"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWeb = void 0;
const solid_client_authn_browser_1 = require("@inrupt/solid-client-authn-browser");
const loginWeb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, solid_client_authn_browser_1.login)({
            oidcIssuer: "http://localhost:3000",
            redirectUrl: new URL(window.location.href).toString(),
            clientName: "Fot Health Application"
        });
        // localStorage.setItem('sessionData', JSON.stringify(getDefaultSession()));
    }
    catch (error) {
        console.error('Login error:', error);
    }
});
exports.loginWeb = loginWeb;
