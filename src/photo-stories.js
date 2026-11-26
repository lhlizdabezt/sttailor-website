import { portfolioCollections, portfolioStories } from "./portfolio-stories.js";
import { garmentCollections, garmentStories } from "./garment-collections.js";

const blazer = "/san-pham/blazer-xanh-hai-hang-khuy/";
const navyBlazer = "/du-an/phoi-blazer-xanh-navy/";
const navySuit = "/san-pham/suit-navy-mot-hang-khuy/";
const plum = "/san-pham/blazer-mau-man/";
const greyJacket = "/san-pham/ao-khoac-xam-ve-chu-k/";
const fittingRoom = "/du-an/chi-tiet-phong-thu-do/";
const navyFitting = "/du-an/buoi-thu-suit-navy/";
const paleGrey = "/du-an/buoi-thu-suit-xam-nhat/";
const threePiece = "/du-an/suit-ba-manh-xam-bac/";
const dress = "/san-pham/dam-mau-dao-theu-la/";
const crimson = "/san-pham/ao-khoac-den-lot-do/";
const greenSuitFitting = "/du-an/thu-suit-xanh-la-dam/";
const shortSleeveShirt = "/san-pham/so-mi-xanh-nhat-tay-ngan/";

export const photoCollections = [
  {
    id: "thu-suit-xanh-la-dam", route: greenSuitFitting, album: "fitting",
    labels: ["Fitting a deep green suit", "Thử suit xanh lá đậm"],
    summary: ["Front, angled and rear views of a deep green two-piece suit, followed by a portrait with a garment bag at S.T Tailor.", "Các góc chính diện, góc nghiêng và góc sau của bộ suit hai mảnh xanh lá đậm, cùng ảnh chụp với túi đựng trang phục tại S.T Tailor."],
    photos: [
      ["deep-green-suit-fitting-front", "Full-length front view of the deep green two-piece suit worn over a white crew-neck shirt.", "Ảnh toàn thân chính diện bộ suit hai mảnh xanh lá đậm phối áo cổ tròn trắng."],
      ["deep-green-suit-fitting-angle", "Angled view of the deep green suit showing the jacket lapel, sleeve and jacket length.", "Góc nghiêng bộ suit xanh lá đậm, thấy ve áo, tay áo và chiều dài áo khoác."],
      ["deep-green-suit-fitting-back", "Rear view of the deep green suit as the client faces the showroom mirror.", "Góc sau bộ suit xanh lá đậm khi khách quay về phía gương trong showroom."],
      ["showroom-tailoring-garment-bag", "Two people hold a brown garment bag in the S.T Tailor showroom after the fitting.", "Hai người cầm túi đựng trang phục màu nâu tại showroom S.T Tailor sau buổi thử."]
    ]
  },
  {
    id: "so-mi-xanh-nhat-tay-ngan", route: shortSleeveShirt, album: "shirts-trousers",
    labels: ["Light blue short-sleeve shirt", "Sơ mi xanh nhạt tay ngắn"],
    summary: ["An open collar, short sleeves and softly lustrous light blue cloth, photographed with beige shorts at the showroom.", "Cổ áo mở, tay ngắn và vải xanh nhạt ánh nhẹ, chụp cùng quần short màu be tại showroom."],
    photos: [
      ["light-blue-short-sleeve-shirt-front", "Three-quarter front of a light blue short-sleeve shirt with an open collar and visible front buttons.", "Góc ba phần tư từ trước của sơ mi xanh nhạt tay ngắn, thấy cổ mở và hàng khuy trước."],
      ["light-blue-short-sleeve-shirt-right-profile", "Right-side profile of the light blue shirt, showing the sleeve edge and untucked hem above beige shorts.", "Góc nhìn từ bên phải của sơ mi xanh nhạt, thấy mép tay áo và lai thả ngoài quần short be."],
      ["light-blue-short-sleeve-shirt-left-profile", "Left-side profile of the light blue shirt with the wearer’s arm relaxed, showing how the cloth drapes at the side.", "Góc nhìn từ bên trái của sơ mi xanh nhạt khi người mặc thả lỏng tay, thấy độ rủ của vải ở thân bên."]
    ]
  },
  {
    id: "blazer-xanh-hai-hang-khuy", route: blazer, album: "suits",
    labels: ["Blue double-breasted blazer", "Blazer xanh hai hàng khuy"],
    summary: ["A blue blazer with peak lapels, worn with an open white collar and grey trousers.", "Blazer xanh ve nhọn, phối sơ mi trắng mở cổ và quần xám."],
    photos: [
      ["double-breasted-blue-blazer-portrait", "Three-quarter portrait in a blue double-breasted blazer over an open-collar white shirt.", "Chân dung góc ba phần tư với blazer xanh hai hàng khuy và sơ mi trắng mở cổ."],
      ["double-breasted-blue-blazer-profile", "Side view of the blue blazer, showing the shoulder and the angle of the peak lapel.", "Blazer xanh nhìn nghiêng, thấy rõ đường vai và góc ve nhọn."],
      ["double-breasted-blue-blazer-grey-trousers", "Full-length view of the blue blazer with grey trousers and black shoes.", "Ảnh toàn thân với blazer xanh, quần xám và giày đen."]
    ]
  },
  {
    id: "phoi-blazer-xanh-navy", route: navyBlazer, album: "appointments",
    labels: ["A client’s navy blazer", "Blazer xanh navy của khách hàng"],
    summary: ["A navy blazer, open-collar white shirt and grey trousers, photographed standing and seated at the showroom.", "Blazer xanh navy, sơ mi trắng mở cổ và quần xám, chụp lúc đứng và ngồi tại showroom."],
    photos: [
      ["navy-blazer-client-standing", "Client standing in a navy blazer, grey trousers and brown leather shoes.", "Khách đứng trong blazer xanh navy, quần xám và giày da nâu."],
      ["navy-blazer-client-profile", "Profile of the client, showing the blazer’s shoulder, sleeve and side line.", "Khách nhìn nghiêng, cho thấy đường vai, tay và thân bên của blazer."],
      ["navy-blazer-fastening", "Close view of the client’s hands at the front fastening of the navy blazer.", "Cận cảnh tay khách đặt ở phần cài khuy của blazer xanh navy."],
      ["navy-blazer-client-at-table", "Client leaning forward at a small showroom table in a navy blazer.", "Khách mặc blazer xanh navy, hơi nghiêng người về phía bàn nhỏ tại showroom."],
      ["/media/2026/09/st-tailor-gallery-duk-9807.jpg", "Seated portrait in the navy blazer, with grey trousers and crossed legs.", "Chân dung ngồi bắt chéo chân trong blazer xanh navy và quần xám."]
    ]
  },
  {
    id: "suit-navy-mot-hang-khuy", route: navySuit, album: "suits",
    labels: ["Single-breasted navy suit", "Suit xanh navy một hàng khuy"],
    summary: ["A single-breasted navy suit with a white shirt, diagonally striped tie and white pocket square.", "Suit xanh navy một hàng khuy, phối sơ mi trắng, cà vạt sọc chéo và khăn túi ngực trắng."],
    photos: [
      ["navy-single-breasted-suit-portrait", "Client in a navy suit with one hand in his pocket, a striped tie and a white pocket square.", "Khách mặc suit xanh navy, một tay trong túi, phối cà vạt sọc và khăn túi ngực trắng."],
      ["navy-single-breasted-suit-front", "Front view of the navy suit with the client’s hand beside the jacket button.", "Mặt trước suit xanh navy, tay khách đặt cạnh khuy áo khoác."],
      ["navy-single-breasted-suit-cuff", "Client looks down while adjusting the cuff of the navy suit.", "Khách nhìn xuống khi chỉnh cổ tay áo suit xanh navy."],
      ["navy-single-breasted-suit-fastening", "Client checks the front fastening, with the white pocket square still visible.", "Khách kiểm tra phần cài khuy mặt trước, vẫn thấy khăn túi ngực trắng."]
    ]
  },
  {
    id: "blazer-mau-man", route: plum, album: "suits",
    labels: ["Plum blazer", "Blazer màu mận"],
    summary: ["A plum blazer worn with a patterned shirt and light trousers, shown from standing and seated positions.", "Blazer màu mận phối sơ mi họa tiết và quần sáng màu, qua các góc đứng và ngồi."],
    photos: [
      ["plum-blazer-client-portrait", "Standing portrait in a plum blazer, patterned open-collar shirt and light trousers.", "Chân dung đứng với blazer màu mận, sơ mi họa tiết mở cổ và quần sáng."],
      ["plum-blazer-profile", "Three-quarter profile showing the open collar and the shoulder of the plum blazer.", "Góc nghiêng ba phần tư cho thấy cổ sơ mi mở và đường vai blazer màu mận."],
      ["plum-blazer-cuff", "Client looks down towards his cuff while wearing the plum blazer.", "Khách mặc blazer màu mận và nhìn xuống phía cổ tay áo."],
      ["plum-blazer-seated-crossed-legs", "Seated client crosses his legs, showing the pale trousers and dark shoes beneath the plum blazer.", "Khách ngồi bắt chéo chân, để lộ quần sáng và giày tối dưới blazer màu mận."],
      ["plum-blazer-seated", "Client seated near the window with the plum jacket open over a patterned shirt.", "Khách ngồi gần cửa kính, mở blazer màu mận để lộ sơ mi họa tiết."]
    ]
  },
  {
    id: "ao-khoac-xam-ve-chu-k", route: greyJacket, album: "jacket-craft",
    labels: ["Grey notch-lapel jacket", "Áo khoác xám ve chữ K"],
    summary: ["The grey jacket is photographed over a white spread-collar shirt, with close views of the lapel and buttons.", "Áo khoác xám được chụp cùng sơ mi trắng cổ mở rộng, kèm ảnh cận ve áo và hàng khuy."],
    photos: [
      ["grey-jacket-on-form", "Grey jacket and white spread-collar shirt on a tailoring form.", "Áo khoác xám và sơ mi trắng cổ mở rộng trên ma-nơ-canh."],
      ["grey-jacket-lapel-and-collar", "Close view of the grey notch lapel and its buttonhole below the white collar.", "Cận ve chữ K màu xám và khuyết ve bên dưới cổ sơ mi trắng."],
      ["grey-jacket-sleeve-buttons", "Row of dark buttons at the grey jacket cuff, beside the outer pocket.", "Hàng khuy tối ở cổ tay áo khoác xám, cạnh túi ngoài."],
      ["grey-jacket-front-fastening", "Two dark buttons and a welt pocket on the grey jacket front.", "Hai khuy tối và túi viền ở mặt trước áo khoác xám."]
    ]
  },
  {
    id: "chi-tiet-phong-thu-do", route: fittingRoom, album: "fitting",
    labels: ["Inside the fitting room", "Bên trong phòng thử đồ"],
    summary: ["Tailor’s chalk, a gold pocket square and views from the side show different checks made during fittings.", "Phấn may, khăn túi ngực vàng và góc nhìn nghiêng cho thấy những bước kiểm tra khác nhau khi thử đồ."],
    photos: [
      ["fitting-waistcoat-shoulder-check", "Tailor checking the shoulder of a dark waistcoat over a pale shirt.", "Thợ may kiểm tra vai áo ghi-lê tối màu mặc ngoài sơ mi sáng."],
      ["/media/2026/09/st-tailor-client-shoulder-fitting.jpg", "Tailor’s hand marking the edge of the armhole on a dark garment over a pink shirt.", "Tay thợ may đánh dấu mép vòng nách trang phục tối màu trên sơ mi hồng."],
      ["fitting-dark-suit-gold-pocket-square", "Hands adjust a gold pocket square on a dark suit over a yellow shirt.", "Chỉnh khăn túi ngực vàng trên suit tối màu phối sơ mi vàng."],
      ["fitting-dark-jacket-side", "Side view of a dark jacket while its front is adjusted.", "Góc nghiêng áo khoác tối màu trong lúc chỉnh thân trước."],
      ["fitting-dark-suit-portrait", "Client in a dark suit standing near the showroom entrance.", "Khách mặc suit tối màu đứng gần lối vào showroom."]
    ]
  },
  {
    id: "buoi-thu-suit-navy", route: navyFitting, album: "fitting",
    labels: ["A navy suit at its fitting", "Thử phom suit xanh navy"],
    summary: ["A navy suit over a dark crew-neck shirt, with views of the lapel adjustment, side profile and sleeve buttons.", "Suit xanh navy phối áo cổ tròn tối màu, qua các góc chỉnh ve, thử nghiêng và cận khuy tay áo."],
    photos: [
      ["navy-suit-fitting-portrait", "Client wearing a navy suit over a dark crew-neck shirt beside the tailor.", "Khách mặc suit xanh navy với áo cổ tròn tối màu, đứng cạnh thợ may."],
      ["navy-suit-lapel-adjustment", "Tailor’s hands adjusting the navy jacket lapel at the chest.", "Tay thợ may chỉnh ve áo khoác xanh navy ở ngực."],
      ["navy-suit-fitting-profile", "Tailor examines the jacket’s side as the client turns.", "Thợ may quan sát thân bên áo khoác khi khách xoay người."],
      ["navy-suit-sleeve-buttons", "Close-up of the row of navy jacket sleeve buttons.", "Cận cảnh hàng khuy tay áo khoác xanh navy."]
    ]
  },
  {
    id: "ghi-chep-phom-xam-nhat", route: paleGrey, album: "fitting",
    labels: ["Fitting notes in pale grey", "Ghi chép buổi thử suit xám nhạt"],
    summary: ["The sleeveless fitting jacket shows the shoulder and jacket length clearly. Blue chalk marks remain on the lapel.", "Áo thử chưa tra tay giúp quan sát đường vai và độ dài thân áo. Dấu phấn xanh vẫn còn trên ve."],
    photos: [
      ["pale-grey-fitting-full-length", "Full-length view of a client in a pale grey fitting jacket and trousers with a straw hat.", "Ảnh toàn thân khách đội mũ cói, thử áo khoác và quần xám nhạt."],
      ["pale-grey-fitting-side-profile", "Side view of the open armhole and jacket hem as the tailor faces the client.", "Góc nghiêng cho thấy vòng nách chưa tra tay và lai áo khi thợ may đứng đối diện khách."],
      ["pale-grey-fitting-shoulder-line", "Tailor checks the shoulder from behind while the client holds the jacket fronts together.", "Thợ may kiểm tra đường vai từ phía sau khi khách giữ hai vạt áo khép lại."],
      ["pale-grey-fitting-chalk-lapel", "Blue tailor’s chalk on the pale grey lapel beside the client’s hands.", "Dấu phấn may xanh trên ve xám nhạt, cạnh tay khách."],
      ["pale-grey-fitting-reaching-forward", "The jacket front shifts as the client reaches forward with both arms.", "Thân trước áo chuyển động khi khách đưa cả hai tay về phía trước."],
      ["pale-grey-fitting-holding-fronts", "Client stands holding the pale grey jacket fronts at the waist.", "Khách đứng giữ hai vạt áo xám nhạt ngang eo."]
    ]
  },
  {
    id: "thu-do-qua-chuyen-dong", route: paleGrey, album: "fitting",
    labels: ["At the fitting", "Qua các tư thế khi thử đồ"],
    summary: ["Four views show the jacket at rest, with one arm raised, at the hem and during a turn.", "Bốn góc ghi lại áo khi đứng yên, lúc nâng một tay, ở phần lai và khi xoay người."],
    photos: [
      ["pale-grey-fitting-standing", "Client standing at ease while the tailor observes the shoulder of the fitting jacket.", "Khách đứng thả lỏng để thợ may quan sát đường vai áo thử."],
      ["pale-grey-fitting-hat-adjustment", "Client adjusts his hat with one hand while wearing the pale grey fitting jacket.", "Khách nâng một tay chỉnh mũ trong lúc mặc áo thử xám nhạt."],
      ["pale-grey-fitting-jacket-hem", "Close view of where the jacket hem sits above the pale grey trousers.", "Cận cảnh vị trí lai áo phía trên quần xám nhạt."],
      ["pale-grey-fitting-turn", "Client turns towards the tailor, showing the pale grey jacket from an angle.", "Khách xoay về phía thợ may, để lộ áo khoác xám nhạt từ góc nghiêng."]
    ]
  },
  {
    id: "suit-ba-manh-xam-bac", route: threePiece, album: "suits",
    labels: ["Finished silver-grey three-piece", "Suit ba mảnh xám bạc hoàn thiện"],
    summary: ["Three views record a coordinated jacket, waistcoat and trousers, from the complete outfit to the cloth drape.", "Ba góc ghi lại áo khoác, ghi-lê và quần đồng bộ, từ tổng thể khi mặc đến độ rủ của vải."],
    photos: [
      ["silver-grey-three-piece-front", "Client in a silver-grey three-piece suit, light blue shirt and straw hat.", "Khách mặc suit ba mảnh xám bạc, sơ mi xanh nhạt và mũ cói."],
      ["silver-grey-three-piece-rear", "Rear three-quarter view of the finished jacket and trousers with the client’s arm bent.", "Góc ba phần tư từ sau của áo khoác và quần hoàn thiện khi khách gập tay."],
      ["silver-grey-three-piece-trouser-drape", "Trouser cloth in close-up, showing a pressed crease, fine texture and soft folds.", "Cận vải quần với đường ly ép, bề mặt mịn và nếp rủ nhẹ."]
    ]
  },
  {
    id: "dam-mau-dao-theu-la", route: dress, album: "womenswear",
    labels: ["Peach dress with embroidered leaves", "Đầm màu đào thêu lá"],
    summary: ["Yellow and rust-toned leaves frame the neckline and gather on one side of the skirt.", "Lá thêu vàng và nâu gạch điểm quanh cổ đầm rồi tụ thành cụm dọc một bên thân váy."],
    photos: [
      ["peach-dress-embroidered-leaves", "Full view of a short-sleeved peach dress with embroidered leaves on one side.", "Toàn cảnh đầm màu đào tay ngắn với họa tiết lá thêu dọc một bên."],
      ["peach-dress-neckline-embroidery", "Yellow and rust leaves sit below the rounded neckline of the peach dress.", "Lá vàng và nâu gạch nằm ngay dưới đường cổ tròn của đầm màu đào."],
      ["peach-dress-skirt-embroidery", "Cluster of yellow and rust leaf embroidery follows the skirt.", "Cụm lá thêu vàng và nâu gạch chạy dọc thân váy."],
      ["peach-dress-sleeve-seam", "Close view of the turned sleeve hem and fine stitching on the peach cloth.", "Cận lai tay áo gập vào trong và đường chỉ nhỏ trên nền vải màu đào."]
    ]
  },
  {
    id: "ao-khoac-den-lot-do", route: crimson, album: "jacket-craft",
    labels: ["Black jacket with crimson lining", "Áo khoác đen lót đỏ thẫm"],
    summary: ["A dark outer cloth opens to a crimson lining with birds, blossoms and a welted inside pocket.", "Lớp vải ngoài tối màu mở ra lớp lót đỏ thẫm có họa tiết chim, hoa và túi trong viền."],
    photos: [
      ["black-jacket-crimson-lining", "Crimson lining and dark facing visible inside the opened jacket.", "Lớp lót đỏ thẫm và nẹp màu tối lộ ra khi mở áo khoác."],
      ["black-jacket-crimson-project-front", "Front of the dark jacket with two buttons and a narrow welt pocket.", "Mặt trước áo khoác tối màu với hai khuy và túi viền hẹp."],
      ["black-jacket-lining-reveal", "Hand opens the dark jacket to show the crimson lining beside a pale shirt.", "Tay mở áo khoác tối màu, để lộ lớp lót đỏ thẫm cạnh sơ mi sáng."],
      ["black-jacket-inside-pocket-and-label", "Close-up of a welted inside pocket, S.T Tailor label and red bird-and-flower pattern.", "Cận túi trong viền, nhãn S.T Tailor và họa tiết chim hoa đỏ."]
    ]
  },
  ...portfolioCollections,
  ...garmentCollections
];

