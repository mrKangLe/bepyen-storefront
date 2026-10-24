export type Article = {
  slug: string;
  title: string;
  shortDesc: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  keywords: string[];
  relatedProductIds: number[];
  contentHtml: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "5-cach-phan-biet-yen-that-va-yen-don-mu-trom",
    title: "5 Cách Phân Biệt Yến Thật Và Yến Độn Mủ Trôm Chuẩn Xác Của Bếp Cung Đình",
    shortDesc:
      "Bí quyết nhận biết sợi yến thật nở bung sần sật, không tan nhớt và mùi thơm tanh nhẹ tự nhiên của lòng trắng trứng gà. Tránh mua phải yến độn mủ trôm, rau câu hay hóa chất tẩy trắng.",
    category: "Cẩm Nang Thật - Giả",
    readTime: "4 phút đọc",
    date: "20/10/2026",
    author: "Bếp Trưởng Nhung — Bếp Yến Ocean",
    image: "/images/product-sen-tao-do.jpg",
    keywords: [
      "phân biệt yến thật giả",
      "cách nhận biết yến chưng thật",
      "yến độn mủ trôm",
      "yến tươi nguyên chất",
    ],
    relatedProductIds: [1, 2],
    contentHtml: `
<p class="lead">Yến sào từ ngàn xưa đã được xếp vào hàng “Bát Trân” — tám món ngự thiện bồi bổ tột đỉnh dành riêng cho vua chúa. Thế nhưng trên thị trường hiện nay, không ít người tiêu dùng vì chưa nắm rõ đặc tính mà mua phải hũ yến độn mủ trôm, bắp, hoặc yến vụn tẩy hóa chất.</p>

<p>Hôm nay, Bếp Yến Ocean xin chia sẻ <strong>5 cách nhận biết yến thật chính xác 100%</strong> từ kinh nghiệm chưng cất hàng nghìn mẻ yến mỗi ngày:</p>

<h3>1. Quan sát độ nở và hình dạng sợi yến</h3>
<p><strong>Yến thật:</strong> Khi chưng cách thủy vừa chín tới, sợi yến ngậm nước sẽ nở bung to gấp 3–4 lần kích thước ban đầu. Các sợi đan xen rõ rệt, có độ trong mờ tự nhiên, nhìn thấy từng thớ sợi mềm mại nhưng không bao giờ bị nát vụn.</p>
<p><strong>Yến giả (độn mủ trôm/rau câu):</strong> Mủ trôm khi ngâm nở thành khối nhớt sền sệt, không có thớ sợi rõ ràng. Khi đưa thìa múc lên, chất lỏng bị keo đặc dính chùm, sợi đứt đoạn vụn nát.</p>

<h3>2. Thử độ dai giòn sần sật khi thưởng thức</h3>
<p>Khi nhai hũ yến thật, bạn sẽ cảm nhận rõ rệt độ <em>dai giòn sần sật</em> đặc trưng, cắn nhẹ thấy sợi yến sực sực trong miệng rồi mới mềm tan. Ngược lại, yến độn thạch hoặc tinh bột sẽ mềm nhũn, nhớt nhờn ở cuống họng hoặc giòn giòn nhân tạo giống rau câu.</p>

<h3>3. Mùi hương ngự thiện tự nhiên</h3>
<p>Yến sào nguyên chất 100% luôn mang một mùi <strong>tanh nhẹ thanh khiết giống lòng trắng trứng gà tươi</strong> khi vừa mở nắp hũ nóng bốc khói. Sau khi nuốt, mùi tanh này tan biến ngay lập tức và để lại hậu vị ngọt thanh dịu nơi cuống họng. Yến giả thường không có mùi này, hoặc bị át đi bởi hương liệu tổng hợp (vani hóa học, đường hóa học gắt cổ).</p>

<h3>4. Thử bằng cách đun lại hoặc bảo quản lạnh</h3>
<p>Sợi yến thật có thể bảo quản trong ngăn mát tủ lạnh 7 ngày mà nước yến vẫn giữ được độ sánh lỏng trong suốt, sợi yến không bị nhão. Nếu là yến độn bột hoặc rau câu, sau 1–2 ngày trong tủ lạnh sẽ bị tách nước (vữa nước), phía dưới lắng cặn bột đục ngầu.</p>

<h3>5. Cam kết uy tín từ Bếp chưng thủ công</h3>
<p>Tại Bếp Yến Ocean (Vinhomes Ocean Park), chúng tôi kiên định một triết lý phụng sự duy nhất: <strong>100% Sợi yến tươi nguyên chất chưng tươi cách thủy theo đơn</strong>, tuyệt đối 0% chất bảo quản và 0% độn phụ gia. Khách hàng nhận hàng tại cửa căn hộ được quyền <em>mở nắp hũ kiểm tra sợi yến bốc khói trước khi thanh toán</em>. Phát hiện yến giả, Bếp đền gấp 10 lần giá trị đơn hàng!</p>
    `,
  },
  {
    slug: "thoi-tiet-giao-mua-nen-an-yen-gi-boi-bo-cho-nguoi-gia-va-tre-nho",
    title: "Thời Tiết Giao Mùa Nên Ăn Yến Gì? Bí Quyết Bổ Phế, Ấm Tỳ Vị Cho Người Già & Trẻ Nhỏ",
    shortDesc:
      "Khi trời trở lạnh, gió đông bắc ùa về là lúc cơ thể dễ nhiễm phong hàn, ho gió, ho khan dai dẳng. Lựa chọn vị yến chưng đúng phép Đông Y giúp ấm tỳ vị, bảo vệ hệ hô hấp và hồi sinh nguyên khí.",
    category: "Bí Quyết Dưỡng Sinh",
    readTime: "5 phút đọc",
    date: "19/10/2026",
    author: "Bếp Trưởng Nhung — Bếp Yến Ocean",
    image: "/images/product-gung-se.jpg",
    keywords: [
      "giao mùa ăn yến gì",
      "yến chưng gừng ấm bụng",
      "yến bồi bổ người già",
      "trị ho phong hàn bằng yến",
    ],
    relatedProductIds: [9, 6],
    contentHtml: `
<p class="lead">Giao mùa là thời điểm độ ẩm không khí thay đổi đột ngột, gió lạnh tràn về khiến niêm mạc đường hô hấp bị kích ứng. Người cao tuổi dễ đau nhức xương khớp, lạnh chân tay, còn các bé nhỏ thì ho khan, sổ mũi triền miên. Đây chính là lúc cơ thể cần bồi bổ "phế âm" và "ôn trung tán hàn" nhất.</p>

<h3>Đông Y nói gì về yến sào trong mùa lạnh?</h3>
<p>Sách <em>Bản Thảo Cương Mục</em> của danh y Lý Thời Trân ghi rõ: Yến sào vị ngọt, tính bình, quy vào hai kinh Phế và Vị. Yến có tác dụng dưỡng âm nhuận phế, hóa đàm chỉ khái (tiêu đờm trừ ho), kiện tỳ ích khí. Tuy nhiên, trong mùa lạnh, nếu dùng yến tính bình không đúng cách dễ gây lạnh bụng đối với người có thể hàn.</p>
<p>Vì vậy, <strong>nguyên tắc vàng khi dùng yến mùa lạnh là: Kết hợp thảo dược tính ấm và luôn ăn khi còn nóng hổi bốc khói</strong>.</p>

<h3>Hai vị yến ngự thiện chuẩn nhất cho thời tiết giao mùa:</h3>

<h4>1. Yến Chưng Gừng Sẻ Tươi (Ấm Tỳ Vị, Trừ Hàn Hoạt Huyết)</h4>
<p>Gừng sẻ đồi có tính ấm nồng, chứa nhiều gingerol giúp làm giãn mao mạch, thúc đẩy tuần hoàn máu và kháng viêm đường hô hấp cực mạnh. Khi chưng cách thủy cùng sợi yến tươi và đường phèn Quảng Ngãi:</p>
<ul>
  <li><strong>Người cao tuổi:</strong> Húp một thìa yến gừng nóng, cảm giác ấm lan từ vòm họng xuống tận bụng, giảm hẳn chứng lạnh chân tay và nhức mỏi xương khớp mùa đông.</li>
  <li><strong>Người ho khan, ho gió:</strong> Vị gừng thanh ấm làm dịu tức thì các cơn ngứa rát cổ họng, loãng đờm tự nhiên mà không cần lạm dụng thuốc kháng sinh.</li>
</ul>

<h4>2. Yến Chưng Nấm Đông Trùng Hạ Thảo (Đại Bổ Phế Thận, Tăng Sinh Lực)</h4>
<p>Đông trùng hạ thảo là thảo dược quý tính ấm, bổ phế ích thận. Hoạt chất Cordycepin giúp tăng cường dung tích phổi, tăng oxy trong máu, giúp người mới ốm dậy hoặc người già thể lực suy kiệt nhanh chóng lấy lại chính khí.</p>

<h3>Lưu ý cách ăn yến mùa giao mùa để hấp thu trọn vẹn:</h3>
<ol>
  <li><strong>Ăn khi nóng bốc khói:</strong> Bếp Yến Ocean giao nóng trong 20–30 phút tận cửa căn hộ. Khi nhận, quý cư dân nên thưởng thức ngay để làn hơi ấm thảo mộc đánh thức tỳ vị.</li>
  <li><strong>Thời điểm vàng:</strong> Dùng vào buổi sáng sớm khi bụng rỗng (trước bữa sáng 30 phút) hoặc buổi tối trước khi đi ngủ 30 phút để có giấc ngủ sâu thư thái.</li>
</ol>
    `,
  },
  {
    slug: "dia-chi-mua-yen-chung-tuoi-giao-nong-20-phut-vinhomes-ocean-park",
    title: "Địa Chỉ Mua Yến Chưng Tươi Giao Nóng 20 Phút Tận Cửa Căn Hộ Vinhomes Ocean Park",
    shortDesc:
      "Nỗi sợ lớn nhất của cư dân Ocean Park khi thèm hũ yến chưng là đặt từ nội thành mất cả tiếng, nhận hàng yến nguội tanh ngắt. Bếp Yến Ocean đỏ lửa ngay nội khu, giao nóng bốc khói tận căn hộ chỉ trong 20–30 phút.",
    category: "Đặc Quyền Cư Dân",
    readTime: "3 phút đọc",
    date: "18/10/2026",
    author: "Bếp Trưởng Nhung — Bếp Yến Ocean",
    image: "/images/banner-hero.jpg",
    keywords: [
      "mua yến ở ocean park",
      "yến chưng nóng ocean park",
      "ship yến vinhomes ocean park",
      "yến sào gia lâm",
    ],
    relatedProductIds: [1, 4],
    contentHtml: `
<p class="lead">Đại đô thị Vinhomes Ocean Park (Gia Lâm, Hà Nội) là nơi an cư đẳng cấp của hàng chục nghìn cư dân tinh hoa. Thế nhưng, nhiều gia đình khi muốn bồi bổ một hũ yến tươi nóng hổi cho con nhỏ hay bố mẹ già lại gặp phải bài toán nan giải: Các thương hiệu yến lớn chủ yếu nằm trong nội thành, thời gian giao hàng qua cầu Vĩnh Tuy, Thanh Trì mất từ 45 phút đến hơn 1 tiếng. Nhận đến nơi, hũ yến đã nguội tanh, mất đi trọn vẹn độ thơm ngon ngự thiện.</p>

<h3>Bếp Yến Ocean — Nổi lửa đỏ hực ngay trong lòng Đại Đô Thị</h3>
<p>Ra đời từ chính tình yêu và sự gắn bó với cư dân Ocean Park 1, 2, 3, <strong>Bếp Yến Ocean</strong> giải quyết triệt để nỗi trăn trở này:</p>

<ul>
  <li><strong>Chưng tươi theo từng đơn đặt:</strong> Bếp tuyệt đối không bán yến chưng sẵn đóng lọ công nghiệp để tủ lạnh nhiều ngày. Khách đặt món nào, Bếp trưởng mới cho yến tươi và nguyên liệu vào thố sứ chưng cách thủy mẻ riêng.</li>
  <li><strong>Shipper nội khu giao hỏa tốc 20–30 phút:</strong> Đội ngũ giao hàng chuyên trách nội khu túc trực khắp các phân khu S1, S2, Masteri Waterfront, The Zenpark, The Pavilion, San Hô, Sao Biển... Ngay khi vừa tắt bếp, hũ yến được cho vào túi giữ nhiệt chuyên dụng, bấm chuông trao tận tay cửa căn hộ khi còn đang <em>bốc làn khói thơm nghi ngút</em>.</li>
  <li><strong>Chính sách Freeship 100% nội khu:</strong> Bếp áp dụng chính sách vận chuyển miễn phí hỏa tốc cho toàn bộ cư dân sinh sống tại Ocean Park.</li>
</ul>

<h3>Đặc quyền sống xanh: Đổi 10 vỏ hũ thủy tinh lấy 1 hũ yến tươi mới</h3>
<p>Nhằm đồng hành cùng lối sống xanh văn minh của cư dân đại đô thị, Bếp Yến Ocean triển khai chương trình thu hồi vỏ hũ định kỳ: Cứ tích lũy đủ <strong>10 vỏ hũ thủy tinh y tế nguyên vẹn</strong>, shipper nội khu sẽ ghé tận cửa căn hộ thu gom và trao tặng lại <strong>1 hũ yến chưng tươi cách thủy mới nóng hổi</strong> hoàn toàn miễn phí!</p>
    `,
  },
  {
    slug: "top-dia-chi-mua-yen-sao-qua-bieu-thuong-hang-uy-tin-nhat-ha-noi",
    title: "Top Địa Chỉ Mua Yến Sào Quà Biếu Thượng Hạng Uy Tín Bậc Nhất Hà Nội",
    shortDesc:
      "Yến sào luôn là bảo vật đứng đầu danh sách quà biếu sức khỏe ngoại giao, thăm hỏi người ốm phẫu thuật và tri ân đối tác cấp cao. Tiêu chuẩn chọn set quà gấm đỏ cung đình và hũ sâu Tây Tạng ngự phẩm.",
    category: "Quà Biếu Vương Giả",
    readTime: "5 phút đọc",
    date: "17/10/2026",
    author: "Bếp Trưởng Nhung — Bếp Yến Ocean",
    image: "/images/product-vip-sau.jpg",
    keywords: [
      "mua yến ở hà nội uy tín",
      "yến sào quà biếu hà nội",
      "sâu đông trùng tây tạng uy tín",
      "yến tổ thượng hạng hà nội",
    ],
    relatedProductIds: [0, 8],
    contentHtml: `
<p class="lead">Trong văn hóa quà tặng của người Tràng An, việc trao tặng một hộp yến sào không đơn thuần là tặng một sản vật đắt giá, mà là gửi gắm trọn vẹn lời chúc trường thọ, an khang và sự tôn kính chân thành nhất. Chọn yến biếu vì vậy đòi hỏi sự tinh tường tuyệt đối về cả phẩm cấp yến lẫn quy cách đóng hộp hoàng gia.</p>

<h3>Ba tiêu chí vàng khi chọn yến sào làm quà biếu VIP tại Hà Nội:</h3>

<h4>1. Nguồn gốc yến đảo nguyên tai thượng hạng</h4>
<p>Tổ yến dùng làm quà biếu phải là dòng yến tổ đảo tự nhiên già ngày, sợi gân nổi rõ, hình cánh sen dày dặn và độ nở tột đỉnh. Tổ yến được làm sạch thủ công bằng nhíp y tế vô trùng, giữ trọn vẹn 18 loại axit amin và khoáng chất quý.</p>

<h4>2. Bao bì hộp quà gấm nhung & sơn mài cung đình</h4>
<p>Hình thức hộp quà biếu thể hiện vị thế của người tặng. Hộp quà tại Bếp Yến Ocean được thiết kế theo phong cách ngự thiện triều đình: Bọc gấm lụa đỏ son thêu hoa văn mây chỉ vàng, lót nhung đen tuyền quý phái. Đi kèm hộp quà là thố sứ chưng yến hoàng gia mạ vàng, táo đỏ Tân Cương, đường phèn kết tinh tự nhiên và nhíp gắp chuyên dụng.</p>

<h4>3. Hũ VIP ngâm Sâu Đông Trùng Tây Tạng nguyên con (Độc Bản)</h4>
<p>Đối với những dịp biếu tặng đặc biệt quan trọng — như thăm hỏi lãnh đạo cấp cao, người thân sau đại phẫu thuật hoặc đối tác ngoại giao lớn — Bếp Yến Ocean cung cấp dòng <strong>Hũ Yến VIP ngâm trực tiếp Sâu Đông Trùng Tây Tạng nguyên con tự nhiên</strong>.</p>
<p>Từng con sâu Tây Tạng khai thác từ độ cao 4.500m băng tuyết Himalaya, rõ mắt đỏ và thân nấm thảo dược, có giá 400.000đ/con sâu. Đây là cực phẩm đại bổ nguyên khí mà bất kỳ vị khách quý nào nhận được cũng đều trân quý và cảm kích tấm lòng của người trao tặng.</p>
    `,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
