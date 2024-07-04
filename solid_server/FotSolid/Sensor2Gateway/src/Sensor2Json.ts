export function Sensor2Json (msg: string){
    let records;
    try { 
        records = JSON.parse(msg);
    } catch(err){
        console.error(`Error parsing message: ${err}.`)
    }
    return records;
}
