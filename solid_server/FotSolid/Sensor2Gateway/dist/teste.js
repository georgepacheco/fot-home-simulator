"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const user_1 = require("./model/user");
const QueryData_1 = require("./QueryData");
const dataFile = "./test/16522.json";
const credentialFile = "./test/16522_cred.json";
async function doService() {
    let user = await load_user_credential();
    (0, QueryData_1.SelectData)(user);
}
/**
 * Load the user credentials from file
 */
async function load_user_credential() {
    const jsonString = fs.readFileSync(credentialFile, 'utf-8');
    const credentials = JSON.parse(jsonString);
    let user = new user_1.User();
    user.local_webid = credentials["solid_localId"];
    user.webId = credentials["solid_webId"];
    user.idp = credentials["idp"];
    user.password = credentials["password"];
    user.username = credentials["email"];
    user.podname = credentials["podname"];
    return user;
}
doService();
//# sourceMappingURL=teste.js.map