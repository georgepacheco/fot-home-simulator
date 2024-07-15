"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Preprocess = void 0;
const Config_1 = require("./Config");
const uuid_1 = require("uuid");
function Preprocess(data) {
    data.forEach(function (d) {
        // complement device uri
        // d.header.device = URI + d.header.device;
        // add unit and quantityKind
        let unit;
        let quantityKind;
        switch (d.header.sensor) {
            case Config_1.SENSORTYPES.HUMIDITY:
                unit = Config_1.M3_UNITS.Percent;
                quantityKind = Config_1.M3_QU.RelativeHumidity;
                d.header.sensorType = Config_1.M3_SENSORTYPES.HUMIDITY;
                d.header.parentClass = "SensingDevice";
                break;
            case Config_1.SENSORTYPES.TEMPERATURE:
                unit = Config_1.M3_UNITS.DegreeCelsius;
                quantityKind = Config_1.M3_QU.Temperature;
                d.header.sensorType = Config_1.M3_SENSORTYPES.TEMPERATURE;
                d.header.parentClass = "SensingDevice";
                break;
            case Config_1.SENSORTYPES.ENV_TEMPERATURE:
                unit = Config_1.M3_UNITS.DegreeCelsius;
                quantityKind = Config_1.M3_QU.Temperature;
                d.header.sensorType = Config_1.M3_SENSORTYPES.ENV_TEMPERATURE;
                d.header.parentClass = "SensingDevice";
                break;
            case Config_1.SENSORTYPES.SOIL:
                unit = Config_1.M3_UNITS.Percent;
                quantityKind = Config_1.M3_QU.SoilHumidity;
                d.header.sensorType = Config_1.M3_SENSORTYPES.SOIL;
                d.header.parentClass = "SensingDevice";
                break;
            case Config_1.SENSORTYPES.BLOOD_PRESSURE:
                unit = Config_1.M3_UNITS.MmHg;
                quantityKind = Config_1.M3_QU.BloodPressure;
                d.header.sensorType = Config_1.M3_SENSORTYPES.BLOOD_PRESSURE;
                d.header.parentClass = "SensingDevice";
                break;
            case Config_1.SENSORTYPES.BODY_TEMPERATURE:
                unit = Config_1.M3_UNITS.DegreeCelsius;
                quantityKind = Config_1.M3_QU.BodyTemperature;
                d.header.sensorType = Config_1.M3_SENSORTYPES.BODY_TEMPERATURE;
                d.header.parentClass = "SensingDevice";
                break;
            case Config_1.SENSORTYPES.ECG:
                unit = "none";
                quantityKind = "none";
                d.header.sensorType = Config_1.M3_SENSORTYPES.ECG;
                d.header.parentClass = "SensingDevice";
                break;
            case Config_1.SENSORTYPES.GLUCOMETER:
                unit = Config_1.M3_UNITS.MmolPerLiter;
                quantityKind = Config_1.M3_QU.BloodGlucose;
                d.header.sensorType = Config_1.M3_SENSORTYPES.BLOOD_GLUCOSE;
                d.header.parentClass = "SensingDevice";
                break;
            case Config_1.SENSORTYPES.OXYMETER:
                unit = Config_1.M3_UNITS.Percent;
                quantityKind = Config_1.M3_QU.SPO2;
                d.header.sensorType = Config_1.M3_SENSORTYPES.OXYMETER;
                d.header.parentClass = "SensingDevice";
                break;
            case Config_1.SENSORTYPES.SMOKE:
                unit = Config_1.M3_UNITS.PPM;
                quantityKind = Config_1.M3_QU.ParticleConcentration;
                d.header.sensorType = Config_1.M3_SENSORTYPES.SMOKE;
                d.header.parentClass = "SensingDevice";
                break;
            default:
                unit = "none";
                quantityKind = "none";
                d.header.sensorType = "none";
                break;
        }
        d.header.unit = unit;
        d.header.quantityKind = quantityKind;
        // add uuid
        d.header.deviceUUID = (0, uuid_1.v4)();
        d.header.observationUUID = (0, uuid_1.v4)();
    });
    return data;
}
exports.Preprocess = Preprocess;
//# sourceMappingURL=Preprocess.js.map