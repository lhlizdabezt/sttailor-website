const ivoryJacket = "/san-pham/ao-khoac-mau-nga/";
const clothLibrary = "/du-an/thu-vien-vai/";
const darkSuit = "/san-pham/suit-hai-manh-toi-mau/";
const geometricTie = "/du-an/phoi-ca-vat-hoa-tiet/";
const footwear = "/du-an/phoi-giay-voi-suit/";
const longline = "/san-pham/ao-khoac-xam-dang-dai/";
const goldLining = "/san-pham/ao-khoac-navy-lot-vang/";
const consultation = "/du-an/buoi-tu-van-may-do/";
const shirtDetails = "/du-an/chi-tiet-so-mi-may-do/";
const jacketConstruction = "/du-an/duong-cat-va-chi-tiet-may/";
const jacketLine = "/du-an/phom-ao-khoac/";
const silverSuit = "/du-an/suit-ba-manh-xam-bac/";
const silverJacket = "/du-an/chi-tiet-ao-khoac-xam-bac/";
const silverWaistcoat = "/du-an/thu-ao-ghi-le-xam-bac/";
const liningGuide = "/cam-nang-may-do/chon-lot-ao-khoac/";
const fitGuide = "/cam-nang-may-do/kiem-tra-phom-suit/";
const fittingProcess = "/quy-trinh-thu-do/";
const clothGuide = "/chon-vai-may-do/";
const suitService = "/dich-vu/suit-may-do/";

export const showroomEntrance = {
  id: "loi-vao-nha-may", route: "/lien-he/", album: "showroom",
  labels: ["Finding S.T Tailor", "Tìm lối vào nhà may S.T Tailor"],
  summary: ["Look for the illuminated tailoring sign and the number 258 at street level. The showroom is on the first floor.", "Tìm biển hiệu nhà may có đèn và số nhà 258 ở mặt đường. Showroom nằm trên lầu 1."],
  photos: [
    ["le-thanh-ton-tailoring-sign-at-dusk", "Illuminated tailoring sign below a yellow awning on Lê Thánh Tôn at dusk.", "Biển hiệu nhà may sáng đèn dưới mái hiên vàng trên đường Lê Thánh Tôn lúc chập tối."],
    ["/media/2026/09/st-tailor-gallery-storefront-details-night.jpg", "Street entrance with the number 258 on the column beside the door.", "Lối vào từ mặt đường với số nhà 258 trên cột cạnh cửa."],
    ["/media/2026/09/st-tailor-gallery-showroom-tailoring-display.jpg", "Navy jacket, white garment and shoes on display inside the S.T Tailor showroom.", "Áo khoác navy, trang phục trắng và giày trưng bày trong showroom S.T Tailor."]
  ]
};

