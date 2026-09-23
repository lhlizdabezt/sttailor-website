"""Create intrinsic image metadata and compact Gallery derivatives at build time.

The WordPress reference keeps the original fashion photography. This build step
preserves those originals as a fallback while supplying compact WebP candidates
for the Gallery grid, where columns are much smaller than camera files.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageOps


SOURCE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
CONTENT_WIDTHS = (480, 768, 1200, 1600)
# Keep a 240px candidate so high-DPR mobile headers do not jump from 160px
# straight to a 320px logo for a roughly 70–100px rendered mark.
ICON_WIDTHS = (96, 160, 240, 320)


def public_path(path: Path) -> str:
    return "/media/_responsive/" + path.as_posix()


def build_variant(image: Image.Image, source_relative: Path, width: int, output_root: Path) -> str:
    height = round(image.height * width / image.width)
    target_relative = source_relative.with_suffix("").with_name(f"{source_relative.stem}-{width}.webp")
    target = output_root / target_relative
    target.parent.mkdir(parents=True, exist_ok=True)
    variant = image.copy()
    variant.thumbnail((width, height), Image.Resampling.LANCZOS)
    if variant.mode not in {"RGB", "RGBA"}:
        variant = variant.convert("RGBA" if "A" in variant.getbands() else "RGB")
    stem = source_relative.stem.lower()
    # Preserve the original uploads as the visual fallback while making the
    # above-the-fold hero materially smaller. The q78 content setting keeps
    # fabric texture and tailoring detail legible; the logo gets a little more
    # headroom for fine lettering.
    quality = 74 if "background-hero" in stem else (84 if "logo" in stem else 78)
    variant.save(target, "WEBP", quality=quality, method=6)
    return public_path(target_relative)


def main() -> int:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: build-image-manifest.py SOURCE_MEDIA OUTPUT_MANIFEST")

    source_root = Path(sys.argv[1])
    output_manifest = Path(sys.argv[2])
    responsive_root = output_manifest.parent / "media" / "_responsive"
    metadata: dict[str, dict[str, object]] = {}
    processed = 0

    for source in sorted(source_root.rglob("*")):
        if not source.is_file() or source.suffix.lower() not in SOURCE_EXTENSIONS:
            continue
        relative = source.relative_to(source_root)
        try:
            with Image.open(source) as opened:
                image = ImageOps.exif_transpose(opened)
                width, height = image.size
                variants = []
                responsive_widths = ICON_WIDTHS if "logo" in source.stem.lower() else CONTENT_WIDTHS
                for candidate in responsive_widths:
                    if candidate < width:
                        variants.append({"src": build_variant(image, relative, candidate, responsive_root), "width": candidate})
                metadata[relative.as_posix()] = {"width": width, "height": height, "responsive": variants}
                processed += 1
        except (OSError, ValueError) as error:
            raise RuntimeError(f"Could not inspect {relative}: {error}") from error

    output_manifest.write_text(json.dumps(metadata, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Image metadata: {processed} originals, responsive WebP variants generated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
