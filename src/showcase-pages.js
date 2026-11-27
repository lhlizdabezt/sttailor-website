import { photoSource, photoStoryPages } from "./photo-stories.js";
import { ninaCampos } from "./commission-stories.js";

const [ninaCover, ...ninaCoverAlt] = ninaCampos.photos[0];

export const showcaseHubs = [
  {
    route: "/san-pham/",
    source: "ShowcaseGarments.html",
    labels: ["Finished garments", "Trang phục hoàn thiện"],
    title: "Finished Bespoke Garments in Ho Chi Minh City | S.T Tailor",
    description: "Explore finished S.T Tailor garments by collection, from bespoke suits and dinner jackets to tailored womenswear, shirts and trousers.",
    image: "/media/2026/09/st-tailor-gallery-beige-double-breasted-suit.png",
    imageAlt: "Beige double-breasted blazer and trousers on a tailoring form | Blazer be hai hàng khuy và quần đồng bộ trên ma-nơ-canh",
    sections: [
      { id: "suits-and-jackets", labels: ["Suits and jackets", "Suit và áo khoác"] },
      { id: "womenswear", labels: ["Women’s wear", "Trang phục nữ"] },
      { id: "shirts-and-trousers", labels: ["Shirts and trousers", "Sơ mi và quần tây"] }
    ]
  },
  {
    route: "/du-an/",
    source: "ShowcaseProjects.html",
    labels: ["Projects and collaborations", "Dự án và hợp tác"],
    title: "Tailoring Projects and Collaborations | S.T Tailor",
    description: "Explore S.T Tailor’s client fittings, finished commissions and collaboration with singer Niña Campos in Ho Chi Minh City.",
    image: photoSource(ninaCover),
    imageAlt: ninaCoverAlt.join(" | "),
    sections: [
      { id: "collaborations", labels: ["Collaborations", "Hợp tác"] },
      { id: "client-work", labels: ["Client commissions", "Trang phục của khách"] },
      { id: "fittings", labels: ["Fitting studies", "Ghi chép thử đồ"] },
      { id: "craft-and-style", labels: ["Cloth, craft and styling", "Vải, kỹ thuật may và phối đồ"] }
    ]
  }
];

