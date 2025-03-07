import axios from 'axios';
import yts from 'yt-search';

const handler = async (m, { conn, text }) => {
    if (!text) throw '*_يرجى إدخال اسم الفيديو للبحث_*';

    try {
        // البحث في يوتيوب
        const searchResults = await yts(text);
        if (!searchResults.videos.length) throw '*_لم يتم العثور على أي نتائج_*';

        const video = searchResults.videos[0]; // أخذ أول نتيجة
        const videoUrl = video.url; // رابط الفيديو
        const thumbnail = video.thumbnail; // الصورة المصغرة
        const title = video.title; // العنوان
        const duration = video.timestamp; // المدة
        const views = video.views.toLocaleString(); // عدد المشاهدات
        const uploadDate = video.ago; // وقت الرفع
        const author = video.author.name; // اسم القناة

        // إرسال معلومات الفيديو
        const caption = `📌 *العنوان:* ${title}\n` +
                        `📎 *الرابط:* ${videoUrl}\n` +
                        `⏳ *المدة:* ${duration}\n` +
                        `👀 *المشاهدات:* ${views}\n` +
                        `📅 *تم الرفع:* ${uploadDate}\n` +
                        `🎙 *القناة:* ${author}`;

        await conn.sendMessage(m.chat, { 
            image: { url: thumbnail }, 
            caption: caption
        });

        // إرسال الرابط إلى API لتحميل الصوت
        const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(videoUrl)}&quality=128kbps`;
        const response = await axios.get(apiUrl);

        if (response.data.status !== 200) throw '*_فشل في جلب البيانات، يرجى المحاولة مرة أخرى_*';

        const { media } = response.data.result;

        // إرسال الصوت كرسالة صوتية (PTT)
        await conn.sendMessage(m.chat, { 
            audio: { url: media }, 
            mimetype: 'audio/mpeg', 
            ptt: false  // إرسال كرسالة صوتية
        });

    } catch (error) {
        console.error(error);
        throw '*_حدث خطأ أثناء معالجة الطلب_*';
    }
};

handler.help = ['play'].map(v => v + ' <بحث>');
handler.tags = ['downloader'];
handler.command = /^play$/i;

export default handler;