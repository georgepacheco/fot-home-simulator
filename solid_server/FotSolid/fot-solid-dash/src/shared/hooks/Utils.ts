

export const getBaseUrl = (webid: string, initial: number, final: number) => {

    const parts = webid.split('/'); // Divide a string em partes usando '/' como delimitador
    const baseUrl = parts.slice(initial, final).join('/'); 

    return baseUrl;
}


