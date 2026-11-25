"""Create intrinsic dimensions, responsive images, and social previews.

The WordPress reference keeps the original fashion photography. This build step
preserves those originals as a fallback while supplying compact WebP candidates
for the Gallery grid, where columns are much smaller than camera files.
"""

from __future__ import annotations

import json
from argparse import ArgumentParser
from hashlib import sha256
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps


SOURCE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
# At 1.75 DPR, a 412px mobile Gallery uses roughly 325px and 665px
# for its two-column and full-width tiles.
CONTENT_WIDTHS = (360, 480, 672, 768, 1200, 1600)
HOME_HERO = "2026/06/background-hero-trang-lien-he-sttailor.webp"
GALLERY_HERO = "2026/09/st-tailor-made-to-measure-stories-gallery.jpg"
# Mobile Lighthouse flagged these densely textured photos in the first album.
GALLERY_COMPACT_THUMBNAILS = {
    "st-tailor-gallery-brocade-dinner-jacket",
    "st-tailor-gallery-ceremonial-jacket-frame",
}
# Keep a 240px candidate so high-DPR mobile headers do not jump from 160px
# straight to a 320px logo for a roughly 70–100px rendered mark.
ICON_WIDTHS = (96, 160, 240, 320)
BRAND_ICON_SIZES = {"favicon": 48, "apple-touch": 180, "app": 192, "app-large": 512}


def public_path(path: Path) -> str:
    return "/media/_responsive/" + path.as_posix()


def check_public_metadata(image: Image.Image, relative: Path) -> None:
    exif = image.getexif()
    gps = exif.get_ifd(34853) if 34853 in exif else {}
    details = exif.get_ifd(34665) if 34665 in exif else {}
    camera_fields = (42032, 42033, 42037)  # Owner, camera body serial and lens serial.
    xmp = image.info.get("xmp") or b""
    xmp = xmp.encode() if isinstance(xmp, str) else xmp
    private_xmp = (b":GPSLatitude", b":GPSLongitude", b":CameraOwnerName", b":SerialNumber", b":LensSerialNumber")
    has_coordinates = any(gps.get(tag) for tag in (2, 4, 6))
    has_camera_id = any(details.get(tag) or exif.get(tag) for tag in camera_fields)
    if has_coordinates or has_camera_id or any(field in xmp for field in private_xmp):
        raise ValueError(f"Remove location or camera identity metadata before publishing {relative}")


def build_variant(image: Image.Image, source_relative: Path, width: int, output_root: Path, *, avif_quality: int | None = None) -> str:
    height = round(image.height * width / image.width)
    stem = source_relative.stem.lower()
    compact = width <= 672 and stem in GALLERY_COMPACT_THUMBNAILS
    # Keep the compact encodes at their own URLs for existing browser caches.
    suffix = f"{width}-q68" if compact else str(width)
    extension = "webp" if avif_quality is None else "avif"
    target_relative = source_relative.with_name(f"{source_relative.stem}-{suffix}.{extension}")
    target = output_root / target_relative
    target.parent.mkdir(parents=True, exist_ok=True)
    variant = image.copy()
    variant.thumbnail((width, height), Image.Resampling.LANCZOS)
    if variant.mode not in {"RGB", "RGBA"}:
        variant = variant.convert("RGBA" if "A" in variant.getbands() else "RGB")
    if avif_quality is not None:
        variant.save(target, "AVIF", quality=avif_quality, speed=5)
        return public_path(target_relative)
    # Preserve the original uploads as the visual fallback while making the
    # above-the-fold hero materially smaller. The q78 content setting keeps
    # fabric texture and tailoring detail legible; the logo gets a little more
    # headroom for fine lettering.
    quality = 74 if "background-hero" in stem else (84 if "logo" in stem else 78)
    variant.save(target, "WEBP", quality=68 if compact else quality, method=6)
    return public_path(target_relative)


def build_mobile_hero(image: Image.Image, relative: Path, output_root: Path) -> dict[str, str]:
    # Match the mobile hero's 62% object position. Removing the unseen sides
    # preserves native vertical detail and the existing framing on phones.
    width = min(image.width, round(image.height * 1.05))
    left = round((image.width - width) * 0.62)
    crop = image.crop((left, 0, left + width, image.height))
    name = relative.with_stem(f"{relative.stem}-portrait")
    # The mobile frame tops out at 740 CSS pixels. Keep enough vertical
    # detail for the full cover while reducing the first mobile transfer.
    width = min(width, 860)
    return {
        "portrait": build_variant(crop, name, width, output_root),
        "portrait_avif": build_variant(crop, name, width, output_root, avif_quality=55),
    }


