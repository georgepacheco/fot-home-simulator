// Importing the required libraries

// @ts-ignore
import auth from 'solid-auth-cli';
import $rdf from 'rdflib';
// @ts-ignore
//import { SolidNodeClient } from 'solid-node-client';
//const client = new SolidNodeClient();


// import { QueryEngine } from '@comunica/query-sparql-solid';
import { User } from './model/user';
import { Login } from './Login';
import { QueryEngine } from '@comunica/query-sparql';


//  const credentials = {
//      IDP: "http://localhost:3000/",
//      USERNAME: "george@gmail.com",
//      PASSWORD: "pod2022"
//  };
// const sourcePath = 'http://localhost:3000/GG/private/store.ttl'

type Credential = {
    IDP: string,
    USERNAME: string,
    PASSWORD: string,
    PODNAME: string
};

type Token = {
    id: string,
    secret: string,
    resource: string
}

type AccessToken = {
    accessToken: string,
    expires: number
}

export async function SaveData(rdfFile: string, sensorType: string, user: User) {

    try {
        const authFetch = await Login(user);

        const sourcePath = user.idp + user.podname + `/private/sensors/${sensorType}.ttl`;
        console.log("Storage Path: " + sourcePath)

        /**
         * Using comunica-sparql-solids - Create a file (if doesn't exist) and save data
         * https://www.npmjs.com/package/@comunica/query-sparql-solid/v/3.0.1
         * https://comunica.dev/docs/query/advanced/solid/
         * https://comunica.dev/docs/query/getting_started/query_app/
         * https://comunica.dev/docs/query/advanced/context/#15--using-a-custom-fetch-function
         */
        const myEngine = new QueryEngine();
        let query = await generateInsertQuery(rdfFile);

        try {
            await myEngine.queryVoid(query,
                {
                    sources: [sourcePath],
                    fetch: authFetch,
                    //destination: { type: 'patchSparqlUpdate', value: sourcePath }
                });
        } catch (error) {
            return new Error('Failed while inserting data.\n' + (error as { message: string }).message);
        }
    } catch (error) {
        return new Error('Failed while logging.\n' + (error as { message: string }).message);
    }
}

export async function SelectData(user: User) {

    const authFetch = await Login(user);

    const sourcePath = user.idp + user.podname + "/private/store.ttl";

    const myEngine = new QueryEngine();

    // query exemplo
    let query = await querySelectSensorByUser();

    const bindingsStream = await myEngine.queryBindings(query,
        {
            sources: [sourcePath],
            fetch: authFetch,
            //destination: { type: 'patchSparqlUpdate', value: sourcePath }
        });

    bindingsStream.on('data', (binding) => {
        console.log(binding.toString()); // Quick way to print bindings for testing

        // Obtaining values
        // console.log(binding.get('s'));
        // console.log(binding.get('s').termType);
        // console.log(binding.get('p').value);
        // console.log(binding.get('o').value);
    });

}

export async function SelectSensorsByUser(user: User) {

}

async function generateInsertQuery(rdfFile: string) {

    let query = `        
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema>
    INSERT DATA
    { ` +
        rdfFile
        +
        `}`;

    return query;
}


async function querySelectSensorByUser() {
    let query = `
        PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
        PREFIX iot-lite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX m3: <http://purl.org/iot/vocab/m3-lite#>
        PREFIX sosa: <http://www.w3.org/ns/sosa/>
        PREFIX ssn: <https://www.w3.org/ns/ssn/>
        
        SELECT ?sensor ?coverage ?point ?latitude ?longitude ?unitType ?quKind
        WHERE {
            ?sensor rdfs:subClassOf ssn:SensingDevice .
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

async function queryObservationBySensor(sensor: string) {

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

/**
 * https://comunica.dev/docs/query/getting_started/update_app/
 * @returns query: an insert example of data
 */
async function queryInsertExample() {
    let query = `
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    INSERT DATA
    { 
      <http://example/president25> foaf:givenName "Bill" .
      <http://example/president25> foaf:familyName "McKinley" .
      <http://example/president27> foaf:givenName "Bill" .
      <http://example/president27> foaf:familyName "Taft" .
      <http://example/president42> foaf:givenName "Bill" .
      <http://example/president42> foaf:familyName "Clinton" .
    }`

    return query;
}

async function querySelectExample() {
    let query = `SELECT * WHERE { ?s ?p ?o }`;

    return query;
}