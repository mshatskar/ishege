import "dotenv/config";
import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import fs from 'fs'
import { ReadStream } from 'fs'

import * as commands from "./commands";
import { botToken, init } from "./config";
import { PublicKey } from "@solana/web3.js";
import { defaultMode1, defaultMode2 } from "./modes";
// import { init } from "./commands/helper";

const token = botToken;
const bot = new TelegramBot(token!, { polling: true });
export const CHATID: string = "";
let botName: string;
let editText: string;
let poolId: PublicKey;

console.log("Bot started");

bot.getMe().then((user) => {
  botName = user.username!.toString();
});

bot.setMyCommands(commands.commandList);

init();


bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
  const userId = msg?.from?.id!;
  const fullCode = match ? match[1] : null; 
  const chatId = msg.chat.id!;
  const username = msg?.from?.username!;
  const text = msg.text!;
  const msgId = msg.message_id!;
  const refCodeMatch = fullCode ? fullCode.match(/^ref_(.*)$/) : null; //take refcodematch
  if (text) console.log(`message : ${chatId} -> ${text}`);
  else return;

  //if user already exist or come without affilate
  if (msg.chat.type === 'private') {
    if (refCodeMatch) { 
      const refcode = refCodeMatch[1]; 
      // 'refcode' is the code
      // you have to check that refcode is valid and registed user to db or not
      // then  

      console.log(`${userId} reffered by ${refcode}`)

    }else{
      try {
        let result;
        const fileStream = fs.createReadStream('./start.mp4');
        const captionText = `<b>Welcome to MASSVOL Bot 🌟</b>\n\n🌋 Generate volume and FOMO for massive trends and ranking on solana! 🏅\n\n🛠 Fully customizable\n🥂 Revenue share for holders of $MASSVOL\n😎 Clear and transparent\n⚡ Lightning Fast with low fees\n\n🔥 Available on all top DEXs of solana including raydium, pump_fun, moonshot etc.`
        const keyboard = {
          reply_markup: {
              inline_keyboard: [
                [
                  { text: 'Create Volume 📉📈', callback_data: 'welcome' } // Button text and callback data
                ],
                [
                  { text: 'Support 📞', url: 'https://t.me/Massvol' }  // Button text and support url
                ]
              ]
            }
          };
    
        await bot.sendVideo(chatId, fileStream, {
          caption: captionText,  // Add the caption here
          parse_mode: 'HTML', //Parse mode HTML 
          ...keyboard
        });
        console.log('One user successfully started');
      }catch (e) {
        console.log("error -> \n", e);
      }
  }}else{
    bot.sendMessage(chatId, `Call me in your DM homie to create fomo :D`)
  }
});



