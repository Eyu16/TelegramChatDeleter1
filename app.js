const express = require('express');
const cors = require('cors');
const logIn = require('./controllers/logInController');
const logOut = require('./controllers/logOutController');
const deleteJoinedChats = require('./controllers/deleteJoinedChat');
const downloadMusic = require('./controllers/downloadMusic');

const app = express();
app.use(cors());
app.use(express.json());
let authCodeResolver = null;
let twoFactorAuthResolver = null;

app.post('/login', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const authCodePromise = new Promise((resolve, reject) => {
      authCodeResolver = resolve;
    });
    const twoFactorAuthPromise = new Promise((resolve, reject) => {
      twoFactorAuthResolver = resolve;
    });

    await logIn(phoneNumber, authCodePromise, twoFactorAuthPromise);

    res.status(200).json({
      status: 'Success',
      message: 'Login Request Succeded',
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'Fail',
      message: 'Login Request Failed',
    });
  }
});

app.post('/code', async (req, res) => {
  try {
    const { authCode } = req.body;
    if (process.env.isAuthCodeSent) throw new Error();
    authCodeResolver(authCode);
    res.status(200).json({
      status: 'Success',
      message: 'Authentication Code Sent',
    });
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: 'Authentication Code Incorrect',
    });
  }
});

app.post('/2fa', async (req, res) => {
  try {
    const { twoFactorAuth } = req.body;
    res.status(200).json({
      status: 'Success',
      message: 'Login Succeded',
    });
    twoFactorAuthResolver(twoFactorAuth);
  } catch (error) {
    res.status(400).json({
      status: 'Fail',
      message: '2FA Code Incorrect',
    });
  }
});

app.post('/logout', async (req, res) => {
  await logOut();
  res.status(200).json({
    status: 'success',
    message: 'You have successful logged out',
  });
});

app.post('/delete', async (req, res) => {
  await deleteJoinedChats();
  res.status(200).json({
    status: 'success',
    message: 'You have successful deleted',
  });
});

app.get('/download', downloadMusic);

module.exports = app;
