import { ytmp4 } from 'ruhend-scraper';

const handler = async (m, { conn }) => {
  const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
m.reply (wait);
  const messageText = m.text.trim();

  if (!youtubeUrlPattern.test(messageText)) {
    return; 


// إذا لم يكن الرابط من YouTube، لا تفعل شيئًا
  }

  try {
    const { title, video, author, description, duration, views, upload, thumbnail } = await ytmp4(messageText);

    // تنزيل الفيديو كمحتوى بايتات
    const videoBuffer = await fetch(video).then(res => res.buffer());

    let message = `🎥 *${title}*\n`;
    message += `🔗 *رابط التنزيل MP4:* ${video}\n`;
    message += `👤 *المؤلف:* ${author}\n`;
    message += `📝 *الوصف:* ${description}\n`;
    message += `⏳ *المدة:* ${duration}\n`;
    message += `👀 *المشاهدات:* ${views}\n`;
    message += `📅 *تاريخ الرفع:* ${upload}`;

    // إرسال الفيديو كملف
    await conn.sendMessage(m.chat, {
      document: videoBuffer,
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply('❌ فشل في تحميل الفيديو، تأكد من صحة الرابط.');
  }
};

// تشغيل البوت تلقائيًا عند إرسال رابط YouTube
handler.customPrefix = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
handler.command = new RegExp(); // بدون أمر محدد

export default handler;