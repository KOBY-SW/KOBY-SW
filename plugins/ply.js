import fs from 'fs';
import archiver from 'archiver';

let handler = async (m, { conn, command }) => {
    
    await m.reply('🕐 جاري تحميل مجلد plugins كملف ZIP...');

    const folderPath = './plugins'; // مسار مجلد plugins
    const zipFilePath = './plugins.zip'; 

    
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
        zlib: { level: 9 } 
    });

    archive.pipe(output);
    archive.directory(folderPath, false);
    await archive.finalize();


    output.on('close', async () => {
        
        if (fs.existsSync(zipFilePath)) {
    
 await conn.sendFile(m.chat, zipFilePath, 'plugins.zip', '📂 إليك مجلد plugins كملف ZIP', m);
            fs.unlinkSync(zipFilePath); // حذف الملف بعد إرساله
        } else {
            m.reply('❌ حدث خطأ أثناء ضغط المجلد. لم يتم العثور على الملف.');
        }
    });

    archive.on('error', (err) => {
        console.log(err);
        m.reply('❌ حدث خطأ أثناء تحميل المجلد.');
    });
};

handler.help = ['.plugin'];
handler.tags = ['developer'];
handler.command = /^\plu$/i;

export default handler;