import { ytmp4 } from 'ruhend-scraper';

const handler = async (m, { conn, args }) => {
  const url = args[0]; 
m.reply(wait);


// Assuming the user provides the URL as the first argument
  if (!url) return m.reply('يرجى إرسال رابط الفيديو من يوتيوب.');

  try {
    const { title, video, author, description, duration, views, upload, thumbnail } = await ytmp4(url);

    // Download the video content as a buffer
    const videoBuffer = await fetch(video).then(res => res.buffer());

    let message = `🎥 *${title}*\n`;
    message += `🔗 *رابط التنزيل MP4:* ${video}\n`;
    message += `👤 *المؤلف:* ${author}\n`;
    message += `📝 *الوصف:* ${description}\n`;
    message += `⏳ *المدة:* ${duration}\n`;
    message += `👀 *المشاهدات:* ${views}\n`;
    message += `📅 *تاريخ الرفع:* ${upload}`;

    // Send the video file as a document
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

handler.command = /^(ya)$/i;  // This ensures that the command can be triggered by either mp4 or ytmp4 commands

export default handler;