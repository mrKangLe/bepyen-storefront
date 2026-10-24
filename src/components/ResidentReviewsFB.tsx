"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ResidentReviewsFBProps {
  productTitle?: string;
  productSlug?: string;
  category?: string;
}

interface FBReviewItem {
  name: string;
  badge: string;
  location: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
  replyText?: string;
  photoUrl?: string;
  photoCaption?: string;
}

interface FBProductReviews {
  comment1: FBReviewItem;
  comment2: FBReviewItem;
  comment3: FBReviewItem;
}

// Bộ từ điển 30 nhân vật cư dân & bình luận riêng biệt cho từng sản phẩm
function getReviewData(slug?: string, title?: string): FBProductReviews {
  const s = (slug || "").toLowerCase();
  const t = (title || "").toLowerCase();

  // 1. GỪNG TƯƠI (Product 9)
  if (s.includes("gung") || t.includes("gừng")) {
    return {
      comment1: {
        name: "Hoàng Lan Anh",
        badge: "Top Fan",
        location: "Tòa S2.12",
        avatar: "/images/avatars/user-25.jpg",
        text: "Mấy hôm nay trời trở lạnh, bố mình bị ho khan dai dẳng với lạnh bụng, mình liền đặt hũ Yến Chưng Gừng Tươi bên Bếp giao sang S2.12. Công nhận sản phẩm rất thơm và ấm, mở nắp ra mùi gừng tươi thái sợi bốc lên thơm nức ấm sực cả phòng khách. Bố mình kỹ tính mà dùng khen nức nở, húp ngụm đầu tiên thấy ấm ran cả lồng ngực, sợi yến dai sần sật quyện vị gừng ngọt thanh không bị cay nồng. Cụ dùng xong ngủ êm ru một mạch tới sáng, hết hẳn lạnh chân tay. 10/10 sẽ ủng hộ Bếp dài dài! 😍🍲",
        likes: 38,
        time: "35 phút",
        photoUrl: "/images/product-gung-se.jpg",
        photoCaption: "📷 Hũ yến chưng gừng tươi ấm nóng bốc khói",
        replyText: "Dạ Bếp cảm ơn chị Lan Anh nhiều ạ! Món Yến Chưng Gừng Tươi nhà em dùng gừng ta tươi chưng cách thủy nóng hổi giúp ấm tỳ vị, giải cảm và bổ phế cho người lớn tuổi cực tốt. Bác khen ngon và ấm bụng là niềm hạnh phúc lớn nhất của Bếp rồi ạ! 🥰🫙",
      },
      comment2: {
        name: "Bác Vũ Đình Quyết",
        badge: "Cựu chiến binh",
        location: "Tòa S1.07",
        avatar: "/images/avatars/user-26.jpg",
        text: "Tôi tuổi già hay bị phong hàn, khớp nhức mỏi mùa lạnh. Sáng nào cũng hâm ấm hũ yến chưng gừng này uống, thấy người ấm ran, khí huyết lưu thông, đỡ ho hẳn. Gừng tươi thơm tự nhiên rất chuẩn vị ngự thiện cổ truyền.",
        likes: 29,
        time: "2 giờ",
      },
      comment3: {
        name: "Đỗ Thành Trung",
        badge: "Cư dân Masteri M2",
        location: "Masteri Waterfront",
        avatar: "/images/avatars/user-27.jpg",
        text: "Tối đi đá bóng về mệt lạnh, uống hũ yến chưng gừng nóng hổi này giải cảm cực nhanh. Sợi yến đặc sánh ngập hũ, vị gừng ấm áp dễ chịu không bị ngọt khé. Đặt luôn set 5 hũ để cả nhà cùng phòng lạnh.",
        likes: 21,
        time: "Hôm qua lúc 21:15",
      },
    };
  }

  // 2. NẤM ĐÔNG TRÙNG HẠ THẢO (Product 10)
  if (s.includes("dong-trung") || t.includes("đông trùng") && !t.includes("sâu")) {
    return {
      comment1: {
        name: "Phạm Hữu Nghĩa",
        badge: "Giám đốc kinh doanh",
        location: "Tòa S2.15",
        avatar: "/images/avatars/user-28.jpg",
        text: "Lịch trình công tác dày đặc người hay bị hụt hơi đuối sức, mình uống đều mỗi tuần 3 hũ Yến Nấm Đông Trùng của Bếp. Thấy thể lực dẻo dai, bổ phổi và không còn cảm giác mệt mỏi buổi sáng. Nấm đông trùng tươi vàng óng giòn sần sật quyện từng sợi yến dày dặn rất đáng đồng tiền! ⚡💪",
        likes: 42,
        time: "25 phút",
        photoUrl: "/images/product-dong-trung.jpg",
        photoCaption: "📷 Nấm đông trùng tươi vàng óng & sợi yến dày",
        replyText: "Dạ Bếp cảm ơn anh Nghĩa ạ! Nấm đông trùng hạ thảo tươi giàu dược chất Cordycepin kết hợp yến sào nguyên chất giúp phục hồi sinh lực, tăng cường chức năng phổi cho các anh làm việc căng thẳng rất hiệu quả đó ạ! 🥰",
      },
      comment2: {
        name: "Nguyễn Hải An",
        badge: "Cư dân San Hô",
        location: "Biệt thự San Hô 03",
        avatar: "/images/avatars/user-29.jpg",
        text: "Bố mẹ mình sau đợt ốm dậy người gầy sút, mình mua liền 2 set yến đông trùng bồi bổ. Hai cụ khen nức nở vị thảo dược thanh dịu dễ uống, ăn cơm ngon miệng và hồi phục thể trạng rất nhanh. Giao nóng tận biệt thự chỉ 25p.",
        likes: 31,
        time: "3 giờ",
      },
      comment3: {
        name: "Cô Trần Thị Lệ",
        badge: "Cư dân Zenpark",
        location: "Tòa R1.03",
        avatar: "/images/avatars/user-30.jpg",
        text: "Set yến đông trùng này đóng hộp quà đỏ thắt nơ mang biếu đối tác hay người thân thì sang trọng miễn bàn. Yến chưng đặc sợi, nấm đông trùng chuẩn chỉ, các cụ ăn khen tấm tắc.",
        likes: 27,
        time: "Hôm qua lúc 19:40",
      },
    };
  }

  // 3. SAFFRON NHỤY HOA NGHỆ TÂY (Product 8)
  if (s.includes("saffron") || t.includes("saffron") || t.includes("nghệ tây")) {
    return {
      comment1: {
        name: "Dương Thảo Vy",
        badge: "Chủ Spa Dưỡng Nhan",
        location: "Masteri Miami M1",
        avatar: "/images/avatars/user-22.jpg",
        text: "Nước yến saffron màu vàng hổ phách óng ánh nhìn quý phái mê ly cả nhà ơi! Sợi saffron Iran xịn xò thơm ngát quyện yến tươi nguyên chất nở dai giòn. Mình dùng 10 ngày thấy nám mờ hẳn, da dẻ căng tràn sức sống, tối ngủ sâu một mạch tới sáng không mộng mị. Chuẩn ngự phẩm dưỡng nhan điểm 10! ✨👑",
        likes: 45,
        time: "15 phút",
        photoUrl: "/images/product-saffron.jpg",
        photoCaption: "📷 Nước yến saffron màu vàng hoàng gia óng ả",
        replyText: "Dạ Bếp cảm ơn chị Thảo Vy ạ! Saffron nhụy hoa nghệ tây ngâm cùng yến tươi giúp đào thải độc tố, kích thích sản sinh collagen tự nhiên và đem lại giấc ngủ sâu thư thái cho phái đẹp. Chị nhớ gom vỏ hũ đổi hũ mới nha chị! 🥰",
      },
      comment2: {
        name: "Nguyễn Tấn Phát",
        badge: "Cư dân S2.05",
        location: "Tòa S2.05",
        avatar: "/images/avatars/user-23.jpg",
        text: "Mua tặng sinh nhật vợ set 5 hũ Saffron, vợ khen nức nở bảo chồng tâm lý điểm 10. Vị thanh mát dễ uống, cảm giác được chăm sóc như hoàng hậu. Vừa được tặng thêm 1 hũ chưng tươi vừa freeship.",
        likes: 33,
        time: "4 giờ",
      },
      comment3: {
        name: "Lâm Hải Yến",
        badge: "Cư dân Ngọc Trai",
        location: "Biệt thự Ngọc Trai 06",
        avatar: "/images/avatars/user-24.jpg",
        text: "Vị saffron này đại bổ dưỡng nhan và điều hòa nội tiết rất tốt cho phụ nữ trung niên. Bếp chưng tay nóng hổi giao chuẩn giờ, sợi yến đặc sánh không pha tạp, dịch vụ 5 sao.",
        likes: 39,
        time: "Hôm qua lúc 20:30",
      },
    };
  }

  // 4. LÁ NẾP HẠT CHIA (Product 6)
  if (s.includes("chia") || t.includes("hạt chia")) {
    return {
      comment1: {
        name: "Lê Ngọc Diệp",
        badge: "HLV Yoga & Wellness",
        location: "Masteri Waterfront M2",
        avatar: "/images/avatars/user-16.jpg",
        text: "Mình theo chế độ eat-clean giữ dáng mà vẫn muốn đủ chất, hũ Yến Hạt Chia này là bữa phụ hoàn hảo! No lâu, nhẹ bụng, thanh lọc cơ thể cực tốt. Mùi lá nếp thơm mát tự nhiên không hương liệu, hạt chia nở giòn lách tách quyện sợi yến dai sần sật ăn vui miệng dã man! 🌿🧘‍♀️",
        likes: 36,
        time: "40 phút",
        photoUrl: "/images/product-hat-chia.jpg",
        photoCaption: "📷 Hũ yến hạt chia giòn sần sật thanh mát",
        replyText: "Dạ Bếp cảm ơn chị Diệp ạ! Hạt chia hữu cơ giàu Omega-3 và chất xơ kết hợp yến sào cách thủy tạo nên món tráng miệng thanh lọc cơ thể, giữ dáng đẹp da hoàn hảo cho cả mẹ và bé đó ạ! 🥰",
      },
      comment2: {
        name: "Đoàn Thu Trang",
        badge: "Mẹ 2 bé",
        location: "Tòa S2.06",
        avatar: "/images/avatars/user-17.jpg",
        text: "2 bé nhà mình mê vị hạt chia này nhất vì hạt chia giòn lách tách thơm lừng mùi lá nếp. Bé tiêu hóa tốt hơn hẳn từ ngày dùng yến hạt chia của bếp, không còn táo bón hay biếng ăn nữa.",
        likes: 24,
        time: "2 giờ",
      },
      comment3: {
        name: "Chu Mạnh Thắng",
        badge: "Kỹ sư IT",
        location: "Tòa S1.09",
        avatar: "/images/avatars/user-18.jpg",
        text: "Ngồi code cả ngày mỏi mệt, chiều làm 1 hũ yến hạt chia mát lạnh thấy đầu óc tỉnh táo hẳn. Vị ngọt thanh rất nhẹ không bị gắt đường, ship lên tận tầng 19 siêu nhanh.",
        likes: 19,
        time: "Hôm qua lúc 18:50",
      },
    };
  }

  // 5. DỪA TƯƠI KỶ TỬ (Product 7)
  if (s.includes("dua") || t.includes("dừa")) {
    return {
      comment1: {
        name: "Tạ Quỳnh Chi",
        badge: "Cư dân Zenpark",
        location: "Tòa R1.01",
        avatar: "/images/avatars/user-19.jpg",
        text: "Vị dừa tươi kỷ tử này uống thanh mát đã khát số 1 ở Ocean Park! Nước dừa xiêm tự nhiên ngọt dịu thanh khiết không cần nhiều đường, cùi dừa non giòn sần sật quyện hạt kỷ tử đỏ mọng và sợi yến tươi béo ngậy. Húp một thìa mát lịm cả người, nhẹ nhõm sảng khoái vô cùng! 🥥🌴",
        likes: 41,
        time: "20 phút",
        photoUrl: "/images/product-dua-tuoi-ky-tu.jpg",
        photoCaption: "📷 Hũ yến dừa tươi kỷ tử thanh mát tự nhiên",
        replyText: "Dạ Bếp cảm ơn chị Chi nhiều ạ! Vị dừa tươi kỷ tử được chưng trực tiếp từ nước dừa xiêm nguyên chất không pha nước lã, kết hợp cùi dừa non và kỷ tử đỏ giúp thanh nhiệt và bổ mắt sáng da rất tuyệt vời chị nha! 🥰",
      },
      comment2: {
        name: "Lưu Đức Trọng",
        badge: "Cư dân Hải Âu",
        location: "Biệt thự Hải Âu 02",
        avatar: "/images/avatars/user-20.jpg",
        text: "Bà xã đang mang bầu tháng thứ 5 nghén đồ ngọt, chỉ uống được nước dừa tươi chưng yến này vì ngọt thanh tự nhiên, vừa bổ ối vừa mát gan cho mẹ và bé. Tuần nào nhà mình cũng đặt 5 hũ.",
        likes: 28,
        time: "3 giờ",
      },
      comment3: {
        name: "Cô Bùi Minh Hạnh",
        badge: "Cư dân S2.10",
        location: "Tòa S2.10",
        avatar: "/images/avatars/user-21.jpg",
        text: "Trời nắng nóng làm hũ dừa tươi kỷ tử mát rượi này thì sảng khoái không gì bằng. Yến nhiều, cùi dừa non thơm bùi, đóng hũ sạch sẽ vệ sinh, shipper rất lễ phép.",
        likes: 35,
        time: "Hôm qua lúc 17:15",
      },
    };
  }

  // 6. HẠT SEN LONG NHÃN LÁ NẾP (Product 2)
  if (s.includes("sen-long-nhan") || (t.includes("sen") && t.includes("nhãn"))) {
    return {
      comment1: {
        name: "Nguyễn Kiều Trang",
        badge: "Cư dân Zenpark",
        location: "Tòa R1.02",
        avatar: "/images/avatars/user-4.jpg",
        text: "Long nhãn cùi dày mọng nước ngọt thơm tự nhiên, kết hợp cùng hạt sen bở tơi bùi ngậy và yến tươi đỉnh chóp luôn cả nhà! Vị ngọt vừa vặn thanh tao quyện mùi lá nếp thơm nức, ăn hoài không ngấy. Cả nhà mình ai cũng mê vị này nhất, húp sạch tới giọt cuối cùng! 🥣✨",
        likes: 37,
        time: "30 phút",
        photoUrl: "/images/product-sen-long-nhan.jpg",
        photoCaption: "📷 Hạt sen bùi ngậy quyện long nhãn ngọt thanh",
        replyText: "Dạ Bếp cảm ơn chị Kiều Trang ạ! Long nhãn Hưng Yên sấy dẻo kết hợp hạt sen Huế bở tơi giúp an thần dưỡng tâm và bổ khí huyết rất tốt. Chúc gia đình mình luôn ngon miệng ạ! 🥰",
      },
      comment2: {
        name: "Bùi Quốc Huy",
        badge: "Cư dân S2.03",
        location: "Tòa S2.03",
        avatar: "/images/avatars/user-5.jpg",
        text: "Vợ mình mới sinh em bé được 2 tháng, ăn món hạt sen long nhãn này vừa lợi sữa vừa phục hồi sức khỏe nhanh. Yến chưng tươi cách thủy nóng bốc khói, an tâm 100% không lo chất bảo quản độc hại.",
        likes: 26,
        time: "2 giờ",
      },
      comment3: {
        name: "Cô Phạm Thị Nga",
        badge: "Cư dân The Pavilion",
        location: "Tòa P4",
        avatar: "/images/avatars/user-6.jpg",
        text: "Cô đặt 5 hũ mang sang biếu bà thông gia, Bếp giao đóng gói cẩn thận có túi xách lịch sự. Long nhãn thơm nức mũi quyện lá nếp rất sang miệng, các cụ ăn khen tấm tắc.",
        likes: 32,
        time: "Hôm qua lúc 19:10",
      },
    };
  }

  // 7. HẠT SEN KỶ TỬ LÁ NẾP (Product 3)
  if (s.includes("sen-ky-tu") || (t.includes("sen") && t.includes("kỷ tử"))) {
    return {
      comment1: {
        name: "Bác Đặng Đình Thành",
        badge: "Cán bộ hưu trí",
        location: "Tòa S1.05",
        avatar: "/images/avatars/user-7.jpg",
        text: "Mắt tôi dạo này hay bị mỏi và mờ do tuổi tác, cháu gái mua tặng hũ yến chưng hạt sen kỷ tử này. Uống đều 1 tuần thấy mắt sáng rõ, ngủ sâu giấc và ăn cơm ngon miệng hơn. Kỷ tử đỏ mọng sạch sẽ, hạt sen bở tơi, sợi yến dai ngon bổ dưỡng vô cùng! 👓❤️",
        likes: 40,
        time: "45 phút",
        photoUrl: "/images/product-sen-ky-tu.jpg",
        photoCaption: "📷 Hạt sen bở tơi & hạt kỷ tử đỏ mọng",
        replyText: "Dạ Bếp kính chúc bác Thành luôn dồi dào sức khỏe và an khang ạ! Hạt sen dưỡng tâm an thần kết hợp kỷ tử bổ can thận sáng mắt là bài thuốc ngự thiện bồi dưỡng sức khỏe người cao tuổi chuẩn nhất đó bác! 🥰",
      },
      comment2: {
        name: "Hoàng Bích Ngọc",
        badge: "Cư dân S2.16",
        location: "Tòa S2.16",
        avatar: "/images/avatars/user-8.jpg",
        text: "Làm việc máy tính văn phòng 10 tiếng mỗi ngày, chiều nào cũng phải nạp 1 hũ hạt sen kỷ tử của Bếp để hồi phục mắt và thần kinh. Vị ngọt dịu ấm nóng hay mát lạnh đều ngon tuyệt cú mèo!",
        likes: 23,
        time: "3 giờ",
      },
      comment3: {
        name: "Trần Thu Hà",
        badge: "Cư dân Masteri M3",
        location: "Masteri Waterfront",
        avatar: "/images/avatars/user-9.jpg",
        text: "Ship hỏa tốc lên tầng 22 siêu nhanh, hũ yến cầm đầm tay đặc quánh sợi yến. Ăn vừa đẹp da vừa bổ mắt, giá cả lại rất hợp lý với chất lượng yến tươi thiên nhiên.",
        likes: 29,
        time: "Hôm qua lúc 20:05",
      },
    };
  }

  // 8. LONG NHÃN TÁO ĐỎ LÁ NẾP (Product 4)
  if (s.includes("long-nhan-tao") || (t.includes("long nhãn") && t.includes("táo đỏ"))) {
    return {
      comment1: {
        name: "Phan Thùy Linh",
        badge: "Cư dân S2.01",
        location: "Tòa S2.01",
        avatar: "/images/avatars/user-10.jpg",
        text: "Sự kết hợp giữa long nhãn cùi dày ngọt đậm và táo đỏ Tân Cương mềm dẻo phải gọi là xuất sắc! Sợi yến tươi dài ngoằng ngập hũ, nước yến sánh quyện mùi lá nếp thơm phức. Húp một thìa là thấy tinh thần sảng khoái tràn đầy sinh lực. Rất mê vị này! 🍯🍎",
        likes: 35,
        time: "35 phút",
        photoUrl: "/images/product-long-nhan-tao.jpg",
        photoCaption: "📷 Topping long nhãn cùi dày & táo đỏ dẻo ngọt",
        replyText: "Dạ Bếp cảm ơn chị Thùy Linh ạ! Long nhãn bổ tỳ ích khí kết hợp táo đỏ dưỡng huyết giúp da dẻ hồng hào và phục hồi nguyên khí cực nhanh đó chị! 🥰",
      },
      comment2: {
        name: "Ngô Quang Dũng",
        badge: "Cư dân Sao Biển",
        location: "Biệt thự Sao Biển 11",
        avatar: "/images/avatars/user-11.jpg",
        text: "Mua cho mẹ bồi dưỡng sau trận ốm, mẹ khen vị thanh ngọt tự nhiên không bị gắt cổ như mấy loại yến chưng sẵn đóng hộp công nghiệp. Mẹ ăn ngon miệng và da dẻ tươi tắn hơn nhiều.",
        likes: 27,
        time: "2 giờ",
      },
      comment3: {
        name: "Cô Lê Thanh Thủy",
        badge: "Cư dân Zenpark",
        location: "Tòa R1.05",
        avatar: "/images/avatars/user-12.jpg",
        text: "Món này bổ huyết dưỡng khí cực tốt, cô dùng đều đặn thấy sắc mặt hồng hào tươi tắn hẳn ra, không còn chóng mặt khi đứng lên ngồi xuống. Đóng gói rất sạch sẽ và chỉn chu.",
        likes: 33,
        time: "Hôm qua lúc 18:40",
      },
    };
  }

  // 9. TÁO ĐỎ KỶ TỬ LÁ NẾP (Product 5)
  if (s.includes("tao-do-ky-tu") || (t.includes("táo đỏ") && t.includes("kỷ tử"))) {
    return {
      comment1: {
        name: "Đinh Cẩm Tú",
        badge: "Cư dân The Pavilion",
        location: "Tòa P1",
        avatar: "/images/avatars/user-13.jpg",
        text: "Bộ đôi táo đỏ kỷ tử chưng yến này đúng là bí quyết dưỡng nhan của chị em chúng mình! Nước yến sánh thơm màu đỏ hồng tự nhiên, sợi yến dai sần sật, táo đỏ dẻo mềm thơm lừng. Mình uống 2 tuần nay da dẻ căng bóng hồng hào hẳn luôn, đi làm ai cũng khen! 🌸🍎",
        likes: 39,
        time: "50 phút",
        photoUrl: "/images/product-tao-ky-tu.jpg",
        photoCaption: "📷 Táo đỏ dẻo mềm & kỷ tử đỏ mọng bổ huyết",
        replyText: "Dạ Bếp cảm ơn chị Cẩm Tú ạ! Táo đỏ và kỷ tử là hai vị ngự thiện bổ huyết sinh tân, chống oxy hóa và nuôi dưỡng làn da từ gốc tuyệt vời nhất cho phái đẹp đó ạ! 🥰",
      },
      comment2: {
        name: "Bác Trịnh Văn Hùng",
        badge: "Cư dân S1.02",
        location: "Tòa S1.02",
        avatar: "/images/avatars/user-14.jpg",
        text: "Bác huyết áp không ổn định hay chóng mặt, từ ngày dùng hũ táo đỏ kỷ tử này thấy người khoan khoái nhẹ nhõm, huyết áp ổn định hơn. Cảm ơn Bếp Yến Ocean làm đồ rất có tâm.",
        likes: 30,
        time: "3 giờ",
      },
      comment3: {
        name: "Mai Phương Uyên",
        badge: "Cư dân S2.18",
        location: "Tòa S2.18",
        avatar: "/images/avatars/user-15.jpg",
        text: "Đặt giao nóng 20p đến cửa căn hộ chuẩn chỉ. Topping táo đỏ với kỷ tử đầy đặn, yến nguyên chất 100% ăn sướng miệng dã man. Đã lưu số Zalo Bếp để đặt định kỳ hàng tuần.",
        likes: 25,
        time: "Hôm qua lúc 21:30",
      },
    };
  }

  // 10. MẶC ĐỊNH: HẠT SEN TÁO ĐỎ NƯỚC LÁ NẾP (Product 1)
  return {
    comment1: {
      name: "Đỗ Minh Thư",
      badge: "Mẹ bỉm sữa",
      location: "Tòa S2.08",
      avatar: "/images/avatars/user-1.jpg",
      text: "Bé Thỏ nhà mình lười ăn lắm mà riêng hũ Yến Chưng Hạt Sen Táo Đỏ này thì tự cầm thìa xúc hết veo cả hũ! Mùi lá nếp thơm dìu dịu, hạt sen bở tơi bùi ngậy, yến sợi thật nở dài chứ không bị nát vụn hay độn nước. Shipper giao lên tầng 18 S2.08 hũ vẫn còn ấm ran bỏng tay. Cho 10/10 điểm từ chất lượng đến độ nhiệt tình luôn ạ! 😍🍲",
      likes: 44,
      time: "25 phút",
      photoUrl: "/images/review-customer-photo-1.jpg",
      photoCaption: "📷 Hũ yến hạt sen táo đỏ nóng hổi tại căn hộ S2.08",
      replyText: "Dạ Bếp cảm ơn chị Minh Thư và bé Thỏ nhiều ạ! Yến nhà em chưng cách thủy tươi mới khi chị đặt để giữ trọn vẹn dinh dưỡng và vị ngọt thanh tự nhiên cho bé. Chị nhớ gom 10 vỏ hũ để đổi hũ mới nha chị ơi! 🥰🫙",
    },
    comment2: {
      name: "Bác Lê Khắc Bình",
      badge: "Giáo viên về hưu",
      location: "Tòa S1.12",
      avatar: "/images/avatars/user-2.jpg",
      text: "Tôi bị mất ngủ kinh niên do tuổi tác, con gái mua biếu set hạt sen táo đỏ này. Uống trước khi ngủ 1 tiếng thấy đầu óc nhẹ nhõm, đêm ngủ một mạch từ 10h đến 5h sáng không mộng mị. Rất ưng vị ngọt thanh của đường phèn tự nhiên, không bị khé cổ họng.",
      likes: 36,
      time: "2 giờ",
    },
    comment3: {
      name: "Vũ Thảo My",
      badge: "Cư dân Masteri M1",
      location: "Masteri Waterfront",
      avatar: "/images/avatars/user-3.jpg",
      text: "Nhận hàng đúng 20p sau khi đặt qua web, ship nhanh chóng mặt. Nước yến đặc sánh, thơm nức mùi lá nếp tươi, ăn xong da dẻ mịn màng hẳn. Đặt luôn mấy hũ yến chưng nóng để cả nhà ăn tối bồi bổ, freeship hỏa tốc tận cửa rất tiện.",
      likes: 28,
      time: "Hôm qua lúc 20:10",
    },
  };
}

