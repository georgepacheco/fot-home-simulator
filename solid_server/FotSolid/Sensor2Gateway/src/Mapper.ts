// Importing the required libraries
import * as rml from 'rocketrml';
import * as fs from 'fs';
import { RML_FILE, RML_OPTIONS } from './Config';

export async function Mapper(msg: string) {

    // Global variable to load mapping file is
    let rml_file: any;

    // Load the rml file into memory (once only)
    if (!rml_file) {
        rml_file = await load_file_to_string(RML_FILE)
            .catch((err) => {
                console.error(err);
            });
        console.log('RML File Loaded');        
    }

    // teste(rml_file);
    //console.log("RML: " + rml_file);
    
    // Map the jsonstring to RDF format, on the condition it is loaded correctly.
    if (!!rml_file) {        
        var rdf_file = await rml.parseFileLive(rml_file.toString(), { input: msg }, RML_OPTIONS).catch((err) => {
           console.error(err);
        });               
        // var response = { name: msg.name, data: rdf_file };
        //console.log("RDF: " + rdf_file);
        return rdf_file;
    }
}

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
function load_file_to_string(filename: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {                
                resolve(data.toString());
            }
        });
    });
}