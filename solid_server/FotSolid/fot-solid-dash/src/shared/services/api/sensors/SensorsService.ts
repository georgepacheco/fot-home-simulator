import { getDefaultSession, Session } from "@inrupt/solid-client-authn-browser";
import { Api } from "../axios-config";
import { QueryEngine } from "@comunica/query-sparql-solid";
import { BindingsStream } from '@comunica/types';
import { Environment } from "../../../environment";
import { StatusCodes } from "http-status-codes";
import { getFile, universalAccess } from "@inrupt/solid-client";
import { issueAccessRequest } from "@inrupt/solid-client-access-grants";


export interface IObservation {
    observationId: string | undefined;
    resultValue: string | undefined;
    resultTime: string | undefined;
};

export interface ISensor {
    sensor: string | undefined;
    sensorName?: string | undefined;
    sensorType: string | undefined;
    lat: string | undefined;
    long: string | undefined;
    unitType: string | undefined;
    quantityKind: string | undefined;
    parentClass: string | undefined;
    observation?: IObservation[];
};

export enum SensorType {
    BLOOD_PRESSURE = "BloodPressureSensor.ttl",
    BODY_TEMPERATURE = "BodyThermometer.ttl",
    ECG_MONITOR = "ECG.ttl",
    ENV_TEMPERATURE = "AirThermometer.ttl",
    GLUCOMETER = "Glucometer.ttl",
    HUMIDITY = "HumiditySensor.ttl",
    OXYMETER = "PulseOxymeter.ttl",
}


const teste = async (): Promise<void> => {

    // const urlFile = "http://localhost:3000/Alex/teste/cloudCredentials.json";

    // const fileBlob = await getFile(urlFile, { fetch: getDefaultSession().fetch });

    // const text = new TextDecoder().decode(await fileBlob.arrayBuffer());
    // const data = JSON.parse(text);
    // console.log(data);


    // universalAccess.setAgentAccess(
    //     "http://localhost:3000/Alex/teste/store.ttl",         // Resource
    //     "http://localhost:3000/Home/profile/card#me",     // Agent
    //     { read: true, write: false, },          // Access object
    //     { fetch: getDefaultSession().fetch }                         // fetch function from authenticated session
    // ).then((newAccess) => {
    //     console.log(JSON.stringify(newAccess));
    // });


    universalAccess.getAgentAccess(
        "http://localhost:3000/Alex/teste/cloudCredentials.json",       // resource  
        "http://localhost:3000/Home/profile/card#me",   // agent
        { fetch: getDefaultSession().fetch }                      // fetch function from authenticated session
    ).then((agentAccess) => {
        console.log(JSON.stringify(agentAccess));
    });

    // universalAccess.getPublicAccess(
    //     "http://localhost:3000/Alex/teste/store.ttl",
    //     // getDefaultSession().info.webId || '',
    //     { fetch: getDefaultSession().fetch }
    // ).then((returnedAccess) => {
    //     if (returnedAccess === null) {
    //         console.log("Could not load access details for this Resource.");
    //     } else {
    //         console.log("Returned Public Access:: " + returnedAccess.read
    //             + ' - ' + returnedAccess.write
    //         );
    //     }
    // });
}

const getAllSensorsByType = async (session: Session, path: string): Promise<ISensor[] | Error> => {

    try {
        if (session.info.isLoggedIn) {
            if (getDefaultSession().info.webId !== undefined) {
                const sourcePath = getSourcePath(getDefaultSession().info.webId || '') + path;


                const myEngine = new QueryEngine();

                const query = querySelectSensorByUser();

                const bindingsStream = await myEngine.queryBindings(query,
                    {
                        sources: [sourcePath],
                        fetch: getDefaultSession().fetch,
                    });

                const sensors: ISensor[] = await prepareDataSensors(bindingsStream);
                return sensors;
            } else {
                return new Error(Environment.WEB_ID_ERROR);
            }
        } else {
            return new Error(Environment.USER_NOT_LOGGED);
        }
    } catch (error) {
        return new Error((error as { message: string }).message || 'Error while querying sensors.');
    }
}

const getAllSensors = async (session: Session): Promise<ISensor[] | Error> => {

    try {
        if (session.info.isLoggedIn) {
            if (getDefaultSession().info.webId !== undefined) {
                let sensors: ISensor[] = []
                let result: any;
                for (const key of Object.values(SensorType)) {
                    const sourcePath: string = `/private/sensors/${key}`
                    result = await getAllSensorsByType(session, sourcePath);
                    if (!(result instanceof Error)) {
                        sensors.push(...result);
                    }
                }
                return sensors;
            } else {
                return new Error(Environment.WEB_ID_ERROR);
            }
        } else {
            return new Error(Environment.USER_NOT_LOGGED);
        }
    } catch (error) {
        return new Error((error as { message: string }).message || 'Error while querying sensors.');
    }
}

