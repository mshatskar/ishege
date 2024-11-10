
import { Keypair } from "@solana/web3.js";
import UserModel from "../utils/model"
import base58 from "bs58";

export const saveInfo = async (userId: number, userData: any) => {

  const username: string = userData.username
  const buyLowerAmount: number = userData.buyLowerAmount
  const buyUpperAmount: number = userData.buyUpperAmount
  const buyInterval: number = userData.buyInterval
  const duration: number = userData.duration

  try {
    const newData = await UserModel.findOneAndUpdate({ userId }, { userId, username, buyLowerAmount, buyUpperAmount, buyInterval, duration }, { new: true, upsert: true })
    return newData?.publicKey;
  } catch (e) {
    return null
  }
}

export const addBotWallet = async (userId: number, wallet: Keypair) => {
  try {
    const privateKey = base58.encode(wallet.secretKey);
    const publicKey = wallet.publicKey.toBase58()
    const data = await UserModel.findOneAndUpdate({ userId }, { userId, privateKey, publicKey }, { new: true, upsert: true });
    return data.publicKey;
  } catch (e) {
    return undefined
  }
}

export const findOfUser = async (userId: number, username?: string) => {
  try {
    const info = await UserModel.findOne({ userId })
    return info;
  } catch (e) {
    return null
  }
}

export const startProcess = async (userId: number) => {
  try {
    const isWorking = true
    const data = await UserModel.findOneAndUpdate({ userId }, { isWorking }, { new: true });
    if (data) {
      console.log("process status: ", data?.isWorking);
      return data.publicKey;
    }
  } catch (e) {
    return undefined
  }
}

export const cancelProcess = async (userId: number) => {
  try {
    const isWorking = false
    const data = await UserModel.findOneAndUpdate({ userId }, { isWorking }, { new: true });
    if (data) {
      console.log("process status: ", data?.isWorking);
      return data.publicKey;
    }
  } catch (e) {
    return undefined
  }
}

export const updateDexName = async (userId: number, dexname: string) => {
  try {
    const data = await UserModel.findOneAndUpdate({ userId }, { userId, dexname }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updateTokenAddr = async (userId: number, tokenAddr: String) => {
  try {
    const data = await UserModel.findOneAndUpdate({ userId }, { userId, tokenAddr }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updatePoolAddr = async (userId: number, poolAddr: String) => {
  try {
    const data = await UserModel.findOneAndUpdate({ userId }, { userId, poolAddr }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updateVolumeWallet = async (userId: number, publicKey: String, privateKey: String) => {
  try {
    const data = await UserModel.findOneAndUpdate({ userId }, { userId, publicKey, privateKey }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updateBuyUpperAmount = async (userId: number, buyUpperAmount: number) => {
  try {
    const data = await UserModel.findOneAndUpdate({ userId }, { userId, buyUpperAmount }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updateBuyLowerAmount = async (userId: number, buyLowerAmount: number) => {
  try {
    const data = await UserModel.findOneAndUpdate({ userId }, { userId, buyLowerAmount }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updateBuyInterval = async (userId: number, buyInterval: number) => {
  try {
    const data = await UserModel.findOneAndUpdate({ userId }, { userId, buyInterval }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const updateDuration = async (userId: number, duration: number) => {
  try {
    const data = await UserModel.findOneAndUpdate({ userId }, { userId, duration }, { new: true, upsert: true });
  } catch (e) {
    return undefined
  }
}

export const getTokenAddress = async(userId: number) => {
  try {
    const info = await UserModel.findOne({ userId })
    return info?.tokenAddr
  } catch (e) {
    return undefined
  }
}

export const getPoolAddress = async(userId: number) => {
  try {
    const info = await UserModel.findOne({ userId })
    return info?.poolAddr!
  } catch (e) {
    return undefined
  }
}
