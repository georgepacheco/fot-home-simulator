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
exports.splitUrl = void 0;
const fs = __importStar(require("fs"));
const Sensor2Json_1 = require("./Sensor2Json");
const Mapper_1 = require("./Mapper");
const QueryData_1 = require("./QueryData");
const Preprocess_1 = require("./Preprocess");
const user_1 = require("./model/user");
const Login_1 = require("./Login");
const Config_1 = require("./Config");
const dotenv = __importStar(require("dotenv"));
const Environment_1 = require("./Environment");
dotenv.config();
// const fileName = "./test/message.txt";
// const dataFile = "./test/16523.json";
// const credentialFile = "./test/16523_cred.json"
// File received from Python script
const dataFile = process.argv[2];
const credentialFile = process.argv[3];
/**
 * Call all necessary methods to save data in Solid
 */
async function doService() {
    // let user = await load_user_credential()
    let sim_user = await load_sim_credentials();
    let data = await parseDataFile(dataFile);
    if (!(data instanceof Error)) {
        console.log('Step 1. Parse File Ok.');
        data = (0, Preprocess_1.Preprocess)(data);
        console.log('Step 2. Preprocess Data Ok.');
        const separatedData = await separateDataBySensorType(data);
        console.log('Step 3. Separate Data Ok.');
        const users = await load_users();
        console.log("Sim User:");
        console.log(sim_user);
        const authFetch = await (0, Login_1.Login)(sim_user);
        for (const sensorType in separatedData) {
            let rdfFile = await (0, Mapper_1.Mapper)(JSON.stringify(separatedData[sensorType]));
            for (const user of users) {
                user.idp = (0, exports.splitUrl)(user.webId, 0, 3) + "/";
                user.podname = (0, exports.splitUrl)(user.webId, 3, 4);
                await (0, QueryData_1.SaveDataSim)(rdfFile, sensorType, user, authFetch);
            }
        }
        // for (const sensorType in separatedData) {
        //     let rdfFile = await Mapper(JSON.stringify(separatedData[sensorType]));
        //     // await SaveData(rdfFile, sensorType, user);
        //     await SaveData(rdfFile, sensorType, sim_user);
        // }
        console.log('Step 4. Save data process complete.');
    }
}
const separateDataBySensorType = async (data) => {
    const groupedBySensor = data.reduce((acc, item) => {
        const sensorType = item.header.sensorType;
        if (!acc[sensorType]) {
            acc[sensorType] = [];
        }
        acc[sensorType].push(item);
        return acc;
    }, {});
    return groupedBySensor;
};
/**
 *
 * @param fileName - the path of the user data file
 * @returns The user data in a JSON object format
 */
async function parseDataFile(fileName) {
    try {
        const jsonString = fs.readFileSync(fileName, 'utf-8');
        return (0, Sensor2Json_1.Sensor2Json)(jsonString);
    }
    catch (error) {
        return new Error('Error parsing file.\n' + error.message);
    }
}
/**
 * Load the user credentials from file
 */
async function load_user_credential() {
    const jsonString = fs.readFileSync(Config_1.USERS_FILE, 'utf-8');
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
const load_sim_credentials = async () => {
    let sim = new user_1.User();
    sim.webId = Environment_1.Environment.WEBID;
    sim.username = Environment_1.Environment.LOGIN || '';
    sim.password = Environment_1.Environment.PASSWORD || '';
    sim.idp = Environment_1.Environment.IDP || '';
    sim.podname = Environment_1.Environment.PODNAME || '';
    return sim;
};
const load_users = async () => {
    const jsonString = fs.readFileSync(Config_1.USERS_FILE, 'utf-8');
    const users = JSON.parse(jsonString);
    return users;
};
const splitUrl = (webid, initial, final) => {
    const parts = webid.split('/'); // Divide a string em partes usando '/' como delimitador
    const baseUrl = parts.slice(initial, final).join('/');
    return baseUrl;
};
exports.splitUrl = splitUrl;
doService();
//# sourceMappingURL=server.js.map