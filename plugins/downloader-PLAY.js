import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let url = text.split(' ')[0];

    if (!url) {
        return conn.reply(m.chat, `Use the format: ${usedPrefix}${command} <url>`, m);
    }

    // Sending request status message
    m.reply (wait);

    let res = await fetch(`https://ytdownloader.nvlgroup.my.id/info?url=${url}`);
    if (!res.ok) return conn.reply(m.chat, 'Failed to fetch video information', m);

    let info = await res.json();
    let title = info.title;
    let duration = info.duration || 'Unknown';

    let downloadUrl = `https://ytdownloader.nvlgroup.my.id/audio?url=${url}&bitrate=128`;
    let audioRes = await fetch(downloadUrl);
    if (!audioRes.ok) return conn.reply(m.chat, 'Failed to download audio', m);

    let audioBuffer = await audioRes.buffer();
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
            ptt: false// Sends as a voice note
        }, { quoted: m });
    }
};

handler.help = ['ytmp3'];
handler.command = ['ytmp3'];
handler.tags = ['downloader'];

export default handler;