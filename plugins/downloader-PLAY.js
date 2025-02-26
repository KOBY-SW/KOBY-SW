import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let url = text.split(' ')[0];

    if (!url) {
        return conn.reply(m.chat, `Use the format: ${usedPrefix}${command} <url>`, m);
    }

    // إرسال رسالة انتظار
    m.reply(wait);

    let downloadUrl = `https://ytdownloader.nvlgroup.my.id/audio?url=${url}&bitrate=128`;

    try {
        // تنفيذ الطلبين معًا
        let [audioRes, infoRes] = await Promise.all([
            fetch(downloadUrl),
            fetch(`https://ytdownloader.nvlgroup.my.id/info?url=${url}`)
        ]);

        if (!audioRes.ok) return conn.reply(m.chat, 'فشل تحميل الصوت', m);
        if (!infoRes.ok) return conn.reply(m.chat, 'فشل جلب معلومات الفيديو', m);

        let audioBuffer = await audioRes.buffer();
        let info = await infoRes.json();
        let title = info.title || 'audio';

        let audioSize = audioBuffer.length / (1024 * 1024);

        if (audioSize > 100) {
            await conn.sendMessage(m.chat, {
                document: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`
            });
        } else {
            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: "audio/mpeg",
                ptt: false
            }, { quoted: m });
        }

    } catch (err) {
        console.error(err);
        conn.reply(m.chat, 'حدث خطأ أثناء جلب الفيديو.', m);
    }
};

handler.help = ['ytmp3'];
handler.command = ['yt'];
handler.tags = ['downloader'];

export default handler;