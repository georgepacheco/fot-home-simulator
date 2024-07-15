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
exports.Mapper = void 0;
// Importing the required libraries
const rml = __importStar(require("rocketrml"));
const fs = __importStar(require("fs"));
const Config_1 = require("./Config");
async function Mapper(msg) {
    // Global variable to load mapping file is
    let rml_file;
    // Load the rml file into memory (once only)
    if (!rml_file) {
        rml_file = await load_file_to_string(Config_1.RML_FILE)
            .catch((err) => {
            console.error(err);
        });
        console.log('RML File Loaded');
    }
    // teste(rml_file);
    //console.log("RML: " + rml_file);
    // Map the jsonstring to RDF format, on the condition it is loaded correctly.
    if (!!rml_file) {
        var rdf_file = await rml.parseFileLive(rml_file.toString(), { input: msg }, Config_1.RML_OPTIONS).catch((err) => {
            console.error(err);
        });
        // var response = { name: msg.name, data: rdf_file };
        //console.log("RDF: " + rdf_file);
        return rdf_file;
    }
}
exports.Mapper = Mapper;
// async function teste (rml_file: any){
//     // Load the rml file into memory (once only)
//     if (!rml_file) {
//         rml_file = await load_file_to_string('./rml_lite_copy.txt')
//             .catch((err) => {
//                 console.error(err);
//             });
//         console.log("NA FUNÇÃO: \n" + rml_file);        
//     }
// } 
// Function to load file contents to a string
function load_file_to_string(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.toString());
            }
        });
    });
}
//# sourceMappingURL=Mapper.js.map