import dotenv from "dotenv";
import { connectMongoDB } from "./db";
import { Connection } from "@solana/web3.js";
dotenv.config();

export const botToken = process.env.TOKEN!
export const mongoUrl = process.env.MONGO_URL!
export const OWNER_PUBLIC_KEY = process.env.OWNER_PUBLIC_KEY!
export const DAO_PUBLIC_KEY = process.env.DAO_PUBLIC_KEY!

export const BUY_INTERVAL = Number(process.env.BUY_INTERVAL!)
export const BUY_UPPER_AMOUNT = Number(process.env.BUY_UPPER_AMOUNT!)
export const BUY_LOWER_AMOUNT = Number(process.env.BUY_LOWER_AMOUNT!)
export const DURATION = Number(process.env.DURATION!)

export const DEV_CONFIRM_FEE = Number(process.env.DEV_CONFIRM_FEE!)
export const DAO_CONFIRM_FEE = Number(process.env.DAO_CONFIRM_FEE!)

export const RPC_ENDPOINT = process.env.RPC_ENDPOINT!
export const RPC_WEBSOCKET_ENDPOINT = process.env.RPC_WEBSOCKET_ENDPOINT!

export const solanaConnection = new Connection(RPC_ENDPOINT, {
    wsEndpoint: RPC_WEBSOCKET_ENDPOINT, commitment: "processed"
})
export const LAMPORTS_PER_SOL = 1000000000;

export const init = async () => {
    connectMongoDB()
}
