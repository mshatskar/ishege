export const commandList = [
    { command: 'start', description: 'Start the bot' },
];

import { ComputeBudgetProgram, Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { BUY_INTERVAL, BUY_LOWER_AMOUNT, BUY_UPPER_AMOUNT, DAO_CONFIRM_FEE, DAO_PUBLIC_KEY, DEV_CONFIRM_FEE, DURATION, LAMPORTS_PER_SOL, OWNER_PUBLIC_KEY, solanaConnection } from "../config";
import * as helper from "./helper"
import base58 from "bs58";
import { cancelProcess, startProcess } from "./helper";
import { getAssociatedTokenAddress, NATIVE_MINT } from "@solana/spl-token";
import { unwrapSol } from "../volume_bot/unwrap";
import { startVolumeBot } from "../volume_bot";
import { defaultMode2 } from "../modes";

export const welcome = async (chatId: number, username?: string) => {
    const userInfo = await helper.findOfUser(chatId, username);

    if (userInfo?.publicKey) {
        console.log("This is already registered User. User's wallet is set: ", userInfo?.publicKey)

        const publicKey: PublicKey = new PublicKey(userInfo?.publicKey!);
        const solAmount = (await solanaConnection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
        const title = `ℹ️ <b>Here below there is your MM wallet info\n\n💹 MM Wallet's PublicKey: <code>${userInfo.publicKey}</code>\n\n💰 Your Balance: <b>${solAmount} SOL</b>`
        const content = [
            [{ text: 'Revenue Share 💵', callback_data: 'revenueShare' }, { text: '❓ How it works', callback_data: 'howitworks' }, ],
            [{ text: 'Referral 🔗', callback_data: 'refferal' }, { text: 'Support 📞', url: 'https://t.me/Massvol' } ],
            [{ text: '⚡ Boost Volume ⚡', callback_data: 'selectDex' }],
        ]

        return { title, content }
    } else {
        console.log("User's wallet is not set.")
        const solAmount = (await solanaConnection.getBalance(userInfo.publicKey)) / LAMPORTS_PER_SOL;
        const title = `<b>📉📈 MASSVOL bot</b>\n\n💰 Wallet: <code>${userInfo.publicKey}</code> (${solAmount.toFixed(3)} SOL)\n\nℹ️ Click on 'Boost volume' and start creating FOMO on top DEXs of Solana 🚀`
        const content = [
            [{ text: 'Revenue Share 💵', callback_data: 'revenueShare' }, { text: '❓ How it works', callback_data: 'howitworks' }, ],
            [{ text: 'Referral 🔗', callback_data: 'refferal' }, { text: 'Support 📞', url: 'https://t.me/Massvol' } ],
            [{ text: '⚡ Boost Volume ⚡', callback_data: 'selectDex' }],
        ]
        return { title, content }
    }
}

export const selectDex = async (chatId: number) => {
    const title = `📢 Select one of the DEX to run volume booster 📢`

    const content = [[{ text: 'Raydium-AMM', callback_data: 'selectRaydiumAmm' }],
    [{ text: 'PumpFun 🏅', callback_data: 'selectPump' }],
    [{ text: 'Moonshot', callback_data: 'selectMoonshot' }],
    [{ text: 'Meteora', callback_data: 'selectMeteora' }],
    [{ text: 'Token-2022', callback_data: 'select2022' }]]

    return { title, content }
}

export const selectRaydiumAmm = async (chatId: number, dexname: string) => {
    console.log(`Dexname is set as: -> ${dexname}`);

    await helper.updateDexName(chatId, dexname);
    const title = `💵 Dexname to boost the volume is set correctly: <b>${dexname}</b>, press continue button! 👨‍💼`
    const content = [[{ text: `✏️ Continue`, callback_data: `boostVolume` }, { text: `✏️ Reset`, callback_data: `selectDex` }]]

    return { title, content };
}

export const selectPump = async (chatId: number, dexname: string) => {
    console.log(`Dexname is set as: -> ${dexname}`);

    await helper.updateDexName(chatId, dexname);
    const title = `💵 Dexname to boost the volume is set correctly: <b>${dexname}</b>, press continue button! 👨‍💼`
    const content = [[{ text: `✏️ Continue`, callback_data: `boostVolume` }, { text: `✏️ Reset`, callback_data: `selectDex` }]]

    return { title, content };
}

export const selectMoonshot = async (chatId: number, dexname: string) => {
    console.log(`Dexname is set as: -> ${dexname}`);

    await helper.updateDexName(chatId, dexname);
    const title = `💵 Dexname to boost the volume is set correctly: <b>${dexname}</b>, press continue button! 👨‍💼`
    const content = [[{ text: `✏️ Continue`, callback_data: `boostVolume` }, { text: `✏️ Reset`, callback_data: `selectDex` }]]

    return { title, content };
}

export const selectMeteora = async (chatId: number, dexname: string) => {
    console.log(`Dexname is set as: -> ${dexname}`);

    await helper.updateDexName(chatId, dexname);
    const title = `💵 Dexname to boost the volume is set correctly: <b>${dexname}</b>, press continue button! 👨‍💼`
    const content = [[{ text: `✏️ Continue`, callback_data: `boostVolume` }, { text: `✏️ Reset`, callback_data: `selectDex` }]]

    return { title, content };
}

export const select2022 = async (chatId: number, dexname: string) => {
    console.log(`Dexname is set as: -> ${dexname}`);

    await helper.updateDexName(chatId, dexname);
    const title = `💵 Dexname to boost the volume is set correctly: <b>${dexname}</b>, press continue button! 👨‍💼`
    const content = [[{ text: `✏️ Continue`, callback_data: `boostVolume` }, { text: `✏️ Reset`, callback_data: `selectDex` }]]

    return { title, content };
}

export const selectOption = async (chatId: number) => {
    const title = `📉 Select one of the options to run volume booster 📈\n\n🍒 <b>Default</b> You can test two packages if you are the first with the bot!\n\n ⚡ <b>GOD Mode</b> You can fully customize your experience with the bot! ⚡`
    const content = [[{ text: 'Default 🚀', callback_data: 'default' }, { text: 'GOD Mode 🚈', callback_data: 'customOption' }]]
    return { title, content }
}

export const defaultMode = async (chatId: number, username?: string) => {

    console.log("Default mode selection.")

    const userDex = (await helper.findOfUser(chatId))?.dexname

    const title = `<b>You can select one of two packages!</b>\n\n<b>⭐️ Package1:</b> You can buy tokens with <b><u>0.0001 - 0.0002 SOL<b></u> and transaction <b><u>interval 0.1second</u></b>, and can get <b><u>400 makers</u></b> and totally <b><u>$30 volume!</u></b> (It looks small but if you increase the balance of the wallet, then you can increase the transaction amount, the volume will be multiplied by that amount, especially in a very short time)\n\n<b>🌟 Package2:<b> You can buy tokens with <b><u>0.004 - 0.005 SOL</u></b> and transaction <b><u>interval 2seconds</u></b>, and can get <b><u>360 makers</u></b> and totally <b><u>$1000 volume!</u></b>\n\n⚠️ Note :\n1. You are not using all balance of your wallet!\n2. You will get remaining balance at the end of bot running!`
    const content = [[{ text: ' Package1 📨', callback_data: 'package1' }, { text: ' Package2 📨', callback_data: 'package2' }]]
    return { title, content }
}

export const defaultSetting = async (chatId: number, mode: any, username?: string) => {
    const userData = {
        username: username,
        buyLowerAmount: mode.buyLowerAmount,
        buyUpperAmount: mode.buyUpperAmount,
        buyInterval: mode.buyInterval,
        duration: mode.duration,
    }

    console.log("Userinfo: ", userData)

    const userInfo = await helper.saveInfo(chatId, userData);
    const userDex = (await helper.findOfUser(chatId))?.dexname

    const title = `<b>🎄 Variables for Trading</b>\n\nℹ️ Name of DEX to boost the volume: <b>${userDex}</b>\n\n🔴 Lower amount for Buying per Transaction: <b>${mode.buyLowerAmount} SOL</b>\n🟢 Upper amount for Buying per Transaction: <b>${mode.buyUpperAmount} SOL</b>\n\n⚡️ Interval between buys in seconds: ${mode.buyInterval}s\n⛈ Total duration of running the bot in seconds: ${mode.duration}s`
    const content = [[{ text: ' Send Token Address 📨', callback_data: 'sendTokenAddr' }]]
    return { title, content }
}

export const customOption = async (chatId: number, username?: string) => {
    const userData = {
        username: username,
        buyLowerAmount: defaultMode2.buyLowerAmount,
        buyUpperAmount: defaultMode2.buyUpperAmount,
        buyInterval: defaultMode2.buyInterval,
        duration: defaultMode2.duration,
    }
    const userInfo = await helper.findOfUser(chatId, username);
    const userDex = userInfo?.dexname

    if (userInfo) {
        const title = `<b>🎄 Variables for Trading</b>\n\nℹ️ Name of DEX to boost the volume: <b>${userInfo.dexname}</b>\n\n🔴 Lower amount for Buying per Transaction: <b>${userInfo.buyLowerAmount} SOL</b> (Must be set lower than Upper amount 😎)\n🟢 Upper amount for Buying per Transaction: <b>${userInfo.buyUpperAmount} SOL</b> (Must be set lower than distribution amount)\n\n⚡️ Time interval between buys in milliseconds: <b>${userInfo.buyInterval}s</b> (Recommended to stay above 0.1)\nDuration of the running the bot: <b>${userInfo.duration}s</b> (Recommended to set depends on the balance)`
        const content = [[{ text: '💰 Buy Lower', callback_data: 'setBuyLowerAmount' }, { text: '💰 Buy Upper', callback_data: 'setBuyUpperAmount' }],
        [{ text: '⌚ Buy Interval', callback_data: 'setBuyInterval' }, { text: '⏰ Running Time', callback_data: 'setDuration' }],
        [{ text: '💵 Show Wallet', callback_data: 'showVolumeWallet' }],
        [{ text: 'Reset 🔄', callback_data: 'godReset' }, { text: 'Finish ➡️', callback_data: 'sendTokenAddr' }]]

        return { title, content };
    } else {
        const title = "Error"
        const content = [[{ text: '🔁 Restart', callback_data: '/start' }]]
        return { title, content }
    }
}

export const agreedReset = async (chatId: number, username?: string) => {
    const userData = {
        username: username,
        buyLowerAmount: BUY_LOWER_AMOUNT,
        buyUpperAmount: BUY_UPPER_AMOUNT,
        buyInterval: BUY_INTERVAL,
        duration: DURATION,
    }

    const userInfo = await helper.saveInfo(chatId, userData);
    const userDex = (await helper.findOfUser(chatId))?.dexname

    const title = `<b>🎄 Variables for Trading</b>\n\nℹ️ Name of DEX to boost the volume: <b>${userDex}</b>\n\n🔴 Lower amount for Buying per Transaction: <b>${BUY_LOWER_AMOUNT}</b> (Must be set lower than Upper amount 😎)\n🟢 Upper amount for Buying per Transaction: <b>${BUY_UPPER_AMOUNT}</b> (Must be set lower than distribution amount)\n\n⚡️ Time interval between buys in seconds: <b>${BUY_INTERVAL}</b>(Recommended to stay above 0.1)\n⛈ Duration of the running the bot in seconds: <b>${DURATION}</b> (Recommended to set depends on the balance)`

    const content = [[{ text: '💰 Buy Lower', callback_data: 'setBuyLowerAmount' }, { text: '💰 Buy Upper', callback_data: 'setBuyUpperAmount' }],
    [{ text: '⌚ Buy Interval', callback_data: 'setBuyInterval' }, { text: '⏰ Running Time', callback_data: 'setDuration' }],
    [{ text: 'Finish ➡️', callback_data: 'sendTokenAddr' }]]

    return { title, content }
}

export const sendTokenAddr = async (chatId: number, tokenAddr: String) => {
    const userInfo = await helper.findOfUser(chatId);

    await helper.updateTokenAddr(chatId, tokenAddr);
    const title = `💵 Token address is set correctly: <code>${tokenAddr}</code>\n\n👨‍💼 Press Continue button to continue or Press Reset button to reset`
    const content = [[{ text: `Continue ➡️`, callback_data: `sendPoolAddr` }, { text: `Reset 🔄`, callback_data: `sendTokenAddr` }]]

    return { title, content };
}

export const sendPoolAddr = async (chatId: number, poolAddr: String) => {
    const userInfo = await helper.findOfUser(chatId);

    await helper.updatePoolAddr(chatId, poolAddr);
    const title = `💵 Pool address is set correctly: <code>${poolAddr}</code>\n\n👨‍💼 Press Continue button to continue or Press Reset button to reset`
    const content = [[{ text: `Continue ➡️`, callback_data: `makeVolumeWallet` }, { text: `Reset 🔄`, callback_data: `sendPoolAddr` }]]

    return { title, content }
}

export const makeVolumeWallet = async (chatId: number, username?: string) => {
    const userData = await helper.findOfUser(chatId);
    const publicKey: PublicKey | undefined = userData?.publicKey ? new PublicKey(userData.publicKey) : undefined;
    const newWalletFee = 0.0011
    if (publicKey) {
        const solBalance = (await solanaConnection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
        const makerNum = Math.floor(userData?.duration! / userData?.buyInterval!)
        // console.log("Number of makers: ", makerNum)
        const solNeeded = (makerNum * 0.0001466 + (makerNum * 2 / 400 + 1) * userData?.buyUpperAmount! + 20 * 0.001063) * (100 + DEV_CONFIRM_FEE + DAO_CONFIRM_FEE) / 100;
        console.log("Sol amount needed: ", solNeeded)
        // console.log("BuyUpperAmount: ", userData?.buyUpperAmount)
        // console.log("New wallet fee: ", newWalletFee)
        // console.log("DEV confirm fee: ", DEV_CONFIRM_FEE)
        // console.log("DAO confirm fee: ", DAO_CONFIRM_FEE)
        const volumeAmt = (userData?.buyUpperAmount! + userData?.buyLowerAmount!) * makerNum;

        if (solBalance >= solNeeded) {
            const title = `💳 Your volume bot wallet: <code>${publicKey}</code>\n\n💰 Sol Balance in your MassVol wallet: <b>${solBalance.toFixed(3)} SOL</b>\n💸 Sol amount needed for volume booster: <b>${solNeeded.toFixed(3)} SOL</b>\n📈 Volume amount you will increase: <b>${volumeAmt.toFixed(3)} SOL</b>\n\n<b>Your wallet Sol balance is enough for trading 🔥</b>`
            const content = [[{ text: '🏆 OK', callback_data: 'confirmWallet' }]]
            return { title, content }
        } else {
            const depositAmt = solNeeded - solBalance;
            const title = `💳 Your volume bot wallet: <code>${publicKey}</code>\n\n💰 Sol Balance in your MassVol wallets: <b>${solBalance == 0 ? '0' : solBalance.toFixed(3)} SOL</b>\nSol amount needed for volume booster: <b>${solNeeded.toFixed(3)} SOL</b>\n📈 Volume amount you will increase: <b>${volumeAmt.toFixed(3)} SOL</b>\n\n💵 Please Deposit <code>${depositAmt} SOL</code> for volume booster!`
            const content = [[{ text: '💰 Deposit SOL', callback_data: 'deposit' }]]
            return { title, content }
        }
    } else {
        const wallet = Keypair.generate();
        const makerNum = Math.floor(userData?.duration! / userData?.buyInterval!)
        const newPublicKey = await helper.addBotWallet(chatId, wallet);
        const solNeeded = (makerNum * 0.0001466 + (makerNum * 2 / 400 + 1) * userData?.buyUpperAmount! + 20 * 0.001063) * (100 + DEV_CONFIRM_FEE + DAO_CONFIRM_FEE) / 100;
        // const solNeeded = (0.00015 * makerNum + userData?.buyUpperAmount! * 0.0025 * 2 * makerNum + newWalletFee * 20) * (100 + DEV_CONFIRM_FEE + DAO_CONFIRM_FEE) / 100;

        const title = `💳 Your volume bot wallet: <code>${newPublicKey}</code>\n\n💵 Please deposit <code>${solNeeded} SOL</code> for volume booster!`
        const content = [[{ text: '💰 Deposit SOL', callback_data: 'deposit' }]]
        return { title, content }
    }
}
export const changeVolumeWallet = async (chatId: number, secretKey: string) => {

    const keyPair = Keypair.fromSecretKey(base58.decode(secretKey))
    const publicKey = keyPair.publicKey
    const walletInfo = await solanaConnection.getAccountInfo(publicKey)
    const solAmount = (await solanaConnection.getBalance(publicKey)) / LAMPORTS_PER_SOL;

    if (!walletInfo) {
        const title = `💵 Volume Wallet SecretKey <code>${secretKey}</code> is invalid Wallet\n\n👨‍💼 Press Reset button to reset the Bot Wallet`
        const content = [[{ text: `Reset 🔄`, callback_data: `changeVolumeWallet` }]]

        return { title, content }
    }

    await helper.updateVolumeWallet(chatId, publicKey.toBase58(), secretKey);
    const title = `😎 Volume Wallet is set correctly:\n\n💹 Your Wallet PublicKey: <code>${publicKey.toBase58()}</code>\n
    🔓 Your Wallet SecretKey: <tg-spoiler>${secretKey}</tg-spoiler>\n💰 Your Balance: <code>${solAmount} SOL</code>\n\n👨‍💼 Press Continue button to continue or Press Reset button to reset`
    const content = [[{ text: `Continue`, callback_data: `customOption` }, { text: `Reset`, callback_data: `changeVolumeWallet` }]]

    return { title, content }
}

export const checkDeposit = async (chatId: number) => {
    const title = `Did you deposit SOL? 💸 `
    const content = [[{ text: '☑️ Yes', callback_data: 'confirmWallet' }, { text: '❌ Not yet', callback_data: 'deposit' }]]
    return { title, content }
}

export const confirmWallet = async (chatId: number) => {
    try {
        const newWalletFee = 0.00015
        const userData = await helper.findOfUser(chatId);
        const publicKey: PublicKey | undefined = userData?.publicKey ? new PublicKey(userData.publicKey) : undefined;
        const privateKey: string = userData?.privateKey!;

        // Create a Keypair from the private key
        const keypair = Keypair.fromSecretKey(base58.decode(privateKey))
        const ownerPublicKey: PublicKey = new PublicKey(OWNER_PUBLIC_KEY);
        const daoPublicKey: PublicKey = new PublicKey(DAO_PUBLIC_KEY);
        const makerNum = Math.floor(userData?.duration! / userData?.buyInterval!)
        const solNeeded = (makerNum * 0.0001466 + (makerNum * 2 / 400 + 1) * userData?.buyUpperAmount! + 20 * 0.001063) * (100 + DEV_CONFIRM_FEE + DAO_CONFIRM_FEE) / 100;

        if (publicKey) {
            const solBalance = (await solanaConnection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
            // const devFee = 0.0001
            // const daoFee = 0.0001
            const devFee = solNeeded * DEV_CONFIRM_FEE / 100;
            const daoFee = solNeeded * DAO_CONFIRM_FEE / 100;
            console.log(`SOL Balance: ${solBalance}`);

            //         const volumeWalletAmount = (await solanaConnection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
            //         const title = `SOL Balance: ${volumeWalletAmount}
            // You can start volume boosting with start button.`;
            //         const content = [[{ text: '🏆 Start', callback_data: 'start' }]]

            //         return { title, content }

            if (solBalance != 0) {
                if (solBalance > solNeeded) {
                    const sendSolTx: TransactionInstruction[] = []
                    sendSolTx.push(
                        ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 }),
                        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 250_000 })
                    )
                    sendSolTx.push(
                        SystemProgram.transfer({
                            fromPubkey: publicKey,
                            toPubkey: ownerPublicKey,
                            lamports: Math.round(devFee * LAMPORTS_PER_SOL)
                        })
                    )
                    sendSolTx.push(
                        SystemProgram.transfer({
                            fromPubkey: publicKey,
                            toPubkey: daoPublicKey,
                            lamports: Math.round(daoFee * LAMPORTS_PER_SOL)
                        })
                    )
                    const siTx = new Transaction().add(...sendSolTx)
                    const latestBlockhash = await solanaConnection.getLatestBlockhash()
                    siTx.feePayer = publicKey
                    siTx.recentBlockhash = latestBlockhash.blockhash

                    const signature = await solanaConnection.sendTransaction(siTx, [keypair], { skipPreflight: true })

                    // let i = 0;
                    // while (i < 5) {
                    const confirmation = await solanaConnection.confirmTransaction(
                        {
                            signature,
                            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
                            blockhash: latestBlockhash.blockhash,
                        }
                    );

                    if (confirmation.value.err) {
                        console.log("Fee paying transaction confirm error");
                        // i++;
                    } else {
                        const feePayTx = signature ? `https://solscan.io/tx/${signature}` : ''
                        console.log("Fee paid successfully: ", feePayTx);
                        const volumeWalletAmount = (await solanaConnection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
                        const title = `
            Fee for the usage of the volume wallet paid successfully.
            Total fee is 15% of the Sol amount needed for the volume boosting.
            Remaining SOL Balance: ${volumeWalletAmount}SOL
            You will start volume boosting with start button.`;
                        const content = [[{ text: '🏆 Start', callback_data: 'start' }]]
                        return { title, content }
                    }
                    // }

                    const title = `Retry to Confirm`;
                    const content = [[{ text: '🔁 Retry', callback_data: 'confirmWallet' }]]
                    return { title, content }

                } else {
                    const title = `SOL Balance: ${solBalance}SOL
            You must deposit ${solNeeded} at least for Trading.
            Please deposit enough sol for volume boosting.`
                    const content = [[{ text: '💰 Deposit Sol', callback_data: 'deposit' }]]
                    return { title, content }
                }
            } else {
                const title = `Retry to Confirm`;
                const content = [[{ text: '🔁 Retry', callback_data: 'confirmWallet' }]]
                return { title, content }
            }

        } else {
            console.log("Public key not found.");

            const title = `ReTry Confirm`;
            const content = [[{ text: '🔁 Retry', callback_data: 'confirmWallet' }]]
            return { title, content }
        }
    } catch (error) {
        console.error("Error confirming wallet:", error);

        const title = `An error occurred`;
        const content = [[{ text: '🔁 Retry', callback_data: 'confirmWallet' }]];
        return { title, content };
    }
}

export const godReset = async (chatId: number) => {
    console.log('Reset request coming...')
    const title = `❔ Do you really want to reset all values to default values?\n\n👨‍💼 If you really want, press Yes button and if not, press No button.
    `
    const content = [[{ text: '👌 Yes', callback_data: 'resetAgree' }, { text: '🚫 No', callback_data: 'customOption' }]]

    return { title, content }
}

export const showWallet = async (chatId: number) => {
    const userInfo = await helper.findOfUser(chatId);
    const privateKey = userInfo?.privateKey
    const publicKey = userInfo?.publicKey
    const solBalance = await solanaConnection.getBalance(new PublicKey(publicKey!)) / LAMPORTS_PER_SOL

    const title = `💹 Your Wallet PublicKey: <code>${publicKey}</code>\n\n🔒 Your Wallet SecretKey: <tg-spoiler>${privateKey}</tg-spoiler>\n\n💰 Your Balance: <code>${solBalance} SOL</code>\n\n👨‍💼 Press Change button to continue or Press Continue button to reset`

    const content = [[{ text: `Change ✏️`, callback_data: `changeVolumeWallet` }, { text: `Continue ➡️`, callback_data: `customOption` }]]

    return { title, content };
}

export const setBuyUpperAmount = async (chatId: number, buyUpperAmount: number) => {
    const userInfo = await helper.findOfUser(chatId);

    let title: string
    let reset: boolean = false
    let content: any
    if (userInfo?.buyLowerAmount! > buyUpperAmount) {
        title = `💵 The maximum random buy amount must be greater than the lower buy amount, 👨‍💼 press Reset button!`
        content = [[{ text: `✏️ Reset`, callback_data: `resetBuyUpperAmount` }]]
        reset = true
    }
    else {
        await helper.updateBuyUpperAmount(chatId, buyUpperAmount);
        title = `💵 The Upper limit for random buy amount is set correctly: <b>${buyUpperAmount} SOL</b>, 👨‍💼 press Continue button!`
        content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setBuyUpperAmount` }]]
    }

    return { title, content, reset };
}

export const setBuyLowerAmount = async (chatId: number, buyLowerAmount: number) => {
    const userInfo = await helper.findOfUser(chatId);

    let title: string
    let content: any
    let reset: boolean = false

    if (0.0001 > buyLowerAmount || userInfo?.buyUpperAmount! < buyLowerAmount) {
        title = `💵 The lower buy amount must be less than the upper buy amount, and greater than the minimum allowed value <code>0.0001 SOL</code>, Press Reset button! 👨‍💼`
        content = [[{ text: `✏️ Reset`, callback_data: `resetBuyLowerAmount` }]]
        reset = true
    } else {
        await helper.updateBuyLowerAmount(chatId, buyLowerAmount);
        title = `💵 The Lower limit for the random buy amount is set correctly: <code>${buyLowerAmount} SOL</code>, Press Continue button 👨‍💼`
        content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setBuyLowerAmount` }]]
    }

    return { title, content, reset };
}

