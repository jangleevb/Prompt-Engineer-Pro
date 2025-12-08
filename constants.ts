import { Template } from './types';

export const TEMPLATES: Template[] = [
  // --- MMO & ADS ---
  {
    id: "mmo_roi",
    source: "system",
    category: "MMO & Ads",
    iconName: "chart-line",
    title: "Tối Ưu Dòng Tiền & ROI",
    desc: "Phân tích file CSV doanh thu để tìm kênh lãi/lỗ và đưa ra quyết định scale.",
    tags: ["Analytical Prompting", "Data Science", "CFO Persona"],
    tactic: "Sử dụng kỹ thuật **Persona Prompting** (đóng vai CFO khắt khe) kết hợp với **Analytical Prompting**. Nó buộc AI không chỉ đọc số liệu mà còn phải tìm ra 'Insights' (góc nhìn) ẩn giấu và đưa ra lời khuyên hành động (Actionable Advice) thay vì chỉ báo cáo chung chung.",
    inputs: [
      { id: "data_desc", label: "Mô tả dữ liệu bạn có", placeholder: "File CSV gồm các cột: Source, Cost, Revenue, Clicks...", type: "textarea" },
      { id: "user_behavior_data", label: "Dữ liệu hành vi người dùng (nếu có)", placeholder: "Conversion Rate, Time on Site, Bounce Rate...", type: "textarea" },
      { id: "goal", label: "Mục tiêu cụ thể", placeholder: "Tìm ra kênh đang lỗ để cắt giảm, hoặc tìm kênh để scale gấp đôi.", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là một Giám đốc Tài chính (CFO) khó tính và chuyên gia về Performance Marketing.
**Task:** Phân tích dữ liệu kinh doanh MMO tháng này để tối ưu hóa dòng tiền.

**Input Data:**
${data.data_desc || '[Dữ liệu đầu vào]'}
${data.user_behavior_data ? `\n**User Behavior Data:**\n${data.user_behavior_data}` : ''}

**Yêu cầu phân tích:**
1. **Phân tích ROI thực tế:** Tính toán kỹ lưỡng Lợi nhuận ròng (Net Profit) sau khi trừ đi mọi chi phí ẩn.
2. **Quy luật 80/20:** Chỉ ra 20% nguồn traffic nào đang mang lại 80% lợi nhuận.
3. **Cảnh báo rủi ro:** Kênh nào đang có dấu hiệu bão hòa (Saturation) hoặc lỗ vốn (Negative ROI)?
${data.user_behavior_data ? `4. **Phân tích User Engagement:** Đánh giá các chỉ số hành vi (Conversion Rate, Time on Site) để xác định chất lượng traffic và điểm gãy trong phễu bán hàng.` : ''}
${data.user_behavior_data ? '5' : '4'}. **Chiến thuật hành động:** ${data.goal || '[Mục tiêu]'}

**Output Format:** Trình bày dưới dạng báo cáo chuyên nghiệp, ngắn gọn. Vẽ biểu đồ ASCII nếu cần thiết để minh họa xu hướng.
`
  },
  {
    id: "mmo_product_desc",
    source: "system",
    category: "MMO & Ads",
    iconName: "shopping-bag",
    title: "Mô Tả Sản Phẩm Thôi Miên",
    desc: "Viết mô tả sản phẩm E-commerce (Shopee, Shopify) đánh trúng tử huyệt cảm xúc.",
    tags: ["Copywriting", "E-commerce", "Sales"],
    tactic: "Sử dụng kỹ thuật **Benefit-Driven Copy** (Lợi ích trên hết). Thay vì liệt kê thông số kỹ thuật khô khan (Features), AI sẽ chuyển hóa chúng thành lợi ích sát sườn (Benefits) và vẽ ra viễn cảnh tươi đẹp khi khách hàng sở hữu sản phẩm (Future Pacing).",
    inputs: [
      { id: "product_name", label: "Tên sản phẩm", placeholder: "Máy mát xa cổ vai gáy Xiaomi", type: "text" },
      { id: "features", label: "Tính năng kỹ thuật", placeholder: "Pin 2000mAh, nhiệt độ 42 độ C, 3 chế độ rung...", type: "textarea" },
      { id: "target_customer", label: "Khách hàng mục tiêu", placeholder: "Dân văn phòng ngồi nhiều, hay đau mỏi", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là chuyên gia Copywriting hàng đầu thế giới theo phong cách Dan Kennedy.
**Task:** Viết mô tả sản phẩm cho trang bán hàng E-commerce để tối đa hóa tỷ lệ chuyển đổi.

**Sản phẩm:** ${data.product_name || '[Tên sản phẩm]'}
**Đối tượng:** ${data.target_customer || '[Khách hàng]'}
**Thông số kỹ thuật (Input):** ${data.features || '[Tính năng]'}

**Yêu cầu viết (Cấu trúc thôi miên):**
1. **Headline:** Một câu tiêu đề chứa lợi ích lớn nhất (Big Promise).
2. **The Problem:** Mô tả nỗi đau của khách hàng một cách đồng cảm (Ví dụ: Cảm giác đau nhói sau 8 tiếng ngồi máy tính...).
3. **The Solution (Benefit Stacking):** Chuyển đổi từng tính năng kỹ thuật thành lợi ích cảm xúc.
   - *Ví dụ:* Đừng nói "Pin 2000mAh", hãy nói "Dùng cả tuần chỉ với 1 lần sạc, không lo hết pin giữa chừng".
4. **Social Proof (Giả lập):** Một đoạn trích dẫn review ngắn gọn (Testimonial).
5. **Call To Action:** Kêu gọi mua hàng khan hiếm.

**Tone:** Thấu hiểu, chuyên gia, thúc giục.
`
  },
  {
    id: "mmo_seeding",
    source: "system",
    category: "MMO & Ads",
    iconName: "users",
    title: "Kịch Bản Seeding & Forum Marketing",
    desc: "Tạo các cuộc thảo luận seeding tự nhiên trên hội nhóm, diễn đàn để điều hướng dư luận.",
    tags: ["Seeding", "Social Listening", "Organic Traffic"],
    tactic: "Sử dụng kỹ thuật **Multi-Persona Simulation** (Giả lập đa nhân cách). Bạn không muốn seeding trông giống bot. Prompt này yêu cầu AI tạo ra 3-4 nhân vật (Người hỏi ngây ngô, Chuyên gia khó tính, Người dùng đã trải nghiệm...) để tạo ra một cuộc tranh luận sôi nổi nhưng cuối cùng vẫn hướng về sản phẩm của bạn một cách khéo léo.",
    inputs: [
      { id: "topic", label: "Chủ đề thảo luận", placeholder: "Hỏi về khóa học tiếng Anh nào tốt cho người mất gốc?", type: "text" },
      { id: "product", label: "Sản phẩm cần Seeding (Subtle)", placeholder: "App Elsa Speak", type: "text" },
      { id: "platform", label: "Nền tảng (Group/Forum)", placeholder: "Voz, Group Tinh Tế, Group Review...", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là chuyên gia Social Seeding và Community Manager.
**Task:** Viết một kịch bản thảo luận (Thread) tự nhiên trên ${data.platform || 'Mạng xã hội'} để seeding cho sản phẩm: "${data.product}".

**Chủ đề:** ${data.topic || '[Topic]'}

**Yêu cầu:** Hãy tạo ra 4 bình luận (Comments) từ 4 người dùng khác nhau:
1.  **User A (The Asker):** Đặt câu hỏi hoặc nêu vấn đề một cách tự nhiên, hơi ngây ngô.
2.  **User B (The Skeptic):** Đưa ra ý kiến trái chiều hoặc nghi ngờ các giải pháp thông thường (Tạo tính chân thực).
3.  **User C (The Supporter):** Chia sẻ trải nghiệm cá nhân tích cực về "${data.product}" nhưng không dẫn link mua hàng ngay (Soft sell).
4.  **User D (The Expert):** Phân tích khách quan và xác nhận ý kiến của User C là đúng.

**Tone:** Sử dụng ngôn ngữ mạng (slang, teencode nhẹ) phù hợp với văn hóa của ${data.platform}. Tránh văn mẫu quảng cáo.
`
  },
  {
    id: "mmo_google_Ads",
    source: "system",
    category: "MMO & Ads",
    iconName: "target",
    title: "Google Ads SKAG Generator",
    desc: "Tạo cấu trúc nhóm quảng cáo Single Keyword (SKAG) để tăng điểm chất lượng.",
    tags: ["SEM", "Google Ads", "PPC"],
    tactic: "Sử dụng **Constraint Prompting** (Ràng buộc ký tự). Google Ads rất khắt khe về số lượng ký tự (Headline 30, Desc 90). Prompt này ép AI phải tuân thủ nghiêm ngặt giới hạn đó, đồng thời chèn từ khóa vào Headline 1 để tối ưu Relevance Score.",
    inputs: [
      { id: "keyword", label: "Từ khóa chính (Keyword)", placeholder: "dịch vụ chuyển nhà trọn gói", type: "text" },
      { id: "usp", label: "Điểm mạnh (USP)", placeholder: "Giá rẻ, cam kết không mất đồ, phục vụ 24/7", type: "text" },
      { id: "landing_page", label: "Nội dung Landing Page (Tóm tắt)", placeholder: "Giảm giá 20% cho sinh viên", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là Chuyên gia Google Ads (SEM Specialist).
**Task:** Viết mẫu quảng cáo tìm kiếm (Search Ads) cho từ khóa: "${data.keyword || '[Keyword]'}".
**USP:** ${data.usp || '[USP]'}

**Yêu cầu nghiêm ngặt (Character Limits):**
- Headline: Tối đa 30 ký tự.
- Description: Tối đa 90 ký tự.

**Output:** Hãy tạo 3 biến thể (Variations) theo cấu trúc sau:
1. **Variation 1 (Focus Relevance):** Headline 1 phải chứa chính xác từ khóa "${data.keyword}".
2. **Variation 2 (Focus Benefit):** Tập trung vào USP và khuyến mãi.
3. **Variation 3 (CTR Optimized):** Dùng câu hỏi hoặc CTA mạnh để kích thích click.

Hãy trình bày dưới dạng bảng để tôi dễ copy.
`
  },
  {
    id: "mmo_affiliate_review",
    source: "system",
    category: "MMO & Ads",
    iconName: "file-text",
    title: "Affiliate Product Review",
    desc: "Viết bài review sản phẩm Affiliate khách quan, không bị 'sale' quá đà.",
    tags: ["Affiliate Marketing", "Content", "Review"],
    tactic: "Sử dụng **Balanced Perspective Strategy** (Góc nhìn cân bằng). Người đọc rất ghét bài review chỉ toàn khen. Prompt này yêu cầu AI phải tìm ra (hoặc giả định) cả nhược điểm (Cons) để bài viết trông chân thực (Authentic), từ đó tăng niềm tin và tỷ lệ click link Affiliate.",
    inputs: [
      { id: "product", label: "Sản phẩm Review", placeholder: "Hosting Namecheap", type: "text" },
      { id: "pros", label: "Ưu điểm (Pros)", placeholder: "Giá rẻ, support nhanh, uptime tốt", type: "text" },
      { id: "cons", label: "Nhược điểm (Cons - Bắt buộc)", placeholder: "Server đặt xa VN nên hơi chậm, giao diện cũ", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là một Blogger công nghệ uy tín, người chuyên review sản phẩm một cách trung thực.
**Task:** Viết bài đánh giá (Review) sản phẩm: "${data.product || '[Sản phẩm]'}".

**Thông tin:**
- **Pros:** ${data.pros || '[Ưu điểm]'}
- **Cons:** ${data.cons || '[Nhược điểm]'}

**Cấu trúc bài viết (Trust-Building Layout):**
1. **Introduction:** Đặt vấn đề và nói rõ bài này dành cho ai? (Ví dụ: "Nếu bạn là newbie, đây là hosting dành cho bạn...").
2. **Key Features (Deep Dive):** Phân tích 3 tính năng quan trọng nhất.
3. **The Ugly Truth (Quan trọng):** Nói thẳng về các nhược điểm (Cons). Đừng giấu giếm. Điều này giúp lọc khách hàng và tăng uy tín.
4. **Comparison:** So sánh nhanh với 1 đối thủ cùng phân khúc.
5. **Final Verdict (Kết luận):** Ai NÊN mua và ai KHÔNG NÊN mua?

**Tone:** Khách quan, trải nghiệm thực tế (dùng từ "tôi thấy", "theo kinh nghiệm của tôi").
`
  },
  {
    id: "mmo_fb_Ads",
    source: "system",
    category: "MMO & Ads",
    iconName: "target",
    title: "Facebook Ads Copywriter",
    desc: "Viết content quảng cáo Facebook chuyển đổi cao theo framework AIDA/PAS.",
    tags: ["Copywriting", "Direct Response", "AIDA Framework"],
    tactic: "Sử dụng **Framework Prompting** (AIDA: Attention - Interest - Desire - Action). AI sẽ được hướng dẫn để viết từng phần riêng biệt, tập trung vào 'Hook' (3 dòng đầu) để dừng việc lướt Newsfeed, và 'Call to Action' rõ ràng.",
    inputs: [
      { id: "product", label: "Sản phẩm/Dịch vụ", placeholder: "Khóa học tiếng Anh online cho người đi làm", type: "text" },
      { id: "pain_point", label: "Nỗi đau khách hàng", placeholder: "Mất gốc, không có thời gian, sợ giao tiếp", type: "text" },
      { id: "offer", label: "Ưu đãi/Offer", placeholder: "Giảm 50% hôm nay, Tặng Ebook", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là một Copywriter đẳng cấp thế giới chuyên viết quảng cáo Direct Response trên Facebook.
**Task:** Viết 3 phiên bản nội dung quảng cáo cho sản phẩm: "${data.product || '[Sản phẩm]'}".

**Thông tin đầu vào:**
- **Nỗi đau khách hàng (Pain Point):** ${data.pain_point || '[Nỗi đau]'}
- **Offer (Lời chào hàng):** ${data.offer || '[Ưu đãi]'}

**Yêu cầu cấu trúc (AIDA Framework):**
1. **Attention (Headline & 3 dòng đầu):** Phải cực sốc, gây tò mò hoặc đánh trúng nỗi đau ngay lập tức.
2. **Interest:** Kể một câu chuyện ngắn hoặc đưa ra số liệu đáng báo động.
3. **Desire:** Show lợi ích (Benefit) chứ không phải tính năng (Feature). Chuyển hóa nỗi đau thành sự sung sướng.
4. **Action:** Kêu gọi hành động khan hiếm (Scarcity).

**Output:** Viết 3 options với 3 phong cách khác nhau: (1) Kể chuyện (Storytelling), (2) Đánh vào nỗi sợ (Fear mongering), (3) Hài hước/Thân thiện. Dùng icon hợp lý.
`
  },
  {
    id: "mmo_content_reels",
    source: "system",
    category: "MMO & Ads",
    iconName: "video",
    title: "Nhà Máy Sản Xuất Kịch Bản Reels",
    desc: "Tạo hàng loạt kịch bản video ngắn viral từ thông tin sản phẩm.",
    tags: ["Creative Prompting", "Structured Output", "Viral Psychology"],
    tactic: "Sử dụng **Structured Prompting** (Yêu cầu đầu ra dạng bảng/JSON). Kỹ thuật này giúp chuẩn hóa quy trình sản xuất. Thay vì nhận một đoạn văn dài lê thê, bạn nhận được một bảng phân cảnh (Storyboard) chi tiết từng giây, dễ dàng đưa cho Editor hoặc dùng Python để dựng video tự động.",
    inputs: [
      { id: "product_name", label: "Tên sản phẩm/Dịch vụ", placeholder: "Nồi chiên không dầu Lock&Lock 5L", type: "text" },
      { id: "target_audience", label: "Khách hàng mục tiêu", placeholder: "Mẹ bỉm sữa, sinh viên ở trọ...", type: "text" },
      { id: "platform", label: "Nền tảng", placeholder: "Facebook Reels / TikTok", type: "text" },
      { id: "viral_element", label: "Viral Hook / Trending Audio (Optional)", placeholder: "Nhạc nền trending, câu mở đầu gây sốc...", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là Đạo diễn Video ngắn (Short-form Video Director) chuyên tạo các nội dung viral triệu view trên ${data.platform || '[Nền tảng]'}.
**Task:** Viết kịch bản video bán hàng cho sản phẩm: "${data.product_name || '[Tên sản phẩm]'}".
**Target Audience:** ${data.target_audience || '[Khách hàng]'}.

${data.viral_element ? `**Viral Constraint:** Bắt buộc sử dụng yếu tố viral sau trong 3 giây đầu hoặc làm nền chủ đạo: "${data.viral_element}"` : ''}

**Yêu cầu cấu trúc (Table Format):**
Hãy tạo một bảng gồm 4 cột:
1. **Time (Giây):** Chia nhỏ video thành các đoạn (0-3s, 3-10s...).
2. **Visual (Hình ảnh):** Mô tả chi tiết cảnh quay, góc máy, hoặc gợi ý hình ảnh để tìm kiếm.
3. **Audio/Script (Lời thoại):** Lời thoại cực cuốn, đánh vào nỗi đau (Pain point) và sự sung sướng (Pleasure) của khách hàng.
4. **Text Overlay:** Chữ hiển thị trên màn hình để giữ chân người xem.

**Yêu cầu tâm lý:** 3 giây đầu phải có "Hook" (Móc câu) cực mạnh để ngăn người xem lướt qua. Kết thúc bằng Call-to-Action (Kêu gọi hành động) dứt khoát.
`
  },
  {
    id: "content_youtube_script",
    source: "system",
    category: "MMO & Ads",
    iconName: "youtube",
    title: "Kịch Bản YouTube Long-form",
    desc: "Viết kịch bản video dài (10p+) tối ưu Retention rate.",
    tags: ["Long-form Content", "Storytelling", "Audience Retention"],
    tactic: "Áp dụng cấu trúc **H.I.C.C** (Hook - Intro - Content - Conclusion) kết hợp với các điểm 'Re-hook' (Móc câu lại) mỗi 2 phút để giữ chân người xem. Prompt này tập trung vào dòng chảy cảm xúc của người xem.",
    inputs: [
      { id: "topic", label: "Chủ đề video", placeholder: "Cách tự học lập trình trong 6 tháng", type: "text" },
      { id: "angle", label: "Góc nhìn độc đáo", placeholder: "Không cần bằng đại học, chỉ dùng tài liệu miễn phí", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là YouTuber chuyên nghiệp với nút vàng, nổi tiếng với khả năng kể chuyện lôi cuốn.
**Task:** Viết kịch bản chi tiết cho video dài 10 phút về chủ đề: "${data.topic || '[Chủ đề]'}" với góc nhìn "${data.angle || '[Góc nhìn]'}".

**Cấu trúc kịch bản (Yêu cầu nghiêm ngặt):**
1. **The Hook (0:00 - 0:45):** Phải cực kỳ ấn tượng, hứa hẹn một kết quả cụ thể. Không chào hỏi rườm rà.
2. **The Intro (0:45 - 1:30):** Chứng minh uy tín (Tại sao nên nghe tôi?) và tóm tắt nhanh nội dung.
3. **The Meat (Nội dung chính):** Chia làm 3-5 luận điểm chính. Mỗi luận điểm phải có ví dụ thực tế hoặc câu chuyện minh họa. *Quan trọng:* Chèn các "Pattern Interrupt" (Ngắt nhịp) mỗi 2-3 phút để người xem không chán.
4. **The Conclusion:** Tóm tắt bài học và Call-to-Action (Đăng ký kênh) một cách tự nhiên.

**Output:** Viết kịch bản chi tiết, bao gồm cả gợi ý về hình ảnh (B-Roll) và cảm xúc giọng đọc (Tone of voice).
`
  },

  // --- CREATIVE & MEDIA ---
  {
    id: "media_img_to_prompt",
    source: "system",
    category: "Creative & Media",
    iconName: "image",
    title: "Image to Text Prompt (Reverse Engineering)",
    desc: "Phân tích hình ảnh và tạo ra text prompt để vẽ lại hình đó (Midjourney/DALL-E).",
    tags: ["Reverse Engineering", "Midjourney", "Image Analysis"],
    tactic: "Sử dụng kỹ thuật **Visual Decoding**. AI sẽ 'nhìn' bức ảnh, phân tách các yếu tố nghệ thuật (ánh sáng, bố cục, phong cách) và chuyển đổi ngược lại thành ngôn ngữ prompt chuyên ngành.",
    inputs: [
      { id: "ref_image", label: "Upload ảnh mẫu (Reference)", placeholder: "Tải ảnh cần lấy prompt...", type: "image" },
      { id: "target_model", label: "Model mục tiêu", placeholder: "Midjourney v6 / DALL-E 3 / Stable Diffusion", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là chuyên gia phân tích hình ảnh và kỹ sư Prompt (Prompt Engineer).
**Task:** Hãy nhìn vào bức ảnh tôi vừa upload và viết lại Prompt mô tả nó.

**Target Model:** ${data.target_model || 'Midjourney v6'}

**Yêu cầu phân tích:**
Hãy mổ xẻ bức ảnh dựa trên các yếu tố:
1. **Subject:** Chủ thể chính là gì?
2. **Art Style:** Phong cách nghệ thuật (Photography, 3D Render, Oil Painting...)?
3. **Lighting & Color:** Ánh sáng và bảng màu chủ đạo.
4. **Camera/Angle:** Góc máy, tiêu cự (nếu là ảnh chụp).
5. **Vibe/Mood:** Cảm xúc của bức ảnh.

**Output:**
Dựa trên phân tích trên, hãy viết **3 Prompts** (bằng tiếng Anh) để tôi có thể dùng nó vẽ lại bức ảnh này.
- **Prompt 1 (Accurate):** Mô tả sát thực tế nhất.
- **Prompt 2 (Creative):** Thêm thắt các tính từ nghệ thuật (Artistic modifiers).
- **Prompt 3 (Minimalist):** Ngắn gọn, tập trung vào từ khóa chính.

*Định dạng:* Hãy để các prompt trong khối code block để dễ copy.
`
  },
  {
    id: "media_moodboard",
    source: "system",
    category: "Creative & Media",
    iconName: "palette",
    title: "Brand Identity & Moodboard",
    desc: "Xây dựng định hướng hình ảnh (Visual Identity), bảng màu và moodboard cho thương hiệu.",
    tags: ["Branding", "Design", "Color Palette"],
    tactic: "Sử dụng kỹ thuật **Visual Synesthesia** (Cảm giác kèm). AI sẽ chuyển đổi các giá trị trừu tượng của thương hiệu (Sứ mệnh, Tính cách) thành các yếu tố thị giác cụ thể (Màu sắc, Font chữ, Họa tiết). Kết quả bao gồm mã màu Hex và gợi ý hình ảnh để designer dễ dàng thực hiện.",
    inputs: [
      { id: "brand_name", label: "Tên thương hiệu", placeholder: "Lumos Candles", type: "text" },
      { id: "values", label: "Giá trị cốt lõi / Tính cách", placeholder: "Thư giãn, sang trọng, tối giản, thân thiện môi trường", type: "textarea" },
      { id: "target_audience", label: "Khách hàng mục tiêu", placeholder: "Phụ nữ 25-40 tuổi, thu nhập khá, yêu yoga", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là Creative Director và Brand Strategist.
**Task:** Xây dựng định hướng hình ảnh (Visual Identity) cho thương hiệu: "${data.brand_name}".

**Context:**
- **Values:** ${data.values || '[Giá trị]'}
- **Audience:** ${data.target_audience || '[Khách hàng]'}

**Yêu cầu Output:**
1.  **Brand Concept:** Mô tả ngắn gọn phong cách chủ đạo (Ví dụ: Minimalist Zen, Retro Pop...).
2.  **Color Palette (Bảng màu):** Cung cấp 5 mã màu HEX (1 màu chính, 2 màu phụ, 2 màu nhấn). Giải thích ý nghĩa tâm lý của từng màu.
3.  **Typography (Font chữ):** Đề xuất cặp font (Tiêu đề & Nội dung) phù hợp.
4.  **Imagery & Mood:** Mô tả loại hình ảnh nên sử dụng (Ánh sáng, filter, bố cục).

**Bonus Prompt:** Viết 1 prompt để tạo ảnh Moodboard tổng thể bằng AI (Midjourney).
`
  },
  {
    id: "media_content_audit",
    source: "system",
    category: "Creative & Media",
    iconName: "shield",
    title: "Content Auditor (Text & Image)",
    desc: "Phân tích nội dung đa phương tiện (ảnh/bài viết) để tối ưu hiệu quả Marketing.",
    tags: ["Multimodal Analysis", "Content Audit", "CRO"],
    tactic: "Sử dụng sức mạnh **Multimodal** của Gemini. Template này cho phép bạn upload hình ảnh (Landing page, Banner, Social Post) hoặc nhập Text. AI sẽ đóng vai Senior Editor để 'khám bệnh' nội dung: Từ bố cục thị giác, thông điệp (Copywriting) đến sự phù hợp với đối tượng mục tiêu.",
    inputs: [
      { id: "audit_image", label: "Upload Ảnh (Banner/Post/Web)", placeholder: "Tải ảnh lên...", type: "image" },
      { id: "audit_text", label: "Nội dung Text (hoặc Context)", placeholder: "Paste bài viết hoặc mô tả mục tiêu của bức ảnh...", type: "textarea" },
      { id: "target_audience", label: "Khách hàng mục tiêu", placeholder: "Gen Z, Nhân viên văn phòng...", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là Senior Content Marketing Manager & UX Auditor.
**Task:** Phân tích và đánh giá nội dung được cung cấp (Hình ảnh hoặc Văn bản) để tối ưu hóa tỷ lệ chuyển đổi (CRO).

**Context:**
- **Khách hàng mục tiêu:** ${data.target_audience || 'Đại chúng'}
${data.audit_text ? `- **Nội dung bổ sung/Context:** ${data.audit_text}` : ''}

**Yêu cầu Audit (Phân tích sâu):**

1. **Visual Hierarchy (Nếu có ảnh):**
   - Điểm nhìn đầu tiên (Focal point) nằm ở đâu? Có đúng vào sản phẩm/thông điệp chính không?
   - Màu sắc và font chữ có tạo cảm giác tin cậy/hấp dẫn không?

2. **Copywriting & Message:**
   - Thông điệp có rõ ràng (Clear) và súc tích (Concise) không?
   - "Hook" có đủ mạnh để dừng ngón tay người dùng không?

3. **Psychological Triggers:**
   - Nội dung này đang đánh vào cảm xúc nào? (Sợ hãi, Tham lam, Tò mò...)
   - Call-to-Action (CTA) có đủ thôi thúc không?

**Kết luận:** Đưa ra 3 điểm cần sửa ngay lập tức (Quick Wins) để tăng hiệu quả của nội dung này.
`
  },
  {
    id: "media_img_caption",
    source: "system",
    category: "Creative & Media",
    iconName: "image",
    title: "AI Image Caption Generator",
    desc: "Tự động tạo caption từ ảnh upload hoặc mô tả văn bản.",
    tags: ["Social Media", "Multimodal", "Viral"],
    tactic: "Sử dụng **Multimodal Vision**. Bạn có thể upload trực tiếp bức ảnh, AI sẽ 'nhìn' và phân tích chi tiết hình ảnh để viết caption sát thực tế nhất, thay vì chỉ dựa vào mô tả văn bản. Nó cũng tự động chọn Tone phù hợp với từng nền tảng.",
    inputs: [
      { id: "image_file", label: "Upload Ảnh (Optional)", placeholder: "Tải ảnh lên để AI phân tích...", type: "image" },
      { id: "img_desc", label: "Mô tả thêm (Context)", placeholder: "Ví dụ: Đây là buổi khai trương cửa hàng...", type: "textarea" },
      { id: "platform", label: "Nền tảng đăng", placeholder: "Instagram / LinkedIn / Facebook", type: "text" },
      { id: "tone", label: "Cảm xúc (Mood)", placeholder: "Hài hước, Deep, Truyền cảm hứng...", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là Social Media Manager chuyên nghiệp.
**Task:** Viết caption cho bài đăng trên ${data.platform || 'Mạng xã hội'}.

**Thông tin đầu vào:**
${data.image_file ? '- **Hình ảnh:** (Đã đính kèm). Hãy phân tích kỹ chi tiết trong ảnh để viết.' : ''}
${data.img_desc ? `- **Mô tả/Bối cảnh:** ${data.img_desc}` : ''}

**Tone & Mood:** ${data.tone || 'Tự nhiên, thu hút'}.

**Yêu cầu Output:**
Hãy viết 3 lựa chọn caption khác nhau:
1. **Option 1 (Ngắn gọn - Punchy):** Dành cho người lướt nhanh, 1 câu duy nhất cực chất.
2. **Option 2 (Storytelling - Engage):** Kể một câu chuyện nhỏ hoặc đặt câu hỏi dựa trên chi tiết trong ảnh để tăng tương tác.
3. **Option 3 (Inspirational/Promotional):** Chia sẻ giá trị hoặc bán hàng khéo léo.

**Bonus:** Hãy viết một đoạn **Alt Text** chuẩn SEO mô tả bức ảnh này cho công cụ tìm kiếm.

**Lưu ý:** 
- Sử dụng emoji phù hợp với cảm xúc.
- Tạo một block 15 Hashtag tối ưu Reach ở cuối.
`
  },
  {
    id: "media_video_sub",
    source: "system",
    category: "Creative & Media",
    iconName: "captions",
    title: "Video Subtitle Reformatter",
    desc: "Tạo phụ đề video ngắn (TikTok/Reels) từ văn bản thô, hỗ trợ phân tích hình ảnh frame video.",
    tags: ["Video Editing", "Reels/TikTok", "Retention"],
    tactic: "Chiến thuật **Chunking & Highlighting**. Để giữ chân người xem video ngắn, phụ đề cần ngắt nhịp nhanh (3-5 từ/dòng) và nhấn mạnh từ khóa. Prompt này sử dụng thêm **Visual Analysis** để đề xuất phong cách sub phù hợp với màu sắc video.",
    inputs: [
      { id: "raw_text", label: "Nội dung lời thoại (Transcript)", placeholder: "Xin chào các bạn hôm nay mình sẽ hướng dẫn...", type: "textarea" },
      { id: "video_frame", label: "Ảnh chụp màn hình video (Context)", placeholder: "Upload một frame tiêu biểu để AI chọn font/màu sub...", type: "image" },
      { id: "style", label: "Phong cách hiển thị", placeholder: "Alex Hormozi style (Nhanh, in đậm keyword)", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là Video Editor chuyên làm sub cho các kênh TikTok/Reels triệu view.
**Task:** Format lại đoạn văn bản sau thành dạng phụ đề (Subtitles) tối ưu cho video ngắn.

**Input Text:**
"${data.raw_text || '[Transcript]'}"

${data.video_frame ? `**Visual Context from Image:** (Đã đính kèm ảnh frame). Hãy nhìn phong cách video (Gaming, Vlog, Edu) để chọn style sub phù hợp.` : ''}

**Phong cách:** ${data.style || 'Nhanh, gãy gọn'}.

**Quy tắc Format (Bắt buộc):**
1. **Ngắt dòng (Line Break):** Mỗi dòng sub không quá 5 từ. Ngắt đúng nhịp nói (Natural pause).
2. **Highlight:** Đặt các từ khóa quan trọng (Keywords) trong dấu **đậm** để Editor biết cần đổi màu hoặc làm to lên.
3. **Emoji:** Chèn emoji minh họa ở cuối các câu quan trọng hoặc thể hiện cảm xúc.
4. **Visual Suggestion (Nếu có ảnh):** Đề xuất Font chữ và Màu sắc text phù hợp với background của ảnh frame đã upload (để không bị chìm).

**Output Example:**
Xin chào **các bạn** 👋
Hôm nay mình sẽ **hướng dẫn**
Cách kiếm **1000$** đầu tiên 💰
`
  },
  {
    id: "media_thumbnail",
    source: "system",
    category: "Creative & Media",
    iconName: "palette",
    title: "YouTube Thumbnail Consultant",
    desc: "Audit thumbnail hiện tại hoặc đề xuất ý tưởng mới tối ưu CTR.",
    tags: ["YouTube Strategy", "Design", "Psychology"],
    tactic: "Sử dụng **Visual Analysis**. Nếu bạn upload ảnh thumbnail nháp, AI sẽ đóng vai chuyên gia thiết kế để 'chấm điểm' và chỉ ra lỗi sai. Nếu không, AI sẽ dùng **Visual Descriptive Prompting** để mô tả ý tưởng thumbnail mới dựa trên tiêu đề.",
    inputs: [
      { id: "current_thumb", label: "Upload Thumbnail nháp (Optional)", placeholder: "Tải ảnh thumbnail hiện tại lên để audit...", type: "image" },
      { id: "video_title", label: "Tiêu đề Video", placeholder: "Cách kiếm 1000$ đầu tiên trên Upwork", type: "text" },
      { id: "target_audience", label: "Đối tượng khán giả", placeholder: "Sinh viên, Freelancer mới bắt đầu", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là YouTube Strategist và Graphic Designer hàng đầu.
${data.current_thumb 
  ? `**Mode:** AUDIT & IMPROVE (Phân tích ảnh thumbnail được cung cấp)` 
  : `**Mode:** IDEATION (Đề xuất ý tưởng mới)`
}

**Thông tin Video:**
- **Title:** "${data.video_title || '[Tiêu đề]'}"
- **Audience:** ${data.target_audience || '[Khán giả]'}

${data.current_thumb ? `
**Yêu cầu Audit (Dựa trên ảnh đã upload):**
1. **First Impression:** Thumbnail này có gây chú ý trong 0.5s đầu tiên không? Điểm nhìn (Focal point) đang ở đâu?
2. **Text Readability:** Văn bản trên hình có dễ đọc trên mobile không? Có quá nhiều chữ không?
3. **Color & Contrast:** Độ tương phản có đủ tốt để nổi bật trên nền trắng/đen của YouTube không?
4. **Emotional Impact:** Biểu cảm khuôn mặt (nếu có) có đủ kích thích sự tò mò/sợ hãi/vui vẻ không?
5. **Competition Check:** Nếu đặt cạnh các thumbnail khác trên nền trắng/đen của YouTube, nó có bị chìm không?
6. **Improvement Plan:** Đề xuất 3 thay đổi cụ thể để tăng CTR ngay lập tức.
` : `
**Yêu cầu Đề xuất Ý tưởng (Ideation):**
Hãy đưa ra 3 concept thumbnail khác nhau. Với mỗi ý tưởng, mô tả chi tiết:
1. **Background:** Màu sắc và bối cảnh.
2. **Foreground (Nhân vật/Chủ thể):** Biểu cảm, hành động.
3. **Text Overlay:** Văn bản ngắn gọn (dưới 5 từ).
4. **Psychology:** Tại sao thiết kế này khiến người xem muốn click?
`}
`
  },
  {
    id: "media_infographic",
    source: "system",
    category: "Creative & Media",
    iconName: "layout-template",
    title: "Infographic Prompt Master",
    desc: "Tạo prompt để vẽ Infographic chuyên nghiệp (Timeline, Process, Data...).",
    tags: ["Visual Design", "Midjourney/Dall-E", "Data Visualization"],
    tactic: "Sử dụng **Structural Visual Prompting**. Để AI vẽ được Infographic chứa chữ và số liệu chính xác là rất khó. Chiến thuật ở đây là yêu cầu AI mô tả bố cục (Layout), bảng màu (Palette) và các icon đại diện (Iconography) để tạo ra một hình ảnh nền hoàn hảo, sau đó bạn có thể chèn text thủ công.",
    inputs: [
      { id: "topic", label: "Chủ đề Infographic", placeholder: "Quy trình 5 bước bán hàng online", type: "text" },
      { id: "points", label: "Các điểm dữ liệu chính (Data Points)", placeholder: "Bước 1: Tìm hàng, Bước 2: Marketing, Bước 3: Sale...", type: "textarea" },
      { id: "style", label: "Phong cách thiết kế", placeholder: "Flat Design, 3D Isometric, Hand-drawn, Corporate Blue...", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là AI Art Director và Midjourney Prompt Expert.
**Task:** Viết 3 Image Generation Prompts khác nhau để tạo nền cho Infographic chủ đề: "${data.topic || '[Topic]'}"

**Data Context:**
${data.points || '[Data Points]'}

**Style:** ${data.style || 'Modern Flat Design, Vector style'}.

**Yêu cầu Output:**
Hãy viết 3 prompt tiếng Anh (English) tối ưu cho AI vẽ tranh (Midjourney/DALL-E):

1. **Option 1: Timeline/Process Layout**
   - *Prompt Structure:* /imagine prompt: [Subject] infographic template, timeline layout, horizontal flow, distinct steps, [Style keywords], white background, high resolution --ar 3:2

2. **Option 2: Modular Grid Layout**
   - *Prompt Structure:* /imagine prompt: [Subject] data visualization, modular grid system, clean hierarchy, comparison charts, [Style keywords], ui/ux design style --ar 2:3

3. **Option 3: Creative/Abstract Representation**
   - *Prompt Structure:* /imagine prompt: [Subject] represented as [Metaphor], 3D isometric view, floating elements, infographic style, [Style keywords], c4d render, octane render --ar 16:9

*Lưu ý:* Thay thế [Subject] và [Style keywords] bằng nội dung cụ thể từ yêu cầu trên. Giữ nguyên các tham số kỹ thuật.
`
  },

  // --- CODER & TECH ---
  {
    id: "tech_code_analysis",
    source: "system",
    category: "Coder & Tech",
    iconName: "scan-search",
    title: "Phân Tích & Review Code (File/URL)",
    desc: "Upload file code (JS, PY, Dockerfile...) hoặc nhập link để AI phân tích kiến trúc, tìm lỗi và gợi ý tối ưu.",
    tags: ["Code Review", "Architecture", "Security", "File Upload"],
    tactic: "Sử dụng **Contextual Analysis Strategy**. Bằng cách upload trực tiếp nội dung file code, AI có cái nhìn chính xác từng dòng (line-by-line). Prompt yêu cầu AI đóng vai 'Senior Architect' để không chỉ tìm lỗi syntax (Linting) mà còn phân tích về logic nghiệp vụ, bảo mật và khả năng mở rộng (Scalability).",
    inputs: [
      { id: "context", label: "Mô tả / Yêu cầu đặc biệt", placeholder: "Ví dụ: Kiểm tra lỗi memory leak, đánh giá bảo mật, giải thích logic...", type: "textarea" },
      { id: "code_url", label: "Link Repository (Github/DockerHub - Optional)", placeholder: "https://github.com/username/repo...", type: "text" },
      { id: "code_content", label: "File Code / Nội dung Code", placeholder: "Upload file code (.js, .py, .txt, Dockerfile...) hoặc paste code vào đây", type: "file" }
    ],
    generate: (data) => `
**Role:** Bạn là Senior Software Architect và Security Researcher.
**Task:** Phân tích sâu (Deep Dive Analysis) đoạn mã nguồn hoặc repository được cung cấp dưới đây.

**Context / Yêu cầu từ user:**
${data.context || 'Phân tích tổng quan và tìm lỗi tiềm ẩn.'}

**Nguồn dữ liệu:**
${data.code_url ? `- **Repository/URL:** ${data.code_url} (Lưu ý: Nếu không truy cập được link, hãy phân tích dựa trên kiến thức đã học hoặc yêu cầu user cung cấp code cụ thể).` : ''}

**Code Content:**
\`\`\`
${data.code_content || '[User chưa upload file hoặc chưa paste code. Nếu có URL, hãy cố gắng phân tích dựa trên URL]'}
\`\`\`

**Yêu cầu Output (Báo cáo chi tiết):**

1.  **Overview (Tổng quan):**
    - Code này làm gì?
    - Stack công nghệ sử dụng?

2.  **Architecture & Logic (Phân tích luồng):**
    - Giải thích luồng dữ liệu chính.
    - Đánh giá về cấu trúc (Clean Architecture, Modularization...).

3.  **Critical Issues (Lỗi & Bảo mật):**
    - Tìm các lỗ hổng bảo mật (Security Flaws) nếu có.
    - Tìm các vấn đề về hiệu năng (Performance Bottlenecks).
    - Các Bad Practices đang tồn tại.

4.  **Refactoring Suggestions (Gợi ý tối ưu):**
    - Đưa ra 3 đề xuất cụ thể để cải thiện code tốt hơn, gọn hơn và nhanh hơn.
    - (Nếu là Dockerfile) Gợi ý cách giảm kích thước image hoặc tăng bảo mật container.

5.  **Tactic/Pattern Explanation:**
    - Code này đang sử dụng (hoặc nên sử dụng) Design Pattern nào?

Hãy trình bày rõ ràng, sử dụng markdown để highlight code.
`
  },
  {
    id: "tech_coder_tool",
    source: "system",
    category: "Coder & Tech",
    iconName: "code",
    title: "Kiến Trúc Sư Tool Automation",
    desc: "Dựng khung (Scaffold) cho tool MMO: Docker, Python, Selenium.",
    tags: ["Code Generation", "System Architecture", "DevOps"],
    tactic: "Sử dụng **Role-based Prompting** (Kiến trúc sư phần mềm) kết hợp **Chain-of-Thought**. Thay vì chỉ viết code, AI sẽ suy nghĩ về cấu trúc hệ thống (Docker, File structure) trước. Điều này đảm bảo code tạo ra không chỉ chạy được mà còn dễ deploy, dễ bảo trì (Clean Code).",
    inputs: [
      { id: "tool_name", label: "Tên Tool / Chức năng", placeholder: "Tool Auto Reg Nick Facebook", type: "text" },
      { id: "tech_stack", label: "Công nghệ sử dụng", placeholder: "Python, Selenium, Docker, MySQL", type: "text" },
      { id: "logic", label: "Logic hoạt động chính", placeholder: "Đọc file mail.txt -> Mở Chrome -> Điền form -> Lưu cookie", type: "textarea" }
    ],
    generate: (data) => `
**Role:** Bạn là Senior DevOps & Python Automation Engineer.
**Task:** Thiết kế và viết code khung (Skeleton) cho dự án: "${data.tool_name || '[Tên Tool]'}".
**Tech Stack:** ${data.tech_stack || '[Công nghệ]'}.

**Logic nghiệp vụ:**
${data.logic || '[Logic]'}

**Yêu cầu đầu ra (Output):**
Hãy cung cấp trọn bộ cấu trúc dự án bao gồm nội dung các file sau:
1. **File cấu trúc thư mục:** Tree view của project.
2. **Dockerfile:** Tối ưu hóa cho môi trường production (nhẹ, bảo mật).
3. **docker-compose.yml:** Cấu hình service và network.
4. **requirements.txt:** Các thư viện cần thiết.
5. **main.py (hoặc file chính):** Code Python mẫu áp dụng các best practices (OOP, Error Handling, Logging).

**Constraint:** Code phải xử lý được các lỗi thường gặp (như mất mạng, element not found) và có cơ chế thử lại (Retry mechanism).
`
  },
  {
    id: "tech_webapp_tool",
    source: "system",
    category: "Coder & Tech",
    iconName: "globe",
    title: "Kiến Trúc Sư Web App Tool",
    desc: "Dựng khung (Scaffold) cho Web App Tool (React, Vue, Next.js) tích hợp API và giao diện hiện đại.",
    tags: ["Web Development", "React/Next.js", "Frontend Architecture", "UI/UX"],
    tactic: "Sử dụng **Component-Based Architecture Strategy**. AI sẽ tư duy về việc chia nhỏ giao diện thành các Component tái sử dụng (Atomic Design), thiết kế State Management (Context/Redux) và xử lý API layer tách biệt. Kết quả là một bộ khung code sạch, dễ mở rộng.",
    inputs: [
      { id: "app_name", label: "Tên Web Tool", placeholder: "Tool Quản Lý Ads Facebook", type: "text" },
      { id: "tech_stack", label: "Tech Stack mong muốn", placeholder: "React + Vite + Tailwind CSS + Supabase", type: "text" },
      { id: "features", label: "Các chức năng chính", placeholder: "Login, Dashboard hiển thị biểu đồ, Import Excel, Export Report", type: "textarea" },
      { id: "ui_style", label: "Phong cách UI", placeholder: "Modern Dashboard, Dark Mode, Minimalist...", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là Senior Full-stack Web Developer và UI/UX Architect.
**Task:** Thiết kế kiến trúc và viết code khung (Scaffolding) cho Web Application: "${data.app_name || '[Tên App]'}".

**Tech Stack:** ${data.tech_stack || 'React, Vite, Tailwind CSS'}.
**Phong cách UI:** ${data.ui_style || 'Modern & Clean'}.

**Chức năng yêu cầu:**
${data.features || '[Danh sách tính năng]'}

**Yêu cầu Output (Cấu trúc dự án & Code):**

1.  **Project Structure (Tree View):**
    - Vẽ cây thư mục tối ưu cho khả năng mở rộng (Scalability).
    - Phân chia rõ ràng folder: \`components\`, \`hooks\`, \`services\`, \`pages\`, \`utils\`.

2.  **Key Components Implementation:**
    - Viết code cho **Main Layout** (Sidebar/Header).
    - Viết code cho 1 **Feature Component** quan trọng nhất (dựa trên yêu cầu trên).
    - Sử dụng **Tailwind CSS** để style trực tiếp (Utility-first).

3.  **State Management & API Layer:**
    - Đề xuất cách quản lý state (Zustand, Context API, hay Redux Toolkit?).
    - Viết mẫu file \`services/api.js\` (hoặc .ts) sử dụng Axios/Fetch để xử lý request chuẩn (Interceptor, Error Handling).

4.  **UI/UX Advice:**
    - Đưa ra 3 lời khuyên để giao diện này thân thiện với người dùng (User-centric) dựa trên phong cách "${data.ui_style}".
`
  },
  {
    id: "tech_code_translate",
    source: "system",
    category: "Coder & Tech",
    iconName: "shuffle",
    title: "Code Translator (Đa Ngôn Ngữ)",
    desc: "Chuyển đổi code từ ngôn ngữ này sang ngôn ngữ khác (VD: Python -> JS) chuẩn syntax.",
    tags: ["Translation", "Refactoring", "Polyglot"],
    tactic: "Sử dụng **Idiomatic Translation**. AI không chỉ dịch từng dòng code (như Google Translate) mà sẽ viết lại code theo 'văn phong' chuẩn của ngôn ngữ đích (Idioms), đảm bảo hiệu năng và dễ đọc.",
    inputs: [
      { id: "source_lang", label: "Ngôn ngữ gốc", placeholder: "Python", type: "text" },
      { id: "target_lang", label: "Ngôn ngữ đích", placeholder: "Golang / TypeScript", type: "text" },
      { id: "source_code", label: "Đoạn code cần dịch", placeholder: "def my_func(): ...", type: "textarea" }
    ],
    generate: (data) => `
**Role:** Bạn là chuyên gia lập trình đa ngôn ngữ (Polyglot Programmer).
**Task:** Chuyển đổi đoạn code từ ${data.source_lang || 'Ngôn ngữ gốc'} sang ${data.target_lang || 'Ngôn ngữ đích'}.

**Source Code:**
\`\`\`
${data.source_code || '[Code]'}
\`\`\`

**Yêu cầu:**
1. **Tính chính xác:** Code mới phải chạy được và giữ nguyên logic nghiệp vụ.
2. **Idiomatic:** Sử dụng các best practices và thư viện chuẩn của ngôn ngữ đích (Ví dụ: Python dùng snake_case, JS dùng camelCase).
3. **Giải thích:** Nêu rõ những thay đổi quan trọng hoặc lưu ý khi chuyển đổi (ví dụ: cách xử lý concurrency khác nhau).
`
  },
  {
    id: "tech_security_audit",
    source: "system",
    category: "Coder & Tech",
    iconName: "lock",
    title: "Security Code Auditor",
    desc: "Rà soát lỗ hổng bảo mật (SQL Injection, XSS...) trong code.",
    tags: ["Security", "OWASP", "Cybersecurity"],
    tactic: "Đóng vai **Cyber Security Expert**. Prompt này tập trung vào việc tìm kiếm các lỗ hổng phổ biến (OWASP Top 10) và yêu cầu AI cung cấp bản vá lỗi ngay lập tức.",
    inputs: [
      { id: "lang", label: "Ngôn ngữ lập trình", placeholder: "PHP / Node.js / Python", type: "text" },
      { id: "suspicious_code", label: "Đoạn code cần kiểm tra", placeholder: "query = 'SELECT * FROM users WHERE name = ' + user_input", type: "textarea" }
    ],
    generate: (data) => `
**Role:** Bạn là chuyên gia bảo mật mạng (Cyber Security Specialist).
**Task:** Audit đoạn code ${data.lang || ''} dưới đây để tìm lỗ hổng bảo mật.

**Code Snippet:**
\`\`\`
${data.suspicious_code || '[Code]'}
\`\`\`

**Quy trình Audit:**
1. **Identify:** Chỉ ra lỗ hổng bảo mật cụ thể (Ví dụ: SQL Injection, XSS, Hardcoded Credentials).
2. **Severity:** Đánh giá mức độ nghiêm trọng (Critical/High/Medium).
3. **Exploit:** Giải thích ngắn gọn cách hacker có thể khai thác lỗ hổng này.
4. **Fix:** Viết lại đoạn code đã được vá lỗi (Secure Code) theo chuẩn an toàn.
`
  },
  {
    id: "tech_mermaid_diagram",
    source: "system",
    category: "Coder & Tech",
    iconName: "layers",
    title: "Hệ Thống Hóa bằng Mermaid.js",
    desc: "Tạo sơ đồ luồng (Flowchart), Sequence Diagram từ mô tả văn bản.",
    tags: ["Documentation", "Architecture", "Diagram"],
    tactic: "Sử dụng **Visualization Prompting**. Thay vì hì hục vẽ Visio, bạn mô tả quy trình bằng lời, AI sẽ sinh ra code Mermaid.js để bạn dán vào Notion/GitHub/Obsidian là có ngay biểu đồ đẹp.",
    inputs: [
      { id: "diagram_type", label: "Loại biểu đồ", placeholder: "Flowchart / Sequence Diagram / ERD", type: "text" },
      { id: "process_desc", label: "Mô tả quy trình/hệ thống", placeholder: "Người dùng đăng nhập -> Check DB -> Nếu sai pass thì báo lỗi -> Nếu đúng thì cấp Token...", type: "textarea" }
    ],
    generate: (data) => `
**Role:** Bạn là System Architect và chuyên gia về tài liệu kỹ thuật.
**Task:** Chuyển đổi mô tả quy trình sau thành code **Mermaid.js** để hiển thị biểu đồ.

**Loại biểu đồ:** ${data.diagram_type || 'Flowchart'}
**Mô tả quy trình:**
${data.process_desc || '[Mô tả]'}

**Yêu cầu Output:**
Chỉ trả về khối code Mermaid (bắt đầu bằng \`\`\`mermaid) hợp lệ. Đảm bảo logic luồng đi đúng hướng và có các chú thích (Label) rõ ràng trên các mũi tên.
`
  },
  {
    id: "tech_dummy_data",
    source: "system",
    category: "Coder & Tech",
    iconName: "database",
    title: "Dummy Data Generator",
    desc: "Tạo dữ liệu giả (Mock Data) chuẩn xác về ngữ nghĩa để test App/DB.",
    tags: ["Data Generation", "Testing", "JSON/SQL"],
    tactic: "Sử dụng **Schema-Aware Generation**. Khác với các tool random string vô nghĩa, prompt này yêu cầu AI hiểu ngữ cảnh của trường dữ liệu (Context-aware). Ví dụ: 'Email' phải có định dạng email, 'Tên' phải giống tên người thật. Kết quả trả về dạng JSON hoặc SQL Insert.",
    inputs: [
      { id: "format", label: "Định dạng Output", placeholder: "JSON Array / SQL Insert / CSV", type: "text" },
      { id: "quantity", label: "Số lượng bản ghi", placeholder: "10 users", type: "text" },
      { id: "fields", label: "Mô tả các trường (Fields)", placeholder: "id (uuid), name (Vietnamese full name), email, role (Admin/User), status (Active/Inactive)", type: "textarea" }
    ],
    generate: (data) => `
**Role:** Bạn là Senior Data Engineer.
**Task:** Tạo bộ dữ liệu giả (Mock Data) chất lượng cao để phục vụ testing.

**Yêu cầu:**
- **Format:** ${data.format || 'JSON'}
- **Số lượng:** ${data.quantity || '5'} bản ghi.
- **Cấu trúc dữ liệu:**
${data.fields || '[Fields]'}

**Constraint (Ràng buộc):**
- Dữ liệu phải có ý nghĩa thực tế (Realism), không dùng random string vô nghĩa (trừ ID).
- Nếu là tên người Việt Nam, hãy dùng tên chuẩn tiếng Việt.
- Trả về kết quả trong khối code block.
`
  },
  {
    id: "tech_bug_fix",
    source: "system",
    category: "Coder & Tech",
    iconName: "bug",
    title: "Bác Sĩ Sửa Lỗi (Debugger)",
    desc: "Phân tích log lỗi và đưa ra giải pháp sửa code Python/n8n.",
    tags: ["Debug", "Root Cause Analysis", "Self-Correction"],
    tactic: "Kỹ thuật **Root Cause Analysis** (Phân tích nguyên nhân gốc). Chúng ta cung cấp Log lỗi + Code hiện tại. AI sẽ đóng vai trò Debugger để không chỉ sửa lỗi (Fix) mà còn giải thích tại sao lỗi (Why) và cách phòng tránh (Prevent).",
    inputs: [
      { id: "error_log", label: "Log lỗi (Copy từ Terminal)", placeholder: "Error: Element not interactable...", type: "textarea" },
      { id: "code_snippet", label: "Đoạn code đang bị lỗi", placeholder: "driver.find_element(By.ID, 'btn').click()", type: "textarea" }
    ],
    generate: (data) => `
**Role:** Bạn là chuyên gia Debugging và bảo trì hệ thống.
**Context:** Tôi đang gặp lỗi khi chạy đoạn code sau.

**Error Log:**
\`\`\`
${data.error_log || '[Error Log]'}
\`\`\`

**Source Code:**
\`\`\`python
${data.code_snippet || '[Code]'}
\`\`\`

**Nhiệm vụ:**
1. **Chẩn đoán:** Giải thích nguyên nhân gốc rễ (Root Cause) của lỗi này. Tại sao nó xảy ra?
2. **Giải pháp:** Viết lại đoạn code đã sửa lỗi (Fixed Code).
3. **Tối ưu:** Đề xuất cách viết tốt hơn (nếu có) để tránh lỗi này trong tương lai (ví dụ: dùng WebDriverWait thay vì sleep).
`
  },
  {
    id: "tech_sql_builder",
    source: "system",
    category: "Coder & Tech",
    iconName: "database",
    title: "SQL Query Master",
    desc: "Viết câu lệnh SQL phức tạp và tối ưu hiệu suất (Performance Tuning).",
    tags: ["Database", "SQL Optimization", "Data Engineering"],
    tactic: "Sử dụng **Constraint Prompting** (Ràng buộc). Bạn yêu cầu AI không chỉ viết query trả về kết quả đúng, mà phải giải thích Execution Plan giả định và đề xuất Indexing để query chạy nhanh nhất.",
    inputs: [
      { id: "schema", label: "Cấu trúc bảng (Schema)", placeholder: "Table Users(id, name, created_at), Table Orders(id, user_id, amount)...", type: "textarea" },
      { id: "requirement", label: "Yêu cầu truy vấn", placeholder: "Lấy top 10 user chi tiêu nhiều nhất trong tháng qua", type: "text" },
      { id: "db_type", label: "Loại Database", placeholder: "PostgreSQL / MySQL / SQL Server", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là Senior Database Administrator (DBA) chuyên về ${data.db_type || 'SQL'}.
**Task:** Viết câu truy vấn SQL tối ưu nhất cho yêu cầu: "${data.requirement || '[Yêu cầu]'}".

**Schema Database:**
\`\`\`sql
${data.schema || '[Schema]'}
\`\`\`

**Yêu cầu Output:**
1. **SQL Query:** Câu lệnh chính xác, sử dụng các kỹ thuật tối ưu (CTE, Window Functions, JOINs hợp lý).
2. **Performance Analysis:** Giải thích tại sao query này nhanh.
3. **Indexing Suggestion:** Đề xuất tạo Index nào cho các bảng trên để query chạy nhanh hơn (Ví dụ: Composite Index).
`
  },
  {
    id: "tech_api_docs",
    source: "system",
    category: "Coder & Tech",
    iconName: "file-json",
    title: "API Documentation Generator",
    desc: "Viết tài liệu kỹ thuật cho API endpoint chuẩn Swagger/OpenAPI.",
    tags: ["Technical Writing", "API Design", "Documentation"],
    tactic: "Sử dụng **Template Filling**. Việc viết document rất nhàm chán, prompt này tự động hóa việc đó bằng cách bắt AI điền vào form chuẩn của OpenAPI, giúp dev tiết kiệm hàng giờ đồng hồ.",
    inputs: [
      { id: "endpoint", label: "Method + Endpoint URL", placeholder: "POST /api/v1/users/register", type: "text" },
      { id: "params", label: "Input Parameters (JSON Body)", placeholder: "{ 'email': '...', 'password': '...' }", type: "textarea" },
      { id: "response", label: "Success Response Example", placeholder: "{ 'id': 1, 'token': 'xyz...' }", type: "textarea" }
    ],
    generate: (data) => `
**Role:** Bạn là Technical Writer chuyên nghiệp.
**Task:** Viết tài liệu API Documentation cho Endpoint sau.

**Endpoint Info:**
- **URL:** ${data.endpoint || '[URL]'}
- **Input Payload:** ${data.params || '[Input]'}
- **Success Response:** ${data.response || '[Response]'}

**Yêu cầu Output:**
Hãy trình bày dưới dạng **Markdown** (tương thích Swagger/OpenAPI) bao gồm các mục:
1. **Description:** Mô tả ngắn gọn chức năng của API.
2. **Request Headers:** (Ví dụ Content-Type, Authorization).
3. **Request Body Schema:** Bảng mô tả các trường, kiểu dữ liệu, bắt buộc hay không.
4. **Response:** Ví dụ JSON trả về và mô tả các mã lỗi (400, 401, 500) có thể gặp.
`
  },
  {
    id: "tech_regex_gen",
    source: "system",
    category: "Coder & Tech",
    iconName: "search",
    title: "Regex Wizard",
    desc: "Tạo biểu thức chính quy (Regex) chính xác kèm giải thích.",
    tags: ["Regex", "String Processing", "Parsing"],
    tactic: "Regex rất khó nhớ. Prompt này sử dụng chiến thuật **Explanation-First**. AI sẽ giải thích tư duy logic trước khi đưa ra chuỗi Regex, giúp bạn hiểu và dễ dàng debug nếu sai.",
    inputs: [
      { id: "match_text", label: "Chuỗi cần tìm/bắt (Match)", placeholder: "Email, Số điện thoại VN, Ngày tháng (dd/mm/yyyy)...", type: "text" },
      { id: "example", label: "Ví dụ dữ liệu mẫu", placeholder: "contact@example.com, user.name+tag@gmail.com", type: "textarea" }
    ],
    generate: (data) => `
**Role:** Bạn là chuyên gia về Regular Expressions (Regex).
**Task:** Tạo Regex để bắt nội dung: "${data.match_text || '[Yêu cầu]'}".

**Dữ liệu mẫu để test:**
${data.example || '[Ví dụ]'}

**Yêu cầu Output:**
1. **Regex Pattern:** Chuỗi Regex tối ưu (xử lý được các case đặc biệt).
2. **Giải thích (Breakdown):** Giải thích ý nghĩa của từng token (Ví dụ: \\d+ nghĩa là gì, ?= nghĩa là gì).
3. **Code Example:** Ví dụ sử dụng Regex này trong JavaScript và Python.
`
  },
  {
    id: "tech_unit_test",
    source: "system",
    category: "Coder & Tech",
    iconName: "shield",
    title: "Unit Test Generator",
    desc: "Tự động viết test case (Jest/Pytest) bao phủ các edge cases.",
    tags: ["Testing", "QA", "TDD"],
    tactic: "Sử dụng **Edge-case Discovery**. AI giỏi hơn con người trong việc nghĩ ra các trường hợp kỳ lạ (nhập số âm, nhập null, tràn bộ nhớ...). Prompt này yêu cầu AI liệt kê các test case đó trước khi viết code test.",
    inputs: [
      { id: "function_code", label: "Code hàm cần test", placeholder: "function calculateDiscount(price, type) { ... }", type: "textarea" },
      { id: "framework", label: "Test Framework", placeholder: "Jest (JS) hoặc Pytest (Python)", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là QA Automation Engineer kỹ tính.
**Task:** Viết Unit Test cho hàm dưới đây sử dụng ${data.framework || 'Jest'}.

**Source Code:**
\`\`\`
${data.function_code || '[Code]'}
\`\`\`

**Quy trình thực hiện:**
1. **Test Plan:** Liệt kê danh sách các trường hợp cần test (Happy Path, Negative Case, Edge Case - ví dụ: input null, rỗng, số cực lớn, ký tự đặc biệt).
2. **Test Code:** Viết code test hoàn chỉnh. Đảm bảo độ bao phủ (Code Coverage) cao nhất có thể.
`
  },
  {
    id: "tech_refactor",
    source: "system",
    category: "Coder & Tech",
    iconName: "layers",
    title: "Code Refactoring Expert",
    desc: "Tối ưu hóa code cũ thành Clean Code (SOLID, DRY).",
    tags: ["Clean Code", "Refactoring", "SOLID"],
    tactic: "Sử dụng chiến thuật **Comparative Analysis** (So sánh Trước/Sau). AI sẽ chỉ ra điểm 'xấu' trong code cũ (Code Smell), giải thích tại sao nó tệ, và đưa ra phiên bản mới sạch đẹp hơn, tuân thủ nguyên lý SOLID.",
    inputs: [
      { id: "dirty_code", label: "Đoạn code cần tối ưu", placeholder: "Code bị lồng nhau quá nhiều (Nested), đặt tên biến khó hiểu...", type: "textarea" }
    ],
    generate: (data) => `
**Role:** Bạn là Software Architect với 20 năm kinh nghiệm, tác giả của sách Clean Code.
**Task:** Review và Refactor đoạn code sau cho dễ đọc, dễ bảo trì và hiệu năng cao hơn.

**Dirty Code:**
\`\`\`
${data.dirty_code || '[Code cũ]'}
\`\`\`

**Yêu cầu:**
1. **Code Smell Analysis:** Chỉ ra 3 điểm tệ nhất trong code này (Ví dụ: Vi phạm Single Responsibility, Magic Number, Nested Ifs).
2. **Refactored Code:** Viết lại code áp dụng nguyên lý SOLID và DRY.
3. **Why it's better:** Giải thích ngắn gọn tại sao code mới tốt hơn.
`
  },

  // --- CONTENT & SEO ---
  {
    id: "content_seo_article",
    source: "system",
    category: "Content & SEO",
    iconName: "file-text",
    title: "SEO Blog Post Writer",
    desc: "Viết bài Blog chuẩn SEO Google với cấu trúc Semantic Keywords.",
    tags: ["SEO", "Content Marketing", "On-page SEO"],
    tactic: "Kết hợp **SEO Optimization** và **Reader-First approach**. Prompt này yêu cầu AI chèn từ khóa một cách tự nhiên (tránh Keyword Stuffing) và cấu trúc bài viết bằng các thẻ Heading (H1, H2, H3) để Google bot dễ đọc.",
    inputs: [
      { id: "keyword", label: "Từ khóa chính (Main Keyword)", placeholder: "cách kiếm tiền online", type: "text" },
      { id: "target_audience", label: "Chân dung người đọc (Persona)", placeholder: "Người mới bắt đầu, Gen Z, Chuyên gia...", type: "text" },
      { id: "tone", label: "Giọng văn (Tone)", placeholder: "Chuyên gia, Thân thiện, hoặc Hài hước", type: "text" },
      { id: "outline", label: "Dàn ý sơ bộ (Optional)", placeholder: "1. Giới thiệu, 2. Các cách MMO, 3. Lời khuyên...", type: "textarea" }
    ],
    generate: (data) => `
**Role:** Bạn là chuyên gia SEO Content Marketing.
**Task:** Viết một bài Blog Post dài, chuẩn SEO cho từ khóa: "${data.keyword || '[Keyword]'}".

**Target Audience (Persona):** ${data.target_audience || 'Đại chúng'}
**Tone:** ${data.tone || 'Chuyên nghiệp'}.

**Yêu cầu Content:**
Hãy điều chỉnh ngôn ngữ, ví dụ và phong cách viết để phù hợp hoàn toàn với **${data.target_audience || 'người đọc'}**. Nếu họ là người mới, hãy giải thích thuật ngữ đơn giản. Nếu là chuyên gia, hãy đi sâu vào kỹ thuật.

**Yêu cầu SEO On-page:**
1. **Tiêu đề (H1):** Phải chứa từ khóa và gây kích thích click (CTR).
2. **Cấu trúc:** Sử dụng H2, H3 rõ ràng.
3. **Semantic Keywords:** Tự động chèn các từ khóa liên quan (LSI Keywords) để tăng độ ngữ nghĩa.
4. **Meta Description:** Viết mô tả ngắn dưới 160 ký tự cho bài này.

**Nội dung:**
${data.outline ? `Dựa trên dàn ý sau: ${data.outline}` : 'Hãy tự đề xuất dàn ý tối ưu nhất cho người đọc.'}

Hãy viết nội dung chi tiết, hữu ích, không viết chung chung.
`
  },
  {
    id: "content_linkedin",
    source: "system",
    category: "Content & SEO",
    iconName: "share-2",
    title: "LinkedIn Viral Post",
    desc: "Viết bài thương hiệu cá nhân (Personal Branding) trên LinkedIn thu hút tương tác.",
    tags: ["LinkedIn", "Personal Branding", "Social Selling"],
    tactic: "Sử dụng phong cách **Broetry** (Dòng ngắn, xuống dòng nhiều) - đặc sản của LinkedIn. Prompt tập trung vào cấu trúc: Hook gây sốc -> Câu chuyện cá nhân (Vulnerability) -> Bài học rút ra (Value) -> Call to Action.",
    inputs: [
      { id: "topic", label: "Chủ đề bài viết", placeholder: "Bài học sau khi bị sa thải, Cách quản lý team remote...", type: "text" },
      { id: "story", label: "Câu chuyện/Bối cảnh (Tùy chọn)", placeholder: "Kể về lúc tôi thất bại khi khởi nghiệp lần đầu...", type: "textarea" },
      { id: "cta", label: "Kêu gọi hành động (CTA)", placeholder: "Comment 'Yes' để nhận tài liệu", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là chuyên gia xây dựng thương hiệu cá nhân (Top Voice) trên LinkedIn.
**Task:** Viết bài đăng LinkedIn (Post) về chủ đề: "${data.topic}".

**Context/Story:**
${data.story || '[Hãy tự sáng tạo một câu chuyện truyền cảm hứng liên quan đến chủ đề này]'}

**Yêu cầu Format (LinkedIn Style):**
1.  **The Hook:** Câu đầu tiên phải cực ngắn, gây tò mò hoặc tranh cãi nhẹ.
2.  **Formatting:** Mỗi câu là một dòng. Sử dụng khoảng trắng nhiều để dễ đọc trên mobile.
3.  **Content Flow:** Đi từ khó khăn (Struggle) -> Bước ngoặt (Turning Point) -> Bài học (Lesson).
4.  **CTA:** ${data.cta || 'Hãy comment ý kiến của bạn bên dưới.'}

**Tone:** Chuyên nghiệp nhưng chân thành (Authentic), truyền cảm hứng.
`
  },

  // --- BUSINESS & SALES ---
  {
    id: "biz_cold_email",
    source: "system",
    category: "Business & Sales",
    iconName: "mail",
    title: "Cold Email Outreach",
    desc: "Viết email chào hàng B2B chuyên nghiệp để tìm kiếm đối tác/khách hàng.",
    tags: ["Sales", "B2B", "Email Marketing"],
    tactic: "Sử dụng **Personalization at Scale**. Cold Email thường bị coi là Spam. Prompt này buộc AI phải tìm điểm chung (Rapport) và đưa ra 'Giá trị trước' (Value First) thay vì chỉ đòi bán hàng ngay lập tức.",
    inputs: [
      { id: "recipient_role", label: "Vai trò người nhận", placeholder: "CEO công ty Marketing, HR Manager...", type: "text" },
      { id: "my_service", label: "Sản phẩm/Dịch vụ của bạn", placeholder: "Phần mềm quản lý nhân sự bằng AI", type: "text" },
      { id: "value_prop", label: "Giá trị cốt lõi (USP)", placeholder: "Giảm 50% thời gian chấm công", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là chuyên gia phát triển kinh doanh (Business Development) chuyên về Cold Outreach.
**Task:** Viết một chuỗi 3 email chào hàng gửi tới: ${data.recipient_role || '[Khách hàng]'}.

**Sản phẩm:** ${data.my_service || '[Sản phẩm]'}
**USP (Lợi thế cạnh tranh):** ${data.value_prop || '[Giá trị]'}

**Yêu cầu:**
1. **Email 1 (The Hook):** Tiêu đề ngắn, không giống quảng cáo. Nội dung tập trung vào vấn đề của họ, không nói nhiều về mình. Kết thúc bằng câu hỏi mở (Soft Call-to-action).
2. **Email 2 (Value Add - Follow up):** Gửi sau 2 ngày. Cung cấp thêm một case study hoặc mẹo hữu ích.
3. **Email 3 (The Break-up):** Gửi sau 5 ngày. Thông báo lịch sự rằng sẽ không làm phiền nữa nếu họ không quan tâm.

**Tone:** Chân thành, ngắn gọn (dưới 150 từ/email), giống như người thật viết cho người thật.
`
  },
  {
    id: "biz_swot_analysis",
    source: "system",
    category: "Business & Sales",
    iconName: "search",
    title: "Strategic TOWS Matrix (Advanced SWOT)",
    desc: "Phân tích SWOT nâng cao kết hợp ma trận TOWS để tìm ra chiến lược hành động.",
    tags: ["Business Strategy", "Market Research", "TOWS Matrix"],
    tactic: "Nâng cấp từ SWOT thông thường lên **TOWS Matrix**. Prompt này yêu cầu AI trả về kết quả dưới dạng **Bảng Markdown** để dễ nhìn, đồng thời quan trọng nhất là đưa ra 4 nhóm chiến lược hành động: **SO** (Phát huy điểm mạnh để nắm bắt cơ hội), **WO**, **ST** và **WT**. Đây là bước quan trọng chuyển từ 'phân tích' sang 'hành động'.",
    inputs: [
      { id: "subject", label: "Dự án / Doanh nghiệp", placeholder: "Mở quán cafe thú cưng tại Hà Nội", type: "text" },
      { id: "industry", label: "Lĩnh vực / Ngành hàng", placeholder: "F&B, Dịch vụ thú cưng", type: "text" },
      { id: "competitors", label: "Đối thủ chính", placeholder: "Các quán cafe truyền thống, trà chanh vỉa hè", type: "text" },
      { id: "goal", label: "Mục tiêu chiến lược", placeholder: "Đạt điểm hòa vốn sau 3 tháng", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là Chuyên gia Tư vấn Chiến lược Kinh doanh (Strategic Consultant) với tư duy sắc bén.
**Task:** Thực hiện phân tích **TOWS Matrix** (SWOT nâng cao) cho dự án: "${data.subject || '[Dự án]'}".

**Context:**
- **Ngành hàng:** ${data.industry || 'Chưa rõ'}
- **Đối thủ:** ${data.competitors || 'Chưa rõ'}
- **Mục tiêu:** ${data.goal || 'Phát triển bền vững'}

---

**PHẦN 1: EXECUTIVE SUMMARY**
Tóm tắt ngắn gọn trong 3 dòng về vị thế hiện tại của dự án này trên thị trường.

**PHẦN 2: SWOT MATRIX (Markdown Table)**
Hãy trình bày 4 yếu tố dưới dạng bảng Markdown 2x2 để dễ quan sát:
| | Positive | Negative |
|---|---|---|
| **Internal** | **Strengths (Điểm mạnh)**<br>*(Liệt kê 3 ý chính)* | **Weaknesses (Điểm yếu)**<br>*(Liệt kê 3 ý chính)* |
| **External** | **Opportunities (Cơ hội)**<br>*(Liệt kê 3 ý chính)* | **Threats (Thách thức)**<br>*(Liệt kê 3 ý chính)* |

**PHẦN 3: TOWS STRATEGIC ACTION PLAN (Quan trọng nhất)**
Dựa trên bảng trên, hãy đề xuất các chiến lược lai ghép cụ thể:

1.  **Chiến lược SO (Maxi-Maxi):** Sử dụng điểm mạnh nào để nắm bắt cơ hội nào?
2.  **Chiến lược WO (Mini-Maxi):** Cần khắc phục điểm yếu nào để không bỏ lỡ cơ hội?
3.  **Chiến lược ST (Maxi-Mini):** Dùng lợi thế nào để đối đầu hoặc né tránh rủi ro?
4.  **Chiến lược WT (Mini-Mini):** Kế hoạch phòng thủ/rút lui để giảm thiểu thiệt hại thấp nhất.

---
**BONUS: Image Generation Prompt**
*Prompt vẽ biểu đồ Infographic cho báo cáo này:*
> **"Modern business infographic template showing SWOT analysis for '${data.subject}', divided into 4 colored quadrants: Blue (Strengths), Orange (Weaknesses), Green (Opportunities), Red (Threats). Professional data visualization style, clean vector icons, white background, --ar 16:9"**
`
  },
  {
    id: "biz_data_viz",
    source: "system",
    category: "Business & Sales",
    iconName: "pie-chart",
    title: "Biến Số Liệu Thành Báo Cáo & Slide",
    desc: "Phân tích dữ liệu thô, tạo code biểu đồ (Mermaid.js) và dàn ý slide thuyết trình.",
    tags: ["Data Analysis", "Visualization", "Presentation"],
    tactic: "Sử dụng kỹ thuật **Data Storytelling**. Thay vì chỉ liệt kê con số vô hồn, AI sẽ tìm ra câu chuyện đằng sau dữ liệu (Trend, Insight) và trực quan hóa nó bằng code biểu đồ **Mermaid.js** (có thể copy vào Notion/Obsidian) kèm theo dàn ý bài thuyết trình thuyết phục.",
    inputs: [
      { id: "raw_data", label: "Dữ liệu thô (Raw Data)", placeholder: "Paste dữ liệu Excel/CSV hoặc mô tả số liệu vào đây...", type: "textarea" },
      { id: "context", label: "Bối cảnh / Mục tiêu", placeholder: "Báo cáo doanh thu Q3 cho sếp, Slide gọi vốn...", type: "text" },
      { id: "chart_preference", label: "Loại biểu đồ mong muốn", placeholder: "Biểu đồ cột, Biểu đồ tròn, hoặc 'Tự động chọn'", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là Senior Data Analyst & Presentation Expert.
**Task:** Phân tích dữ liệu được cung cấp và chuyển hóa thành Báo cáo Insight & Dàn ý Slide thuyết trình.

**Context/Mục tiêu:** ${data.context || '[Mục tiêu báo cáo]'}
**Yêu cầu Biểu đồ:** ${data.chart_preference || 'Tự động chọn loại phù hợp nhất'}

**Raw Data:**
\`\`\`
${data.raw_data || '[Dữ liệu]'}
\`\`\`

**Yêu cầu Output (3 Phần):**

**PHẦN 1: EXECUTIVE INSIGHTS (Báo cáo ngắn)**
- Tìm ra 3 điểm nổi bật nhất (Key Findings) từ dữ liệu trên.
- Giải thích *tại sao* con số đó quan trọng (The "So What?").

**PHẦN 2: DATA VISUALIZATION (Mermaid.js Code)**
Hãy viết code **Mermaid.js** để vẽ biểu đồ minh họa cho dữ liệu trên.
*Lưu ý:* Chọn loại biểu đồ (Pie/Bar/Line/XY) phù hợp nhất để thể hiện sự so sánh hoặc xu hướng.
\`\`\`mermaid
...code here...
\`\`\`

**PHẦN 3: PRESENTATION OUTLINE (Dàn ý Slide)**
Hãy tạo dàn ý cho 3-5 slide thuyết trình dựa trên insights trên:
- **Slide 1: Title** (Tiêu đề thu hút + Subtitle).
- **Slide 2: The Problem/Context** (Thực trạng từ dữ liệu).
- **Slide 3: The Insight** (Điểm nhấn chính + Đề xuất biểu đồ minh họa).
- **Slide 4: Recommendation** (Đề xuất hành động tiếp theo).
`
  },
  {
    id: "biz_job_desc",
    source: "system",
    category: "Business & Sales",
    iconName: "briefcase",
    title: "Tuyển Dụng & Job Description",
    desc: "Viết bản mô tả công việc (JD) hấp dẫn, tập trung vào kết quả và văn hóa.",
    tags: ["HR", "Recruitment", "Job Description"],
    tactic: "Thay vì liệt kê đầu việc nhàm chán, prompt này sử dụng kỹ thuật **Role-Result Alignment**. Nó tập trung vào 'Kết quả kỳ vọng' (Outcomes) và 'Tại sao bạn sẽ yêu thích công việc này', giúp thu hút nhân tài thực sự chứ không chỉ là người xin việc.",
    inputs: [
      { id: "job_title", label: "Vị trí tuyển dụng", placeholder: "Senior React Developer", type: "text" },
      { id: "responsibilities", label: "Trách nhiệm chính", placeholder: "Xây dựng giao diện, Tối ưu performance, Mentor junior", type: "textarea" },
      { id: "culture", label: "Văn hóa công ty", placeholder: "Làm việc từ xa, Linh hoạt, Data-driven", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là Chuyên gia Tuyển dụng (Recruitment Manager) và Employer Branding.
**Task:** Viết một bản mô tả công việc (JD) cực kỳ hấp dẫn cho vị trí: "${data.job_title}".

**Context:**
- **Nhiệm vụ:** ${data.responsibilities || '[Trách nhiệm]'}
- **Văn hóa:** ${data.culture || '[Văn hóa]'}

**Cấu trúc JD (Performance-based):**
1.  **The Mission (Sứ mệnh):** Tại sao vị trí này tồn tại và nó quan trọng thế nào với công ty?
2.  **What You Will Achieve (Kết quả kỳ vọng):**
    - *Trong 1 tháng đầu:* ...
    - *Trong 3 tháng:* ...
3.  **Why You'll Love It Here (Quyền lợi & Văn hóa):** Bán "ước mơ" và môi trường làm việc, không chỉ là lương.
4.  **Who You Are (Chân dung ứng viên):** Mô tả tư duy và kỹ năng mềm, không chỉ là bằng cấp.

**Tone:** Chuyên nghiệp, chào đón, thách thức (để lọc ứng viên giỏi).
`
  },

  // --- CHATBOT & CS ---
  {
    id: "chatbot_training",
    source: "system",
    category: "Chatbot & CS",
    iconName: "robot",
    title: "Huấn Luyện AI Chatbot (n8n)",
    desc: "Tạo dữ liệu training cho chatbot trả lời khách hàng tự nhiên.",
    tags: ["Few-Shot Prompting", "Persona", "JSON Output"],
    tactic: "Đây là ví dụ điển hình của **Few-Shot Prompting** (Cung cấp ví dụ mẫu). Để Chatbot không trả lời như cái máy, bạn cần cung cấp các cặp câu hỏi-đáp mẫu mang phong cách (Tone) mà bạn muốn. AI sẽ học theo pattern đó (Pattern Matching) để sinh ra các câu trả lời mới.",
    inputs: [
      { id: "bot_persona", label: "Tính cách Bot", placeholder: "Vui vẻ, dùng nhiều icon, gen Z, hay trêu đùa", type: "text" },
      { id: "scenarios", label: "Các tình huống cần xử lý", placeholder: "Khách chê đắt, Khách hỏi ship, Khách bom hàng", type: "textarea" }
    ],
    generate: (data) => `
**Role:** Bạn là chuyên gia biên kịch hội thoại (Conversation Designer).
**Task:** Tạo bộ dữ liệu huấn luyện (Training Data) cho Chatbot bán hàng.

**Persona (Tính cách Bot):**
${data.bot_persona || '[Tính cách]'}

**Tình huống cần xử lý:**
${data.scenarios || '[Tình huống]'}

**Yêu cầu Output (JSON Format):**
Hãy tạo một danh sách 10-20 cặp hội thoại mẫu (User - Bot) dưới dạng JSON Array. Đảm bảo câu trả lời của Bot thể hiện đúng tính cách đã mô tả, ngắn gọn và hướng tới chốt đơn.

Format mẫu:
[
  {
    "intent": "price_objection",
    "user": "Sao đắt thế shop ơi",
    "bot": "Dạ tiền nào của nấy bác ơi 🥺 Hàng bên em là bản Premium bảo hành 12 tháng, không phải hàng chợ đâu ạ. Em freeship bù nha? 🎁"
  }
]
`
  },
  {
    id: "cs_sop",
    source: "system",
    category: "Chatbot & CS",
    iconName: "book-open",
    title: "Quy Trình Xử Lý Khiếu Nại (SOP)",
    desc: "Xây dựng quy trình chuẩn (SOP) từng bước cho nhân viên CSKH xử lý sự cố.",
    tags: ["Customer Service", "SOP", "Crisis Management"],
    tactic: "Sử dụng mô hình **L.A.T.T.E** (Listen, Acknowledge, Take action, Thank, Explain) của Starbucks. Prompt này giúp bạn chuẩn hóa quy trình xử lý khủng hoảng, đảm bảo mọi nhân viên đều xử lý chuyên nghiệp và giảm thiểu thiệt hại thương hiệu.",
    inputs: [
      { id: "issue", label: "Vấn đề khiếu nại thường gặp", placeholder: "Khách nhận hàng bị vỡ/hỏng, Giao hàng trễ", type: "text" },
      { id: "policy", label: "Chính sách đền bù", placeholder: "Đổi mới 1-1 trong 7 ngày, Tặng voucher 50k", type: "text" }
    ],
    generate: (data) => `
**Role:** Bạn là Trưởng phòng Chăm sóc Khách hàng (CS Manager).
**Task:** Xây dựng Quy trình vận hành tiêu chuẩn (SOP) để xử lý khiếu nại: "${data.issue}".

**Chính sách công ty:** ${data.policy || '[Chính sách]'}

**Yêu cầu SOP (Mô hình L.A.T.T.E):**
Hãy viết kịch bản hướng dẫn nhân viên từng bước:
1.  **Listen (Lắng nghe):** Cách đặt câu hỏi để khách xả cơn giận và thu thập thông tin.
2.  **Acknowledge (Đồng cảm):** Mẫu câu xin lỗi chân thành (không văn mẫu).
3.  **Take Action (Hành động):** Các phương án giải quyết dựa trên chính sách (Trao quyền cho nhân viên).
4.  **Thank (Cảm ơn):** Cảm ơn vì khách đã phản hồi.
5.  **Explain (Giải thích):** Giải thích ngắn gọn nguyên nhân (nếu cần) và cam kết không tái diễn.

**Output:** Trình bày dạng Checklist hoặc Flowchart text để nhân viên dễ làm theo.
`
  }
];
