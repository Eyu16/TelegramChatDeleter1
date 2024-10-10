const fs = require('fs');
const { getClient } = require('./client');

const client = getClient();
// const sendMessage = async function (audioBuffer, title, duration) {
//   const data = await client.invoke({
//     _: 'sendMessage',
//     chat_id: 6151371160, // Replace with the actual chat ID
//     input_message_content: {
//       _: 'inputMessageAudio',
//       audio: {
//         _: 'inputFileGenerated', // Use 'inputFileGenerated' to send from buffer
//         original_path: title, // You can use the title as the original path
//         conversion: '', // Conversion string can be empty
//         data: audioBuffer, // Send the audio buffer directly
//       },
//       duration, // Optionally specify the duration of the audio in seconds
//       title, // Optionally specify a title for the audio
//     },
//   });
// };
const sendMessage = async function (path, title, duration) {
  console.log('fineshed start sending audio  2222');

  try {
    const data = await client.invoke({
      _: 'sendMessage',
      chat_id: 5612372732, // Replace with the actual chat ID
      input_message_content: {
        _: 'inputMessageAudio',
        audio: {
          _: 'inputFileLocal',
          path, // Use the path to the audio file
        },
        duration, // Optionally specify the duration of the audio in seconds
        title, // Optionally specify a title for the audio
      },
    });
  } catch (error) {
    console.log(error, 'from client');
  }
};

// console.log('fineshed start sending audio  33333');

// await client.invoke({
//   _: 'sendMessage',
//   chat_id: 'id', // Replace with the actual chat ID
//   input_message_content: {
//     _: 'inputMessageAudio',
//     audio: {
//       _: 'inputFileLocal',
//       path: audioFile, // Use the path to the audio file
//     },
//     duration: 0, // Optionally specify the duration of the audio in seconds
//     title: 'Audio Title', // Optionally specify a title for the audio
//     performer: 'Performer Name', // Optionally specify a performer name
//   },
// });

// const sendMessage = async function (stream, title, duration) {
//   // Create a buffer array to store chunks of the stream
//   const chunks = [];

//   // Collect the stream chunks into the buffer array
//   const buffer = await streamToBuffer(stream);
//   const data = buffer.toString('base64');
//   console.log(data);
//   // Send the buffer to Telegram
//   await client.invoke({
//     _: 'sendMessage',
//     chat_id: 6151371160,
//     input_message_content: {
//       _: 'inputMessageAudio',
//       audio: {
//         _: 'inputFileGenerated',
//         // original_path: title,
//         conversion: '#custom_audio_conversion',
//         // expected_size: buffer.length,
//         data,
//       },
//       duration: duration,
//       title: title,
//     },
//   });
// };

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (data) => {
      if (typeof data === 'string') {
        // Convert string to Buffer assuming UTF-8 encoding
        chunks.push(Buffer.from(data, 'utf-8'));
      } else if (data instanceof Buffer) {
        chunks.push(data);
      } else {
        // Convert other data types to JSON and then to a Buffer
        const jsonData = JSON.stringify(data);
        chunks.push(Buffer.from(jsonData, 'utf-8'));
      }
    });
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on('error', reject);
  });
}

module.exports = sendMessage;
