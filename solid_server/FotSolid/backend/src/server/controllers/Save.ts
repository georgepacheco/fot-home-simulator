import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import { StatusCodes } from "http-status-codes";

interface IDataUser {
    user_id: string,
    solid_localId: string,
    solid_webId: string,
    idp: string,
    name: string,
    email: string,
    podname: string,
    password: string,
    auth: string

}

// const filePath = path.join(__dirname, 'user_.json');
const filePath = '../solid-server/user_.json';

export const save = async (req: Request<{}, {}, IDataUser>, res: Response) => {

    const user: IDataUser = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
        let jsonData = [];

        if (!err) {
            try {
                jsonData = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing existing JSON file:', parseErr);
            }
        }

        const userExists = jsonData.some((old_user: { solid_webId: string }) => old_user.solid_webId === user.solid_webId);

        if (userExists) {
            return res.status(409).send('User already exists');
        }

        jsonData.push(user);

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to JSON file:', writeErr);
                res.status(500).send('Error saving data');
            } else {
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
};
