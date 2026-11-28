const oliveShirt = "/du-an/so-mi-xanh-o-liu-khi-mac/";
const greyJacket = "/san-pham/ao-khoac-xam-lot-hoa/";
const navyShirt = "/du-an/so-mi-navy-tay-ngan/";
const rustShirt = "/san-pham/so-mi-do-gach/";
const whiteShirt = "/san-pham/so-mi-trang-co-mo-rong/";
const ivoryShirt = "/san-pham/so-mi-mau-nga-co-nhon/";
const shirtService = "/dich-vu/so-mi-may-do/";
const shirtDetails = "/du-an/chi-tiet-so-mi-may-do/";

export const ninaCampos = {
  id: "suit-san-khau-nina-campos", route: "/du-an/nina-campos/", album: "appointments",
  labels: ["Niña Campos in a light suit", "Niña Campos trong bộ suit sáng màu"],
  summary: ["S.T Tailor made this pale two-piece suit for singer Niña Campos. Seven photographs follow the open jacket and pleated trousers from the stage to full-length portraits by the staircase.", "S.T Tailor may bộ suit hai mảnh sáng màu này cho ca sĩ Niña Campos. Bảy bức ảnh ghi lại dáng áo khoác mở vạt và quần xếp ly, từ sân khấu đến những bức chân dung toàn thân bên cầu thang."],
  includeReferencedPhotos: true,
  photos: [
    ["nina-campos-light-suit-on-stage", "Niña Campos holds a microphone in a pale open jacket and matching trousers against blue and red stage lighting.", "Niña Campos cầm micro trong áo khoác sáng màu mở vạt và quần đồng bộ, trước nền đèn sân khấu xanh đỏ."],
    ["nina-campos-performance-audience-view", "Wide audience view of two performers on stage, with Niña Campos in a light suit at left.", "Góc rộng từ phía khán giả nhìn lên hai người biểu diễn, Niña Campos mặc suit sáng màu ở bên trái."],
    ["nina-campos-light-suit-stage-group", "Niña Campos stands between two people on stage, wearing a light suit and dark top.", "Niña Campos đứng giữa hai người trên sân khấu, phối suit sáng màu với áo tối."],
    ["nina-campos-light-lapel-group-portrait", "Close group portrait with Niña Campos in the centre, showing the light jacket lapel over a dark top.", "Chân dung cận cảnh của nhóm với Niña Campos ở giữa, thấy ve áo khoác sáng trên nền áo tối."],
    ["/media/2026/09/st-tailor-gallery-singer-feedback-one.jpg", "Niña Campos in a light suit and dark top, standing beside a man in a white shirt near a staircase.", "Niña Campos mặc suit sáng màu và áo tối, đứng cạnh một người mặc sơ mi trắng gần cầu thang."],
    ["/media/2026/09/st-tailor-gallery-singer-feedback-two.jpg", "Niña Campos poses by the staircase with one arm bent, showing her pale pleated trousers and light trainers below the open jacket.", "Niña Campos đứng bên cầu thang với một tay gập, để lộ quần xếp ly và giày thể thao sáng màu bên dưới áo khoác mở vạt."],
    ["/media/2026/09/st-tailor-owner-client-white-suit.jpg", "Full-length staircase portrait of Niña Campos beside an S.T Tailor representative, with her pale jacket open over a dark top and one hand near her trouser pocket.", "Chân dung toàn thân bên cầu thang của Niña Campos cạnh đại diện S.T Tailor, với áo khoác sáng mở vạt ngoài áo tối và một tay đặt cạnh túi quần."]
  ]
};