export const setBuyInterval = async (chatId: number, buyInterval: number) => {
    const userInfo = await helper.findOfUser(chatId);

    let title: string
    let content: any
    let reset: boolean = false

    const MIN_INTERVAL = 0.1

    if (buyInterval < MIN_INTERVAL) {
        title = `💵 Minimum buy interval must be less than Maximum buy interval and greater than minimum value 0.1s, Press Reset button! 👨‍💼`
        content = [[{ text: `✏️ Reset`, callback_data: `resetBuyIntervalMin` }]]
        reset = true
    } else {
        await helper.updateBuyInterval(chatId, buyInterval);
        title = `💵 Minimum interval between buys in seconds is set correctly: <b>${buyInterval}s</b>, press Continue button! 👨‍💼`
        content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setBuyInterval` }]]
    }

    return { title, content, reset };
}

export const setDuration = async (chatId: number, duration: number) => {
    const userInfo = await helper.findOfUser(chatId);

    await helper.updateDuration(chatId, duration);
    const title = `⏰ Duration of the bot running is set correctly: <b>${duration}s</b>, press continue button! 👨‍💼`
    const content = [[{ text: `✏️ Continue`, callback_data: `customOption` }, { text: `✏️ Reset`, callback_data: `setDuration` }]]

    return { title, content };
}
export const start = async (chatId: number) => {
    const userInfo = await helper.findOfUser(chatId);
    const poolId = userInfo?.poolAddr
    // console.log("========================userInfo==============", userInfo)
    startProcess(chatId);

    startVolumeBot(userInfo, chatId);
    const title = `💵 Now Distributing Sol and Trading..... 🔥`
    const content = [[{ text: `✏️ Click here to see transactions in Dexscreener`, url: `https://dexscreener.com/solana/${poolId!.toLowerCase()}` }],
    [{ text: `🔴 Stop Volume Bot`, callback_data: `stop` }]]

    return { title, content };
}

