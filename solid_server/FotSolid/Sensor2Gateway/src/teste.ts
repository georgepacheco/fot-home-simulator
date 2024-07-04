
import * as fs from "fs";
import { User } from "./model/user";
import { SelectData } from "./QueryData";


const dataFile = "./test/16522.json";
const credentialFile = "./test/16522_cred.json"


async function doService() {
    let user = await load_user_credential();

    SelectData(user);
}

/**
 * Load the user credentials from file
 */
async function load_user_credential() {

    const jsonString = fs.readFileSync(credentialFile, 'utf-8');
    const credentials = JSON.parse(jsonString);

    let user = new User();

    user.local_webid = credentials["solid_localId"];
    user.webid = credentials["solid_webId"];
    user.idp = credentials["idp"];
    user.password = credentials["password"];
    user.username = credentials["email"]
    user.podname = credentials["podname"]

    return user;
}


doService();
