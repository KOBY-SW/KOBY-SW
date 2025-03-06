import axios from 'axios';

const handler = async (m, { conn, args }) => {
    if (!args[0]) throw '*_يرجى إدخال رابط الفيديو_*';

    try {
        const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(args[0])}&quality=128kbps`;
        const response = await axios.get(apiUrl);

        if (response.data.status !== 200) throw '*_فشل في جلب البيانات، يرجى المحاولة مرة أخرى_*';

        const { media } = response.data.result;

        await conn.sendMessage(m.chat, { 
            audio: { url: media }, 
            mimetype: 'audio/mpeg', 
            ptt: true  // إرسال كرسالة صوتية
        });

    } catch (error) {
        console.error(error);
        throw '*_حدث خطأ أثناء معالجة الطلب_*';
    }
};

handler.help = ['ytmp3'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^play$/i;

export default handler;