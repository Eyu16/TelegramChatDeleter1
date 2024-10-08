const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ytdl = require('@distube/ytdl-core');
const sendMessage = require('./sendMessage');
const youtube = google.youtube('v3');

async function downloadPlayListAudios(playlistId) {
  const response = await youtube.playlistItems.list({
    part: 'snippet',
    maxResults: 2,
    playlistId: 'PLSujxUKxUFxuri4XrFhDjkJEifRxNCtYq',
    key: process.env.APIKEY,
  });
  // PLSujxUKxUFxuri4XrFhDjkJEifRxNCtYq
  // PLvy5jih231da691sjb1Ji
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (const item of response.data.items) {
    const { videoId } = item.snippet.resourceId;
    console.log(`Processing video ID: ${videoId}`);
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const stream = await ytdl(url, {
      filter: 'audioonly',
    });

    const filePath = `./Music/${item.snippet.title}.mp3`;
    const writeStream = fs.createWriteStream(filePath);
    stream.pipe(writeStream);
    writeStream.on('finish', async () => {
      console.log(`Downloaded: ${item.snippet.title}.mp3`);
      const detail = await getMusicDetails(videoId);
      const duration = detail.contentDetails.duration;
      const { minutes, seconds } = extractMinutesAndSeconds(duration);
      const totalSec = minutes * 60 + seconds;
      console.log(minutes, seconds);
      const data = await sendMessage(
        filePath,
        `${item.snippet.title}`,
        totalSec
      );
    });

    writeStream.on('error', (error) => {
      console.error('Error:', error);
    });

    await delay(5000); // Delay of 30 seconds between downloads
  }
}

// async function downloadPlayListAudios(playlistId) {
//   const response = await youtube.playlistItems.list({
//     part: 'snippet',
//     maxResults: 2,
//     playlistId: 'PLvy5jih231da691sjb1Ji-KSjKnFmJMkm',
//     key: process.env.APIKEY,
//   });
//   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//   for (const item of response.data.items) {
//     // const { videoId } = item.snippet.resourceId;
//     // const videoId = 'XZL4IG5RZZ8';
//     const { videoId } = item.snippet.resourceId;
//     // console.log(`Processing video ID: ${videoId}`);
//     const url = `https://www.youtube.com/watch?v=${videoId}`;
//     let audioBuffer = Buffer.alloc(0);
//     const stream = ytdl(url, {
//       filter: 'audioonly',
//     });
//     stream.on('data', (chunk) => {
//       audioBuffer = Buffer.concat([audioBuffer, chunk]);
//     });
//     stream.on('end', async () => {
//       const detail = await getMusicDetails(videoId);
//       const duration = detail.contentDetails.duration;
//       const { minutes, seconds } = extractMinutesAndSeconds(duration);
//       const totalSec = minutes * 60 + seconds;
//       console.log(minutes, seconds);
//       console.log('it is happening');
//       await sendMessage(audioBuffer, `${item.snippet.title}`, totalSec);
//     });
//     // const filePath = `./Music/${item.snippet.title}.mp3`;
//     // const writeStream = fs.createWriteStream(filePath);
//     // stream.pipe(writeStream);
//     // console.log(`Downloaded: ${item.snippet.title}.mp3`);
//     // const detail = await getMusicDetails(videoId);
//     // const duration = detail.contentDetails.duration;
//     // const { minutes, seconds } = extractMinutesAndSeconds(duration);
//     // const totalSec = minutes * 60 + seconds;
//     // console.log(minutes, seconds);
//     // writeStream.on('finish', async () => {
//     //   console.log('fineshed start sending audio  1111');
//     //   await sendMessage(filePath, `${item.snippet.title}`, totalSec);
//     // });
//     await delay(5000); // Delay of 30 seconds between downloads
//   }
// }

async function getMusicDetails(videoId) {
  const response = await axios.get(
    'https://www.googleapis.com/youtube/v3/videos',
    {
      params: {
        id: videoId,
        part: 'snippet,contentDetails,statistics',
        key: process.env.APIKEY,
      },
    }
  );
  return response.data.items[0];
}

function extractMinutesAndSeconds(duration) {
  // Regular expression to match the ISO 8601 duration format
  const regex = /PT(\d+M)?(\d+S)?/;
  const matches = duration.match(regex);

  // Extract the minutes and seconds
  const minutes = matches[1] ? parseInt(matches[1].replace('M', '')) : 0;
  const seconds = matches[2] ? parseInt(matches[2].replace('S', '')) : 0;

  return { minutes, seconds };
}

const downloadMusic = async (req, res) => {
  console.log('We are here');
  await downloadPlayListAudios();
  res.status(200).json({
    status: 'success',
    message: 'Stored In local disk',
  });
};
module.exports = downloadMusic;
