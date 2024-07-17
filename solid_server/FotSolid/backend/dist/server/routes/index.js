"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const Save_1 = require("../controllers/Save");
const Login_1 = require("../controllers/Login");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/', (req, res) => {
    return res.send('Hello API Node for Community Solid Server!');
});
// router.options('/save', cors());
router.post('/save', Save_1.save);
router.get('/login', Login_1.loginWeb);
