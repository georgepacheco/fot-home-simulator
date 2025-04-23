
// Mapping constants (which SenML unit maps to which om-2 unit and quantity) (SSN/SAREF)
//export const RML_FILE = './src/rml/rml_test.ttl';
//export const RML_FILE = './src/rml/rml_ssn.ttl';

/**
 * Para execução local
 */
// export const RML_FILE = './src/rml/rml_lite.ttl';
// export const USERS_FILE = './test/users_.json';

/**
 * Receive file from Python script
 */
export const RML_FILE = '../solid-server/FotSolid/Sensor2Gateway/src/rml/rml_lite.ttl';
export const USERS_FILE = '../solid-server/users_.json';


export const RML_OPTIONS = {
    toRDF: true,
    verbose: false,
    xmlPerformanceMode: false,
    replace: false
}

export const URI = "http://example.com/soft-iot/sensor/";

// SENSORS TYPES
export const SENSORTYPES = {
    HUMIDITY: "humiditySensor",
    TEMPERATURE: "temperatureSensor",
    ENV_TEMPERATURE: "environmentTemperatureSensor",
    SOIL: "soilmoistureSensor",
    HEART_RATE: "heartrateSensor",
    BLOOD_PRESSURE: "bloodPressureSensor",
    DIASTOLIC_BLOOD_PRESSURE: "diastolicBloodPressureSensor",
    SYSTOLIC_BLOOD_PRESSURE: "systolicBloodPressureSensor",
    SWEATING: "sweatingSensor",
    SHIVERING: "shiveringSensor",
    BODY_TEMPERATURE: "bodyTemperatureSensor",
    ECG: "ecgmonitor",
    GLUCOMETER: "glucometerSensor",
    OXYMETER: "oxymeterSensor",
    SMOKE: "smokeSensor",
    PRESENCE: "presenceSensor",
    GAS: "gasSensor",
    LUMINOSITY: "luminositySensor",

}

export const M3_SENSORTYPES = {
    HUMIDITY: "HumiditySensor",
    TEMPERATURE: "Thermometer",
    ENV_TEMPERATURE: "AirThermometer",
    SOIL: "SoilHumiditySensor",
    BLOOD_GLUCOSE: "Glucometer",
    HEART_RATE: "HeartBeatSensor",
    BLOOD_PRESSURE: "BloodPressureSensor",
    BODY_TEMPERATURE: "BodyThermometer",
    ECG: "ECG",
    GLUCOMETER: "Glucometer",
    OXYMETER: "PulseOxymeter",
    SMOKE: "SmokeDetector",
    SWEATING: "SkinConductanceSensor",
    SHIVERING: "Accelerometer",
    SYSTOLIC_BLOOD_PRESSURE: "SystolicBloodPressure",
    DIASTOLIC_BLOOD_PRESSURE: "DiastolicBloodPressure",
    PRESENCE: "OccupancyDetector",
    GAS: "CO_Sensor",
    LUMINOSITY: "LightSensor"

}

/**
 * @description UNITS
 */
export const M3_UNITS = {

    /**
     * @description degree celsius
     */
    "DegreeCelsius": "DegreeCelsius",

    /**
     * @description meter
     */
    "Meter": "Meter",

    /**
     * @description Glucose unit -  Millimol per liter 
     */
    "MmolPerLiter": "MmolPerLiter",

    /**
         * @description MillimeterMercury mmHg unit is used to measure blood pressure measurements (systolic and diastolic)
         */
    "MmHg": "MmHg",

    /**
     * @description percent
     */
    "Percent": "Percent",

    "PPM": "PPM",

    /**
     * @description BeatPerMinute (bpm) is the unit to measure heart rate
     */

    "BPM": "BeatPerMinute",

    /**
    * @description Arbitrary indirect reference which should be translated into meaningful measurements by using the corresponding decoding algorithm detailed in the resource description. In this case the returned values are part of a continuous variable which can take any numeric value.
    */
    "Scale": "Scale",

    /**
     * @description The SI unit of luminous flux, equal to the amount of light emitted per second in a unit solid angle of one steradian from a uniform source of one candela." 
     */
    "Lumen": "Lumen"

}

export const RDF_UNITS = {
    "boolean": "boolean"
}

/**
 * @description QUANTITY UNIT
 */
export const M3_QU = {

    /**
     * @description Blood Glucose level, blood sugar level
     */
    "BloodGlucose": "BloodGlucose",

    /**
     * @description BloodPressure
     */
    "BloodPressure": "BloodPressure",

    /**
     * @description BodyTemperature
     */
    "BodyTemperature": "BodyTemperature",

    /**
    * @description
    */
    "Humidity": "Humidity",

    /**
     * @description The ratio of vapour pressure to saturation 
     * vapour pressure, where vapour pressure is the pressure 
     * exerted by the molecules of water vapour and saturation 
     * vapour pressure is the pressure exerted by molecules of 
     * water vapour in AIR that has attained saturation.
     */
    "RelativeHumidity": "RelativeHumidity",

    /**
     * @description Soil Humidity 
     */
    "SoilHumidity": "SoilHumidity",

    /**
         * @description SPO2 measurement
        */
    "SPO2": "SPO2",

    /**
     * @description By defaut, Air temperature
     */
    "Temperature": "Temperature",

    /**
     * @description Chemical Agent Atmospheric Concentration
     */
    "ParticleConcentration": "ChemicalAgentAtmosphericConcentration",


    "DiastolicBloodPressure": "DiastolicBloodPressure",

    "SystolicBloodPressure": "SystolicBloodPressure",

    "SkinConductance": "SkinConductance",

    "Acceleration": "Acceleration",

    /**
     * @description HeartBeat, heart rate
     */
    "HeartBeat": "HeartBeat",

    /**
     * @description A person is in the room or not."@en 
     */
    "Presence": "Presence",

    /**
     * @description Luminous Flux is the measure of the perceived power of light."@en 
     */
    "LuminousFlux": "LuminousFlux",

    "AirPollution": "AirPollution"
}


// // UNITS
// export const UNITS_OM = {
//     "m": "metre",
//     "kg": "kilogram",
//     "g": "gram",
//     "s": "second-Time",
//     "A": "ampere",
//     "C": "degreeCelsius",
//     "K": "kelvin",
//     "RH": "percent",
//     "%": "percent",
//     "MmHg": "millimeterMercury",
//     "none": "undefined"
// }

// // QUANTITY KIND (MEASURES)
// export const MEASURES_OM = {
//     "MmHg": "MillimeterMercury",
//     "m": "Length",
//     "kg": "Mass",
//     "g": "Mass",
//     "s": "Time",
//     "A": "ElectricCurrent",
//     "C": "Temperature",
//     "K": "Temperature",
//     "RH": "RelativeHumidity",
//     "%": "Percentage",
//     "none": "undefined"
// }