export const portfolioCollections = [
  {
    id: "ao-khoac-mau-nga", route: ivoryJacket, album: "suits",
    labels: ["Ivory tailored jacket", "Áo khoác may đo màu ngà"],
    summary: ["An ivory jacket with tonal buttons, notch lapels and flap pockets, worn on the form over a white shirt.", "Áo khoác màu ngà với khuy cùng tông, ve chữ K và túi nắp, trưng bày cùng sơ mi trắng."],
    photos: [
      ["ivory-notched-jacket-front", "Front of the ivory jacket over a white open-collar shirt on a tailoring form.", "Mặt trước áo khoác màu ngà phối sơ mi trắng mở cổ trên ma-nơ-canh."],
      ["ivory-notched-jacket-three-quarter", "Three-quarter view of the ivory jacket showing the shoulder, lapel and flap pocket.", "Góc ba phần tư áo khoác màu ngà, thấy đường vai, ve áo và túi nắp."],
      ["ivory-jacket-button-and-weave", "Pale front button and stitched buttonhole against the fine ivory weave.", "Khuy trước màu sáng và khuyết may trên nền vải dệt mịn màu ngà."]
    ]
  },
  {
    id: "ke-sach-vai", route: clothLibrary, album: "cloth",
    labels: ["Books in the cloth library", "Sách mẫu trong thư viện vải"],
    summary: ["Three perspectives show how fabric books are arranged on the stone-finish shelves at the showroom.", "Ba góc nhìn cho thấy cách sắp xếp sách mẫu vải trên kệ hoàn thiện vân đá tại showroom."],
    photos: [
      ["cloth-library-books-recessed-shelf", "Spines of cloth books in a recessed shelf at the S.T Tailor showroom.", "Gáy sách mẫu vải trên kệ âm tại showroom S.T Tailor."],
      ["cloth-library-books-spines", "Close view of burgundy, blue and black cloth-book spines on the shelf.", "Cận các gáy sách mẫu vải màu đỏ rượu, xanh và đen trên kệ."],
      ["cloth-library-books-wide-shelf", "Wide view of a row of cloth books, with green volumes at the front of the shelf.", "Góc rộng một hàng sách mẫu vải, với các tập bìa xanh lục ở đầu kệ."]
    ]
  },
  {
    id: "suit-hai-manh-toi-mau", route: darkSuit, album: "suits",
    labels: ["Dark two-piece suit", "Suit hai mảnh tối màu"],
    summary: ["A dark jacket and matching trousers, styled with a white open-collar shirt and brown leather shoes.", "Áo khoác và quần tối màu đồng bộ, phối sơ mi trắng mở cổ và giày da nâu."],
    photos: [
      ["dark-two-piece-suit-front-brown-shoes", "Front view of the dark two-piece suit and brown shoes beside a cream wall.", "Mặt trước suit hai mảnh tối màu cùng giày nâu bên tường màu kem."],
      ["dark-two-piece-suit-profile", "Side view of the dark suit and the sleeve, with brown shoes in the foreground.", "Góc nghiêng suit tối màu và tay áo, với giày nâu ở phía trước."],
      ["dark-two-piece-suit-three-quarter", "Three-quarter view of the suit, showing the open white collar and matching trousers.", "Góc ba phần tư bộ suit, thấy cổ sơ mi trắng mở và quần đồng bộ."]
    ]
  },
  {
    id: "phoi-ca-vat-hoa-tiet", route: geometricTie, album: "appointments",
    labels: ["The geometric tie", "Cà vạt họa tiết hình học"],
    summary: ["Orange, green and blue shapes bring colour between navy lapels. The series follows the knot and the pocket-square pairing.", "Họa tiết cam, xanh lục và xanh dương điểm sắc giữa hai ve navy. Bộ ảnh ghi lại cách thắt nút và phối khăn túi ngực."],
    photos: [
      ["geometric-tie-navy-jacket-front", "Navy jacket and white shirt with a multicolour geometric tie on a dress form.", "Áo khoác navy và sơ mi trắng phối cà vạt hình học nhiều màu trên ma-nơ-canh."],
      ["geometric-tie-setting-the-knot", "Hands setting the knot of a patterned tie against a light shirt.", "Tay chỉnh nút thắt cà vạt họa tiết trên nền sơ mi sáng."],
      ["geometric-tie-side-of-lapel", "Side view of the geometric tie between the jacket lapels and white collar.", "Góc nghiêng cà vạt hình học giữa ve áo khoác và cổ sơ mi trắng."],
      ["geometric-tie-yellow-pocket-square", "Orange, green and blue shapes on the tie beside a yellow pocket square.", "Họa tiết cam, xanh lục và xanh dương trên cà vạt, cạnh khăn túi ngực vàng."]
    ]
  },
  showroomEntrance,
  {
    id: "phoi-giay-voi-suit", route: footwear, album: "appointments",
    labels: ["From loafers to lace-ups", "Từ giày loafer đến giày buộc dây"],
    summary: ["Brown loafers and black lace-ups show two ways to finish a tailored outfit.", "Giày loafer nâu và giày buộc dây đen gợi ý hai cách hoàn thiện bộ trang phục may đo."],
    photos: [
      ["brown-loafers-showroom-three-quarter", "Pair of brown leather loafers on a light stone display plinth.", "Đôi loafer da nâu trên bục trưng bày bằng đá sáng màu."],
      ["black-lace-ups-showroom-display", "Pair of black leather lace-ups displayed below a dark jacket.", "Đôi giày da buộc dây đen trưng bày bên dưới áo khoác tối."],
      ["brown-loafer-side-profile", "Side profile of a brown loafer showing the toe, vamp and low heel.", "Góc nghiêng giày loafer nâu, thấy rõ mũi, thân giày và gót thấp."]
    ]
  },
  {
    id: "ao-khoac-xam-dang-dai", route: longline, album: "jacket-craft",
    labels: ["Longline grey jacket", "Áo khoác xám dáng dài"],
    summary: ["A light grey longline jacket with a shaped waist, notch lapels, pale buttons and a patterned blue lining.", "Áo khoác xám nhạt dáng dài, chiết eo, ve chữ K, khuy sáng và lớp lót xanh họa tiết."],
    photos: [
      ["longline-grey-jacket-silhouette", "Longline pale grey jacket on a hanger showing its shaped waist and hem.", "Áo khoác xám nhạt dáng dài trên móc, thấy đường chiết eo và lai áo."],
      ["longline-grey-jacket-waist-fastening", "Shaped waist seams and pale fastening buttons on the longline jacket.", "Đường chiết eo và khuy cài sáng màu trên áo khoác dáng dài."],
      ["longline-grey-jacket-notch-lapels", "Close view of the collar and notch lapels above the blue lining.", "Cận cổ áo và ve chữ K ngay phía trên lớp lót xanh."],
      ["longline-grey-jacket-patterned-blue-lining", "Patterned blue lining and the inside zip of the grey jacket.", "Lớp lót xanh họa tiết và khóa kéo bên trong áo khoác xám."]
    ]
  },
  {
    id: "ao-khoac-navy-lot-vang", route: goldLining, album: "jacket-craft",
    labels: ["Gold lining inside a navy jacket", "Lớp lót vàng trong áo khoác navy"],
    summary: ["An open navy jacket shows the gold lining, inside pockets and the seam where lining meets facing.", "Khi mở áo khoác navy, có thể thấy lớp lót vàng, túi trong và đường may tiếp giáp giữa lót và nẹp."],
    photos: [
      ["navy-jacket-open-gold-lining", "Hand opening a navy jacket to reveal gold lining and its inside pockets.", "Tay mở áo khoác navy để lộ lớp lót vàng và các túi trong."],
      ["navy-jacket-gold-lining-inner-pockets", "Gold lining and dark pocket welts inside the navy jacket laid flat.", "Lót vàng và viền túi tối phía trong áo khoác navy khi trải phẳng."],
      ["navy-jacket-button-over-gold-lining", "Dark button on a navy jacket front above a fold of gold lining.", "Khuy tối trên thân áo navy, phía trên nếp gấp lớp lót vàng."],
      ["navy-jacket-gold-lining-lower-edge", "Lower edge where the folds of the gold lining meet a navy facing.", "Mép dưới, nơi nếp lót vàng tiếp giáp nẹp vải navy."]
    ]
  },
  {
    id: "buoi-tu-van-may-do", route: consultation, album: "showroom",
    labels: ["The consultation room", "Không gian tư vấn may đo"],
    summary: ["A showroom desk, display rail and fabrics in hand show where a tailoring consultation begins.", "Bàn tư vấn, thanh treo trang phục và mẫu vải trên tay cho thấy nơi bắt đầu một buổi tư vấn may đo."],
    photos: [
      ["showroom-consultation-desk", "Consultation desk and seated staff member below a tailoring display at S.T Tailor.", "Bàn tư vấn và nhân viên ngồi bên dưới khu trưng bày trang phục tại S.T Tailor."],
      ["showroom-brass-rail-and-shoes", "Jackets and shoes displayed against a textured wall with brass rails.", "Áo khoác và giày trưng bày bên tường vân nổi, cạnh thanh treo ánh đồng."],
      ["/media/2026/09/st-tailor-gallery-canonico-cloth-books.jpg", "Cloth books and a pale swatch open on a green showroom chair.", "Sách mẫu vải và mẫu vải sáng mở trên ghế xanh trong showroom."],
      ["showroom-comparing-dark-fabric-swatches", "Hand turning a dark swatch above cloth books on the consultation table.", "Tay lật mẫu vải tối bên trên các sách mẫu đặt trên bàn tư vấn."]
    ]
  },
  {
    id: "chi-tiet-so-mi-may-do", route: shirtDetails, album: "shirts-trousers",
    labels: ["Shirt details", "Chi tiết sơ mi may đo"],
    summary: ["Collar samples, a sleeve seam and cufflinks show the choices that shape a tailored shirt and how it is worn.", "Mẫu cổ áo, đường ráp tay và khuy măng sét cho thấy những chi tiết định hình sơ mi may đo và cách phối."],
    photos: [
      ["/media/2026/09/st-tailor-gallery-duk-9907.jpg", "Folded white shirt with a fine check inside the collar and cuff.", "Sơ mi trắng gấp gọn, có ca rô nhỏ phía trong cổ và cổ tay."],
      ["shirt-collar-shapes-on-shelf", "Pale shirt collar samples set out side by side on a textured shelf.", "Các mẫu cổ sơ mi sáng màu đặt cạnh nhau trên kệ vân nổi."],
      ["white-shirt-sleeve-shoulder-seam", "Close view of the seam where a white shirt sleeve joins the shoulder.", "Cận đường ráp tay áo vào thân ở vùng vai trên sơ mi trắng."],
      ["boxed-cufflinks-showroom-shelf", "Open boxes of cufflinks and accessories on a light showroom shelf.", "Các hộp khuy măng sét và phụ kiện mở nắp trên kệ showroom màu sáng."]
    ]
  },
  {
    id: "duong-cat-va-lop-lot", route: jacketConstruction, album: "jacket-craft",
    labels: ["The cut and the cloth", "Đường cắt và chất vải"],
    summary: ["Six views compare jacket profiles, pockets, cuffs and the surfaces visible when a jacket opens.", "Sáu góc nhìn so sánh phom áo, túi, cổ tay và những bề mặt lộ ra khi mở áo khoác."],
    photos: [
      ["deep-blue-tailored-jacket-on-form", "Angled view of a deep blue tailored jacket and white shirt on a form.", "Áo khoác xanh đậm và sơ mi trắng trên ma-nơ-canh, chụp từ góc nghiêng."],
      ["sand-jacket-rounded-patch-pocket", "Rounded patch pocket and sleeve buttons on a sand-coloured jacket.", "Túi đắp bo tròn và khuy tay trên áo khoác màu cát."],
      ["navy-jacket-pale-trim-interior-pocket", "Inside pocket with pale trim against the navy cloth of a jacket.", "Túi trong viền sáng trên nền vải xanh navy của áo khoác."],
      ["jacket-printed-lining-and-label", "Red, ochre and black printed lining around a welt pocket and S.T Tailor label.", "Lót in đỏ, vàng đất và đen quanh túi viền và nhãn S.T Tailor."],
      ["pale-jacket-three-cuff-buttons", "Three dark cuff buttons on a pale jacket sleeve laid across the jacket front.", "Ba khuy tay tối màu trên ống tay sáng đặt ngang thân áo."],
      ["brass-showroom-rail-jacket-colours", "Burgundy, navy, pale blue and mauve jackets along a brass rail.", "Áo khoác đỏ rượu, navy, xanh nhạt và tím nhạt trên thanh treo ánh đồng."]
    ]
  },
  {
    id: "anh-can-chi-tiet-may", route: jacketConstruction, album: "jacket-craft",
    labels: ["A closer look at tailoring", "Cận cảnh chi tiết may đo"],
    summary: ["Lapel lines, woven motifs and contrasting linings are seen close up, then in the context of the showroom rail.", "Đường ve, họa tiết dệt và lót tương phản được ghi lại ở cự ly gần, rồi đặt trong tổng thể khu trưng bày."],
    photos: [
      ["navy-lapel-gold-pocket-square", "Gold pocket square below the notch lapel of a dark blue jacket.", "Khăn túi ngực vàng bên dưới ve chữ K của áo khoác xanh đậm."],
      ["stone-grey-lapel-buttonhole", "Stitched lapel buttonhole and pocket edge on a stone-grey jacket.", "Khuyết ve áo và mép túi trên áo khoác màu xám đá."],
      ["/media/2026/09/st-tailor-gallery-patterned-shirt.jpg", "Blue shirt with copper-toned woven motifs on a showroom hanger.", "Sơ mi xanh họa tiết dệt ánh đồng trên móc trong showroom."],
      ["green-suiting-cuff-and-pocket", "Green-grey jacket cuff and pocket as the wearer rests a hand beside the hip.", "Cổ tay và túi áo khoác xanh xám khi người mặc đặt tay bên hông."],
      ["dark-jacket-red-jacquard-facing", "Dark jacket opened to show red jacquard lining beside a light shirt.", "Áo khoác tối mở vạt để lộ lót jacquard đỏ cạnh sơ mi sáng."],
      ["showroom-navy-and-grey-jackets-on-rail", "Navy and grey jackets on the showroom rail, with gold lining visible on one.", "Áo khoác navy và xám trên thanh treo, một chiếc để lộ lớp lót vàng."],
      ["silver-blue-brocade-shoulder-detail", "Silver-blue brocade motif photographed at the shoulder of a shirt.", "Họa tiết gấm xanh ánh bạc chụp cận ở vai áo."],
      ["showroom-white-and-gold-shirts-on-rail", "Pale and gold-toned shirts hanging side by side on a showroom rail.", "Sơ mi trắng và vàng treo cạnh nhau trên thanh treo trong showroom."]
    ]
  },
  {
    id: "phong-chon-vai", route: clothLibrary, album: "cloth",
    labels: ["The cloth room", "Không gian chọn vải"],
    summary: ["Swatches on the table and in the hand show how cloth is compared before a garment is cut.", "Mẫu vải đặt trên bàn và cầm trên tay cho thấy cách so sánh chất liệu trước khi cắt may."],
    photos: [
      ["cloth-room-suits-along-the-rail", "Tailored jackets in blue, grey, lilac and ivory arranged along the showroom rail.", "Áo khoác may đo các màu xanh, xám, tím nhạt và ngà trên thanh treo showroom."],
      ["/media/2026/09/st-tailor-suiting-fabric-swatches.jpeg", "Folded suiting swatches laid side by side on cloth books.", "Các mẫu vải may suit gấp và đặt cạnh nhau trên sách mẫu."],
      ["cloth-room-ochre-swatch-in-hand", "Hand holding folds of an ochre fabric to show its texture and drape.", "Tay cầm các nếp vải vàng đất để thấy bề mặt và độ rủ."],
      ["cloth-room-blue-books-on-stone-shelf", "Blue cloth books stacked against a stone-finish showroom shelf.", "Sách mẫu vải bìa xanh xếp trên kệ showroom hoàn thiện vân đá."]
    ]
  },
  {
    id: "phom-ao-khoac", route: jacketLine, album: "suits",
    labels: ["The jacket line", "Đường nét áo khoác"],
    summary: ["Four jackets show how button stance, shoulder line and cloth pattern affect the look of the front and sleeve.", "Bốn áo khoác cho thấy ảnh hưởng của vị trí khuy, đường vai và họa tiết vải đến thân trước và tay áo."],
    photos: [
      ["blue-double-breasted-jacket-on-form", "Blue double-breasted jacket with peak lapels on a tailoring form.", "Áo khoác xanh hai hàng khuy, ve nhọn, trên ma-nơ-canh."],
      ["checked-grey-double-breasted-jacket-front", "Front of a checked grey double-breasted jacket hanging open at the collar.", "Mặt trước áo khoác xám ca rô hai hàng khuy với phần cổ mở."],
      ["tan-tailored-jacket-on-rail", "Tan jacket with a notched lapel and flap pocket on the showroom rail.", "Áo khoác nâu vàng ve chữ K và túi nắp trên thanh treo trong showroom."],
      ["grey-jacket-cuff-dark-buttons", "Row of dark buttons and stitched buttonholes on a grey jacket cuff.", "Hàng khuy tối và khuyết may ở cổ tay áo khoác xám."]
    ]
  },
  {
    id: "chinh-vai-ao-xam-bac", route: silverSuit, album: "fitting",
    labels: ["Fitting the silver-grey jacket", "Buổi thử áo khoác xám bạc"],
    summary: ["The jacket is shown on the client while the shoulder, sleeve finish and back line are checked.", "Áo khoác trên người khách trong lúc thợ may kiểm tra vai, cổ tay và đường thân sau."],
    photos: [
      ["silver-grey-jacket-shoulder-fitting", "Tailor adjusting the shoulder and lapel of the silver-grey jacket on the client.", "Thợ may chỉnh đường vai và ve áo khoác xám bạc trên người khách."],
      ["silver-grey-jacket-sleeve-finish", "Dark cuff buttons on the silver-grey jacket sleeve beside a flap pocket.", "Khuy tay tối trên tay áo khoác xám bạc cạnh túi nắp."],
      ["silver-grey-three-piece-back-fitting", "Rear fitting view of the silver-grey jacket and matching trousers.", "Góc thử từ phía sau của áo khoác và quần xám bạc đồng bộ."]
    ]
  },
  {
    id: "cau-tao-ao-ghi-le-xam-bac", route: silverWaistcoat, album: "fitting",
    labels: ["Waistcoat construction", "Kết cấu áo ghi-lê"],
    summary: ["On the form, the waistcoat’s front edges, small buttons, stitched buttonholes and lower points are easy to compare.", "Trên ma-nơ-canh, dễ so sánh mép thân trước, khuy nhỏ, khuyết may và hai vạt nhọn của áo ghi-lê."],
    photos: [
      ["silver-grey-waistcoat-front-on-form", "Silver-grey waistcoat on the form with a narrow welt pocket and pointed fronts.", "Áo ghi-lê xám bạc trên ma-nơ-canh, có túi viền hẹp và hai vạt nhọn."],
      ["silver-grey-waistcoat-lower-buttons", "Lower waistcoat buttons, welt pocket edge and fine weave in close-up.", "Cận các khuy dưới của áo ghi-lê, mép túi viền và bề mặt dệt."],
      ["silver-grey-waistcoat-stitched-buttonholes", "Two stitched buttonholes beside the folded edge of the silver-grey waistcoat.", "Hai khuyết may cạnh mép gập của áo ghi-lê xám bạc."]
    ]
  },
  {
    id: "van-vai-ao-xam-bac", route: silverJacket, album: "jacket-craft",
    labels: ["Grain and lining", "Vân vải và lớp lót"],
    summary: ["The silver-grey cloth is shown at the lapel, the lining edge and the junction with the facing.", "Vải xám bạc được ghi lại ở ve áo, mép lót và phần tiếp giáp giữa lớp lót và nẹp."],
    photos: [
      ["silver-grey-jacket-lapel-and-grain", "Fine weave along the edge of the silver-grey jacket lapel.", "Vân dệt nhỏ chạy dọc mép ve áo khoác xám bạc."],
      ["silver-grey-jacket-lining-at-edge", "Pale lining meeting the silver-grey fabric at the inside edge of the jacket.", "Lớp lót sáng tiếp giáp vải xám bạc ở mép trong áo khoác."],
      ["silver-grey-jacket-jacquard-lining-and-facing", "Pale patterned jacquard lining stitched to a strip of silver-grey facing.", "Lót jacquard sáng họa tiết được may vào nẹp xám bạc."]
    ]
  },
  {
    id: "chi-tiet-ao-khoac-xam-bac", route: silverJacket, album: "jacket-craft",
    labels: ["The jacket in detail", "Chi tiết áo khoác xám bạc"],
    summary: ["Front, shoulder and back views show the notch, pocket edge and the uninterrupted fall of the jacket.", "Các góc trước, vai và sau cho thấy góc ve, mép túi và độ rủ liền mạch của áo khoác."],
    photos: [
      ["silver-grey-jacket-front-white-shirt", "Silver-grey notch-lapel jacket over an open-collar white shirt on a form.", "Áo khoác xám bạc ve chữ K phối sơ mi trắng mở cổ trên ma-nơ-canh."],
      ["silver-grey-jacket-notch-and-shoulder-weave", "Close view of the notch, shoulder line and fine horizontal weave of the jacket.", "Cận góc ve, đường vai và vân dệt ngang nhỏ của áo khoác."],
      ["silver-grey-jacket-back-on-form", "Back of the silver-grey jacket, showing the fall of the cloth over the shoulder.", "Thân sau áo khoác xám bạc, cho thấy độ rủ của vải từ vai."]
    ]
  },
  {
    id: "lan-thu-ghi-le-dau", route: silverWaistcoat, album: "fitting",
    labels: ["The first waistcoat check", "Lần kiểm tra đầu khi thử ghi-lê"],
    summary: ["The waistcoat is checked with a peach shirt, both from a standing position and at the armhole.", "Thợ may kiểm tra áo ghi-lê khi mặc cùng sơ mi màu đào, từ dáng đứng đến vòng nách."],
    photos: [
      ["silver-grey-waistcoat-client-arms-bent", "Client in a silver-grey waistcoat bending his arms during a showroom fitting.", "Khách mặc ghi-lê xám bạc, gập tay trong buổi thử tại showroom."],
      ["silver-grey-waistcoat-peach-shirt-fitting", "Client in a silver-grey waistcoat and peach shirt with the tailor behind him.", "Khách mặc ghi-lê xám bạc và sơ mi màu đào, thợ may đứng phía sau."],
      ["silver-grey-waistcoat-armhole-edge", "Close view of the waistcoat armhole finish beside the peach shirt.", "Cận mép vòng nách áo ghi-lê bên cạnh sơ mi màu đào."]
    ]
  }
];

