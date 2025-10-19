"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const app_1 = require("../src/app");
const connection_1 = require("../src/database/connection");
const app = (0, app_1.createApp)();
async function handler(req, res) {
    await (0, connection_1.ensureDBConnected)();
    // @ts-ignore - Vercel adapter: repassar para o Express
    return app(req, res);
}