const getObservationsBySensor = async (session: Session, sensor: string, sensorType: string): Promise<IObservation[] | Error> => {

    try {
        if (session.info.isLoggedIn) {
            if (getDefaultSession().info.webId !== undefined) {
                const sourcePath = getSourcePath(getDefaultSession().info.webId || '') + `/private/sensors/${sensorType}.ttl`;

                const myEngine = new QueryEngine();

                const query = queryObservationBySensor(sensor);
                const bindingsStream = await myEngine.queryBindings(query,
                    {
                        sources: [sourcePath],
                        fetch: getDefaultSession().fetch,
                    });
                const observations: IObservation[] = await prepareDataObservations(bindingsStream);
                return observations;
            } else {
                return new Error(Environment.WEB_ID_ERROR);
            }

        } else {
            return new Error(Environment.USER_NOT_LOGGED);
        }
    } catch (error) {
        return new Error((error as { message: string }).message || 'Error while querying sensors.');
    }
}

const getObservationById = async (session: Session, observationId: string, sensorType: string): Promise<IObservation | Error> => {
    try {
        if (session.info.isLoggedIn) {
            if (getDefaultSession().info.webId !== undefined) {
                const sourcePath = getSourcePath(getDefaultSession().info.webId || '') + `/private/sensors/${sensorType}.ttl`;

                const myEngine = new QueryEngine();

                const query = queryObservationById(observationId);
                const bindingsStream = await myEngine.queryBindings(query,
                    {
                        sources: [sourcePath],
                        fetch: getDefaultSession().fetch,
                    });
                const observation: IObservation = await prepareObservationById(bindingsStream, observationId);
                return observation;
            } else {
                return new Error(Environment.WEB_ID_ERROR);
            }

        } else {
            return new Error(Environment.USER_NOT_LOGGED);
        }
    } catch (error) {
        return new Error((error as { message: string }).message || 'Error while querying sensors.');
    }
}

const deleteObservations = async (session: Session, observations: string[], sensorType: string): Promise<Error | void> => {
    try {
        if (session.info.isLoggedIn) {
            if (getDefaultSession().info.webId !== undefined) {
                const sourcePath = getSourcePath(getDefaultSession().info.webId || '') + `/private/sensors/${sensorType}.ttl`;

                const myEngine = new QueryEngine();

                console.log(observations);
                const query = queryDeleteObservations(observations);

                console.log(query);
                await myEngine.queryVoid(query,
                    {
                        sources: [sourcePath],
                        fetch: getDefaultSession().fetch,
                    });
            } else {
                return new Error(Environment.WEB_ID_ERROR);
            }
        } else {
            return new Error(Environment.USER_NOT_LOGGED);
        }
    } catch (error) {
        return new Error((error as { message: string }).message || 'Error while deleting observations.');
    }
}

/**
 * 
 * @description Send data to the cloud and maintain a copy in the FoT using my Solid-API.
 * @param sensor 
 * @returns server response (success or error)
 */
const sendData2Cloud = async (sensor: ISensor) => {
    try {
        const urlRelativa = `/savefot`;

        const { data } = await Api.post(urlRelativa, sensor);

        if (data) {
            return data;
        } else {
            return new Error(Environment.ERROR_DATA_SENDER);
        }
    } catch (error) {
        return new Error((error as { message: string }).message || Environment.ERROR_DATA_SENDER);
    }
}

/**
 * @description Send data to the cloud and remove from FoT using the Solid API.
 */
const sendData2CloudDelete = async (sensor: ISensor, checked: string[]) => {
    try {
        const result = await sendData2Cloud(sensor);

        if (result instanceof Error) {
            return result;
        } else {
            deleteObservations(getDefaultSession(), checked, splitString(sensor.sensorType, "#") || '');
        }
    } catch (error) {

        return new Error((error as { message: string }).message || Environment.ERROR_DATA_SENDER);
    }
}


const prepareDataObservations = async (bindingsStream: BindingsStream) => {


    let observations: IObservation[] = [];

    for await (const binding of bindingsStream) {
        // console.log(binding.toString());
        let obs: IObservation = {
            observationId: '',
            resultValue: '',
            resultTime: ''
        };

        obs.observationId = binding.get('observation')?.value;
        obs.resultValue = binding.get('resultvalue')?.value;
        obs.resultTime = binding.get('resulttime')?.value;
        observations.push(obs);
    }

    return observations;
}

const prepareDataSensors = async (bindingsStream: BindingsStream) => {

    let sensors: ISensor[] = [];

    for await (const binding of bindingsStream) {
        // console.log(binding.toString());
        let sensor: ISensor = {
            sensor: '',
            sensorType: '',
            lat: '',
            long: '',
            unitType: '',
            quantityKind: '',
            parentClass: '',
            // observation: []
        };

        sensor.sensor = binding.get('sensor')?.value;
        sensor.sensorType = binding.get('sensorType')?.value;
        sensor.lat = binding.get('latitude')?.value;
        sensor.long = binding.get('longitude')?.value;
        sensor.unitType = binding.get('unitType')?.value;
        sensor.quantityKind = binding.get('quKind')?.value;
        sensor.parentClass = binding.get('parentClass')?.value;
        sensors.push(sensor);
    }

    return sensors;
}

