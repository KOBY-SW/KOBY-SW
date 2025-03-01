import fetch from 'node-fetch';

const handler = async (m, { text, conn }) => {
  // التأكد من أن الرابط موجود
  if (!text) {
    return conn.reply(m.chat, 'يرجى إرسال رابط YouTube لتحميله كـ MP4.', m);
  }

  // رابط API لتحويل الفيديو إلى MP4
  const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${encodeURIComponent(text)}&quality=360`;

  try {
    // استدعاء API باستخدام fetch
    const response = await fetch(apiUrl, {
      method: 'GET', // تحديد طريقة الطلب GET
      headers: {
        'accept': 'application/json' // تحديد نوع الاستجابة المطلوبة
      }
    });

    // التأكد من أن الاستجابة تحتوي على حالة 200 (نجاح)
    if (!response.ok) {
      throw new Error(`API returned error: ${response.statusText}`);
    }

    // تحويل الاستجابة إلى JSON
    const data = await response.json();

    // التأكد من أن البيانات تحتوي على النتيجة المطلوبة
    if (data.status === 200 && data.result && data.result.media) {
      const mp4Url = data.result.media; // رابط الـ MP4

      // تنزيل الفيديو
      const videoResponse = await fetch(mp4Url);
      const videoBuffer = await videoResponse.buffer();

      // إرسال الفيديو مباشرة
      await conn.sendMessage(m.chat, {
        video: videoBuffer,
        caption: 'تم تحميل الفيديو بنجاح!',
        mimetype: 'video/mp4'
      });

    } else {
      conn.reply(m.chat, 'تعذر الحصول على الفيديو، تأكد من صحة الرابط المرسل أو أن الفيديو متاح على YouTube.', m);
    }
  } catch (error) {
    console.error('Error:', error.message);
    conn.reply(m.chat, `حدث خطأ أثناء معالجة الطلب: ${error.message}`, m);
  }
};

handler.command = /^ytv$/i;
export default handler;