export const showcaseEntries = [
  {
    route: "/san-pham/blazer-mau-be/",
    section: "suits-and-jackets",
    source: "ShowcaseBeigeBlazer.html",
    labels: ["Beige double-breasted blazer", "Blazer be hai hàng khuy"],
    title: "Beige Double-Breasted Blazer by S.T Tailor",
    description: "Examine a finished beige double-breasted blazer by S.T Tailor, with peaked lapels, warm-toned buttons and matching trousers.",
    summary: ["Peaked lapels and warm-toned buttons on a soft beige jacket, photographed with matching trousers.", "Áo khoác màu be dịu với ve nhọn và khuy tông ấm, chụp cùng quần đồng bộ."],
    image: "/media/2026/09/st-tailor-gallery-beige-double-breasted-suit.png",
    imageAlt: "Beige double-breasted blazer with peaked lapels and matching trousers on a tailoring form | Blazer be hai hàng khuy, ve nhọn và quần đồng bộ trên ma-nơ-canh"
  },
  {
    route: "/san-pham/suit-navy-hai-hang-khuy/",
    section: "suits-and-jackets",
    source: "ShowcaseNavySuit.html",
    labels: ["Navy double-breasted suit", "Suit xanh navy hai hàng khuy"],
    title: "Navy Double-Breasted Suit by S.T Tailor",
    description: "See the finished jacket of a navy double-breasted suit by S.T Tailor and consider lapel width, button stance and fit when commissioning your own.",
    summary: ["A deep navy jacket with peaked lapels, dark buttons and a defined shoulder line.", "Áo suit xanh navy đậm, ve nhọn, khuy tối màu và đường vai rõ nét."],
    image: "/media/2026/09/st-tailor-navy-double-breasted-front.jpeg",
    imageAlt: "Front of S.T Tailor’s navy double-breasted jacket with dark buttons and flap pockets | Mặt trước áo suit xanh navy hai hàng khuy tối màu và túi có nắp của S.T Tailor"
  },
  {
    route: "/san-pham/suit-den-ve-chu-k/",
    section: "suits-and-jackets",
    source: "ShowcaseBlackNotchSuit.html",
    labels: ["Black notch-lapel suit", "Suit đen ve chữ K"],
    title: "Black Notch-Lapel Suit by S.T Tailor",
    description: "See a finished black two-piece suit with notch lapels, straight-leg trousers and a white shirt. Compare the cut with a shawl-lapel tuxedo.",
    summary: ["A black two-piece suit paired with a white shirt. The full-length view shows the notch lapels, sleeve length and straight trouser line.", "Bộ suit đen hai mảnh phối sơ mi trắng. Ảnh toàn thân cho thấy ve chữ K, chiều dài tay áo và đường ống quần suông."],
    image: "/media/2026/09/st-tailor-black-suit-full-length.jpeg",
    imageAlt: "Black notch-lapel jacket and matching straight-leg trousers on a tailoring form with a white shirt | Áo khoác đen ve chữ K và quần ống suông đồng bộ trên ma-nơ-canh, phối sơ mi trắng"
  },
  {
    route: "/san-pham/suit-xam-nhat-hai-hang-khuy/",
    section: "suits-and-jackets",
    source: "ShowcaseLightGreyDoubleBreastedSuit.html",
    labels: ["Light grey double-breasted suit", "Suit xám nhạt hai hàng khuy"],
    title: "Light Grey Double-Breasted Suit | S.T Tailor",
    description: "View a light grey double-breasted suit with wide lapels and matching trousers. Compare button position, jacket length and cloth for your own fitting.",
    summary: ["Light grey tailoring with wide lapels, an overlapping front and matching trousers.", "Suit xám nhạt với ve bản rộng, hai vạt áo chồng lên nhau và quần đồng bộ."],
    image: "/media/2026/09/st-tailor-gallery-gray-double-breasted-suit.png",
    imageAlt: "Light grey double-breasted suit with wide lapels and matching trousers on a tailoring form | Suit xám nhạt hai hàng khuy, ve bản rộng và quần đồng bộ trên ma-nơ-canh"
  },
  {
    route: "/san-pham/ao-khoac-xanh-da-troi/",
    section: "suits-and-jackets",
    source: "ShowcaseLightBlueJacket.html",
    labels: ["Light blue tailored jacket", "Áo khoác may đo xanh da trời"],
    title: "Light Blue Tailored Jacket | S.T Tailor",
    description: "See a light blue tailored jacket with notch lapels and jetted pockets. Compare the cloth in two photographs and explore shirt and trouser pairings.",
    summary: ["A pale tailored jacket with notch lapels and jetted pockets, photographed from the front and at an angle.", "Áo khoác may đo sáng màu với ve chữ K và túi viền không nắp, chụp chính diện và góc nghiêng."],
    image: "/media/2026/09/st-tailor-gallery-duk-9988.jpg",
    imageAlt: "Light blue tailored jacket with notch lapels and jetted pockets on a black hanger | Áo khoác may đo xanh da trời nhạt, ve chữ K và túi viền không nắp trên móc đen"
  },
  {
    route: "/san-pham/ao-khoac-du-tiec-det-van/",
    section: "suits-and-jackets",
    source: "ShowcaseDinnerJacket.html",
    labels: ["Textured dinner jacket", "Áo khoác dự tiệc dệt vân"],
    title: "Textured Bespoke Dinner Jacket by S.T Tailor",
    description: "Explore a dark textured dinner jacket by S.T Tailor. See the raised woven motif, curved patch pockets and round button at the waist.",
    summary: ["An evening jacket with a dark woven pattern, patch pockets and a round button at the waist.", "Áo khoác dự tiệc tối màu dệt hoa văn nổi, có túi đắp và khuy tròn ở eo."],
    image: "/media/2026/09/st-tailor-gallery-brocade-dinner-jacket.jpg",
    imageAlt: "Dark patterned S.T Tailor dinner jacket with patch pockets and a round button | Áo khoác dự tiệc tối màu dệt hoa văn, có túi đắp và khuy tròn của S.T Tailor"
  },
  {
    route: "/san-pham/tuxedo-den-ve-sam/",
    section: "suits-and-jackets",
    source: "ShowcaseBlackTuxedo.html",
    labels: ["Black shawl-lapel tuxedo", "Tuxedo đen ve sam"],
    title: "Black Shawl-Lapel Tuxedo by S.T Tailor",
    description: "See a finished black tuxedo by S.T Tailor, with satin shawl lapels and a single-button front, photographed from the front and side in Ho Chi Minh City.",
    summary: ["A black evening jacket with a continuous satin shawl lapel, shown over a white dress shirt.", "Áo tuxedo đen với ve sam satin liền nét, phối cùng sơ mi trắng dùng cho lễ phục."],
    image: "/media/2026/09/st-tailor-gallery-duk-0010.jpg",
    imageAlt: "Black one-button tuxedo jacket with satin shawl lapels and white dress shirt on a tailoring form | Áo tuxedo đen một khuy, ve sam satin và sơ mi trắng trên ma-nơ-canh"
  },
  {
    route: "/san-pham/ao-le-phuc-do-ruou-co-dung/",
    section: "suits-and-jackets",
    source: "ShowcaseBurgundyCeremonialJacket.html",
    labels: ["Burgundy stand-collar ceremonial jacket", "Áo lễ phục đỏ rượu cổ đứng"],
    title: "Burgundy Stand-Collar Ceremonial Jacket | S.T Tailor",
    description: "View a burgundy ceremonial jacket with a short standing collar and red dragon motifs on an ochre panel. Explore pattern placement for an occasion garment.",
    summary: ["A short standing collar and red dragon motifs on an ochre front panel, framed by burgundy sleeves and sides.", "Cổ đứng thấp và họa tiết rồng đỏ trên mảng thân trước màu vàng đất, điểm cùng tay áo và hai bên thân màu đỏ rượu."],
    image: "/media/2026/09/st-tailor-gallery-ceremonial-jacket-frame.jpg",
    imageAlt: "Burgundy stand-collar jacket with red dragon motifs on an ochre front panel | Áo lễ phục đỏ rượu cổ đứng với họa tiết rồng đỏ trên mảng thân trước màu vàng đất"
  },
  {
    route: "/san-pham/dam-lua-hong-phan-theu-hoa/",
    section: "womenswear",
    source: "ShowcaseSilkDress.html",
    labels: ["Blush floral silk dress", "Đầm lụa hồng phấn thêu hoa"],
    title: "Blush Floral Silk Dress by S.T Tailor",
    description: "See a finished blush silk dress from S.T Tailor with a round neckline, short sleeves and floral embroidery that follows the silhouette.",
    summary: ["Blush silk with warm floral embroidery, a round neckline and short sleeves.", "Lụa hồng phấn thêu hoa sắc ấm, phối cổ tròn và tay ngắn."],
    image: "/media/2026/09/st-tailor-gallery-blush-silk-floral-dress.jpg",
    imageAlt: "Blush silk dress with coral and gold floral embroidery and short sleeves | Đầm lụa hồng phấn tay ngắn, thêu hoa tông cam san hô và vàng"
  },
  {
    route: "/san-pham/suit-nu-trang/",
    section: "womenswear",
    source: "ShowcaseWhiteWomensSuit.html",
    labels: ["White women’s suit", "Suit nữ màu trắng"],
    title: "White Tailored Women’s Suit by S.T Tailor",
    description: "See a finished white women’s suit by S.T Tailor with a notch-lapel jacket and matching trousers. Consider layering, opacity and hem length at your fitting.",
    summary: ["A white jacket with notch lapels and matching trousers, photographed on a tailoring form.", "Áo khoác trắng ve chữ K và quần đồng bộ, chụp trên ma-nơ-canh."],
    image: "/media/2026/09/st-tailor-womens-white-suit.jpg",
    imageAlt: "White women’s suit with a notch-lapel jacket and matching trousers on a tailoring form | Suit nữ màu trắng gồm áo ve chữ K và quần đồng bộ trên ma-nơ-canh"
  },
  {
    route: "/san-pham/dam-quan-hoa-hong-tim/",
    section: "womenswear",
    source: "ShowcaseFloralWrapDress.html",
    labels: ["Magenta floral wrap dress", "Đầm quấn hoa tông hồng tím"],
    title: "Magenta Floral Wrap Dress | S.T Tailor",
    description: "See a finished S.T Tailor wrap dress with a V-neck, long sleeves and a side tie. Read what to check at a made-to-measure dress fitting.",
    summary: ["The overlapping front forms a V-neck and ties at the waist. Violet flowers run across the deep magenta cloth.", "Hai vạt đầm bắt chéo tạo cổ chữ V và buộc ở eo. Họa tiết hoa tím trải trên nền vải hồng đậm."],
    image: "/media/2026/09/st-tailor-magenta-floral-wrap-dress-full-length.jpg",
    imageAlt: "Long magenta floral wrap dress with a side tie, displayed beside a navy suit | Đầm quấn dài họa tiết hoa tông hồng tím, buộc nơ bên eo, trưng bày cạnh suit xanh navy"
  },
  {
    route: "/san-pham/ao-khoac-jacquard-hoa/",
    section: "suits-and-jackets",
    source: "ShowcaseFloralJacquardJacket.html",
    labels: ["Floral jacquard evening jacket", "Áo khoác dự tiệc jacquard hoa"],
    title: "Floral Jacquard Evening Jacket | S.T Tailor",
    description: "Explore a finished S.T Tailor jacket in magenta and violet floral jacquard. See the shawl lapel, fabric-covered button and flap pockets.",
    summary: ["Violet flowers are woven into the magenta ground. A shawl lapel and one fabric-covered button leave much of the pattern visible.", "Hoa tím được dệt trên nền hồng đậm. Ve sam và một khuy bọc vải để lộ phần lớn họa tiết trên thân áo."],
    image: "/media/2026/09/st-tailor-floral-dinner-jacket-showroom.png",
    imageAlt: "Magenta and violet floral jacquard jacket with a shawl lapel and flap pockets on a dress form | Áo khoác jacquard hoa hồng tím với ve sam và túi có nắp trên ma-nơ-canh"
  },
  {
    route: "/san-pham/ao-khoac-trang-nga-ve-den/",
    section: "suits-and-jackets",
    source: "ShowcaseIvoryJacket.html",
    labels: ["Ivory jacket with black lapels", "Áo khoác trắng ngà ve đen"],
    title: "Ivory Tailored Jacket With Black Lapels | S.T Tailor",
    description: "See S.T Tailor’s ivory jacket with black contrast lapels, worn with a dark shirt and tailored trousers. Consider cloth, contrast and fit for your own commission.",
    summary: ["An ivory jacket with black lapels, worn open with a dark shirt and charcoal trousers.", "Áo khoác trắng ngà ve đen, mặc mở cùng sơ mi tối màu và quần xám than."],
    image: "/media/2026/09/st-tailor-gallery-client-white-jacket.jpg",
    imageAlt: "Ivory jacket with black lapels, dark shirt and charcoal trousers worn outside S.T Tailor | Áo khoác trắng ngà ve đen, sơ mi tối và quần xám than trước S.T Tailor"
  },
  {
    route: "/san-pham/so-mi-trang-vien-ca-ro/",
    section: "shirts-and-trousers",
    source: "ShowcaseCheckedTrimShirt.html",
    labels: ["White shirt with checked trim", "Sơ mi trắng phối viền ca rô"],
    title: "White Tailored Shirt With Checked Trim | S.T Tailor",
    description: "Explore a white shirt finished by S.T Tailor, with checked trim at the inner collar and cuff. See the details and what to consider at a shirt fitting.",
    summary: ["A white shirt with a discreet checked detail inside the collar and cuff.", "Sơ mi trắng điểm họa tiết ca rô ở mặt trong cổ áo và cổ tay."],
    image: "/media/2026/09/st-tailor-gallery-duk-9905.jpg",
    imageAlt: "White tailored shirt folded on navy cloth | Sơ mi trắng may đo gấp trên nền vải xanh navy"
  },
  {
    route: "/san-pham/so-mi-le-phuc-xep-ly/",
    section: "shirts-and-trousers",
    source: "ShowcasePleatedDressShirt.html",
    labels: ["White pleated-front dress shirt", "Sơ mi lễ phục trắng xếp ly"],
    title: "White Pleated-Front Dress Shirt | S.T Tailor",
    description: "See a white pleated-front dress shirt by S.T Tailor, displayed with black trousers. Learn how to check the shirt front, collar and cuffs with a tuxedo.",
    summary: ["A white long-sleeve dress shirt with narrow pleats on both sides of the button line, shown with black trousers. See how to check the pleats, collar and cuffs during a tuxedo fitting.", "Sơ mi lễ phục trắng tay dài, có các nếp ly nhỏ dọc hai bên hàng khuy, trưng bày cùng quần đen. Xem cách kiểm tra nếp ly, cổ và măng sét khi thử cùng tuxedo."],
    image: "/media/2026/09/st-tailor-gallery-duk-9733.jpg",
    imageAlt: "White pleated-front dress shirt and black trousers on a tailoring form, with brown shoes beside it | Sơ mi lễ phục trắng xếp ly cùng quần đen trên ma-nơ-canh, bên cạnh là đôi giày nâu"
  },
  {
    route: "/san-pham/so-mi-xanh-hoa-van/",
    section: "shirts-and-trousers",
    source: "ShowcaseBluePatternedShirt.html",
    labels: ["Blue floral shirt", "Sơ mi xanh họa tiết hoa"],
    title: "Blue Floral Tailored Shirt | S.T Tailor",
    description: "See a finished blue floral shirt by S.T Tailor, with warm-toned flowers and pale buttons. Learn what to check at a tailored shirt fitting.",
    summary: ["Copper-toned flowers on a blue shirt with pale buttons and a pointed collar.", "Hoa tông đồng nổi trên nền sơ mi xanh, phối khuy sáng màu và cổ nhọn."],
    image: "/media/2026/09/st-tailor-gallery-patterned-shirt.jpg",
    imageAlt: "Blue long-sleeved shirt with copper-toned floral motifs and pale buttons on a dress form | Sơ mi xanh dài tay họa tiết hoa tông đồng và khuy sáng màu trên ma-nơ-canh"
  },
  {
    route: "/san-pham/quan-tay-ca-ro-xam/",
    section: "shirts-and-trousers",
    source: "ShowcaseGreyCheckedTrousers.html",
    labels: ["Grey checked trousers", "Quần tây ca rô xám"],
    title: "Grey Checked Tailored Trousers by S.T Tailor",
    description: "See the subtle check, waistband and pocket on a pair of grey tailored trousers by S.T Tailor. Read how to assess the waist, leg line and hem at a fitting.",
    summary: ["A fine check in grey, visible across the folded leg and near the waistband.", "Họa tiết ca rô nhỏ trên nền xám, thấy rõ ở phần ống gấp và gần cạp quần."],
    image: "/media/2026/09/tailored-trouser-check.jpg",
    imageAlt: "Grey checked tailored trousers with the waistband and side pocket visible, folded on wood | Quần tây ca rô xám gấp trên mặt gỗ, thấy rõ cạp và túi bên"
  },
  {
    route: "/san-pham/ao-co-cao-trang-hoa-thuc-vat/",
    section: "womenswear",
    source: "ShowcaseBotanicalTunic.html",
    labels: ["White botanical-print tunic", "Áo dáng dài cổ cao trắng họa tiết hoa lá"],
    title: "White Botanical-Print Tunic by S.T Tailor",
    description: "See a long white tunic with a high collar and a red-and-blue botanical print, photographed in the S.T Tailor showroom window.",
    summary: ["Red and blue flowers cross the upper body and lower edge of this long white tunic, shown with pale trousers in the showroom window.", "Họa tiết hoa đỏ và xanh điểm trên thân trên và gần gấu áo trắng dáng dài, được trưng bày cùng quần sáng màu tại cửa kính nhà may."],
    image: "/media/2026/09/st-tailor-gallery-womenswear-window-frame.jpg",
    imageAlt: "Long white high-collared tunic with red and blue botanical motifs in the S.T Tailor showroom window | Áo trắng dáng dài cổ cao họa tiết hoa lá đỏ và xanh tại cửa kính nhà may S.T Tailor"
  },
  {
    route: "/san-pham/ao-nu-mau-nga-ru-cheo/",
    section: "womenswear",
    source: "ShowcaseDrapedIvoryTop.html",
    labels: ["Draped ivory top", "Áo nữ màu ngà rủ chéo"],
    title: "Draped Ivory Tailored Top With Lace Trim | S.T Tailor",
    description: "See how soft folds and a slanted lace-trimmed hem shape an ivory top by S.T Tailor, photographed with dark wide-leg trousers during a fitting.",
    summary: ["Soft folds run diagonally across the front of this ivory top. Lace follows the slanted hem, which falls over dark wide-leg trousers in photographs from the S.T Tailor showroom.", "Các nếp vải mềm chạy chéo trên thân trước áo màu ngà. Viền ren men theo đường lai chéo, phủ nhẹ trên quần ống rộng tối màu trong ảnh tại showroom S.T Tailor."],
    image: "/media/2026/11/st-tailor-draped-ivory-top-with-dark-trousers.webp",
    imageAlt: "Client wearing an ivory top with diagonal folds and a lace-trimmed hem over dark wide-leg trousers | Khách mặc áo màu ngà có nếp rủ chéo và lai viền ren cùng quần ống rộng tối màu"
  },
  {
    route: "/san-pham/quan-tay-xanh-xam-xep-ly/",
    section: "shirts-and-trousers",
    source: "ShowcaseSlatePleatedTrousers.html",
    labels: ["Slate-blue pleated trousers", "Quần tây xanh xám xếp ly"],
    title: "Slate-Blue Pleated Trousers by S.T Tailor",
    description: "See the front pleats, belt loops and waistband of a finished slate-blue pair and learn what to check when commissioning pleated trousers.",
    summary: ["Folded slate-blue trousers show the front pleat, waistband and belt loops. See how those details affect the way a new pair fits and wears.", "Ảnh quần tây xanh xám gấp gọn cho thấy ly trước, cạp và đỉa quần. Xem những chi tiết này ảnh hưởng thế nào đến phom và cảm giác khi mặc."],
    image: "/media/2026/09/st-tailor-gallery-duk-9920.jpg",
    imageAlt: "Folded slate-blue tailored trousers with a front pleat and belt loops | Quần tây xanh xám gấp gọn, thấy ly trước và đỉa quần"
  },
  {
    route: "/san-pham/so-mi-soc-nho-co-trang/",
    section: "shirts-and-trousers",
    source: "ShowcaseStripedContrastCollarShirt.html",
    labels: ["Fine-striped shirt with a white collar", "Sơ mi sọc nhỏ phối cổ trắng"],
    title: "Fine-Striped Dress Shirt With a White Collar | S.T Tailor",
    description: "See how fine pale pink stripes, a white point collar and a patterned tie work together in this S.T Tailor showroom example.",
    summary: ["Fine pink stripes and a plain white point collar frame a geometric tie in this showroom display.", "Sọc hồng nhỏ và cổ nhọn trắng trơn làm nền cho cà vạt họa tiết hình học trên mẫu trưng bày tại nhà may."],
    image: "/media/2026/09/st-tailor-gallery-jacket-lining-mannequin.jpg",
    imageAlt: "Pale pink fine-striped shirt with a white point collar and geometric tie under an open dark jacket | Sơ mi sọc hồng nhạt có cổ nhọn trắng và cà vạt họa tiết bên dưới áo khoác tối mở vạt"
  },
  {
    route: "/du-an/thu-so-mi-trang-va-quan-toi-mau/",
    section: "fittings",
    source: "ShowcaseShirtTrouserFitting.html",
    labels: ["A white shirt and dark trousers at fitting", "Thử sơ mi trắng và quần tây tối màu"],
    title: "White Shirt and Dark Trousers at a Fitting | S.T Tailor",
    description: "See a client fitting of a white shirt and dark trousers at S.T Tailor, with practical checks for a tucked shirt, waistband and trouser hem.",
    summary: ["A client tries an open-collar white shirt tucked into dark trousers. The full-length photograph shows how the two pieces meet at the waist.", "Khách mặc thử sơ mi trắng mở cổ và sơ vin vào quần tối màu. Ảnh toàn thân cho thấy hai món phối với nhau ở phần eo như thế nào."],
    image: "/media/2026/09/st-tailor-client-shirt-trouser-fitting.jpg",
    imageAlt: "Client standing in an open-collar white shirt tucked into dark trousers at an S.T Tailor fitting | Khách đứng thử sơ mi trắng mở cổ sơ vin cùng quần tây tối màu tại S.T Tailor"
  },
  {
    route: "/du-an/ben-trong-cap-quan-tay/",
    section: "craft-and-style",
    source: "ShowcaseTrouserWaistband.html",
    labels: ["Inside a tailored trouser waistband", "Bên trong cạp quần tây may đo"],
    title: "Inside a Tailored Trouser Waistband | S.T Tailor",
    description: "Look inside a pair of tailored trousers and see how the waistband, closure and pocket area work together when the trousers are worn.",
    summary: ["An inside view of a tailored pair shows the waistband facing and the construction around the pocket. See what to check when trying on trousers.", "Ảnh mặt trong quần tây cho thấy đáp cạp và phần may quanh túi. Xem những chi tiết cần kiểm tra khi thử quần."],
    image: "/media/2026/09/st-tailor-gallery-duk-9926.jpg",
    imageAlt: "Folded dark trousers showing the inside waistband and pocket construction | Quần tây tối màu gấp gọn để lộ phần trong cạp và kết cấu túi"
  },
  {
    route: "/du-an/nina-campos/",
    section: "collaborations",
    source: "ShowcaseNinaCampos.html",
    labels: ["Niña Campos collaboration", "Hợp tác cùng Niña Campos"],
    heading: "Niña Campos",
    title: "Niña Campos in a Tailored Stage Suit | S.T Tailor",
    description: "See the light two-piece stage suit S.T Tailor made for singer Niña Campos in six performance and portrait photographs. Explore the cut, layers and fit in motion.",
    summary: ninaCampos.summary,
    image: photoSource(ninaCover),
    imageAlt: ninaCoverAlt.join(" | "),
    photoCollection: ninaCampos
  },
  {
    route: "/du-an/trang-phuc-san-khau/",
    section: "craft-and-style",
    source: "ShowcaseStageTailoring.html",
    labels: ["Tailoring for the stage", "May đo trang phục sân khấu"],
    title: "Stage and Performance Tailoring | S.T Tailor",
    description: "Plan a tailored stage outfit around lighting, movement, microphones and fittings, with photographs from S.T Tailor’s work with singer Niña Campos.",
    summary: ["What to bring to a stagewear consultation and how to try the cloth, shoes and layers before a performance.", "Những gì nên mang đến buổi tư vấn may trang phục sân khấu và cách thử vải, giày, các lớp áo trước buổi biểu diễn."],
    image: "/media/2026/11/st-tailor-nina-campos-light-suit-on-stage.webp",
    imageAlt: "Singer Niña Campos holding a microphone in a pale suit under blue and red stage lights | Ca sĩ Niña Campos cầm micro trong bộ suit sáng màu dưới ánh đèn sân khấu xanh và đỏ"
  },
  {
    route: "/du-an/ao-ghi-le-do/",
    section: "client-work",
    source: "ShowcaseRedWaistcoat.html",
    labels: ["Red waistcoat in wear", "Áo ghi-lê đỏ khi mặc"],
    title: "Red Patterned Waistcoat in Wear | S.T Tailor Project",
    description: "See an S.T Tailor client’s red patterned waistcoat in wear, with photographs showing the rear adjuster, colour pairings and evening light.",
    summary: ["A red patterned waistcoat worn with cool-toned trousers, photographed from the side and back.", "Áo ghi-lê đỏ họa tiết phối quần tông lạnh, ghi lại qua các góc nghiêng và sau lưng."],
    image: "/media/2026/10/st-tailor-red-waistcoat-turning-view.jpg",
    imageAlt: "Client turning in a red patterned waistcoat with an adjustable back strap | Khách xoay người, để lộ đai điều chỉnh sau lưng áo ghi-lê đỏ họa tiết"
  },
  {
    route: "/du-an/suit-le-phuc-navy/",
    section: "client-work",
    source: "ShowcaseNavyFormalClient.html",
    labels: ["Navy formal suit in wear", "Suit lễ phục navy khi mặc"],
    title: "Navy Formal Suit in Wear | S.T Tailor Project",
    description: "Explore a client’s navy formal suit from the front, side and back, styled with a burgundy tie. See what each angle reveals at a suit fitting.",
    summary: ["Three views of a navy suit with a burgundy tie show the jacket balance and trouser line.", "Ba góc nhìn bộ suit navy phối cà vạt đỏ rượu cho thấy độ cân đối của áo khoác và đường ống quần."],
    image: "/media/2026/09/st-tailor-archive-navy-formal-profile.jpg",
    imageAlt: "Client seen from the side in a navy suit and black shoes beside a timber wall | Khách mặc suit navy và giày đen, chụp góc nghiêng cạnh vách gỗ"
  },
  {
    route: "/du-an/buoi-thu-suit-lot-vang/",
    section: "fittings",
    source: "ShowcaseGoldLiningFitting.html",
    labels: ["Fitting a suit with gold lining", "Buổi thử suit lót vàng"],
    title: "Fitting a Dark Suit With Gold Lining | S.T Tailor Project",
    description: "See the front of a client’s dark suit and the gold lining revealed when the jacket is opened during a fitting at S.T Tailor in Ho Chi Minh City.",
    summary: ["Photographs from a fitting show how a gold shirt, pocket square and lining change the appearance of a dark suit as the jacket opens.", "Ảnh buổi thử cho thấy sơ mi, khăn túi ngực và lớp lót vàng hiện lên thế nào trên bộ suit tối màu khi mở áo khoác."],
    image: "/media/2026/09/st-tailor-archive-gold-jacket-fitting.jpg",
    imageAlt: "Client in a dark suit with a gold shirt and pocket square during a fitting at S.T Tailor | Khách thử suit tối màu phối sơ mi và khăn túi ngực màu vàng tại S.T Tailor"
  },
  {
    route: "/du-an/thu-suit-den-tai-showroom/",
    section: "fittings",
    source: "ShowcaseBlackSuitMirrorFitting.html",
    labels: ["Fitting a black suit at the mirror", "Thử suit đen trước gương"],
    title: "Black Suit Fitting From Front and Back | S.T Tailor",
    description: "Follow an S.T Tailor fitting from the front of a black suit to its rear view at the mirror. See how arm movement and a natural stance reveal the jacket balance.",
    summary: ["Two showroom photographs show the same black suit from the front and back. The client extends his arms in one and stands at ease by the mirror in the other.", "Hai ảnh tại nhà may ghi lại cùng bộ suit đen từ trước và sau. Trong một ảnh, khách dang hai tay. Ảnh còn lại ghi lại tư thế đứng tự nhiên bên gương."],
    image: "/media/2026/09/st-tailor-client-fitted-suit.jpg",
    imageAlt: "Client in a black suit and gold shirt extending his arms during a fitting at S.T Tailor | Khách mặc suit đen và sơ mi vàng, dang hai tay trong buổi thử tại S.T Tailor"
  },
  {
    route: "/du-an/chon-vai-cung-khach/",
    section: "client-work",
    source: "ShowcaseClothConsultation.html",
    labels: ["Choosing suit cloth at a consultation", "Chọn vải may suit trong buổi tư vấn"],
    title: "Choosing Suit Cloth With a Client | S.T Tailor",
    description: "See a fabric consultation at S.T Tailor in Ho Chi Minh City and learn how to compare colour, pattern scale and drape before commissioning a suit.",
    summary: ["A client and tailor compare swatches at the showroom. See how to read colour and pattern in a small sample and what to ask about the way the finished cloth will hang.", "Khách và thợ may so sánh các mẫu vải tại showroom. Xem cách nhận biết màu sắc, họa tiết trên mẫu nhỏ và những điều nên hỏi về độ rủ của trang phục sau khi may."],
    image: "/media/2026/09/st-tailor-client-fabric-consultation.jpg",
    imageAlt: "Tailor and client seated over an open fabric book at the S.T Tailor showroom | Thợ may và khách ngồi xem quyển mẫu vải mở tại showroom S.T Tailor"
  },
  {
    route: "/du-an/thu-quan-ong-rong-nu/",
    section: "fittings",
    source: "ShowcaseWomensTrouserFitting.html",
    labels: ["Fitting women’s wide-leg trousers", "Buổi thử quần nữ ống rộng"],
    title: "Women’s Wide-Leg Trouser Fitting | S.T Tailor",
    description: "See two views of a women’s wide-leg trouser fitting at S.T Tailor. Check the fall of the cloth, room for movement and hem length with your shoes.",
    summary: ["Two fitting-room photographs show how dark wide-leg trousers fall beneath a draped ivory top, from the front and the side.", "Hai ảnh trong phòng thử cho thấy độ rủ của quần tối màu ống rộng khi phối với áo màu ngà có nếp rủ, nhìn từ trước và từ bên."],
    image: "/media/2026/11/st-tailor-draped-ivory-top-with-dark-trousers.webp",
    imageAlt: "Front view of a client fitting dark wide-leg trousers with a draped ivory top at S.T Tailor | Góc trước khách thử quần tối màu ống rộng cùng áo màu ngà có nếp rủ tại S.T Tailor"
  },
  {
    route: "/du-an/ban-giao-trang-phuc-tai-showroom/",
    section: "client-work",
    source: "ShowcaseShowroomHandover.html",
    labels: ["A showroom garment handover", "Một buổi bàn giao trang phục tại showroom"],
    title: "A Garment Handover at the Showroom | S.T Tailor",
    description: "See a garment handover from the S.T Tailor client archive and plan how to carry your finished tailoring home after collecting it in Ho Chi Minh City.",
    summary: ["An archive photograph shows a client receiving a garment bag at the S.T Tailor showroom. See what to discuss when you will be travelling with your finished tailoring.", "Ảnh lưu niệm ghi lại khoảnh khắc khách nhận túi đựng trang phục tại showroom S.T Tailor. Xem những điều cần trao đổi nếu bạn sẽ mang trang phục hoàn thiện theo khi đi xa."],
    image: "/media/2026/09/st-tailor-gallery-international-client-one.jpg",
    imageAlt: "An S.T Tailor team member and a client shake hands while holding a garment bag at the showroom | Đại diện S.T Tailor và khách bắt tay khi đang cầm túi đựng trang phục tại showroom"
  },
  {
    route: "/du-an/kiem-tra-phom-ao-khoac-khi-ngoi/",
    section: "fittings",
    source: "ShowcaseSeatedJacketFit.html",
    labels: ["Checking jacket fit while seated", "Kiểm tra phom áo khoác khi ngồi"],
    title: "Checking Jacket Fit While Seated | S.T Tailor Fitting Study",
    description: "Compare two S.T Tailor showroom portraits and see how jacket fronts, shoulder lines and sleeves move as the wearer leans forward or sits back.",
    summary: ["Two showroom portraits show how a navy blazer and a plum blazer settle as their wearers sit in different positions.", "Hai ảnh tại showroom cho thấy blazer navy và blazer màu mận rủ ra sao khi khách ngồi ở hai tư thế khác nhau."],
    image: "/media/2026/11/st-tailor-navy-blazer-client-at-table.webp",
    imageAlt: "Client in a navy blazer and white shirt leaning forward at a showroom table | Khách mặc blazer navy và sơ mi trắng, hơi nghiêng người về phía bàn tại showroom"
  },
  {
    route: "/du-an/duong-luoc-tren-ao-khoac/",
    section: "craft-and-style",
    source: "ShowcaseJacketBasting.html",
    labels: ["Basting stitches on a tailored jacket", "Đường chỉ lược trên áo khoác may đo"],
    title: "Basting Stitches on a Tailored Jacket | S.T Tailor",
    description: "See pale basting threads on a black tailored jacket with red patterned lining and learn what temporary stitches do during jacket construction.",
    summary: ["Pale temporary stitches trace the lapel, shoulder and front of a dark jacket with red patterned lining.", "Đường chỉ lược sáng màu chạy dọc ve, vai và thân trước áo khoác tối màu có lớp lót đỏ họa tiết."],
    image: "/media/2026/09/sttailorhcm_3971189422263494295.jpg",
    imageAlt: "Black tailored jacket with pale temporary stitches, opened to show its red patterned lining | Áo khoác đen với đường chỉ lược sáng màu, mở vạt để lộ lớp lót đỏ họa tiết"
  },
  {
    route: "/san-pham/ao-khoac-nau-vang-ve-chu-k/",
    section: "suits-and-jackets",
    source: "ShowcaseTanNotchJacket.html",
    labels: ["Tan notch-lapel jacket", "Áo khoác nâu vàng ve chữ K"],
    title: "Tan Notch-Lapel Tailored Jacket | S.T Tailor",
    description: "Examine the warm tan cloth, notch lapels and two-button front of an S.T Tailor jacket and consider how to pair a similar jacket with separate trousers.",
    summary: ["The showroom photograph shows a warm tan jacket with visible texture in the cloth, notch lapels and two front buttons.", "Ảnh tại nhà may cho thấy áo khoác nâu vàng có vân vải rõ, ve chữ K và hai khuy trước."],
    image: "/media/2026/11/st-tailor-tan-tailored-jacket-on-rail.webp",
    imageAlt: "Warm tan tailored jacket with notch lapels and two front buttons on the showroom rail | Áo khoác may đo nâu vàng ve chữ K và hai khuy trước treo tại nhà may"
  },
  {
    route: "/san-pham/ao-khoac-xam-ca-ro-hai-hang-khuy/",
    section: "suits-and-jackets",
    source: "ShowcaseCheckedDoubleBreastedJacket.html",
    labels: ["Checked grey double-breasted jacket", "Áo khoác xám ca rô hai hàng khuy"],
    title: "Checked Grey Double-Breasted Jacket | S.T Tailor",
    description: "See the fine checks, two rows of buttons and patterned blue lining on a finished grey double-breasted jacket by S.T Tailor in Ho Chi Minh City.",
    summary: ["Fine grey checks run across the front of this double-breasted jacket. The showroom photograph shows the two rows of buttons, flap pockets and blue patterned lining.", "Ca rô mảnh chạy trên thân trước áo khoác xám hai hàng khuy. Ảnh tại nhà may cho thấy hai hàng khuy, túi có nắp và lớp lót xanh họa tiết."],
    image: "/media/2026/11/st-tailor-checked-grey-double-breasted-jacket-front.webp",
    imageAlt: "Grey checked double-breasted jacket on a hanger, with front flap pockets and patterned blue lining visible at the collar | Áo khoác xám ca rô hai hàng khuy trên móc, có túi nắp trước và lớp lót xanh họa tiết lộ ở cổ"
  },
  {
    route: "/san-pham/ao-khong-tay-sang-mau-hoa-tiet-nho/",
    section: "womenswear",
    source: "ShowcaseTonalMotifTop.html",
    labels: ["Pale sleeveless top with tonal motifs", "Áo không tay sáng màu họa tiết cùng tông"],
    title: "Pale Sleeveless Top With Tonal Motifs | S.T Tailor",
    description: "See the armhole, shaping seam and small tonal motifs on a pale sleeveless top from S.T Tailor. Learn what to check when fitting a sleeveless design.",
    summary: ["A close showroom view shows how small tonal motifs read beside the armhole and across the shaped bodice.", "Ảnh cận tại nhà may cho thấy họa tiết nhỏ cùng tông hiện lên ra sao cạnh vòng nách và trên thân áo được tạo dáng."],
    image: "/media/2026/11/st-tailor-pale-sleeveless-top-embroidered-detail.webp",
    imageAlt: "Close view of small tonal motifs and a curved shaping seam beside the armhole of a pale sleeveless top on a form | Cận họa tiết nhỏ cùng tông và đường may tạo dáng cong cạnh vòng nách áo không tay sáng màu trên ma-nơ-canh"
  },
  {
    route: "/du-an/phoi-ao-khoac-xam-than/",
    section: "client-work",
    source: "ShowcaseCharcoalJacketInWear.html",
    labels: ["Charcoal jacket with dark separates", "Áo khoác xám than phối trang phục tối màu"],
    title: "A Charcoal Jacket With Dark Separates | S.T Tailor",
    description: "See a client wear a charcoal jacket over a dark top and trousers at S.T Tailor. Use the portrait to plan a layered outfit and check jacket movement.",
    summary: ["A showroom portrait shows how a charcoal jacket contrasts with a dark top and trousers, with one hand in a trouser pocket.", "Ảnh tại nhà may cho thấy áo khoác xám than tương phản nhẹ với áo trong và quần tối màu khi khách đặt một tay vào túi quần."],
    image: "/media/2026/09/st-tailor-gallery-client-charcoal-suit.jpg",
    imageAlt: "Client in an open charcoal jacket over a dark top and trousers, standing with one hand in a pocket at S.T Tailor | Khách mở vạt áo khoác xám than phối áo trong và quần tối màu, đứng với một tay trong túi quần tại S.T Tailor"
  },
  {
    route: "/san-pham/so-mi-hong-nhat-soc-min/",
    section: "shirts-and-trousers",
    source: "ShowcasePinkFineStripeShirt.html",
    labels: ["Pale pink fine-stripe shirt", "Sơ mi hồng nhạt sọc mảnh"],
    title: "Pale Pink Fine-Stripe Tailored Shirt | S.T Tailor",
    description: "See a pale pink S.T Tailor shirt with fine vertical stripes, a point collar and pale buttons. Compare it with solid ivory and contrast-collar shirts.",
    summary: ["Fine vertical stripes carry through the body and collar of this pale pink tailored shirt. The photograph shows the collar open and the pale buttons along the front.", "Sọc dọc mảnh chạy trên thân và cổ chiếc sơ mi may đo màu hồng nhạt. Ảnh cho thấy cổ áo mở và hàng khuy sáng phía trước."],
    image: "/media/2026/11/st-tailor-pale-pink-shirt-on-rail.webp",
    imageAlt: "Pale pink shirt with fine vertical stripes, an open point collar and pale buttons | Sơ mi hồng nhạt sọc dọc mảnh, cổ nhọn mở và hàng khuy sáng màu"
  },
  {
    route: "/san-pham/ao-khoac-mau-cat-tui-dap/",
    section: "suits-and-jackets",
    source: "ShowcaseSandPatchPocketJacket.html",
    labels: ["Sand jacket with a patch pocket", "Áo khoác màu cát có túi đắp"],
    title: "Sand Jacket with a Rounded Patch Pocket | S.T Tailor",
    description: "Examine the rounded patch pocket, contoured stitching and dark cuff buttons of a sand-coloured S.T Tailor jacket.",
    summary: ["A rounded patch pocket follows the line of the jacket front. The close-up shows the stitching around the pocket and the dark buttons on the neighbouring sleeve.", "Túi đắp bo tròn chạy theo đường nét thân trước áo. Ảnh cận cho thấy đường chỉ quanh túi và hàng khuy tối trên tay áo bên cạnh."],
    image: "/media/2026/11/st-tailor-sand-jacket-rounded-patch-pocket.webp",
    imageAlt: "Sand-coloured tailored jacket showing a rounded patch pocket and dark cuff buttons | Áo khoác may đo màu cát với túi đắp bo tròn và khuy tay áo tối màu"
  },
  {
    route: "/san-pham/ao-khoac-navy-ve-chu-k/",
    section: "suits-and-jackets",
    source: "ShowcaseNavyNotchJacket.html",
    labels: ["Navy notch-lapel jacket", "Áo khoác navy ve chữ K"],
    title: "Navy Notch-Lapel Jacket with Jetted Pockets | S.T Tailor",
    description: "See a finished S.T Tailor navy jacket from the front, side and back. Examine its notch lapels, jetted pockets, curved front and contrast buttonhole.",
    summary: ["A navy jacket with notch lapels and jetted pockets, shown with a white shirt, a pale blue dotted tie and a yellow pocket square.", "Áo khoác navy ve chữ K và túi viền, phối cùng sơ mi trắng, cà vạt xanh nhạt chấm bi và khăn túi ngực màu vàng."],
    image: "/media/2026/09/navy-notch-lapel.jpg",
    imageAlt: "Navy notch-lapel jacket on a form with a pale blue dotted tie and yellow pocket square | Áo khoác navy ve chữ K trên mannequin, phối cà vạt xanh nhạt chấm bi và khăn túi ngực vàng"
  },
  {
    route: "/san-pham/ao-khoac-gam-xanh-bac/",
    section: "suits-and-jackets",
    source: "ShowcaseSilverBlueBrocadeJacket.html",
    labels: ["Silver-blue brocade jacket", "Áo khoác gấm xanh bạc"],
    title: "Silver-Blue Brocade Jacket and Woven Detail | S.T Tailor",
    description: "See how the silver-blue woven motif changes around the shoulder of this S.T Tailor brocade jacket, with advice for choosing evening cloth.",
    summary: ["A close view of the shoulder and sleeve shows how a fine silver-blue motif catches the light along the curve of the seam.", "Ảnh cận vai và tay áo cho thấy họa tiết xanh bạc nhỏ bắt sáng theo đường cong của đường ráp."],
    image: "/media/2026/11/st-tailor-silver-blue-brocade-shoulder-detail.webp",
    imageAlt: "Curved shoulder and sleeve seam on a brocade jacket with a silver-blue woven motif | Đường ráp vai và tay áo cong trên áo khoác gấm dệt họa tiết xanh bạc"
  },
  {
    route: "/du-an/phoi-trang-phuc-du-tiec-doi/",
    section: "craft-and-style",
    source: "ShowcaseCoordinatedOccasionwear.html",
    labels: ["A floral dress and navy suit", "Đầm hoa phối cùng suit navy"],
    title: "A Floral Wrap Dress and Navy Suit, Styled Together | S.T Tailor",
    description: "See a magenta floral wrap dress displayed with a navy suit at S.T Tailor and explore how to coordinate two made-to-measure looks for an occasion.",
    summary: ["A magenta floral wrap dress and a navy suit, photographed together in the showroom, illustrate how two occasion outfits can share a palette of deeper tones.", "Đầm quấn hoa hồng tím và suit navy được chụp cạnh nhau tại showroom, gợi ý cách phối hai bộ trang phục dự tiệc với các tông màu trầm."],
    image: "/media/2026/09/st-tailor-magenta-floral-wrap-dress-and-navy-suit.jpg",
    imageAlt: "Navy suit with a patterned tie displayed beside a magenta floral wrap dress at S.T Tailor | Suit navy phối cà vạt họa tiết trưng bày cạnh đầm quấn hoa hồng tím tại S.T Tailor"
  },
  {
    route: "/du-an/lay-so-do-may-suit/",
    section: "fittings",
    source: "ShowcaseSuitMeasurements.html",
    labels: ["Taking measurements for a suit", "Lấy số đo may suit"],
    title: "Taking a Client’s Suit Measurements | S.T Tailor",
    description: "See a measuring appointment at S.T Tailor and learn how to discuss trouser waist position, layers and fit for a bespoke suit.",
    summary: ["A tailor takes a measurement at the client’s waist. The appointment is an opportunity to discuss where the trousers will sit and which layers will be worn with the suit.", "Thợ may lấy số đo ở ngang eo khách hàng. Đây cũng là dịp để trao đổi về vị trí cạp quần và những lớp áo sẽ mặc cùng bộ suit."],
    image: "/media/2026/09/st-tailor-client-measurement-session.jpg",
    imageAlt: "Tailor measuring near a client’s waist during a showroom appointment | Thợ may lấy số đo ngang eo khách trong buổi hẹn tại showroom"
  },
  ...photoStoryPages
];

export const showcasePages = [...showcaseHubs, ...showcaseEntries];

export function showcaseItemsFor(hubRoute) {
  const entries = showcaseEntries.filter(({ route }) => route.startsWith(hubRoute));
  const sections = showcaseHubs.find(({ route }) => route === hubRoute)?.sections;
  return sections ? sections.flatMap(({ id }) => entries.filter(({ section }) => section === id)) : entries;
}
