import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import { StatusCodes } from "http-status-codes";

interface IDataUser {
    webId: string,
    // user_id: string,
    // solid_localId: string,
    // solid_webId: string,
    // idp: string,
    // name: string,
    // email: string,
    // podname: string,
    // password: string,
    // auth: string

}

// const filePath = path.join(__dirname, 'user2_.json');
const filePath = '../solid-server/users_.json';

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

        const userExists = jsonData.some((old_user: { webId: string }) => old_user.webId === user.webId);

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
};
