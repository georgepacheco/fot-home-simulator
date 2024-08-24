

export const Environment = {
    
    /**
     * @description The agent's webId
     */
    // AGENT_WEBID: "http://localhost:3000/Health/profile/card#me",
    AGENT_WEBID: "https://192.168.0.111:3000/Health/profile/card#me",
    
    /**
     * URL of the file with data on resources with guaranteed access
     */
    // URL_FILE_RESOURCE_GRANTED: "http://localhost:3000/Health/private/resource_granted.json",
    URL_FILE_RESOURCE_GRANTED: "https://192.168.0.111:3000/Health/private/resource_granted.json",


    USER_ID: "1652322",
    LOCAL_WEBID: "https://192.168.0.111:3000/Health/profile/card#me",
    WEBID: "https://192.168.0.111:3000/Health/profile/card#me",
    IDP: "https://192.168.0.111:3000/",
    USERNAME: "health@example.com",
    PODNAME: "Health",
    PASSWORD: "12345",


    FILE_RESOURCE_GRANTED_NAME: "resource_granted.json",

    /**
     * Define a quantidade de linhas a ser carregada por padrão nas listagens
     */
    LIMITE_LINHAS: 10,

    /**
     * Placeholder exibido nas inputs
     */
    INPUT_BUSCA: 'Search ...',

    /**
     * Texto exibido quando nenhum registro é encontrado em uma listagem
     */
    LISTAGEM_VAZIA: 'No records found.',
   
    /**
     * URL base do servidor de pods na cloud. 
     */
    URL_BASE_CLOUD: 'http://localhost:3333',

    
    ERROR_FETCH: 'Failed fetching server.',

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
};