export const stopProcess = async (chatId: number) => {
    cancelProcess(chatId);
    const userInfo = await helper.findOfUser(chatId)
    const publicKey = new PublicKey(userInfo?.publicKey!)
    const wSolAccount = await getAssociatedTokenAddress(NATIVE_MINT, publicKey)
    const solBalance = (await solanaConnection.getBalance(publicKey)) / LAMPORTS_PER_SOL
    const wSolBalance = (await solanaConnection.getTokenAccountBalance(wSolAccount)).value.uiAmount

    const title = `<b>💵 Trading is stopped!</b>\n\n🔴 Volume bot's operation stopped now!\n\n💵 Your Volume bot wallet balance: <code>${solBalance.toFixed(3)} SOL</code>\n💰 Your Volume bot wallet WSOL balance: <code>${wSolBalance?.toFixed(3)} wSOL</code>\n\n🔘 Please click Unwrap button to unwrap WrapSol in bot wallet! `
    const content = [[{ text: `🔓 Unwrap WSOL`, callback_data: `unwrap` }]]

    return { title, content }
}

export const unwrap = async (chatId: number) => {
    cancelProcess(chatId);
    const userInfo = await helper.findOfUser(chatId)
    const privateKey = userInfo?.privateKey
    const keypair = Keypair.fromSecretKey(base58.decode(privateKey!))
    await unwrapSol(keypair)

    const publicKey = new PublicKey(userInfo?.publicKey!)
    const solBalance = (await solanaConnection.getBalance(publicKey)) / LAMPORTS_PER_SOL

    const title = `<b>💵 Unwrapped WrappedSol to Sol Successfully!</b>\n\n💰 Your Volume bot wallet balance: <code>${solBalance} SOL</code>\n\nℹ️ If you want to restart, then please click Restart button!`
    const content = [[{ text: `🔄 Restart`, callback_data: `restart` }]]

    return { title, content }
}