def build_share_preview(image: Image.Image, relative: Path, output_root: Path) -> dict[str, object]:
    rgb = image.convert("RGB")
    for edge in (1200, 1000, 800):
        preview = rgb.copy()
        preview.thumbnail((edge, edge), Image.Resampling.LANCZOS)
        buffer = BytesIO()
        preview.save(buffer, "JPEG", quality=83, optimize=True, progressive=True)
        data = buffer.getvalue()
        if len(data) <= 256 * 1024:
            break
    version = sha256(data).hexdigest()[:12]
    target_relative = relative.with_name(f"{relative.stem}-share-{version}.jpg")
    target = output_root / target_relative
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    return {"src": public_path(target_relative), "width": preview.width, "height": preview.height}


def main() -> int:
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("source_media", type=Path)
    parser.add_argument("output_manifest", type=Path)
    parser.add_argument("share_images", nargs="*")
    parser.add_argument("--home-card", action="append", default=[])
    parser.add_argument("--feature-image", action="append", default=[])
    args = parser.parse_args()
    source_root = args.source_media
    output_manifest = args.output_manifest
    home_cards = set(args.home_card)
    feature_images = set(args.feature_image)
    responsive_root = output_manifest.parent / "media" / "_responsive"
    brand_icon_root = output_manifest.parent / "icons"
    metadata: dict[str, dict[str, object]] = {}
    processed = 0

    for source in sorted(source_root.rglob("*")):
        if not source.is_file() or source.suffix.lower() not in SOURCE_EXTENSIONS:
            continue
        relative = source.relative_to(source_root)
        try:
            with Image.open(source) as opened:
                check_public_metadata(opened, relative)
                image = ImageOps.exif_transpose(opened)
                width, height = image.size
                variants = []
                responsive_widths = ICON_WIDTHS if "logo" in source.stem.lower() else CONTENT_WIDTHS
                for candidate in responsive_widths:
                    if candidate < width:
                        variants.append({"src": build_variant(image, relative, candidate, responsive_root), "width": candidate})
                entry = {"width": width, "height": height, "responsive": variants}
                if relative.as_posix() in {HOME_HERO, GALLERY_HERO}:
                    variants.append({"src": build_variant(image, relative, width, responsive_root), "width": width})
                if relative.as_posix() == HOME_HERO:
                    entry.update(build_mobile_hero(image, relative, responsive_root))
                if relative.as_posix() in home_cards:
                    entry["mobile_avif"] = [
                        {"src": build_variant(image, relative, candidate, responsive_root, avif_quality=58), "width": candidate}
                        for candidate in CONTENT_WIDTHS if candidate <= 768 and candidate < width
                    ]
                if relative.as_posix() in feature_images:
                    entry["responsive_avif"] = [
                        {"src": build_variant(image, relative, variant["width"], responsive_root, avif_quality=58), "width": variant["width"]}
                        for variant in variants if variant["width"] <= 1200
                    ]
                metadata[relative.as_posix()] = entry
                processed += 1
        except (OSError, ValueError) as error:
            raise RuntimeError(f"Could not inspect {relative}: {error}") from error

    for asset in sorted(set(args.share_images)):
        relative = Path(asset)
        with Image.open(output_manifest.parent / "media" / relative) as opened:
            image = ImageOps.exif_transpose(opened)
            entry = metadata.setdefault(asset, {"width": image.width, "height": image.height, "responsive": []})
            entry["share"] = build_share_preview(image, relative, responsive_root)

    # Keep the owner's original logo colors. A warm brand-color square makes
    # the dark mark legible in light and dark browser UI; the footer logo stays
    # transparent. Full-size PNGs cost hundreds of KB on first load.
    with Image.open(source_root / "2026" / "09" / "logo-sttailor.png") as opened:
        logo = opened.convert("RGBA")
        for name, size in BRAND_ICON_SIZES.items():
            mark = logo.copy()
            edge = round(size * 0.9)
            mark.thumbnail((edge, edge), Image.Resampling.LANCZOS)
            canvas = Image.new("RGBA", (size, size), (243, 225, 197, 255))
            canvas.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
            canvas.save(brand_icon_root / f"sttailor-{name}-{size}.png", "PNG", optimize=True)

    output_manifest.write_text(json.dumps(metadata, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Image metadata: {processed} originals, responsive WebP variants generated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
