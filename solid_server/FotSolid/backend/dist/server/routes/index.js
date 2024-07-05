"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const Save_1 = require("../controllers/Save");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/', (req, res) => {
    return res.send('Hello API Node for Community Solid Server!');
});
router.post('/save', Save_1.save);