const prepareObservationById = async (bindingsStream: BindingsStream, observationId: string) => {

    let observation: IObservation = {
        observationId: observationId,
        resultTime: '',
        resultValue: ''
    };

    for await (const binding of bindingsStream) {


        observation.resultTime = binding.get('resulttime')?.value;
        observation.resultValue = binding.get('resultvalue')?.value;

    }

    return observation;
}

const prepareDataSend = async (bindingsStream: BindingsStream) => {

    for await (const binding of bindingsStream) {
        console.log(binding.toString());
    }
}

const getSourcePath = (webid: string) => {

    const parts = webid.split('/'); // Divide a string em partes usando '/' como delimitador
    const baseUrl = parts.slice(0, 4).join('/'); // Seleciona as primeiras 4 partes e junta-as novamente com '/'

    return baseUrl;
}

const querySelectSensorByUser = () => {
    let query = `
        PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
        PREFIX iot-lite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX m3: <http://purl.org/iot/vocab/m3-lite#>
        PREFIX sosa: <http://www.w3.org/ns/sosa/>
        PREFIX ssn: <https://www.w3.org/ns/ssn/>
        
        SELECT ?sensor ?parentClass ?sensorType ?coverage ?point ?latitude ?longitude ?unitType ?quKind
        WHERE {
            ?sensor rdfs:subClassOf ssn:SensingDevice .
            ?sensor rdfs:subClassOf ?parentClass .
            ?sensor rdf:type ?sensorType .
            ?sensor iot-lite:hasCoverage ?coverage .
            ?coverage geo:location ?point .
            ?point geo:lat ?latitude .
            ?point geo:long ?longitude .
            ?sensor iot-lite:hasUnit ?unitType .
            ?sensor iot-lite:quantityKind ?quKind
        }   
    
    `;

    return query;
}

const queryObservationBySensor = (sensor: string) => {

    let query = `
        PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
        PREFIX iot-lite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX m3: <http://purl.org/iot/vocab/m3-lite#>
        PREFIX sosa: <http://www.w3.org/ns/sosa/>
        PREFIX ssn: <https://www.w3.org/ns/ssn/>
        PREFIX map: <http://example.com/soft-iot/>

        SELECT ?observation ?resultvalue ?resulttime
        WHERE {

            map:` + sensor + ` sosa:madeObservation ?observation .
            ?observation sosa:hasSimpleResult ?resultvalue .
            ?observation sosa:resultTime ?resulttime
        }
    `
    return query;
}

const queryObservationById = (observationId: string) => {
    let query = `
        PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
        PREFIX iot-lite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX m3: <http://purl.org/iot/vocab/m3-lite#>
        PREFIX sosa: <http://www.w3.org/ns/sosa/>
        PREFIX ssn: <https://www.w3.org/ns/ssn/>
        PREFIX map: <http://example.com/soft-iot/>

        SELECT ?resultvalue ?resulttime
        WHERE {

            <` + observationId + `> ?p ?o.
            <` + observationId + `> sosa:hasSimpleResult ?resultvalue .
            <` + observationId + `> sosa:resultTime ?resulttime
        }
    `
    return query;
}

const queryDeleteObservations = (observations: string[]) => {

    let queryObs = '';
    observations.forEach((obs) => {
        queryObs = queryObs + `<` + obs + `> ?p ?o .\n`;
    });

    let query =
        `     
    DELETE {
        ` + queryObs + `
        }
    WHERE 
        {
            ` + queryObs + `
        } 
    `;


    // let query = `
    // DELETE {<observation:d565bb6a-863f-47bd-a9b4-fad9373677aa> ?p ?o}
    // WHERE 
    //     {
    //     <observation:d565bb6a-863f-47bd-a9b4-fad9373677aa> ?p ?o
    //     }  
    // `;

    return query;
}

const querySendData = (observations: string[]) => {

    let query =
        `
        PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
        PREFIX iot-lite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX m3: <http://purl.org/iot/vocab/m3-lite#>
        PREFIX sosa: <http://www.w3.org/ns/sosa/>
        PREFIX ssn: <https://www.w3.org/ns/ssn/>
        PREFIX map: <http://example.com/soft-iot/>

        SELECT ?sensor ?parentClass ?sensorType ?coverage ?point ?latitude 
                ?longitude ?unitType ?quKind ?observation ?resultvalue ?resulttime
        WHERE {
            ?s ?p ?o .
        }
    `;

    return query;
}

const splitString = (data: string | undefined, delimitador: string) => {
    if (data !== undefined) {
        const parts = data.split(delimitador); // Divide a string em partes usando '/' como delimitador
        const lastPart = parts[parts.length - 1]; // Seleciona o último elemento do array
        return (lastPart);
    }
}

export const SensorServices = {
    getAllSensors,
    getObservationsBySensor,
    deleteObservations,
    sendData2Cloud,
    getObservationById,
    sendData2CloudDelete,
    splitString,
    teste
};