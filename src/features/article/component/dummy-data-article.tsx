export const sampleArticle = {
  time: Date.now(),
  blocks: [
    {
      id: "h1-title",
      type: "header",
      data: {
        text: "Membangun CMS Modern dengan NextJS dan EditorJS",
        level: 1,
      },
    },
    {
      id: "intro",
      type: "paragraph",
      data: {
        text: "Membangun Content Management System (CMS) modern saat ini tidak lagi harus menggunakan sistem monolitik yang kompleks. Dengan kombinasi Next.js dan EditorJS, kita dapat membuat CMS yang ringan, fleksibel, dan scalable untuk kebutuhan production.",
      },
    },
    {
      id: "section1",
      type: "header",
      data: {
        text: "Kenapa Menggunakan Next.js?",
        level: 2,
      },
    },
    {
      id: "section1-p1",
      type: "paragraph",
      data: {
        text: "Next.js memberikan banyak keunggulan seperti Server Components, API Routes, dan optimasi performa bawaan. Framework ini sangat cocok untuk membangun aplikasi CMS yang SEO-friendly dan cepat.",
      },
    },
    {
      id: "section1-list",
      type: "list",
      data: {
        style: "unordered",
        items: ["Routing berbasis file system", "API bawaan tanpa backend terpisah", "Optimasi gambar otomatis", "Dukungan penuh TypeScript"],
      },
    },
    {
      id: "section2",
      type: "header",
      data: {
        text: "Peran EditorJS dalam CMS",
        level: 2,
      },
    },
    {
      id: "section2-p1",
      type: "paragraph",
      data: {
        text: "EditorJS adalah block-based editor yang memungkinkan konten disimpan dalam format JSON terstruktur. Ini sangat powerful karena kita bisa mengontrol bagaimana konten dirender pada sisi frontend.",
      },
    },
    {
      id: "section2-quote",
      type: "quote",
      data: {
        text: "Block-based content membuat rendering lebih fleksibel dan aman dibandingkan menyimpan HTML mentah.",
        caption: "Best Practice CMS Modern",
      },
    },
    {
      id: "section3",
      type: "header",
      data: {
        text: "Struktur Arsitektur CMS",
        level: 2,
      },
    },
    {
      id: "section3-p1",
      type: "paragraph",
      data: {
        text: "Dalam implementasi production, kita biasanya memisahkan antara layer editor, preview renderer, dan public article page. Konten disimpan sebagai JSON dan dirender ulang saat ditampilkan ke pengguna.",
      },
    },
    {
      id: "code-sample",
      type: "code",
      data: {
        code: `const article = await editorRef.current.save();

    await fetch("/api/article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(article),
    });`,
      },
    },
    {
      id: "section4",
      type: "header",
      data: {
        text: "Menambahkan Gambar pada Artikel",
        level: 2,
      },
    },
    {
      id: "section4-p1",
      type: "paragraph",
      data: {
        text: "EditorJS menyediakan Image Tool yang dapat dikonfigurasi untuk mengupload gambar ke server atau layanan cloud seperti S3 dan Cloudinary.",
      },
    },
    {
      id: "image-sample",
      type: "image",
      data: {
        file: {
          url: "https://nvxvwlilfmroacrtldce.supabase.co/storage/v1/object/public/cms-storage/article/pngtree-glowing-neural-networks-in-a-high-tech-digital-background-picture-image_16364335.jpg",
        },
        caption: "Contoh ilustrasi workspace developer",
        withBorder: false,
        withBackground: false,
        stretched: false,
      },
    },
    {
      id: "closing",
      type: "header",
      data: {
        text: "Kesimpulan",
        level: 2,
      },
    },
    {
      id: "closing-p1",
      type: "paragraph",
      data: {
        text: "Dengan menggabungkan Next.js dan EditorJS, kita dapat membangun CMS yang modular, scalable, dan SEO-friendly. Struktur block-based memungkinkan fleksibilitas tinggi untuk rendering dan pengembangan fitur lanjutan seperti preview, autosave, dan analytics.",
      },
    },
    {
      id: "closing-p2",
      type: "paragraph",
      data: {
        text: "Dengan menggabungkan Next.js dan EditorJS, kita dapat membangun CMS yang modular, scalable, dan SEO-friendly. Struktur block-based memungkinkan fleksibilitas tinggi untuk rendering dan pengembangan fitur lanjutan seperti preview, autosave, dan analytics.",
      },
    },
    {
      id: "closing-p3",
      type: "paragraph",
      data: {
        text: "Dengan menggabungkan Next.js dan EditorJS, kita dapat membangun CMS yang modular, scalable, dan SEO-friendly. Struktur block-based memungkinkan fleksibilitas tinggi untuk rendering dan pengembangan fitur lanjutan seperti preview, autosave, dan analytics.",
      },
    },
    {
      id: "closing-p4",
      type: "paragraph",
      data: {
        text: "Dengan menggabungkan Next.js dan EditorJS, kita dapat membangun CMS yang modular, scalable, dan SEO-friendly. Struktur block-based memungkinkan fleksibilitas tinggi untuk rendering dan pengembangan fitur lanjutan seperti preview, autosave, dan analytics.",
      },
    },
    {
      id: "closing-p5",
      type: "paragraph",
      data: {
        text: "Dengan menggabungkan Next.js dan EditorJS, kita dapat membangun CMS yang modular, scalable, dan SEO-friendly. Struktur block-based memungkinkan fleksibilitas tinggi untuk rendering dan pengembangan fitur lanjutan seperti preview, autosave, dan analytics.",
      },
    },
  ],
  version: "2.28.0",
};