export const commissionCollections = [
  ninaCampos,
  {
    id: "so-mi-xanh-o-liu-khi-mac", route: oliveShirt, album: "appointments",
    labels: ["Olive shirt in daylight", "Sơ mi xanh ô liu dưới nắng"],
    summary: ["An open-collar olive shirt tucked into ivory trousers, photographed from the front and back in daylight.", "Sơ mi xanh ô liu mở cổ, sơ vin cùng quần màu ngà, chụp từ phía trước và sau dưới ánh sáng tự nhiên."],
    photos: [
      ["olive-shirt-ivory-trousers-front", "Client in an open-collar olive shirt tucked into ivory trousers with a dark belt, photographed outdoors.", "Khách mặc sơ mi xanh ô liu mở cổ, sơ vin cùng quần màu ngà và thắt lưng tối, chụp ngoài trời."],
      ["olive-shirt-yoke-and-back-drape", "Rear view of the olive shirt showing the yoke, sleeves and the cloth above the trouser waistband.", "Góc sau sơ mi xanh ô liu cho thấy cầu vai, tay áo và độ rủ của vải phía trên cạp quần."]
    ]
  },
  {
    id: "ao-khoac-xam-lot-hoa", route: greyJacket, album: "jacket-craft",
    labels: ["Grey jacket with floral lining", "Áo khoác xám lót hoa"],
    summary: ["A grey notch-lapel jacket with dark sleeve buttons and pale floral lining, displayed with a white shirt and a yellow pocket square.", "Áo khoác xám ve chữ K, khuy tay tối màu và lót hoa sáng, trưng bày cùng sơ mi trắng và khăn túi ngực vàng."],
    photos: [
      ["grey-floral-lined-jacket-front", "Grey notch-lapel jacket over a white shirt on a tailoring form, with a yellow pocket square.", "Áo khoác xám ve chữ K phối sơ mi trắng trên ma-nơ-canh, điểm khăn túi ngực vàng."],
      ["grey-jacket-floral-lining-inside-pocket", "Inside of the grey jacket showing pale floral lining, an inside pocket and the S.T Tailor label.", "Mặt trong áo khoác xám cho thấy lớp lót hoa sáng, túi trong và nhãn S.T Tailor."],
      ["grey-floral-lined-jacket-sleeve-buttons", "Hand holding the grey jacket sleeve to show four dark cuff buttons and their stitched buttonholes.", "Tay nâng tay áo khoác xám để thấy bốn khuy tối màu và đường chỉ quanh khuyết."]
    ]
  },
  {
    id: "so-mi-navy-tay-ngan", route: navyShirt, album: "shirts-trousers",
    labels: ["Navy short-sleeve shirt in wear", "Sơ mi navy tay ngắn khi mặc"],
    summary: ["Two showroom portraits show a short-sleeve navy shirt worn loose over dark trousers, with the collar open.", "Hai ảnh tại showroom cho thấy sơ mi navy tay ngắn mặc thả ngoài quần tối màu và để mở cổ."],
    photos: [
      ["navy-short-sleeve-shirt-showroom-portrait", "Client wearing a navy short-sleeve shirt untucked over dark trousers at the S.T Tailor showroom.", "Khách mặc sơ mi navy tay ngắn thả ngoài quần tối màu tại showroom S.T Tailor."],
      ["navy-short-sleeve-shirt-arm-bent", "Front view of the navy short-sleeve shirt with one arm bent, showing the collar and button line.", "Góc chính diện sơ mi navy tay ngắn khi khách gập một tay, thấy cổ áo và hàng khuy."]
    ]
  },
  {
    id: "so-mi-do-gach", route: rustShirt, album: "shirts-trousers",
    labels: ["Rust-red tailored shirt", "Sơ mi may đo màu đỏ gạch"],
    summary: ["A long-sleeve rust-red shirt with a pointed collar, tonal button front and a softly lustrous finish.", "Sơ mi đỏ gạch tay dài với lá cổ nhọn, khuy cùng tông và bề mặt ánh nhẹ."],
    photos: [
      ["rust-red-tailored-shirt-front", "Full front of a rust-red long-sleeve shirt on a form, showing the pointed collar and tonal buttons.", "Toàn bộ thân trước sơ mi đỏ gạch tay dài trên ma-nơ-canh, thấy lá cổ nhọn và khuy cùng tông."],
      ["rust-red-shirt-collar-and-placket", "Angled close-up of the rust-red collar, shoulder and button placket, with light catching the cloth.", "Góc cận cổ, vai và nẹp khuy sơ mi đỏ gạch, ánh sáng phản chiếu trên mặt vải."]
    ]
  },
  {
    id: "so-mi-trang-co-mo-rong", route: whiteShirt, album: "shirts-trousers",
    labels: ["White spread-collar shirt", "Sơ mi trắng cổ mở rộng"],
    summary: ["A white long-sleeve shirt with a wide spread collar, plain button front and curved hem.", "Sơ mi trắng tay dài với cổ mở rộng, nẹp khuy trơn và lai cong."],
    photos: [
      ["white-spread-collar-shirt-front", "Front of a white long-sleeve shirt on a form, showing the spread collar and curved hem.", "Mặt trước sơ mi trắng tay dài trên ma-nơ-canh, thấy cổ mở rộng và lai cong."],
      ["white-spread-collar-shirt-placket", "Closer front view of the white shirt’s open collar and straight button placket.", "Góc cận chính diện cổ mở và nẹp khuy thẳng của sơ mi trắng."],
      ["white-spread-collar-shirt-shoulder", "Angled view of the white spread collar and the seam joining the sleeve to the shoulder.", "Góc nghiêng cho thấy cổ mở rộng và đường ráp tay vào vai của sơ mi trắng."]
    ]
  },
  {
    id: "so-mi-mau-nga-co-nhon", route: ivoryShirt, album: "shirts-trousers",
    labels: ["Ivory point-collar shirt", "Sơ mi màu ngà cổ nhọn"],
    summary: ["A finished long-sleeve shirt in ivory with a pointed collar, pale buttons and a curved hem. The front and angled views show how the cloth catches the light.", "Sơ mi dài tay màu ngà đã hoàn thiện, với lá cổ nhọn, khuy sáng và lai cong. Ảnh chính diện và góc nghiêng cho thấy ánh sáng thay đổi trên mặt vải."],
    includeReferencedPhotos: true,
    photos: [
      ["/media/2026/11/st-tailor-ivory-point-collar-shirt-front.jpg", "Front view of an ivory shirt on a form, showing pointed collar tips, pale buttons and long sleeves.", "Mặt trước sơ mi màu ngà trên ma-nơ-canh, thấy lá cổ nhọn, khuy sáng và tay dài."],
      ["/media/2026/11/st-tailor-ivory-point-collar-shirt-three-quarter.jpg", "Three-quarter view of the ivory shirt, showing its curved hem, long sleeves and button cuffs.", "Sơ mi màu ngà nhìn nghiêng, thấy lai cong, tay dài và măng sét cài khuy."]
    ]
  }
];

