import { exec } from "child_process";

const handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) {
        return conn.reply(m.chat, "⚠️ الرجاء كتابة أمر لتنفيذه.", m);
    }

    exec(text, (error, stdout, stderr) => {
        if (error) {
            return conn.reply(m.chat, `❌ خطأ أثناء التنفيذ:\n\`\`\`${error.message}\`\`\``, m);
        }
        if (stderr) {
            conn.reply(m.chat, `⚠️ مخرجات خطأ:\n\`\`\`${stderr}\`\`\``, m);
        }
        conn.reply(m.chat, `✅ نتيجة الأمر:\n\`\`\`${stdout}\`\`\``, m);
    });
};

handler.command = /^i$/i;
export default handler;