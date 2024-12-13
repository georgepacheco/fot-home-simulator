import { createInterface } from "readline";
import * as fs from "fs";
import { Sensor2Json } from "./Sensor2Json";
import { Mapper } from "./Mapper";
import { SaveData, SaveDataSim } from "./QueryData";
import { Preprocess } from "./Preprocess";
import { json } from "stream/consumers";
import { User } from "./model/user";
import { IDataEntry } from "./model/IData";
import { Login } from "./Login";
import { USERS_FILE } from "./Config";
import * as dotenv from 'dotenv';
import { Environment } from "./Environment";

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

        data = Preprocess(data);
        console.log('Step 2. Preprocess Data Ok.');

        const separatedData: { [key: string]: IDataEntry[] } = await separateDataBySensorType(data);
        console.log('Step 3. Separate Data Ok.')

        const users: User[] = await load_users();

        console.log("Sim User:");
        console.log(sim_user);
        const authFetch = await Login(sim_user);


        for (const sensorType in separatedData) {
            let rdfFile = await Mapper(JSON.stringify(separatedData[sensorType]));
            for (const user of users) {
                user.idp = splitUrl(user.webId, 0, 3) + "/";
                user.podname = splitUrl(user.webId, 3, 4);

                await SaveDataSim(rdfFile, sensorType, user, authFetch);
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

const separateDataBySensorType = async (data: IDataEntry[]): Promise<{ [key: string]: IDataEntry[] }> => {

    const groupedBySensor = data.reduce((acc, item) => {
        const sensorType = item.header.sensorType;
        if (!acc[sensorType]) {
            acc[sensorType] = [];
        }
        acc[sensorType].push(item);
        return acc;
    }, {} as { [key: string]: IDataEntry[] });

    return groupedBySensor;
}

/**
 * 
 * @param fileName - the path of the user data file
 * @returns The user data in a JSON object format
 */
async function parseDataFile(fileName: string) {
    try {
        const jsonString = fs.readFileSync(fileName, 'utf-8');

        return Sensor2Json(jsonString);
    } catch (error) {
        return new Error('Error parsing file.\n' + (error as { message: string }).message);
    }

}


/**
 * Load the user credentials from file
 */
async function load_user_credential() {

    const jsonString = fs.readFileSync(USERS_FILE, 'utf-8');
    const credentials = JSON.parse(jsonString);

    let user = new User();

    user.local_webid = credentials["solid_localId"];
    user.webId = credentials["solid_webId"];
    user.idp = credentials["idp"];
    user.password = credentials["password"];
    user.username = credentials["email"]
    user.podname = credentials["podname"]

    return user;
}

const load_sim_credentials = async () => {

    let sim = new User();

    sim.webId = Environment.WEBID;
    sim.username = Environment.LOGIN || '';
    sim.password = Environment.PASSWORD || '';
    sim.idp = Environment.IDP || '';
    sim.podname = Environment.PODNAME || '';

    return sim;
}

const load_users = async () => {
    const jsonString = fs.readFileSync(USERS_FILE, 'utf-8');
    const users: User[] = JSON.parse(jsonString);

    return users;
}

export const splitUrl = (webid: string, initial: number, final: number) => {

    const parts = webid.split('/'); // Divide a string em partes usando '/' como delimitador
    const baseUrl = parts.slice(initial, final).join('/');

    return baseUrl;
}

doService();


