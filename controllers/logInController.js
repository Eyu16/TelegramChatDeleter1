const { getClient } = require('./client');

async function logIn(phoneNumber, authCodePromise, twoFactorAuthPromise) {
  try {
    const client = getClient();
    await client.login({
      async getPhoneNumber(retry) {
        if (!phoneNumber) {
          throw new Error('PHONE_NUMBER environment variable is not set');
        }
        return phoneNumber;
      },
      async getAuthCode(retry) {
        const timeOutPromise = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error('AuthCode Time Limit Expired')),
            30000
          );
        });
        const code = await Promise.race([authCodePromise, timeOutPromise]);
        process.env.isAuthCodeSent = true;
        return code;
      },
      async getPassword(passwordHint, retry) {
        const code = await twoFactorAuthPromise;
        return code;
      },
    });
  } catch (error) {
    await getClient().invoke({ _: 'logOut' });
    throw error;
  }
}
module.exports = logIn;
