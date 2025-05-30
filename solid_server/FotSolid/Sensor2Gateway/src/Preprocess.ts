import { URI, SENSORTYPES, M3_SENSORTYPES, M3_UNITS, M3_QU, RDF_UNITS } from "./Config";
import { v4 as uuidv4 } from 'uuid';

export function Preprocess(data: any) {
    data.forEach(function (d: any) {

        // complement device uri
        // d.header.device = URI + d.header.device;

        // add unit and quantityKind
        let unit: string;
        let quantityKind: string;
        switch (d.header.sensor) {
            case SENSORTYPES.HUMIDITY:
                unit = M3_UNITS.Percent;
                quantityKind = M3_QU.RelativeHumidity
                d.header.sensorType = M3_SENSORTYPES.HUMIDITY;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.TEMPERATURE:
                unit = M3_UNITS.DegreeCelsius;
                quantityKind = M3_QU.Temperature;
                d.header.sensorType = M3_SENSORTYPES.TEMPERATURE;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.ENV_TEMPERATURE:
                unit = M3_UNITS.DegreeCelsius;
                quantityKind = M3_QU.Temperature;
                d.header.sensorType = M3_SENSORTYPES.ENV_TEMPERATURE;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.SOIL:
                unit = M3_UNITS.Percent;
                quantityKind = M3_QU.SoilHumidity;
                d.header.sensorType = M3_SENSORTYPES.SOIL;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.DIASTOLIC_BLOOD_PRESSURE:
                unit = M3_UNITS.MmHg;
                quantityKind = M3_QU.DiastolicBloodPressure;
                d.header.sensorType = M3_SENSORTYPES.DIASTOLIC_BLOOD_PRESSURE;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.SYSTOLIC_BLOOD_PRESSURE:
                unit = M3_UNITS.MmHg;
                quantityKind = M3_QU.SystolicBloodPressure;
                d.header.sensorType = M3_SENSORTYPES.SYSTOLIC_BLOOD_PRESSURE;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.BLOOD_PRESSURE:
                unit = M3_UNITS.MmHg;
                quantityKind = M3_QU.BloodPressure;
                d.header.sensorType = M3_SENSORTYPES.BLOOD_PRESSURE;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.SWEATING:
                unit = RDF_UNITS.boolean;
                quantityKind = M3_QU.SkinConductance;
                d.header.sensorType = M3_SENSORTYPES.SWEATING;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.SHIVERING:
                unit = RDF_UNITS.boolean;
                quantityKind = M3_QU.Acceleration;
                d.header.sensorType = M3_SENSORTYPES.SHIVERING;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.BODY_TEMPERATURE:
                unit = M3_UNITS.DegreeCelsius;
                quantityKind = M3_QU.BodyTemperature;
                d.header.sensorType = M3_SENSORTYPES.BODY_TEMPERATURE;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.ECG:
                unit = "none";
                quantityKind = "none";
                d.header.sensorType = M3_SENSORTYPES.ECG;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.GLUCOMETER:
                unit = M3_UNITS.MmolPerLiter;
                quantityKind = M3_QU.BloodGlucose;
                d.header.sensorType = M3_SENSORTYPES.BLOOD_GLUCOSE;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.OXYMETER:
                unit = M3_UNITS.Percent;
                quantityKind = M3_QU.SPO2;
                d.header.sensorType = M3_SENSORTYPES.OXYMETER;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.SMOKE:
                unit = M3_UNITS.PPM;
                quantityKind = M3_QU.ParticleConcentration;
                d.header.sensorType = M3_SENSORTYPES.SMOKE;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.HEART_RATE:
                unit = M3_UNITS.BPM;
                quantityKind = M3_QU.HeartBeat;
                d.header.sensorType = M3_SENSORTYPES.HEART_RATE;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.PRESENCE:
                unit = M3_UNITS.Scale;
                quantityKind = M3_QU.Presence;
                d.header.sensorType = M3_SENSORTYPES.PRESENCE;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.GAS:
                unit = M3_UNITS.PPM;
                quantityKind = M3_QU.AirPollution;
                d.header.sensorType = M3_SENSORTYPES.GAS;
                d.header.parentClass = "SensingDevice";
                break;
            case SENSORTYPES.LUMINOSITY:
                unit = M3_UNITS.Lumen;
                quantityKind = M3_QU.LuminousFlux;
                d.header.sensorType = M3_SENSORTYPES.LUMINOSITY;
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
        d.header.deviceUUID = uuidv4();
        d.header.observationUUID = uuidv4();

    });
    return data;
}



