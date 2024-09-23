import { QueryEngine } from "@comunica/query-sparql-solid";
import { getDefaultSession, Session } from "@inrupt/solid-client-authn-browser"
import { Environment } from "../../../environment";
import { getFile, getSourceUrl, overwriteFile } from "@inrupt/solid-client";
import { StatusCodes } from "http-status-codes";


export interface ICloudData {
    cloudPath: string,
    webId: string,
    email: string,
    password: string
}

const getSourcePath = (webid: string) => {

    const parts = webid.split('/'); // Divide a string em partes usando '/' como delimitador
    const baseUrl = parts.slice(0, 4).join('/'); // Seleciona as primeiras 4 partes e junta-as novamente com '/'

    return baseUrl;
}


const addCloud = async (data: ICloudData): Promise<Error | void> => {
    const urlFile = getSourcePath(getDefaultSession().info.webId || '') + "/private/cloudCredentials.json";
    try {
        if (getDefaultSession().info.isLoggedIn) {
            if (getDefaultSession().info.webId !== undefined) {
                let allData: ICloudData[] = [];
                const result = await getAllClouds();
                if (!(result instanceof Error)) {
                    allData = result;
                }

                const existingRecord = allData.find(existedData => existedData.webId === data.webId);

                if (!existingRecord) {
                    allData.push(data);
                    await saveData(urlFile, allData);
                }

            } else {
                return new Error(Environment.WEB_ID_ERROR);
            }
        } else {
            return new Error(Environment.USER_NOT_LOGGED);
        }
    } catch (error) {
        return new Error((error as { message: string }).message || 'Error saving cloud list file.');
    }
}

const getAllClouds = async (): Promise<ICloudData[] | Error> => {
    const urlFile = getSourcePath(getDefaultSession().info.webId || '') + "/private/cloudCredentials.json";
    try {
        if (getDefaultSession().info.isLoggedIn) {
            if (getDefaultSession().info.webId !== undefined) {
                const fileBlob = await getFile(urlFile, { fetch: getDefaultSession().fetch });

                const text = new TextDecoder().decode(await fileBlob.arrayBuffer());
                const data = JSON.parse(text);

                return data;
            } else {
                return new Error(Environment.WEB_ID_ERROR);
            }
        } else {
            return new Error(Environment.USER_NOT_LOGGED);
        }
    } catch (error) {
        const response = (error as any).response;
        if (response.status === StatusCodes.NOT_FOUND) {
            return [];
        }
        return new Error((error as { message: string }).message || 'Error saving cloud list file.');
    }
}

/**
 * Delete cloud credentials by webId
 * @param webId 
 * @returns 
 */
const deleteCloud = async (webId: string): Promise<Error | void> => {
    const urlFile = getSourcePath(getDefaultSession().info.webId || '') + "/private/cloudCredentials.json";
    try {
        if (getDefaultSession().info.isLoggedIn) {
            if (getDefaultSession().info.webId !== undefined) {
                let data = await getAllClouds();

                if (!(data instanceof Error)) {
                    data = data.filter(cloud => cloud.webId !== webId);
                    await saveData(urlFile, data);
                }
            } else {
                return new Error(Environment.WEB_ID_ERROR);
            }
        } else {
            return new Error(Environment.USER_NOT_LOGGED);
        }
    } catch (error) {
        return new Error((error as { message: string }).message || 'Error deleting cloud data credentials.');
    }
}

/**
 * Overwrite the file with data cloud credentials list.
 * 
 * @param urlFile cloud credential file path.
 * @param allData all credential data.
 */
const saveData = async (urlFile: string, allData: ICloudData[]): Promise<Error | void> => {

    try {
        await overwriteFile(
            urlFile,
            new File([JSON.stringify(allData)], 'cloudCredentials.json', { type: "application/json" }),
            { fetch: getDefaultSession().fetch }
        );
    } catch (error) {
        return new Error((error as { message: string }).message || 'Error saving .');
    }
}


export const CloudServices = {
    addCloud,
    getAllClouds,
    deleteCloud
}