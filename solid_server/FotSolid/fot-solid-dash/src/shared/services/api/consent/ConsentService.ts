import { universalAccess, overwriteFile } from "@inrupt/solid-client";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { Environment } from "../../../environment";
import { getBaseUrl } from "../../../hooks";
import { QueryEngine } from "@comunica/query-sparql";
import { SourceSharp } from "@mui/icons-material";
import axios, { AxiosError } from "axios";


export enum SensorType {
    BLOOD_PRESSURE = "BloodPressureSensor.ttl",
    BODY_TEMPERATURE = "BodyThermometer.ttl",
    ECG_MONITOR = "ECG.ttl",
    GLUCOMETER = "Glucometer.ttl",
    HUMIDITY = "HumiditySensor.ttl",
    OXYMETER = "PulseOxymeter.ttl",
    SMOKE = "SmokeDetector.ttl",
    ENV_TEMPERATURE = "AirThermometer.ttl",
    SWEATING = "SkinConductanceSensor.ttl",
    SHIVERING = "Accelerometer.ttl",
    HEART_RATE = "HeartBeatSensor.ttl"
}

export interface IAgentAccess {
    webId: string,
    append: boolean,
    read: boolean,
    write: boolean,
}

export interface IResource {
    resourceUrl: string,
    agent: IAgentAccess[];
}

const getAllGrantedAccessByResource = async (resourceUrl: string): Promise<IAgentAccess[] | Error> => {

    let agents: IAgentAccess[] = [];
    try {
        if (getDefaultSession().info.isLoggedIn) {
            if (getDefaultSession().info.webId !== undefined) {
                await universalAccess.getAgentAccessAll(
                    resourceUrl, // resource
                    { fetch: getDefaultSession().fetch }                // fetch function from authenticated session
                ).then((accessByAgent) => {
                    if (accessByAgent)
                        for (const [agent, accessModes] of Object.entries(accessByAgent)) {
                            if (agent !== getDefaultSession().info.webId) {
                                let agentAccess: IAgentAccess = {
                                    webId: agent,
                                    append: accessModes.append,
                                    read: accessModes.read,
                                    write: accessModes.write,
                                }
                                agents.push(agentAccess);
                            }
                        }
                });
                return agents;
            } else {
                return new Error(Environment.WEB_ID_ERROR);
            }
        } else {
            return new Error(Environment.USER_NOT_LOGGED);
        }
    } catch (error) {
        return new Error((error as { message: string }).message);
    }

}

const getAllGrantAccess = async (baseUrl: string): Promise<IResource[] | Error> => {

    let resources: IResource[] = [];
    let result: any;
    try {
        if (getDefaultSession().info.isLoggedIn) {
            if (getDefaultSession().info.webId !== undefined) {
                for (const key of Object.values(SensorType)) {
                    const sourcePath: string = `${baseUrl}/private/sensors/${key}`
                    result = await getAllGrantedAccessByResource(sourcePath);
                    if (!(result instanceof Error)) {
                        let resource: IResource = {
                            agent: result,
                            resourceUrl: sourcePath
                        }
                        resources.push(resource);
                    }
                }
            } else {
                return new Error(Environment.WEB_ID_ERROR);
            }
        } else {
            return new Error(Environment.USER_NOT_LOGGED);
        }
        return resources;
    } catch (error) {
        return new Error((error as { message: string }).message || 'Error while querying granted consent.');
    }

}

const updateAccess = async (resources: IResource[]) => {    
    try {
        if (getDefaultSession().info.isLoggedIn) {
            if (getDefaultSession().info.webId !== undefined) {
                for (const resource of resources) {
                    for (const agent of resource.agent) {
                        // console.log(agent);
                        await universalAccess.setAgentAccess(
                            resource.resourceUrl,         // Resource
                            agent.webId,     // Agent
                            { read: agent.read, write: agent.write, append: agent.append },          // Access object
                            { fetch: getDefaultSession().fetch }                         // fetch function from authenticated session
                        ).then((newAccess) => {                            
                            // console.log(JSON.stringify(newAccess));
                        });
                    }
                }
            } else {
                return new Error(Environment.WEB_ID_ERROR);
            }
        } else {
            return new Error(Environment.USER_NOT_LOGGED);
        }
    } catch (error) {
        return new Error((error as { message: string }).message);
    }
}

const grantAccess2Simulation = async (webId: string | undefined) => {

    if (webId !== undefined) {
        const baseUrl = getBaseUrl(webId, 0, 4);
        for (const key of Object.values(SensorType)) {
            const sourcePath: string = `${baseUrl}/private/sensors/${key}`;
            console.log(sourcePath);
            const myEngine = new QueryEngine();
            let query = `
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  
            INSERT DATA {
                <https://fotsimulator/${key}> a rdfs:Resource ;    
            }`;

            try {
                await myEngine.queryVoid(query,
                    {
                        sources: [sourcePath],
                        fetch: getDefaultSession().fetch,
                        //destination: { type: 'patchSparqlUpdate', value: sourcePath }
                    });
            } catch (error) {
                return new Error('Failed while inserting data.\n' + (error as { message: string }).message);
            }

            try {
                await universalAccess.setAgentAccess(
                    sourcePath,         // Resource
                    Environment.SIM_WEBID,     // Simulator Agent
                    { read: true, write: true, append: true },          // Access object
                    { fetch: getDefaultSession().fetch }
                );
            } catch (error) {
                return new Error('Failed while granting access to simulator.\n' + (error as { message: string }).message);
            }

        
        }
        const metricsFilePath: string = `${baseUrl}/private/${Environment.METRICS_FILE}`;
        try {
                await overwriteFile(
                    metricsFilePath,
                    new File([JSON.stringify("")], Environment.METRICS_FILE, { type: "application/json" }),
                    { fetch: getDefaultSession().fetch }
                );
            } catch (error) {
                return new Error((error as { message: string }).message || 'Error saving metrics file.');
            }
        try {
            await universalAccess.setAgentAccess(
                metricsFilePath,         // Resource
                Environment.SIM_WEBID,     // Simulator Agent
                { read: true, write: true, append: true },          // Access object
                { fetch: getDefaultSession().fetch }
            );
        } catch (error) {
            return new Error('Failed while granting access to simulator.\n' + (error as { message: string }).message);
        }

        addWebId2Sim(getDefaultSession().info.webId);
        // fazer uma chamada para salvar o webid no simulador
    }
}

const addWebId2Sim = async (webId: string | undefined) => {

    if (webId !== undefined) {
        const data = {
            webId: webId
        }
        try {
            await axios.post(Environment.SIM_API_URL, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            if ((error as AxiosError).response?.status !== 409) {
                console.log(error as AxiosError);
            }
        }
    }
}

export const ConsentService = {
    getAllGrantedAccessByResource,
    getAllGrantAccess,
    updateAccess,
    grantAccess2Simulation
}