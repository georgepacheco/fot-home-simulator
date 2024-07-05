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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.save = void 0;
const fs_1 = __importDefault(require("fs"));
// const filePath = path.join(__dirname, 'user_.json');
const filePath = '../solid-server/user_.json';
const save = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    fs_1.default.readFile(filePath, 'utf8', (err, data) => {
        let jsonData = [];
        if (!err) {
            try {
                jsonData = JSON.parse(data);
            }
            catch (parseErr) {
                console.error('Error parsing existing JSON file:', parseErr);
            }
        }
        const userExists = jsonData.some((old_user) => old_user.solid_webId === user.solid_webId);
        if (userExists) {
            return res.status(409).send('User already exists');
        }
        jsonData.push(user);
        fs_1.default.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to JSON file:', writeErr);
                res.status(500).send('Error saving data');
            }
            else {
                res.send('Data saved successfully');
            }
        });
    });
    return res;
    // const reqData: Array<IData> | undefined = req.body.data;
    // if (user != undefined) {
    //     if (reqData != undefined) {
    //         let data = await preprocess(reqData);
    //         let rdfFile = await mapper(JSON.stringify(data), RML_LOCAL);
    //         const authFetch = await login(user, res);
    //         const sourcePath = user.idp + user.podname + "/private/store.ttl";
    //         const myEngine = new QueryEngine();
    //         let query = await queryInsertData(rdfFile);
    //         try {
    //             await myEngine.queryVoid(query,
    //                 {
    //                     sources: [sourcePath],
    //                     fetch: authFetch,
    //                     //destination: { type: 'patchSparqlUpdate', value: sourcePath }
    //                 });
    //             return res.status(StatusCodes.OK).send("save");        
    //         } catch (error) {
    //             return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    //         }                        
    //     }        
    // }
});
exports.save = save;
