"use strict";
// Importing the required libraries
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSensorsByUser = exports.SelectData = exports.SaveData = exports.SaveDataSim = void 0;
const Login_1 = require("./Login");
const query_sparql_1 = require("@comunica/query-sparql");
async function SaveDataSim(rdfFile, sensorType, user, authFetch) {
    try {
        const sourcePath = user.idp + user.podname + `/private/sensors/${sensorType}.ttl`;
        console.log(sourcePath);
        const myEngine = new query_sparql_1.QueryEngine();
        let query = await generateInsertQuery(rdfFile);
        try {
            await myEngine.queryVoid(query, {
                sources: [sourcePath],
                fetch: authFetch,
                //destination: { type: 'patchSparqlUpdate', value: sourcePath }
            });
        }
        catch (error) {
            return new Error('Failed while inserting data.\n' + error.message);
        }
    }
    catch (error) {
        return new Error('Failed while logging.\n' + error.message);
    }
}
exports.SaveDataSim = SaveDataSim;
async function SaveData(rdfFile, sensorType, user) {
    try {
        const authFetch = await (0, Login_1.Login)(user);
        const sourcePath = user.idp + user.podname + `/private/sensors/${sensorType}.ttl`;
        console.log("Storage Path: " + sourcePath);
        /**
         * Using comunica-sparql-solids - Create a file (if doesn't exist) and save data
         * https://www.npmjs.com/package/@comunica/query-sparql-solid/v/3.0.1
         * https://comunica.dev/docs/query/advanced/solid/
         * https://comunica.dev/docs/query/getting_started/query_app/
         * https://comunica.dev/docs/query/advanced/context/#15--using-a-custom-fetch-function
         */
        const myEngine = new query_sparql_1.QueryEngine();
        let query = await generateInsertQuery(rdfFile);
        try {
            await myEngine.queryVoid(query, {
                sources: [sourcePath],
                fetch: authFetch,
                //destination: { type: 'patchSparqlUpdate', value: sourcePath }
            });
        }
        catch (error) {
            return new Error('Failed while inserting data.\n' + error.message);
        }
    }
    catch (error) {
        return new Error('Failed while logging.\n' + error.message);
    }
}
exports.SaveData = SaveData;
async function SelectData(user) {
    const authFetch = await (0, Login_1.Login)(user);
    const sourcePath = user.idp + user.podname + "/private/store.ttl";
    const myEngine = new query_sparql_1.QueryEngine();
    // query exemplo
    let query = await querySelectSensorByUser();
    const bindingsStream = await myEngine.queryBindings(query, {
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
exports.SelectData = SelectData;
async function SelectSensorsByUser(user) {
}
exports.SelectSensorsByUser = SelectSensorsByUser;
async function generateInsertQuery(rdfFile) {
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
async function queryObservationBySensor(sensor) {
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
    `;
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
    }`;
    return query;
}
async function querySelectExample() {
    let query = `SELECT * WHERE { ?s ?p ?o }`;
    return query;
}
//# sourceMappingURL=QueryData.js.map