export const portfolioStories = [
  {
    route: ivoryJacket, section: "suits-and-jackets",
    description: "Explore an ivory tailored jacket by S.T Tailor in Ho Chi Minh City. Examine its notch lapel, flap pocket, tonal button and fine weave.",
    details: [
      ["White and ivory in daylight", "Sắc trắng và ngà dưới ánh sáng ban ngày", "An open white collar sits close to the ivory lapels. Check the two colours together in daylight before choosing a shirt. In warm indoor lighting, the cream cast of the jacket may look stronger.", "Cổ sơ mi trắng mở cạnh ve áo màu ngà. Hãy so hai màu dưới ánh sáng ban ngày trước khi chọn sơ mi. Dưới ánh đèn ấm, áo khoác có thể ngả kem rõ hơn."],
      ["The line from shoulder to pocket", "Đường nét từ vai đến túi áo", "The angled photograph makes the shoulder, lapel and flap pocket easy to read together. In the button close-up, the tonal fastening leaves the weave visible. When you try a pale jacket, check the hem and the position of the pocket with your intended trousers.", "Ảnh nghiêng cho thấy cùng lúc đường vai, ve áo và túi nắp. Ảnh cận khuy cùng tông vẫn làm rõ vân vải. Khi thử áo sáng màu, hãy xem lai và vị trí túi cùng quần dự định phối."]
    ],
    related: ["/san-pham/ao-khoac-trang-nga-ve-den/", "/san-pham/blazer-mau-be/", suitService]
  },
  {
    route: clothLibrary, section: "craft-and-style",
    labels: ["The S.T Tailor cloth library", "Thư viện vải S.T Tailor"],
    summary: ["From books on the shelf to cloth in the hand, see how we compare colour, texture and drape at the showroom.", "Từ sách mẫu trên kệ đến vải cầm trên tay, xem cách chúng tôi so sánh màu, bề mặt và độ rủ tại showroom."],
    description: "See the cloth library at S.T Tailor. Compare fabric books, laid-out suiting swatches and hand-held samples before a made-to-measure commission.",
    details: [
      ["Read the cloth in more than one light", "Xem vải dưới nhiều nguồn sáng", "Place shortlisted swatches next to one another, then take them closer to daylight. A fabric that reads as solid from across the room may show both warp and weft colours up close. Holding a fold helps you judge body and drape.", "Đặt các mẫu đã chọn cạnh nhau rồi đưa đến gần nguồn sáng tự nhiên. Vải trông như một màu khi nhìn xa có thể hiện rõ màu sợi dọc và sợi ngang ở cự ly gần. Cầm một nếp gấp giúp cảm nhận độ đứng và độ rủ."],
      ["Choose for the garment and occasion", "Chọn vải theo trang phục và dịp mặc", "Discuss when and where you plan to wear the piece. Compare European suitings, including Vitale Barberis Canonico, for a jacket or suit. Review Vietnamese silk for pieces where its sheen and movement suit the design. Ask to see and feel the cloth you intend to order.", "Hãy chia sẻ khi nào và ở đâu bạn sẽ mặc trang phục. Có thể so sánh vải suit châu Âu, trong đó có Vitale Barberis Canonico, cho áo khoác hoặc bộ suit. Tìm hiểu lụa Việt Nam khi độ óng và độ rủ phù hợp với thiết kế. Hãy xem và chạm mẫu vải dự định đặt may."]
    ],
    related: [clothGuide, "/chon-vai-may-do/vai-len-y/", "/chon-vai-may-do/lua-viet-nam/", consultation]
  },
  {
    route: darkSuit, section: "suits-and-jackets",
    description: "See a dark two-piece suit on the form at S.T Tailor, with matching trousers, an open white collar and brown leather shoes.",
    details: [
      ["A jacket and trousers cut from the same cloth", "Áo khoác và quần đồng bộ", "The uninterrupted colour from jacket to trousers gives the two-piece its line. A white collar opens the neckline, while brown shoes introduce a warm tone at the floor. The side angle shows more of the sleeve length and jacket hem.", "Sắc vải liền mạch từ áo khoác đến quần tạo đường nét cho bộ suit hai mảnh. Sơ mi trắng mở cổ làm phần cổ thoáng hơn, còn giày nâu thêm sắc ấm ở dưới. Góc nghiêng cho thấy rõ hơn độ dài tay và lai áo."],
      ["Bring the shoes to the fitting", "Mang giày đến buổi thử", "Stand and walk in the shoes you expect to wear. The tailor can then judge how the trouser crease meets the shoe and whether the hem settles as intended. Try the jacket with the shirt buttoned and open to compare the effect at the neck.", "Hãy đứng và đi thử với đôi giày bạn dự định mang. Thợ may có thể xem đường ly chạm mũi giày thế nào và lai quần có rơi đúng vị trí hay không. Thử áo khoác với sơ mi cài cổ và mở cổ để so sánh."]
    ],
    related: [footwear, "/san-pham/suit-navy-mot-hang-khuy/", fitGuide]
  },
  {
    route: geometricTie, section: "craft-and-style",
    description: "See a geometric tie in orange, green and blue with a navy tailored jacket, including close views of the knot, lapel and yellow pocket square.",
    details: [
      ["Where the knot sits", "Vị trí nút thắt", "Set the knot close to the collar and check that it sits between the collar points. In the side view, the navy lapels leave a narrow band of the pattern visible. Consider the collar opening and tie width together when choosing what to wear.", "Đưa nút thắt sát cổ áo và kiểm tra vị trí giữa hai lá cổ. Ở góc nghiêng, hai ve navy để lộ một dải họa tiết hẹp. Khi phối đồ, hãy xem cùng lúc độ mở cổ áo và bản cà vạt."],
      ["Echo one accent colour", "Nhắc lại một màu nhấn", "A yellow pocket square picks up the warm shades in the tie. The white shirt and dark jacket leave room for the geometric pattern. Compare the pocket square folded flat with a softer fold to see how much colour you want at the breast pocket.", "Khăn túi ngực vàng nhắc lại các sắc ấm trên cà vạt. Sơ mi trắng và áo khoác tối tạo nền cho họa tiết hình học. Hãy thử gấp khăn phẳng và gấp mềm để chọn lượng màu muốn để lộ ở túi ngực."]
    ],
    related: [shirtDetails, "/san-pham/suit-navy-mot-hang-khuy/", footwear]
  },
  {
    route: footwear, section: "craft-and-style",
    description: "Compare brown loafers and black lace-ups with S.T Tailor’s tailored looks. Learn what to check where a trouser hem meets the shoe.",
    details: [
      ["Choose the shoe for the occasion", "Chọn giày theo dịp mặc", "Brown loafers introduce a warmer colour against navy or grey. Black lace-ups give a darker, more formal finish with a dark suit. Check the shoes beside the complete outfit, including socks and accessories, before making your choice.", "Loafer nâu tạo sắc ấm khi phối cùng navy hoặc xám. Giày buộc dây đen cho tổng thể trầm và trang trọng hơn khi đi với suit tối màu. Hãy đặt giày cạnh cả bộ trang phục, gồm tất và phụ kiện, trước khi chọn."],
      ["Check the trouser break in motion", "Kiểm tra nếp gãy ống quần khi di chuyển", "A loafer and a lace-up can sit at different heights over the instep. Wear the intended shoes to your fitting. Check the cloth above the vamp while standing, then take a few steps to see where the hem settles.", "Giày loafer và giày buộc dây có thể cao khác nhau ở mu bàn chân. Hãy mang đôi giày dự định phối đến buổi thử. Kiểm tra phần vải phía trên thân giày khi đứng, sau đó đi vài bước để xem lai rơi ở đâu."]
    ],
    related: [darkSuit, geometricTie, "/san-pham/quan-tay-ca-ro-xam/"]
  },
  {
    route: longline, section: "suits-and-jackets",
    description: "See a longline pale grey jacket by S.T Tailor, with notch lapels, shaped waist seams, pale buttons and a patterned blue lining with an inside zip.",
    details: [
      ["Waist placement and length", "Vị trí eo và độ dài áo", "Shaped seams guide the eye through the waist down to the long hem. Pale buttons keep the line through the front in the same tonal range. At a fitting, bring the layer you intend to wear underneath and check that fastening the jacket leaves room to sit.", "Đường chiết dẫn mắt qua eo xuống lai dài. Khuy sáng giúp thân trước đồng nhất về sắc độ. Khi thử, hãy mang lớp áo định mặc bên trong và kiểm tra khi cài khuy vẫn có đủ độ thoải mái để ngồi."],
      ["Inside the jacket", "Bên trong áo khoác", "The blue lining carries a woven-looking motif and a zipped opening. The close view shows how the pattern sits inside the pale outer cloth. Try reaching the inside zip with the jacket on to judge its position and ease of use.", "Lớp lót xanh có họa tiết và một đường khóa kéo. Ảnh cận cho thấy cách họa tiết nằm bên trong nền vải ngoài sáng màu. Hãy thử với tay đến khóa khi đang mặc áo để xem vị trí có thuận tiện không."]
    ],
    related: [jacketLine, liningGuide, "/san-pham/suit-nu-trang/"]
  },
  {
    route: goldLining, section: "suits-and-jackets",
    description: "Explore a navy jacket with gold lining by S.T Tailor. Compare the open jacket, inside pockets, dark button and lower facing.",
    details: [
      ["Gold from the pocket to the hem", "Sắc vàng từ túi đến lai áo", "Open the navy jacket and the gold lining becomes the dominant surface. The dark pocket trim echoes the outer fabric. The photograph of the jacket laid flat makes the pocket openings and label placement easy to see.", "Khi mở áo khoác navy, lớp lót vàng trở thành bề mặt nổi bật nhất. Viền túi tối lặp lại màu vải ngoài. Ảnh áo trải phẳng cho thấy rõ miệng túi và vị trí nhãn."],
      ["The edge where the layers meet", "Mép tiếp giáp giữa hai lớp", "At the bottom of the jacket, the gold lining folds before it meets the navy facing. See this junction with the garment on and off the body when comparing linings. A contrast colour can be subtle when the front is closed and much more visible when it opens.", "Ở mép dưới, lớp lót vàng tạo nếp trước khi tiếp giáp nẹp navy. Khi so sánh mẫu lót, hãy xem điểm này cả lúc mặc và khi đặt áo xuống. Màu tương phản chỉ hiện nhẹ khi cài áo và rõ hơn nhiều khi mở vạt."]
    ],
    related: [liningGuide, "/du-an/buoi-thu-suit-lot-vang/", "/san-pham/ao-khoac-den-lot-do/"]
  },
  {
    route: consultation, section: "craft-and-style",
    description: "See S.T Tailor’s consultation room in Ho Chi Minh City and what to bring when choosing cloth, cut and fitting dates for a tailored garment.",
    details: [
      ["What to bring to the conversation", "Chuẩn bị cho buổi tư vấn", "Bring the date and occasion, any dress code, and a garment or photo that shows how you like to dress. If an existing jacket or pair of trousers fits especially well, that gives the tailor a clear reference for length and ease.", "Hãy chuẩn bị ngày và dịp mặc, quy định trang phục nếu có, cùng một món đồ hoặc ảnh thể hiện cách bạn thích mặc. Nếu đã có áo khoác hoặc quần vừa ý, đó là mẫu tham khảo rõ ràng về độ dài và độ rộng."],
      ["From swatches to a fitting plan", "Từ mẫu vải đến lịch thử", "Compare swatches beside a finished garment to see how texture and colour change at a larger scale. Discuss the intended cut, how you move in the garment, and the dates when you can return. Visitors to Ho Chi Minh City can share their travel window before booking.", "So mẫu vải cạnh trang phục hoàn thiện để thấy bề mặt và màu sắc thay đổi thế nào trên diện tích lớn. Hãy trao đổi về kiểu dáng, cách bạn vận động trong trang phục và các ngày có thể quay lại. Khách đến TP. Hồ Chí Minh có thể cho biết lịch trình trước khi đặt hẹn."]
    ],
    related: [clothLibrary, fittingProcess, "/lien-he/"]
  },
  {
    route: shirtDetails, section: "craft-and-style",
    title: "Tailored Shirt Collars, Cuffs and Seams | S.T Tailor",
    description: "Compare collar samples, white-shirt stitching, checked inner trim and cufflinks at S.T Tailor before choosing details for a made-to-measure shirt.",
    details: [
      ["The collar with an open neck or tie", "Cổ áo khi mở khuy hoặc đeo cà vạt", "Collar samples let you compare how far the points spread and how much of the tie knot will show. The white shirt folds back to reveal a small check inside the collar and cuff. Bring your usual jacket to view the collar beside its lapels.", "Các mẫu cổ áo giúp so sánh độ mở của hai lá cổ và phần nút cà vạt sẽ lộ ra. Sơ mi trắng gập lại để lộ ca rô nhỏ trong cổ và cổ tay. Hãy mang áo khoác thường mặc để xem cổ sơ mi cạnh ve áo."],
      ["Sleeve, shoulder and cuff", "Tay áo, vai và cổ tay", "The close-up shows where the sleeve joins the shoulder. At a fitting, reach forward and check how the shirt feels across the back. If you want to wear cufflinks, discuss a cuff made to take them and try it beside your jacket sleeve.", "Ảnh cận cho thấy đường ráp tay với thân áo ở vai. Khi thử, hãy đưa tay ra trước và cảm nhận phần lưng áo. Nếu muốn dùng khuy măng sét, hãy trao đổi về kiểu cổ tay phù hợp và thử cùng tay áo khoác."]
    ],
    related: ["/san-pham/so-mi-trang-vien-ca-ro/", "/san-pham/so-mi-xanh-nhat-tay-ngan/", geometricTie, fittingProcess]
  },
  {
    route: jacketConstruction, section: "craft-and-style",
    labels: ["The cut and the cloth", "Đường cắt và chất vải"],
    description: "Examine S.T Tailor jacket details in close-up, from a rounded patch pocket and stitched lapel to cuff buttons, woven motifs and contrast linings.",
    details: [
      ["Pockets on the outside and inside", "Túi ngoài và túi trong", "The rounded patch pocket sits visibly on the sand-coloured jacket. A lighter trim outlines the inside pocket on the navy cloth. Compare these placements with how you use your jacket, including which hand you reach with and what you normally carry.", "Túi đắp bo tròn nổi rõ trên áo màu cát. Viền sáng tạo đường nét cho túi trong trên nền vải navy. Hãy so các vị trí này với thói quen sử dụng, kể cả tay thuận và những món bạn thường mang."],
      ["In close-up and on the rail", "Từ ảnh cận đến tổng thể trên thanh treo", "Near the jacket, the stitched buttonhole, cuff buttons and woven surface are easier to distinguish. Step back to see how the colours read at a distance. Brocade on a shirt and jacquard inside a jacket can bring pattern to different areas of the same outfit.", "Ở cự ly gần, dễ phân biệt khuyết may, khuy tay và bề mặt dệt. Lùi lại để xem màu sắc hiện lên thế nào từ xa. Gấm trên sơ mi và jacquard bên trong áo khoác có thể đặt họa tiết ở những vị trí khác nhau trong cùng bộ đồ."],
      ["Decide what you want to see when the jacket opens", "Chọn chi tiết muốn lộ ra khi mở áo", "A gold pocket square can put a small note of colour on the outside, while a red jacquard lining remains inside the jacket. Try the layers together, at rest and with your jacket open, to judge the balance.", "Khăn túi ngực vàng tạo một điểm màu nhỏ bên ngoài, còn lót jacquard đỏ nằm trong áo. Hãy thử các lớp cùng nhau, khi đứng tự nhiên và khi mở vạt, để xem độ cân bằng."]
    ],
    related: [jacketLine, goldLining, liningGuide, shirtDetails]
  },
  {
    route: jacketLine, section: "craft-and-style",
    title: "Tailored Jacket Shapes and Cuff Details | S.T Tailor",
    description: "Compare four tailored jackets from S.T Tailor, including blue and checked double-breasted styles, a tan jacket and a grey jacket cuff.",
    details: [
      ["Button stance and lapel", "Vị trí khuy và đường ve", "Set the solid blue jacket beside the checked double-breasted jacket. The two rows of buttons establish the front, while the checks draw attention to how the cloth sits around the closure. The tan jacket gives a quieter view of the lapel and flap pocket.", "Đặt áo xanh trơn cạnh áo ca rô hai hàng khuy. Hai hàng khuy tạo bố cục thân trước, còn ô ca rô làm rõ cách vải nằm quanh điểm cài. Áo màu nâu vàng cho thấy ve và túi nắp trên nền vải ít họa tiết hơn."],
      ["Compare sleeve details with the full jacket", "Xem chi tiết tay áo trong tổng thể", "The grey cuff shows how the button row is spaced along the sleeve. Use the complete jacket view to compare cuff position with the shoulder, jacket length and front pockets. Bring a shirt to the fitting if you want a particular amount of cuff to show.", "Cổ tay áo xám cho thấy khoảng cách giữa các khuy dọc ống tay. Từ ảnh toàn áo, hãy so vị trí cổ tay với vai, chiều dài áo và túi trước. Mang theo sơ mi đến buổi thử nếu muốn phần cổ tay áo lộ ra ở một mức nhất định."]
    ],
    related: ["/san-pham/blazer-xanh-hai-hang-khuy/", "/san-pham/ao-khoac-xam-dang-dai/", fitGuide]
  },
  {
    route: silverJacket, section: "client-work",
    labels: ["Details of the silver-grey jacket", "Chi tiết áo khoác xám bạc"],
    coverCollection: "chi-tiet-ao-khoac-xam-bac",
    description: "The silver-grey jacket at S.T Tailor, with a closer view of the notch lapel, woven grain, shoulder, back, jacquard lining and facing.",
    details: [
      ["The front, shoulder and back", "Thân trước, vai và thân sau", "The notch and the open white collar define the upper front. The shoulder close-up shows the direction of the fine weave, and the rear view shows how the fabric drapes across the back. Compare these views during a fitting with your arms relaxed.", "Góc ve và cổ sơ mi trắng mở tạo đường nét phần thân trước phía trên. Ảnh cận vai cho thấy hướng vân dệt nhỏ, còn ảnh sau ghi lại độ rủ của vải qua lưng. Khi thử, hãy so các góc này lúc hai tay thả lỏng."],
      ["How the lining is joined", "Cách ráp lớp lót", "The pale patterned lining meets a strip of outer cloth at the inside edge. The photographs show the weave of the facing and the texture of the lining together. View this detail when the jacket is open, then move your arm to see how the layers sit as you reach.", "Lớp lót sáng họa tiết tiếp giáp dải vải ngoài ở mép trong. Ảnh cận cho thấy vân dệt của nẹp và bề mặt lớp lót cùng lúc. Hãy xem chi tiết khi mở áo, rồi cử động tay để kiểm tra hai lớp nằm thế nào khi với."]
    ],
    related: [silverSuit, silverWaistcoat, liningGuide]
  },
  {
    route: silverWaistcoat, section: "fittings",
    labels: ["Fitting a silver-grey waistcoat", "Thử áo ghi-lê xám bạc"],
    coverCollection: "lan-thu-ghi-le-dau",
    description: "See a silver-grey waistcoat at its fitting and on the tailoring form. Compare the armhole, front points, buttonholes and small welt pocket.",
    details: [
      ["On the form", "Trên ma-nơ-canh", "The form gives a steady view of the waistcoat’s front points, pocket edges and buttonholes. The close-ups record the alignment of the lower buttons and the finish where the front edges meet.", "Ma-nơ-canh cho góc nhìn ổn định về hai vạt nhọn, mép túi và khuyết áo ghi-lê. Ảnh cận ghi lại sự thẳng hàng của các khuy dưới và đường hoàn thiện ở hai mép thân trước."],
      ["On the client", "Trên người khách khi thử", "The client tries the waistcoat with a peach shirt. Bending the elbows changes how the shirt and waistcoat meet at the armhole. After moving, settle back into a natural stance and check that the front closes without pulling at the buttons.", "Khách thử áo ghi-lê cùng sơ mi màu đào. Khi gập khuỷu tay, cách sơ mi và ghi-lê tiếp giáp ở vòng nách thay đổi. Sau khi cử động, hãy đứng thả lỏng rồi kiểm tra hai vạt có cài được mà không kéo căng quanh khuy hay không."]
    ],
    related: [silverSuit, silverJacket, "/du-an/buoi-thu-suit-xam-nhat/", fittingProcess]
  }
];
