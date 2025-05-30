

export const Environment = {
    /**
     * Define a quantidade de linhas a ser carregada por padrão nas listagens
     */
    LIMITE_LINHAS: 20,

    /**
     * Placeholder exibido nas inputs
     */
    INPUT_BUSCA: 'Search ...',

    /**
     * Texto exibido quando nenhum registro é encontrado em uma listagem
     */
    LISTAGEM_VAZIA: 'No records found.',

    /**
     * User not logged in message.
     */
    USER_NOT_LOGGED:  "User not logged in. Please connect to your Pod.",

     /**
     * WebId error message.
     */
    WEB_ID_ERROR: "WebId is undefined. Please connect to your Pod.",

    ERROR_DATA_SENDER: "Failure to send data to the server.",

    SELECT_DATA_SENDER: "Please select any data to send to the cloud.",

    ERROR_PROFILE: "Error to retrieve your profile.",
    
    
    

    /**
     * @description The simulator webId
     */
    // SIM_WEBID: "https://147.79.82.127:3003/HomeSimulator/profile/card#me",
    // SIM_WEBID: "https://147.79.82.127:3000/HomeSimulator/profile/card#me",
    SIM_WEBID: "https://192.168.0.111:3000/HomeSimulator/profile/card#me",


    SIM_API_URL: "https://192.168.0.111/api/save",
    // SIM_API_URL: "https://147.79.82.127/api/save",

    /**
     * URL base do servidor de pods na cloud. 
     */

    URL_BASE_CLOUD: 'https://192.168.0.111:3333/',
    // URL_BASE_CLOUD: 'https://147.79.82.127:3333/',

    URL_CLOUD: 'https://192.168.0.111:3333/apiCloud/savefot',
    // URL_CLOUD: 'https://147.79.82.127:3333/apiCloud/savefot',

    CLOUD_WEBID: "DefaultUser/profile/card#me",

    CLOUD_USERNAME: "default@example.com",

    CLOUD_PASSWORD: "1234",

    CLOUD_PODNAME: "DefaultUser",

    METRICS_FILE: "metrics.json"
};