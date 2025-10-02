"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
function handler(_req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true, runtime: 'vercel-node' }));
}