const stories = [
  {
    route: greenSuitFitting, section: "fittings",
    title: "Deep Green Suit Fitting in Ho Chi Minh City | S.T Tailor",
    description: "See a deep green two-piece suit during a private fitting at S.T Tailor. Compare the jacket, trouser line and rear view before collection.",
    details: [
      ["Checking the front and back", "Kiểm tra thân trước và thân sau", "From the front, you can see where the jacket ends and how the trousers taper. The angled view makes the lapel and sleeve length easier to compare. In the mirror, check that the collar sits close and that the upper back stays smooth when your arms are relaxed.", "Góc chính diện cho thấy vị trí lai áo và độ thuôn của ống quần. Góc nghiêng giúp quan sát ve áo và chiều dài tay áo. Khi nhìn qua gương, hãy thả lỏng hai tay để kiểm tra cổ áo có ôm sát và phần lưng trên có nằm phẳng hay không."],
      ["Before taking the suit home", "Trước khi nhận bộ suit", "Bring the shirt and shoes you plan to wear so you can check the sleeve opening and how the trouser hem rests on the shoe. At collection, try the jacket and trousers together and mention any spot that still feels tight as you sit or reach. The series ends with a portrait in the showroom holding a garment bag.", "Mang theo sơ mi và giày dự định phối để kiểm tra cửa tay áo và vị trí lai quần trên giày. Khi nhận đồ, hãy thử áo khoác cùng quần và trao đổi nếu có chỗ còn căng khi ngồi hoặc với tay. Bộ ảnh khép lại bằng một tấm chụp cùng túi đựng trang phục tại showroom."]
    ],
    related: [navyFitting, "/cam-nang-may-do/kiem-tra-phom-suit/", "/quy-trinh-thu-do/", "/dich-vu/suit-may-do/"]
  },
  {
    route: shortSleeveShirt, section: "shirts-and-trousers",
    title: "Light Blue Short-Sleeve Shirt by S.T Tailor",
    description: "Study a made-to-measure light blue short-sleeve shirt from S.T Tailor, with an open collar, clean button front and a hem worn untucked.",
    details: [
      ["The collar and sleeve line", "Cổ và đường tay áo", "The open collar sits above a row of tonal buttons. Each sleeve ends above the elbow. The two profile photographs show where the sleeve sits against the upper arm and how the fabric falls when the arm hangs naturally.", "Cổ áo mở nằm trên hàng khuy cùng tông. Tay áo kết thúc trên khuỷu tay. Hai góc nghiêng cho thấy vị trí mép tay trên bắp tay và độ rủ của vải khi thả lỏng tay."],
      ["Length when worn untucked", "Chiều dài khi mặc thả ngoài", "The client wears the shirt loose over beige shorts, keeping the full hem visible. At a fitting, raise your arms and sit down to check the sleeve opening and where the hem returns. If you plan to wear the shirt with trousers as well, bring a pair to compare the proportions.", "Khách mặc sơ mi thả ngoài quần short be nên có thể thấy rõ toàn bộ lai áo. Khi thử, hãy nâng tay rồi ngồi xuống để kiểm tra độ rộng cửa tay và vị trí lai sau khi cử động. Nếu định phối thêm với quần dài, hãy mang theo một chiếc để so tỷ lệ."]
    ],
    related: ["/du-an/chi-tiet-so-mi-may-do/", "/san-pham/so-mi-trang-vien-ca-ro/", "/chon-vai-may-do/", "/dich-vu/"]
  },
  {
    route: blazer, section: "suits-and-jackets",
    description: "See how a blue double-breasted blazer with peak lapels pairs with grey trousers and an open white collar at S.T Tailor in Ho Chi Minh City.",
    details: [
      ["A blazer worn as a separate", "Phối blazer với quần khác màu", "The grey trousers break up the blue and let the two rows of buttons define the jacket front. An open white collar keeps the neckline relaxed and leaves the peaked lapels in view.", "Quần xám tạo khoảng chuyển màu để hai hàng khuy nổi rõ trên thân áo xanh. Cổ sơ mi trắng mở tạo cảm giác nhẹ nhàng và để lộ đường ve nhọn."],
      ["Checking the fastening", "Kiểm tra vị trí cài khuy", "Try the jacket with the trousers and shirt you plan to wear. Check that the front closes comfortably and that the bottom edge stays level when you move your arms.", "Hãy thử áo cùng quần và sơ mi dự định phối. Kiểm tra hai vạt có cài khuy thoải mái và lai áo có giữ cân bằng khi cử động tay hay không."]
    ],
    related: ["/san-pham/suit-navy-hai-hang-khuy/", "/dich-vu/suit-may-do/"]
  },
  {
    route: navyBlazer, section: "client-work",
    description: "A S.T Tailor client shows how a navy blazer sits when standing, fastening the jacket, and sitting. See the full look with grey trousers and leather shoes.",
    details: [
      ["Navy, grey and brown", "Xanh navy, xám và nâu", "The outfit keeps a tailored line with an open collar. Grey trousers and brown leather shoes bring a softer contrast to the dark blazer.", "Tổng thể vẫn gọn gàng khi để cổ sơ mi mở. Quần xám và giày da nâu tạo độ tương phản vừa phải với blazer tối màu."],
      ["The same jacket at rest", "Phom áo khi ngồi", "The seated views show how the sleeve and front crease as the wearer leans forward or crosses his legs. Bring the shirt and trousers you expect to wear most often to the fitting.", "Ảnh ngồi cho thấy nếp tay áo và thân trước khi khách nghiêng người hoặc bắt chéo chân. Khi thử đồ, hãy mang sơ mi và quần bạn thường dự định phối."]
    ],
    related: [blazer, "/quy-trinh-thu-do/"]
  },
  {
    route: navySuit, section: "suits-and-jackets",
    description: "Explore S.T Tailor’s single-breasted navy suit with a striped tie and white pocket square. See how the jacket looks at the cuff and fastening.",
    details: [
      ["A considered shirt and tie", "Cách phối sơ mi và cà vạt", "The angled stripes give the tie definition against the white shirt. The narrow line of the pocket square repeats the white without adding another pattern.", "Sọc chéo giúp cà vạt nổi rõ trên nền sơ mi trắng. Mép khăn túi ngực nhắc lại sắc trắng mà vẫn giữ tổng thể tinh gọn."],
      ["Cuff and button in use", "Cổ tay và khuy khi mặc", "The close views show how the sleeve shifts as the client reaches for his cuff and what the front looks like as he fastens it. If you wear a watch, bring it to check clearance at the cuff.", "Ảnh cận cho thấy tay áo thay đổi khi khách chỉnh cổ tay và thân trước khi cài khuy. Nếu thường đeo đồng hồ, hãy mang theo để thử độ rộng ở cổ tay áo."]
    ],
    related: [navyFitting, "/cam-nang-may-do/kiem-tra-phom-suit/"]
  },
  {
    route: plum, section: "suits-and-jackets",
    title: "Plum Tailored Blazer | S.T Tailor",
    description: "See S.T Tailor’s plum blazer styled with a patterned shirt and light trousers. Compare the jacket’s standing and seated silhouettes.",
    details: [
      ["Colour around the face", "Phối màu quanh cổ áo", "The open shirt collar places a small area of pattern between the plum lapels. Pale trousers leave the stronger colour concentrated in the jacket.", "Cổ sơ mi mở để lộ một khoảng họa tiết giữa hai ve áo màu mận. Quần sáng giúp sắc đậm tập trung ở phần blazer."],
      ["Seated fit", "Phom áo khi ngồi", "The two seated photographs show the jacket open and the trousers in different positions. Try sitting during a fitting to see how the waist, jacket front and trouser crease feel together.", "Hai ảnh ngồi ghi lại áo khoác mở vạt với quần ở các tư thế khác nhau. Hãy thử ngồi để cảm nhận đồng thời độ thoải mái ở eo, thân trước áo và đường ly quần."]
    ],
    related: [navyBlazer, "/chon-vai-may-do/"]
  },
  {
    route: greyJacket, section: "suits-and-jackets",
    description: "View a S.T Tailor grey jacket on the form, then see its notch lapel, welt pocket, stitched buttonhole and dark front and sleeve buttons in detail.",
    details: [
      ["From collar to lapel", "Từ cổ đến ve áo", "The white spread collar leaves room to see the notch and its stitched buttonhole. The grey weave is easier to read in the closer photographs.", "Cổ sơ mi trắng mở rộng để lộ góc ve và khuyết ve được may chỉn chu. Các ảnh cận cho thấy rõ hơn bề mặt dệt của vải xám."],
      ["Where the buttons sit", "Vị trí hàng khuy", "The dark cuff buttons echo the two front buttons. At your fitting, judge the jacket length and button position together so the front looks balanced over the trousers.", "Khuy tối ở cổ tay hài hòa với hai khuy thân trước. Khi thử, nên xem cùng lúc độ dài áo và vị trí khuy để thân trước cân đối với quần."]
    ],
    related: [crimson, "/chon-vai-may-do/vai-len-y/"]
  },
  {
    route: fittingRoom, section: "fittings",
    description: "Go inside S.T Tailor’s fitting room in Ho Chi Minh City, from chalk at the armhole to checking the jacket’s side and setting a pocket square.",
    details: [
      ["Marks for the next adjustment", "Dấu phấn cho lần chỉnh tiếp theo", "A chalk mark records the point the tailor has checked on the wearer. At the armhole, check whether you can move your arm without pulling the shoulder or jacket front out of place.", "Dấu phấn ghi lại vị trí thợ may vừa kiểm tra trên người mặc. Ở vòng nách, hãy thử cử động tay để xem đường vai và thân trước có bị kéo lệch không."],
      ["The details of a finished look", "Chi tiết hoàn thiện khi phối đồ", "The gold pocket square is adjusted with the shirt and jacket already on. A side view shows how the two front edges sit after the adjustment.", "Khăn túi ngực vàng được chỉnh sau khi khách đã mặc sơ mi và áo khoác. Góc nghiêng cho thấy hai vạt trước nằm thế nào sau khi chỉnh."]
    ],
    related: [greenSuitFitting, navyFitting, shortSleeveShirt, "/du-an/trang-phuc-khi-mac/", "/phim-thu-do/"]
  },
  {
    route: navyFitting, section: "fittings",
    description: "Follow a navy suit fitting at S.T Tailor, with the tailor adjusting the lapel and checking the jacket in profile. See the sleeve and button details.",
    details: [
      ["The lapel over a crew neck", "Ve áo trên nền áo cổ tròn", "The dark top makes the two edges of the open navy jacket easy to compare. The tailor sets the lapel with the client standing naturally.", "Áo tối màu bên trong giúp dễ so sánh hai vạt áo xanh navy khi mở. Thợ may chỉnh ve lúc khách đứng tự nhiên."],
      ["The jacket from the side", "Quan sát áo từ bên hông", "Once the client turns, the tailor can see the shoulder, sleeve and fall of the back. The close-up then records the row of dark cuff buttons.", "Khi khách xoay người, thợ may có thể quan sát vai, tay và độ rủ của thân sau. Ảnh cận ghi lại hàng khuy tối ở cổ tay áo."]
    ],
    related: [navySuit, greenSuitFitting, "/quy-trinh-thu-do/"]
  },
  {
    route: paleGrey, section: "fittings",
    labels: ["Checking a pale grey suit in motion", "Thử phom suit xám nhạt qua chuyển động"],
    description: "Two photo studies document a pale grey suit fitting at S.T Tailor. See the chalked lapel, open armhole, jacket hem and fit as the client turns and reaches.",
    details: [
      ["Chalk marks and the shoulder line", "Dấu phấn và đường vai", "The fitting jacket has open armholes, so the shoulder and depth of the opening are visible. In the first sequence, blue chalk at the lapel records the area being reviewed. The side view shows the hem with the client standing naturally.", "Vì áo thử chưa tra tay, có thể thấy rõ đường vai và độ sâu vòng nách. Trong loạt đầu, vết phấn xanh trên ve đánh dấu khu vực đang kiểm tra. Góc nghiêng cho thấy vị trí lai áo khi khách đứng tự nhiên."],
      ["Reach, turn and settle", "Đưa tay, xoay người và thả lỏng", "Compare the jacket at rest with the views of the client reaching forward, lifting one hand and turning. The changes at the front edge and hem show why these movements belong in a fitting.", "So sánh áo lúc đứng yên với khi khách đưa tay ra trước, nâng một tay và xoay người. Thay đổi ở mép vạt và lai áo cho thấy lý do nên thử những chuyển động này."]
    ],
    related: [threePiece, "/du-an/thu-ao-ghi-le-xam-bac/", "/cam-nang-may-do/kiem-tra-phom-suit/"]
  },
  {
    route: threePiece, section: "client-work",
    description: "See a finished silver-grey three-piece suit worn with a light blue shirt at S.T Tailor. Photographs show the jacket from behind and the drape of the trousers.",
    details: [
      ["The finished three-piece", "Bộ suit ba mảnh khi hoàn thiện", "A light blue open-neck shirt sits inside the matching waistcoat and jacket. The full view shows the balance between the layered upper half and the matching trousers.", "Sơ mi xanh nhạt mở cổ nằm bên trong ghi-lê và áo khoác đồng bộ. Góc nhìn toàn thân cho thấy tỷ lệ giữa các lớp áo phía trên và quần cùng màu."],
      ["The back and trouser drape", "Thân sau và độ rủ quần", "With the client’s arm bent, the rear view shows the back seam, shoulder and sleeve folds. A closer view shows a long pressed trouser crease and subtle cloth texture.", "Khi khách gập tay, góc sau cho thấy đường ráp lưng, vai và nếp tay áo. Ảnh cận làm rõ đường ly quần kéo dài và bề mặt vải nhẹ."],
      ["Checking the jacket on the client", "Kiểm tra áo khoác trên người khách", "The tailor checks the shoulder while the client wears the jacket over the waistcoat. The rear view gives a second look at the centre back and hem. The sleeve close-up records the spacing of the dark cuff buttons beside the pocket.", "Thợ may kiểm tra đường vai khi khách mặc áo khoác ngoài ghi-lê. Góc sau giúp quan sát thêm đường giữa lưng và lai áo. Ảnh cận tay áo ghi lại khoảng cách giữa các khuy tối cạnh túi."]
    ],
    related: [paleGrey, "/du-an/thu-ao-ghi-le-xam-bac/", "/du-an/chi-tiet-ao-khoac-xam-bac/", "/dich-vu/suit-may-do/", "/cam-nang-may-do/chon-suit-hai-manh-ba-manh/"]
  },
  {
    route: dress, section: "womenswear",
    description: "Explore a short-sleeved peach dress by S.T Tailor, with yellow and rust leaf embroidery at the neckline and skirt, and a close view of the sleeve finish.",
    details: [
      ["Leaves along the neckline and skirt", "Lá thêu dọc cổ và thân váy", "The neckline holds a small group of leaves. The motif gathers again down one side of the skirt, leaving the other side mostly open so the placement is easy to read.", "Cổ đầm điểm một nhóm lá nhỏ. Họa tiết tụ lại dọc một bên thân váy, chừa khoảng thoáng ở phía còn lại để bố cục rõ ràng."],
      ["Checking the sleeve finish", "Kiểm tra đường hoàn thiện tay áo", "The sleeve close-up shows the stitching and folded edge. When planning embroidery on a new commission, try the garment in motion and review the motif placement at the neckline and sleeve before finishing.", "Ảnh cận tay áo cho thấy đường chỉ và mép gập. Khi đặt may đầm thêu, hãy thử cử động và xem lại vị trí họa tiết ở cổ, tay áo trước khi hoàn thiện."]
    ],
    related: ["/san-pham/dam-lua-hong-phan-theu-hoa/", "/dich-vu/trang-phuc-nu/"]
  },
  {
    route: crimson, section: "suits-and-jackets",
    cover: 2,
    description: "See a dark S.T Tailor jacket with crimson bird-and-blossom lining, dark front buttons and a welted inside pocket. Explore options for jacket lining.",
    details: [
      ["The lining inside the jacket", "Lớp lót bên trong áo", "The dark front and pale shirt keep the exterior understated. When the jacket opens, birds and blossoms run across the crimson lining and stop at the dark facing.", "Thân áo tối màu và sơ mi sáng tạo vẻ trang nhã bên ngoài. Khi mở áo, họa tiết chim và hoa hiện ra trên lớp lót đỏ thẫm và dừng ở nẹp tối màu."],
      ["An inside pocket in use", "Vị trí và công dụng túi trong", "The pocket and label show how the pattern meets the internal construction. When choosing lining, check how it feels against your shirt and whether the inside pocket is placed for easy use.", "Túi và nhãn cho thấy vị trí họa tiết tiếp giáp phần kết cấu bên trong. Khi chọn lót, hãy thử cảm giác khi mặc cùng sơ mi và kiểm tra túi trong có thuận tay không."]
    ],
    related: ["/cam-nang-may-do/chon-lot-ao-khoac/", "/du-an/buoi-thu-suit-lot-vang/"]
  },
  ...portfolioStories,
  ...garmentStories
];

export function photoSource(file) {
  return file.startsWith("/") ? file : "/media/2026/11/st-tailor-" + file + ".webp";
}

export const photoStoryPages = stories.map((story) => {
  const collections = photoCollections.filter(({ route }) => route === story.route);
  const { labels, summary, photos } = story.coverCollection
    ? collections.find(({ id }) => id === story.coverCollection)
    : collections[0];
  const [file, en, vi] = photos[story.cover ?? 0];
  const pageLabels = story.labels ?? labels;
  return {
    ...story,
    collections,
    source: "ShowcasePhotoStory.html",
    labels: pageLabels,
    title: story.title ?? pageLabels[0] + " | S.T Tailor",
    image: photoSource(file),
    imageAlt: en + " | " + vi,
    summary: story.summary ?? summary
  };
});
