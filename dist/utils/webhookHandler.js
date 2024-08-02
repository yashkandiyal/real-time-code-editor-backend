"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookHandler = void 0;
const svix_1 = require("svix");
const env_1 = require("../config/env");
const user_model_1 = __importDefault(require("../models/user.model"));
const webhookHandler = async (req, res) => {
    if (!env_1.WEBHOOK_SECRET) {
        throw new Error("You need a WEBHOOK_SECRET in your .env");
    }
    const headers = req.headers;
    const payload = req.body;
    const svix_id = headers["svix-id"];
    const svix_timestamp = headers["svix-timestamp"];
    const svix_signature = headers["svix-signature"];
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res
            .status(400)
            .json({ success: false, message: "Error occurred -- no svix headers" });
    }
    const wh = new svix_1.Webhook(env_1.WEBHOOK_SECRET);
    let evt;
    try {
        evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    }
    catch (err) {
        console.log("Error verifying webhook:", err.message);
        return res.status(400).json({ success: false, message: err.message });
    }
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const email = email_addresses[0].email_address;
    const eventType = evt.type;
    if (eventType === "user.created") {
        try {
            const user = new user_model_1.default({ id, first_name, last_name, email, image_url });
            await user.save();
            console.log(`User with ID ${id} created and saved to the database.`);
        }
        catch (err) {
            console.log("Error saving user to database:", err.message);
            return res
                .status(500)
                .json({ success: false, message: "Error saving user to database" });
        }
    }
    console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
    console.log("Webhook body:", evt.data);
    return res.status(200).json({ success: true, message: "Webhook received" });
};
exports.webhookHandler = webhookHandler;
//# sourceMappingURL=webhookHandler.js.map