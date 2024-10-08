const tdl = require('tdl');
const { getTdjson } = require('prebuilt-tdlib');
tdl.configure({ tdjson: getTdjson() });
let client;

const createClient = function () {
  client = tdl.createClient({
    apiId: process.env.APIID,
    apiHash: process.env.API_HASH,
  });
  client.on('update', async (update) => {
    if (update._ === 'updateChatLastMessage') {
      const chatHistory = await client.invoke({
        _: 'getChatHistory',
        chat_id: update.chat_id,
        limit: 1,
      });
      const chat = await client.invoke({
        _: 'getChat',
        chat_id: update.chat_id,
      });
      console.log(chatHistory.messages[0]?.content?.text?.text?.toLowerCase());
      if (
        chatHistory.messages[0]?.content._ === 'messageContactRegistered' ||
        chatHistory.messages[0]?.content?.text?.text?.toLowerCase() === 'clear'
      ) {
        console.log(chat);
        console.log('updated lastchat deleting registered');
        await client.invoke({
          _: 'deleteChat',
          chat_id: update.chat_id,
        });
      }
    }
  });
};

createClient();

module.exports = {
  getClient() {
    console.log(`${client.isClosed()} from Client`);
    if (client.isClosed()) {
      createClient();
    }
    return client;
  },
};