bot.on("callback_query", async (query: CallbackQuery) => {
  const chatId = query.message?.chat.id!;
  const msgId = query.message?.message_id!;
  const action = query.data!;
  const username = query.message?.chat?.username!;
  console.log("username -> ", username)
  const callbackQueryId = query.id;

  console.log(`query : ${chatId} -> ${action}`);
  try {
    let result;
    switch (action) {
        case "welcome":
          result = await commands.welcome(chatId, username)
          await bot.sendMessage(chatId, result?.title, {
            reply_markup: {
              inline_keyboard: result?.content,
            },
            parse_mode: "HTML",
          });
  
          break;
  
        case "restart":
          result = await commands.welcome(chatId, username);
          await bot.sendMessage(chatId, result?.title, {
            reply_markup: {
              inline_keyboard: result?.content,
            },
            parse_mode: "HTML",
          });
  
          break;
        //main menu stuff from AB
        case "revenueShare":
            await bot.sendMessage(chatId, `<b>💸 Revenue Share for $MASSVOL Holders </b>👉 To be eligible for revenue share from @massvol_bot, hold $MASSVOL and get paid % equivalent to % of total supply of $MASSVOL you hold in the same wallet where you hold!\n\nℹ️ If you hold 1% of total supply of $MASSVOL in xyz.sol then you will get paid 1% of total revenue in xyz.sol in SOL 🔥\n\n📑 $MASSVOL's CA: <code>Coming soon...</code>\n\n<b>🌓 Buy $MASSVOL and HODL</b>`, {
              parse_mode: 'HTML', //Parse mode HTML 
            }); //Replace coming soon with legit contract address
            break;
      case "howitworks":
            await bot.sendMessage(chatId, `<b>❓ How it works</b>\n\n<b>Setp 1:</b> Deposit atleast 0.1 SOL in volume bot wallet through your public keys</b>\n<b>Step 2:</b> Click on 'Boost volume' button in the most bottom of main menu\n<b>Step 3:</b> Choose the DEX and then suitable option from Default or God mode\nStep 4: Config volume generation setting associated with mode\nLast step: Send Token address, take a look at quote and config then start making FOMO 🔥`, {
              parse_mode: 'HTML', //Parse mode HTML 
            });
          break;
      case "refferal":
            await bot.sendMessage(chatId, `<b>💸 Refferal</b>\n\nTotal refferals: <code>${'0'}</code>\n\n🔗 Link: <code>https://t.me/massvol_bot?start=ref_${query.from.id}</code>\n\nℹ️ Get 25% from our fees of your refferals, get paid in your volume bot wallet in solana!`, {
              parse_mode: 'HTML', //Parse mode HTML 
            }); //Please interegate reffera counting system here..  
        break;
      case "selectDex":
        result = await commands.selectDex(chatId);
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false,
          },
          parse_mode: "HTML",
        })

        break;

      case "selectRaydiumAmm":
        result = await commands.selectRaydiumAmm(chatId, "RaydiumAmm");
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false,
          },
          parse_mode: "HTML"
        });

        break;

      case "selectPump":
        result = await commands.selectRaydiumAmm(chatId, "PumpFun");
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false,
          },
          parse_mode: "HTML"
        });

        break;

      case "selectMoonshot":
        result = await commands.selectRaydiumAmm(chatId, "Moonshot");
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false,
          },
          parse_mode: "HTML"
        });

        break;

      case "selectMeteora":
        result = await commands.selectRaydiumAmm(chatId, "Meteora");
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false,
          },
          parse_mode: "HTML"
        });

        break;

      case "select2022":
        result = await commands.selectRaydiumAmm(chatId, "Token2022");
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false,
          },
          parse_mode: "HTML"
        });

        break;

      case "boostVolume":
        result = await commands.selectOption(chatId);
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false, // Disable input field
          },
          parse_mode: "HTML",
        });

        break;

      case "default":
        result = await commands.defaultMode(chatId, username);
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false, // Disable input field
          },
          parse_mode: "HTML",
        });

        break;

      case "package1":
        result = await commands.defaultSetting(chatId, defaultMode1, username)
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false, // Disable input field
          },
          parse_mode: "HTML",
        });

        break;

      case "package2":
        result = await commands.defaultSetting(chatId, defaultMode2, username)
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false, // Disable input field
          },
          parse_mode: "HTML",
        });

        break;

      case "customOption":
        result = await commands.customOption(chatId, username);
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false, // Disable input field
          },
          parse_mode: "HTML",
        });

        break;

      case "makeVolumeWallet":
        result = await commands.makeVolumeWallet(chatId, username);
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false, // Disable input field
          },
          parse_mode: "HTML",
        });

        break;

      case "sendTokenAddr":
        const sendTokenAddr_msg = await bot.sendMessage(
          chatId,
          "Please send a token mint address for volume market making."
        );
        bot.once(`message`, async (msg) => {
          if (msg.text) {
            result = await commands.sendTokenAddr(msg.chat.id, String(msg.text));
            await bot.sendMessage(chatId, result?.title, {
              reply_markup: {
                inline_keyboard: result?.content,
                force_reply: false, // Disable input field
              },
              parse_mode: "HTML",
            });

            await bot.deleteMessage(chatId, sendTokenAddr_msg.message_id);
          }
        });

        break;

      case "sendPoolAddr":
        const sendPoolAddr_msg = await bot.sendMessage(
          chatId,
          "Please send the Pool address of the Token for volume market making."
        );
        bot.once(`message`, async (msg) => {
          if (msg.text) {
            result = await commands.sendPoolAddr(msg.chat.id, String(msg.text));
            await bot.sendMessage(chatId, result?.title, {
              reply_markup: {
                inline_keyboard: result?.content,
                force_reply: false, // Disable input field
              },
              parse_mode: "HTML",
            });

            await bot.deleteMessage(chatId, sendPoolAddr_msg.message_id);
          }
        });

        break;

      case "deposit":
        result = await commands.checkDeposit(chatId);
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false, // Disable input field
          },
          parse_mode: "HTML",
        });

        break;

      case "confirmWallet":
        await bot.sendMessage(
          chatId,
          `Please wait for a second.`
        );
        result = await commands.confirmWallet(chatId);
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false, // Disable input field
          },
          parse_mode: "HTML",
        });

        break;

      case "setBuyUpperAmount":
        const buyUpperAmount_msg = await bot.sendMessage(
          chatId,
          "Input upper limit for random buy amount. It should be less than distribution Sol amount."
        );
        bot.once(`message`, async (msg) => {
          if (msg.text) {
            result = await commands.setBuyUpperAmount(msg.chat.id, Number(msg.text));
            await bot.sendMessage(msg.chat.id, result?.title, {
              reply_markup: {
                inline_keyboard: result?.content,
                force_reply: false, // Disable input field
              },
              parse_mode: "HTML",
            });

            await bot.deleteMessage(msg.chat.id, buyUpperAmount_msg.message_id);
          }
        });

        break;

      case "resetBuyUpperAmount":
        const rebuyUpperAmount_msg = await bot.sendMessage(
          chatId,
          "Input upper limit for random buy amount. It should be less than distribution Sol amount."
        );
        bot.once(`message`, async (msg) => {
          if (msg.text) {
            result = await commands.setBuyUpperAmount(msg.chat.id, Number(msg.text));
            const resetBuyUpperMessage = await bot.sendMessage(msg.chat.id, result?.title, {
              reply_markup: {
                inline_keyboard: result?.content,
                force_reply: false, // Disable input field
              },
              parse_mode: "HTML",
            });

            await bot.deleteMessage(msg.chat.id, rebuyUpperAmount_msg.message_id);
            if (result.reset) {
              await bot.deleteMessage(msg.chat.id, resetBuyUpperMessage.message_id);
            }
          }
        });

        break;

      case "setBuyLowerAmount":
        const buyLowerAmount_msg = await bot.sendMessage(
          chatId,
          "Input Lower limit for random buy amount. It should be lower than Upper amount."
        );
        bot.once(`message`, async (msg) => {
          if (msg.text) {
            result = await commands.setBuyLowerAmount(msg.chat.id, Number(msg.text));
            await bot.sendMessage(msg.chat.id, result?.title, {
              reply_markup: {
                inline_keyboard: result?.content,
                force_reply: false, // Disable input field
              },
              parse_mode: "HTML",
            });

            await bot.deleteMessage(msg.chat.id, buyLowerAmount_msg.message_id);
          }
        });

        break;

      case "resetBuyLowerAmount":
        const rebuyLowerAmount_msg = await bot.sendMessage(
          chatId,
          "Input Lower limit for random buy amount. It should be lower than Upper amount."
        );
        bot.once(`message`, async (msg) => {
          if (msg.text) {
            result = await commands.setBuyLowerAmount(msg.chat.id, Number(msg.text));
            const resetBuyLowerMessage = await bot.sendMessage(msg.chat.id, result?.title, {
              reply_markup: {
                inline_keyboard: result?.content,
                force_reply: false, // Disable input field
              },
              parse_mode: "HTML",
            });

            await bot.deleteMessage(msg.chat.id, rebuyLowerAmount_msg.message_id);
            if (result.reset) await bot.deleteMessage(msg.chat.id, resetBuyLowerMessage.message_id);
          }
        });

        break;

      case "setBuyInterval":
        const buyInterval_msg = await bot.sendMessage(
          chatId,
          "Input buy interval in seconds. It should be greater than 0.1s"
        );
        bot.once(`message`, async (msg) => {
          if (msg.text) {
            result = await commands.setBuyInterval(msg.chat.id, Number(msg.text));
            await bot.sendMessage(msg.chat.id, result?.title, {
              reply_markup: {
                inline_keyboard: result?.content,
                force_reply: false, // Disable input field
              },
              parse_mode: "HTML",
            });

            await bot.deleteMessage(msg.chat.id, buyInterval_msg.message_id);
          }
        });

        break;

      case "setDuration":
        const duration_msg = await bot.sendMessage(
          chatId,
          "Input duration of bot running in seconds. It should be greater than buyInterval"
        );
        bot.once(`message`, async (msg) => {
          if (msg.text) {
            result = await commands.setDuration(msg.chat.id, Number(msg.text));
            await bot.sendMessage(msg.chat.id, result?.title, {
              reply_markup: {
                inline_keyboard: result?.content,
                force_reply: false, // Disable input field
              },
              parse_mode: "HTML",
            });

            await bot.deleteMessage(msg.chat.id, duration_msg.message_id);
          }
        });

        break;

      case "showVolumeWallet":
        result = await commands.showWallet(chatId)

        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false, // Disable input field
          },
          parse_mode: "HTML",
        });

        break;

      case "changeVolumeWallet":
        const sendNewWallet_msg = await bot.sendMessage(
          chatId,
          "Please send secretkey of your wallet for volume market making."
        );
        bot.once(`message`, async (msg) => {
          if (msg.text) {
            result = await commands.changeVolumeWallet(chatId, String(msg.text));
            await bot.sendMessage(chatId, result?.title, {
              reply_markup: {
                inline_keyboard: result?.content,
                force_reply: false, // Disable input field
              },
              parse_mode: "HTML",
            });

            await bot.deleteMessage(chatId, sendNewWallet_msg.message_id);
          }
        });

        break;

      case "godReset":
        result = await commands.godReset(chatId)
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false
          },
          parse_mode: "HTML",
        });

        break;

      case "resetAgree":
        result = await commands.agreedReset(chatId)
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false
          },
          parse_mode: "HTML"
        });

        break;

     // case "start":
      //  result = await commands.start(chatId);
      //  await bot.sendMessage(chatId, result?.title, {
     //     reply_markup: {
     //       inline_keyboard: result?.content,
      //      force_reply: false, // Disable input field
      //    },
      //    parse_mode: "HTML",
      //  });

      //  break;

      case "stop":
        result = await commands.stopProcess(chatId);
        await bot.sendMessage(chatId, result?.title, {
          reply_markup: {
            inline_keyboard: result?.content,
            force_reply: false, // Disable input field
          },
          parse_mode: "HTML",
        });

        break;

     // case "unwrap":
     //   result = await commands.unwrap(chatId);
     //   await bot.sendMessage(chatId, result?.title, {
     //     reply_markup: {
     //       inline_keyboard: result?.content,
     //       force_reply: false, // Disable input field
     //     },
     //     parse_mode: "HTML",
     //   });

     //   break;

    }
  } catch (e) {
    console.log("error -> \n", e);
  }
});
