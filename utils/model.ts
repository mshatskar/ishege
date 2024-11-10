import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, default: '' },
    userId: { type: Number, required: true, unique: true },
    publicKey: { type: String, default: '' },
    privateKey: { type: String, default: '' },
    dexname: { type: String, default: '' },
    tokenAddr: { type: String, default: '' },
    poolAddr: { type: String, default: '' },
    buyLowerAmount: { type: Number, default: 0 },
    buyUpperAmount: { type: Number, default: 0 },
    buyInterval: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    isWorking: { type: Boolean, default: false }
});

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;