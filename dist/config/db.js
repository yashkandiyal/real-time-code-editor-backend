"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
if (!env_1.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
}
async function connectDB() {
    try {
        await mongoose_1.default.connect(env_1.MONGODB_URI, {});
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
exports.default = connectDB;
//# sourceMappingURL=db.js.map