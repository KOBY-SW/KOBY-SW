import fetch from 'node-fetch';

const handler = async (m, { text, conn }) => {
  if (!text) {
    return conn.reply(m.chat, '*_🍁يرجى إدخال رابط فيديو يوتيوب.🍁_*', m);
  }

  // API لاستخراج الفيديو
  const videoApi = `https://mahiru-shiina.vercel.app/download/ytmp4?url=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(videoApi);
    const result = await response.json();

    if (!result.data || !result.data.download) {
      return conn.reply(m.chat, '⚠️ لم أتمكن من استخراج الفيديو. حاول مرة أخرى.', m);
    }

    const { title, thumbnail, author, download: videoUrl } = result.data;

    // إرسال صورة الفيديو مع التفاصيل
    await conn.sendMessage(m.chat, { 
      image: { url: thumbnail }, 
      caption: `📌 *العنوان:* ${title}\n📺 *القناة:* ${author.name}\n🔗 *رابط القناة:* ${author.url}`
    }, { quoted: m });

    // إرسال الفيديو
    await conn.sendMessage(m.chat, { 
      video: { url: videoUrl }, 
      mimetype: 'video/mp4'
    }, { quoted: m });

  } catch (error) {
    console.log(`❌ خطأ في API الفيديو: ${error.message}`);
    return conn.reply(m.chat, '⚠️ حدث خطأ أثناء جلب الفيديو.', m);
  }
};

handler.command = /^ytv$/i;
handler.help = ["ytv"];
handler.tags=["ytv"];
export default handler;