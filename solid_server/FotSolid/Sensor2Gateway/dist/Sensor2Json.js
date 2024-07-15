"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sensor2Json = void 0;
function Sensor2Json(msg) {
    let records;
    try {
        records = JSON.parse(msg);
    }
    catch (err) {
        console.error(`Error parsing message: ${err}.`);
    }
    return records;
}
exports.Sensor2Json = Sensor2Json;
//# sourceMappingURL=Sensor2Json.js.map