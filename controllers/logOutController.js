const { getClient } = require('./client');
const client = getClient();
async function logOut() {
  console.log('LoggedOut Successfuly');
  await client.invoke({ _: 'logOut' });
}
module.exports = logOut;