export default function ResidentReviewsFB({ productTitle, productSlug }: ResidentReviewsFBProps) {
  const reviews = getReviewData(productSlug, productTitle);
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm border border-stone-200/90 bg-white space-y-2.5 sm:space-y-3">
      {/* ── HEADER FACEBOOK GROUP ──────────────────────────────── */}
      <div className="flex items-center justify-between gap-2.5 border-b border-stone-100 pb-2.5">
        <div className="flex items-center gap-2.5">
          {/* Logo Hội cư dân FB */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center text-white text-base shadow-xs shrink-0 relative">
            <span>👥</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 border border-white flex items-center justify-center text-[8px] font-black text-white">
              f
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs sm:text-sm font-black text-stone-900 font-heading">
                Cư Dân Vinhomes Ocean Park (Chính Thức)
              </h3>
              <span className="inline-flex items-center text-[9px] text-blue-600 font-bold bg-blue-50 px-1 rounded">
                ✓ Đã duyệt
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 flex items-center gap-1.5">
              <span>128.5K thành viên</span>
              <span>·</span>
              <span className="text-amber-600 font-bold">⭐ 4.9/5 (1.250+ phản hồi)</span>
            </p>
          </div>
        </div>

        {/* Nút trạng thái */}
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg shrink-0">
          Sôi nổi
        </span>
      </div>

      {/* Tiêu đề ngắn dẫn dắt */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] sm:text-xs font-bold text-stone-800 uppercase tracking-wide flex items-center gap-1">
          <span>💬</span>
          <span>Cảm Nhận Thực Tế Về: <strong className="text-red-950 font-bold">{productTitle || "Món Yến Này"}</strong></span>
        </span>
        <span className="text-[10px] text-stone-400">Gần đây ▼</span>
      </div>

      {/* ── DANH SÁCH BÌNH LUẬN FACEBOOK CHÂN THẬT ─────────────── */}
      <div className="space-y-2.5 sm:space-y-3">
        {/* COMMENT 1: Kèm ảnh feedback thực tế của món đó */}
        <div className="flex items-start gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-stone-200 bg-amber-100 shadow-2xs">
            <Image
              src={reviews.comment1.avatar}
              alt={reviews.comment1.name}
              fill
              sizes="32px"
              className="object-cover"
              onError={(e) => {
                (e.target as any).src = "/images/avatars/user-1.jpg";
              }}
            />
          </div>

          <div className="flex-1 space-y-1">
            <div className="bg-[#F0F2F5] p-2.5 rounded-xl rounded-tl-xs space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-stone-900 hover:underline cursor-pointer">
                  {reviews.comment1.name}
                </span>
                <span className="text-[9px] font-bold bg-blue-100/80 text-blue-800 px-1 py-0.2 rounded">
                  {reviews.comment1.badge}
                </span>
                <span className="text-[10px] text-stone-500 font-medium">
                  · {reviews.comment1.location}
                </span>
              </div>

              <p className="text-xs text-stone-800 leading-relaxed">
                {reviews.comment1.text}
              </p>

              {/* Ảnh chụp thực tế của khách đính kèm trong comment */}
              {reviews.comment1.photoUrl && (
                <div className="pt-0.5">
                  <div className="relative w-32 sm:w-40 aspect-4/3 rounded-lg overflow-hidden border border-stone-300 shadow-2xs group cursor-pointer">
                    <Image
                      src={reviews.comment1.photoUrl}
                      alt={reviews.comment1.photoCaption || "Ảnh khách chụp thực tế"}
                      fill
                      sizes="160px"
                      className="object-cover transition group-hover:scale-105"
                      onError={(e) => {
                        (e.target as any).src = "/images/review-customer-photo-1.jpg";
                      }}
                    />
                    <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-[8px] font-bold text-white px-1 py-0.2 rounded">
                      📷 Ảnh thật
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hàng tương tác Like / Phản hồi */}
            <div className="flex items-center gap-2.5 text-[10px] text-stone-500 pl-1.5">
              <span className="font-bold text-stone-700 hover:underline cursor-pointer">Thích</span>
              <span>·</span>
              <span className="font-bold text-stone-700 hover:underline cursor-pointer">Phản hồi</span>
              <span>·</span>
              <span>{reviews.comment1.time}</span>
              <span className="ml-auto inline-flex items-center gap-1 bg-white border border-stone-200 shadow-2xs px-1.5 py-0.2 rounded-full text-[9px]">
                <span className="text-blue-500">👍</span>
                <span className="text-red-500">❤️</span>
                <span className="font-bold text-stone-700">{reviews.comment1.likes}</span>
              </span>
            </div>

            {/* Phản hồi con từ Bếp Yến Ocean (Tác giả) */}
            {reviews.comment1.replyText && (
              <div className="flex items-start gap-1.5 pt-0.5 pl-1.5">
                <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-amber-300 bg-amber-50">
                  <div
                    className="w-full h-full flex items-center justify-center font-bold text-[9px] text-red-950"
                    style={{ background: "linear-gradient(135deg, var(--gold), var(--gold-light))" }}
                  >
                    Y
                  </div>
                </div>
                <div className="flex-1 bg-[#F0F2F5] p-2 rounded-xl rounded-tl-xs space-y-0.5">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[11px] font-bold text-stone-900">
                      Bếp Yến Ocean
                    </span>
                    <span className="text-[8px] font-bold bg-amber-200 text-amber-900 px-1 rounded">
                      Tác giả
                    </span>
                    <span className="text-[8px] text-blue-600">✓</span>
                  </div>
                  <p className="text-[11px] text-stone-800 leading-relaxed">
                    {reviews.comment1.replyText}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COMMENT 2: Người thứ 2 riêng biệt */}
        <div className="flex items-start gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-stone-200 bg-blue-100 shadow-2xs">
            <Image
              src={reviews.comment2.avatar}
              alt={reviews.comment2.name}
              fill
              sizes="32px"
              className="object-cover"
              onError={(e) => {
                (e.target as any).src = "/images/avatars/user-2.jpg";
              }}
            />
          </div>

          <div className="flex-1 space-y-1">
            <div className="bg-[#F0F2F5] p-2 sm:p-2.5 rounded-xl rounded-tl-xs space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-stone-900 hover:underline cursor-pointer">
                  {reviews.comment2.name}
                </span>
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded">
                  {reviews.comment2.badge}
                </span>
                <span className="text-[10px] text-stone-500 font-medium">
                  · {reviews.comment2.location}
                </span>
              </div>

              <p className="text-[11px] sm:text-xs text-stone-800 leading-snug">
                {reviews.comment2.text}
              </p>
            </div>

            {/* Hàng tương tác */}
            <div className="flex items-center gap-2.5 text-[10px] text-stone-500 pl-1.5">
              <span className="font-bold text-stone-700 hover:underline cursor-pointer">Thích</span>
              <span>·</span>
              <span className="font-bold text-stone-700 hover:underline cursor-pointer">Phản hồi</span>
              <span>·</span>
              <span>{reviews.comment2.time}</span>
              <span className="ml-auto inline-flex items-center gap-1 bg-white border border-stone-200 shadow-2xs px-1.5 py-0.2 rounded-full text-[9px]">
                <span className="text-blue-500">👍</span>
                <span className="font-bold text-stone-700">{reviews.comment2.likes}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Nút mở rộng xem thêm hoặc COMMENT 3 */}
        {!showAll ? (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="w-full py-1 text-center text-[10px] sm:text-[11px] font-bold text-stone-500 hover:text-stone-800 bg-stone-50 hover:bg-stone-100 rounded-lg transition cursor-pointer border border-stone-200/60"
          >
            Xem thêm 1 bình luận khác ▼
          </button>
        ) : (
          /* COMMENT 3: Người thứ 3 */
          <div className="flex items-start gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-stone-200 bg-amber-100 shadow-2xs">
              <Image
                src={reviews.comment3.avatar}
                alt={reviews.comment3.name}
                fill
                sizes="32px"
                className="object-cover"
                onError={(e) => {
                  (e.target as any).src = "/images/avatars/user-3.jpg";
                }}
              />
            </div>

            <div className="flex-1 space-y-1">
              <div className="bg-[#F0F2F5] p-2 sm:p-2.5 rounded-xl rounded-tl-xs space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-stone-900 hover:underline cursor-pointer">
                    {reviews.comment3.name}
                  </span>
                  <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1 py-0.2 rounded">
                    {reviews.comment3.badge}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium">
                    · {reviews.comment3.location}
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-stone-800 leading-snug">
                  {reviews.comment3.text}
                </p>
              </div>

              {/* Hàng tương tác */}
              <div className="flex items-center gap-2.5 text-[10px] text-stone-500 pl-1.5">
                <span className="font-bold text-stone-700 hover:underline cursor-pointer">Thích</span>
                <span>·</span>
                <span className="font-bold text-stone-700 hover:underline cursor-pointer">Phản hồi</span>
                <span>·</span>
                <span>{reviews.comment3.time}</span>
                <span className="ml-auto inline-flex items-center gap-1 bg-white border border-stone-200 shadow-2xs px-1.5 py-0.2 rounded-full text-[9px]">
                  <span className="text-blue-500">👍</span>
                  <span className="text-red-500">❤️</span>
                  <span className="font-bold text-stone-700">{reviews.comment3.likes}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER KHUNG BÌNH LUẬN FACEBOOK MOCK ─────────────────── */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] sm:text-[11px] text-stone-500">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>128 cư dân đang online</span>
        </span>
        <span className="text-blue-600 font-bold hover:underline cursor-pointer">
          Xem tất cả 1.250+ đánh giá ➔
        </span>
      </div>
    </div>
  );
}
