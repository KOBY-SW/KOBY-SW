const {
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia
} = (await import("baileys"))["default"];
import yts from 'yt-search';
var handler = async (m, {
  conn,
  command,
  text,
  usedPrefix
}) => {
  if (!text) {
    throw `أكتب العنوان أو الرابط `;
  }
  m.reply(wait);
  try {
    let results = await yts(text);
    let tes = results.all[0]
    let {
      title,
      thumbnail,
      timestamp,
      views,
      ago,
      url
    } = tes;
    let teks = "\n*" + title + "*" + "\n\n*الوقت⏳️:* " +  timestamp + "\n*المشاهدات🩵:* " + views + "\n*مدة النشر🚀 :* " + ago + "\n*الرابط📎:* " + url + "\n";
    let msg = generateWAMessageFromContent(m.chat, {
      'viewOnceMessage': {
        'message': {
          'messageContextInfo': {
            'deviceListMetadata': {},
            'deviceListMetadataVersion': 0x2
          },
          'interactiveMessage': proto.Message.InteractiveMessage.create({
            'body': proto.Message.InteractiveMessage.Body.create({
              'text': teks
            }),
            'footer': proto.Message.InteractiveMessage.Footer.create({
              'text': wm
            }),
            'header': proto.Message.InteractiveMessage.Header.create({
              'hasMediaAttachment': false,
              ...(await prepareWAMessageMedia({
                'image': {
                  'url': thumbnail
                }
              }, {
                'upload': conn.waUploadToServer
              }))
            }),
            'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.create({
              'buttons': [{
                'name': "quick_reply",
                'buttonParamsJson': "{\"display_text\":\"🍀Audio\",\"id\":\".ytmp3 " + url + "\"}"
              }, {
                'name': "quick_reply",
                'buttonParamsJson': "{\"display_text\":\"🍁Video\",\"id\":\".ya " + url + "\"}"
              }]
            })
          })
        }
      }
    }, {
      'quoted': m
    });
    return await conn.relayMessage(m.chat, msg.message, {});
  } catch (err) {
    conn.sendFile(m.chat, eror, "anu.mp3", null, m, true, {
      'type': "audioMessage",
      'ptt': true
    });
  }
};
handler.help = ["play"];
handler.tags = ["downloader"];
handler.command = /^(play)$/i;

export default handler;