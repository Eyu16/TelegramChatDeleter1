const { chat_ids } = await client.invoke({
  _: "getChats",
  chat_list: { _: "chatListMain" },
  limit: 1000,
});

await client.invoke({
  _: "sendMessage",
  chat_id: "id",
  input_message_content: {
    _: "inputMessageText",
    text: {
      _: "formattedText",
      text: await input.text("What do you wanna say the user"),
    },
  },
});

chat_ids.forEach(async (id) => {
  const chat = await client.invoke({ _: "getChat", chat_id: id });
  console.log(chat.title, id);
});