export const commissionStories = [
  {
    route: oliveShirt, section: "client-work",
    title: "Olive Shirt and Ivory Trousers in Daylight | S.T Tailor",
    description: "See front and rear views of a tailored olive shirt with ivory trousers, and what to look for at the collar, shoulder and waist when wearing a shirt tucked in.",
    details: [
      ["Olive against ivory", "Xanh ô liu phối màu ngà", "Direct sunlight brings out a lighter green on the sleeves and the front. The open collar frames the neck, while the dark belt gives the shirt and trousers a clear break at the waist. Compare your cloth swatch against the trousers in both daylight and shade before settling on a colour.", "Nắng trực tiếp làm sắc xanh ở tay áo và thân trước sáng hơn. Cổ mở tạo khoảng thoáng quanh cổ, còn thắt lưng tối phân tách rõ áo và quần ở eo. Trước khi chốt màu, hãy đặt mẫu vải cạnh quần dưới cả ánh nắng và bóng râm."],
      ["A tucked shirt from the back", "Sơ mi sơ vin nhìn từ phía sau", "The rear photograph shows the yoke across the shoulders and a little ease above the waistband. At a fitting, sit down and reach forward with the shirt tucked into the trousers you plan to wear. The tailor can check whether the back pulls or the shirt rides up at the waist.", "Ảnh phía sau cho thấy đường cầu vai và độ dư nhẹ phía trên cạp. Khi thử, hãy sơ vin với chiếc quần định phối, rồi ngồi xuống và đưa tay ra trước. Thợ may có thể kiểm tra xem lưng áo có bị kéo căng hoặc thân áo có bị tuột khỏi cạp hay không."]
    ],
    related: [shirtService, "/dich-vu/quan-tay-may-do/", "/chon-vai-may-do/", navyShirt]
  },
  {
    route: greyJacket, section: "suits-and-jackets",
    title: "Grey Tailored Jacket With Floral Lining | S.T Tailor",
    description: "Explore a finished grey S.T Tailor jacket with pale floral lining, a yellow pocket square and dark cuff buttons, photographed inside and out.",
    details: [
      ["The outside of the jacket", "Mặt ngoài áo khoác", "A white shirt puts the focus on the grey cloth and clean notch lapels. The yellow pocket square sits high in the breast pocket and is the strongest colour in the photograph. Try your preferred shirt and pocket square with the jacket buttoned and open to see how much contrast you want.", "Sơ mi trắng làm nổi chất vải xám và đường ve chữ K. Khăn vàng nhô lên khỏi túi ngực, tạo điểm nhấn màu rõ nhất trong ảnh. Hãy thử áo cùng sơ mi và khăn túi ngực định phối, cả lúc cài khuy lẫn mở vạt, để chọn độ tương phản vừa ý."],
      ["Inside pocket, lining and cuff", "Túi trong, lớp lót và khuy tay", "Turning the jacket exposes the floral pattern beside the pocket and label. Four dark buttons define the sleeve edge, where the close-up also shows the stitching. Bring anything you regularly carry in an inside pocket to your fitting and check how the jacket falls with it in place.", "Khi lật áo, hoa văn lót hiện rõ cạnh túi trong và nhãn. Bốn khuy tối tạo điểm nhấn ở mép tay, còn góc chụp cận cho thấy đường chỉ quanh khuyết. Hãy mang món đồ bạn thường để trong túi áo khi đi thử để xem áo rủ thế nào khi có đồ bên trong."]
    ],
    related: ["/cam-nang-may-do/chon-lot-ao-khoac/", "/san-pham/ao-khoac-xam-ve-chu-k/", "/du-an/chi-tiet-ao-khoac-xam-bac/", "/dich-vu/suit-may-do/"]
  },
  {
    route: navyShirt, section: "client-work",
    title: "Navy Short-Sleeve Shirt in Wear | S.T Tailor Project",
    description: "See how an untucked navy short-sleeve shirt sits over dark trousers at S.T Tailor in Ho Chi Minh City, with the arms relaxed and one arm bent.",
    details: [
      ["An open collar and an untucked hem", "Cổ mở và lai thả ngoài quần", "The navy short-sleeve shirt is worn over dark trousers, with the hem visible and the upper button open. When you try an untucked shirt, look from the front and side to see how far the hem covers the trouser pockets. Check that you can reach those pockets comfortably.", "Sơ mi navy tay ngắn phối với quần tối màu, thả lai ngoài và mở khuy trên. Khi thử áo mặc thả, hãy nhìn chính diện và góc nghiêng để xem lai che túi quần đến đâu. Thử đưa tay vào túi để kiểm tra có vướng hay không."],
      ["Check the sleeve with your arm bent", "Kiểm tra tay áo khi gập tay", "One portrait shows the shirt with the arms down. In the other, the client bends one arm, making it easier to compare how the sleeve sits. Try both positions and reach forward to check that the opening is comfortable around the upper arm.", "Một ảnh ghi lại dáng áo khi hai tay thả lỏng. Ở ảnh còn lại, khách gập một tay nên dễ so sánh vị trí mép tay áo. Hãy thử cả hai tư thế rồi đưa tay về trước để xem cửa tay có thoải mái quanh bắp tay không."]
    ],
    related: [shirtService, "/san-pham/so-mi-xanh-nhat-tay-ngan/", shirtDetails, oliveShirt]
  },
  {
    route: rustShirt, section: "shirts-and-trousers",
    title: "Rust-Red Tailored Long-Sleeve Shirt | S.T Tailor",
    description: "See a finished rust-red shirt by S.T Tailor with a pointed collar, tonal buttons and soft sheen, photographed from the front and close up.",
    details: [
      ["How the cloth catches light", "Mặt vải dưới ánh sáng", "Under side lighting, the shoulder looks brighter than the cloth beside the buttons. The close-up shows how the rust-red shade shifts across folds. When choosing a cloth for evening wear, compare it under the kind of light you expect and beside the jacket or trousers you plan to wear.", "Dưới ánh sáng chiếu ngang, vai áo trông sáng hơn vùng vải cạnh hàng khuy. Ảnh cận cho thấy sắc đỏ gạch thay đổi theo nếp vải. Khi chọn vải cho trang phục buổi tối, hãy xem mẫu dưới ánh sáng tương tự và đặt cạnh áo khoác hoặc quần định phối."],
      ["The collar and button front", "Lá cổ và nẹp khuy", "The pointed collar sits above buttons close to the colour of the cloth. At your fitting, fasten the collar and turn your head, then open the top button and try it beneath a jacket. Check where the collar points land against the lapels in both positions.", "Lá cổ nhọn nằm trên hàng khuy gần với màu vải. Khi thử, hãy cài khuy cổ rồi xoay đầu, sau đó mở khuy trên và mặc thử dưới áo khoác. Quan sát vị trí hai lá cổ so với ve áo ở cả hai cách mặc."]
    ],
    related: [shirtService, whiteShirt, shirtDetails, "/chon-vai-may-do/lua-viet-nam/"]
  },
  {
    route: whiteShirt, section: "shirts-and-trousers",
    title: "White Spread-Collar Tailored Shirt | S.T Tailor",
    description: "Examine a finished white made-to-measure shirt from S.T Tailor with a wide spread collar, plain button front and curved hem.",
    details: [
      ["Where the open collar sits", "Vị trí lá cổ khi mở khuy", "The collar points turn outwards and leave a wide opening at the neck. The angled photograph shows the curve of the collar and where the sleeve meets the shoulder. Bring the jacket you intend to wear so the tailor can see how the collar and lapels meet while you move.", "Hai lá cổ mở về hai bên, tạo khoảng rộng ở cổ. Ảnh nghiêng cho thấy độ cong của cổ áo và vị trí tay ráp vào vai. Hãy mang theo áo khoác định phối để thợ may kiểm tra cổ sơ mi và ve áo khi bạn cử động."],
      ["Button front and curved hem", "Nẹp khuy và lai cong", "The closer front view shows a plain button line. The full view shows the curved hem and where it rises on each side. If you plan to tuck in the shirt, sit down and raise your arms at the fitting. For an untucked version, compare the side length over your trousers.", "Ảnh cận chính diện cho thấy nẹp khuy trơn. Ảnh toàn thân áo cho thấy đường lai cong và phần xẻ cao hơn ở hai bên. Nếu định sơ vin, hãy thử ngồi và nâng tay trong buổi thử đồ. Nếu muốn mặc thả, hãy xem chiều dài bên hông khi phối cùng quần của bạn."]
    ],
    related: [shirtService, "/san-pham/so-mi-trang-vien-ca-ro/", shirtDetails, rustShirt, ivoryShirt]
  },
  {
    route: ivoryShirt, section: "shirts-and-trousers",
    cover: 1,
    title: "Ivory Point-Collar Tailored Shirt | S.T Tailor",
    description: "See a finished ivory long-sleeve shirt by S.T Tailor. Front and angled photos show its pointed collar, pale buttons and curved hem.",
    details: [
      ["Collar and button front", "Lá cổ và nẹp khuy", "The front view shows the pointed collar above a row of pale buttons. Bring the jacket or tie you wear most often to a shirt fitting. With the top button open, check where the collar tips sit under the lapels. If you wear a tie, fasten the collar and check for room to turn your head comfortably.", "Ảnh chính diện cho thấy hai lá cổ nhọn phía trên hàng khuy sáng màu. Hãy mang theo áo khoác hoặc cà vạt bạn thường dùng khi thử sơ mi. Lúc mở khuy trên cùng, quan sát vị trí lá cổ dưới ve áo khoác. Nếu có đeo cà vạt, hãy cài khuy cổ rồi xoay đầu để kiểm tra độ thoải mái."],
      ["An ivory tone in different light", "Sắc ngà dưới các nguồn sáng", "The cloth looks warmer where the light strikes the front and cooler in the folds of the sleeves. Compare an ivory swatch with the jacket and trousers you plan to wear. Look at the pairing near a window and again under indoor lighting before choosing the cloth.", "Mặt vải ngả ấm ở phần thân trước được chiếu sáng và lạnh hơn ở các nếp tay áo. Hãy đặt mẫu vải màu ngà cạnh áo khoác và quần bạn định phối. Xem cách kết hợp này bên cửa sổ và dưới ánh đèn trong nhà trước khi chọn vải."],
      ["Curved hem and sleeve length", "Lai cong và chiều dài tay", "The angled view shows how the curved hem rises at the side, as well as the cuffs on both sleeves. If you intend to wear the shirt tucked in, try sitting and reaching forward to check how much of the hem stays inside the waistband. Try the cuffs with your watch and jacket to judge how much sleeve shows.", "Ảnh góc nghiêng cho thấy đường lai cong nâng lên ở bên hông và măng sét ở hai tay áo. Nếu định sơ vin, hãy thử ngồi và đưa tay về phía trước để xem phần lai còn nằm trong cạp quần bao nhiêu. Đeo đồng hồ và mặc áo khoác khi thử để xem phần cổ tay sơ mi lộ ra vừa đủ chưa."]
    ],
    related: [shirtService, whiteShirt, shirtDetails, "/san-pham/quan-tay-toi-mau/", "/chon-vai-may-do/"]
  }
];
