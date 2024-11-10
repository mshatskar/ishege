const TelegramBot = require('node-telegram-api-bot');
import fs from 'fs'

// Replace with your bot token
const BOT_TOKEN = '8164760892:AAGvSSSToWhckIXBJ8hKRy2hsRYBVnVP6yM';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onCommand('start', (msg) => {
    const fileStream = fs.createReadStream('./start.mp4');
    const captionText = `<b>Welcome to MASSVOL Bot 🌟</b>\n\n🌋 Generate volume and FOMO for massive trends and ranking! 🏅\n\n🛠 Fully customizable\n🥂 Revenue Share for holders of $MASSVOL\n😎 Clear and transparent\n⚡ Lightning Fast with low fees\nSupport contact: https://t.me/Massvol / @Massvol`
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Start Volume Bot', callback_data: 'welcome' }  // Button text and callback data
          ]
        ]
      }
    };

    await bot.sendVideo(chatId, fileStream, {
      caption: captionText,  // Add the caption here
      parse_mode: 'HTML', //Parse mode HTML 
      ...keyboard
    });
});

console.log('Bot started. Listening for commands...');