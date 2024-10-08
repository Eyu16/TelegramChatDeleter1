const tdl = require('tdl');
const { getTdjson } = require('prebuilt-tdlib');
tdl.configure({ tdjson: getTdjson() });

const client = tdl.createClient({
  apiId: '',
  apiHash: '',
});
client.on('error', (error) => console.log(error));
async function main() {
  await client.login();
  const { chat_ids } = await client.invoke({
    _: 'getChats',
    chat_list: { _: 'chatListMain' },
    limit: 10,
  });
  for (let i = 0; i < chat_ids.length; i++) {
    const id = chat_ids[i];
    const chat = await client.invoke({ _: 'getChat', chat_id: id });
    const chatHistory = await client.invoke({
      _: 'getChatHistory',
      chat_id: id,
      limit: 1,
    });

    console.log(chat.title, chatHistory.messages[0].content._);

    if (chatHistory.messages[0].content._ === 'messageContactRegistered') {
      console.log(chat.title, chatHistory.messages[0].content._);
      await client.invoke({ _: 'deleteChat', chat_id: id });
      console.log(`Success fully deleted ${chat.title}'s chat`);
      break;
    }
  }
  // await client.invoke({ _: "logOut" });
  await client.close();
}

main().catch(console.error);
