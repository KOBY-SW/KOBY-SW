import fetch from 'node-fetch';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

// تحديد مسار ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

const handler = async (m, { conn }) => {
  const messageText = m.text.trim(); // استخدام m.text للحصول على محتوى الرسالة

  // التأكد من أن الرابط موجود
  if (!messageText) {
    return conn.reply(m.chat, 'يرجى إرسال رابط Facebook لتحميله.', m);
m.reply(wait);
  }

  // رابط API لتحميل الفيديو من Facebook
  const apiUrl = `https://jazxcode.biz.id/downloader/facebook?url=${encodeURIComponent(messageText)}`;

  try {
    // استدعاء API باستخدام fetch
    const response = await fetch(apiUrl);
    const data = await response.json();

    // التأكد من أن الاستجابة تحتوي على النتيجة المطلوبة
    if (data.status) {
      const videoUrl = data.result.sdLink || data.result.hdLink; // الحصول على رابط الفيديو (جودة منخفضة أو عالية)
      const title = data.result.title; // العنوان
      const caption = data.result.caption; // التسمية التوضيحية
      const image = data.result.image; // صورة مصغرة

      // تنزيل الفيديو
      const videoPath = `./src/tmp/facebook_${Date.now()}.mp4`;
      const videoBuffer = await (await fetch(videoUrl)).buffer();
      fs.writeFileSync(videoPath, videoBuffer);

      // إرسال الفيديو
      await conn.sendMessage(m.chat, { 
        video: { url: videoUrl }, 
        caption: `${title}\n\n${caption}`,
        thumbnail: { url: image }
      }, { quoted: m });

      // استخراج الصوت من الفيديو باستخدام ffmpeg
      const audioPath = videoPath.replace('.mp4', '.mp3');
      await new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .output(audioPath)
          .toFormat('mp3')
          .on('end', resolve)
          .on('error', reject)
          .run();
      });

      // إرسال الصوت المستخرج
      await conn.sendMessage(
        m.chat,
        { audio: fs.readFileSync(audioPath), mimetype: 'audio/mpeg', ptt: false }, // إرسال الصوت كـ PTT
        { quoted: m }
      );

      // حذف الملفات المؤقتة
      fs.unlinkSync(videoPath);
      fs.unlinkSync(audioPath);
    } else {
      conn.reply(m.chat, 'تعذر الحصول على الرابط، تأكد من صحة الرابط المرسل.', m);
    }
  } catch (error) {
    console.error('Error:', error);
    conn.reply(m.chat, 'حدث خطأ أثناء معالجة الطلب.', m);
  }
};

// تشغيل البوت تلقائيًا عند إرسال رابط Facebook
handler.customPrefix = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/.+$/;
handler.command = new RegExp(); // بدون أمر محدد

export default handler;