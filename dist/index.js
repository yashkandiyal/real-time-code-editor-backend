"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
const socket_1 = require("./socket");
const env_1 = require("./config/env");
const webhookHandler_1 = require("./utils/webhookHandler");
const app = (0, express_1.default)();
const frontendUrl = env_1.FRONTEND_URL;
// Middleware
app.use((0, cors_1.default)({
    origin: frontendUrl,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
(0, db_1.default)();
app.get("/", (req, res) => {
    res.send("API running!");
});
app.post("/api/webhooks", webhookHandler_1.webhookHandler);
const server = (0, http_1.createServer)(app);
(0, socket_1.initializeSocket)(server);
server.listen(env_1.PORT, () => {
    console.log(`server running at port http://localhost:${env_1.PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map