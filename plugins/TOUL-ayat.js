import axios from 'axios';

const Murottal = {
    async list() {
        return (await axios.get('https://www.assabile.com/ajax/loadplayer-33-0')).data.Recitation;
    },
    async search(q) {
        let list = await Murottal.list();
        return (typeof q === 'number') ? [list[q - 1]] : list.filter(_ => {
            return _.span_name.toLowerCase().replace(/\W/g, '').includes(q.replace(/\W/g, ''));
        });
    },
    async audio(d) {
        const mp3 = await axios.get(`https://www.assabile.com/ajax/getrcita-link-${d.href.slice(1)}`, {
            headers: {
                'authority': 'www.assabile.com',
                'accept': '*/*',
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'referer': 'https://www.assabile.com/maher-al-mueaqly-33/maher-al-mueaqly.htm',
                'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
                'sec-ch-ua-mobile': '?1',
                'sec-ch-ua-platform': '"Android"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
                'x-requested-with': 'XMLHttpRequest'
            },
            decompress: true
        });
        return mp3.data;
    }
};

const handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('*⚠️ يرجى إدخال اسم السورة أو رقمها*');

    try {
        const searchResults = await Murottal.search(args[0]);

        if (searchResults.length === 0) {
            return m.reply('*❌ لم يتم العثور على نتائج للسورة المطلوبة*');
        }

        const mp3Url = await Murottal.audio(searchResults[0]);

        const info = `📖 *${searchResults[0].span_name}*\n🔢 *رقم السورة:* ${searchResults[0].sura_id}\n⏱️ *المدة:* ${searchResults[0].duration}`;
        
        await m.reply(info);
        await conn.sendMessage(m.chat, { audio: { url: mp3Url }, mimetype: 'audio/mpeg', ptt: false }, { quoted: m });
    } catch (error) {
        console.error(error);
        m.reply('*❌ حدث خطأ أثناء جلب التلاوة*');
    }
};

handler.help = ['ayat <اسم_السورة | رقم_السورة>'];
handler.tags = ['TOUL'];
handler.command = /^ayat$/i;

export default handler;