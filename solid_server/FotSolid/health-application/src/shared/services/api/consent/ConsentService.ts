import { issueAccessRequest } from "@inrupt/solid-client-access-grants";
import { AuthService } from "../auth/AuthService";
import { getFile, overwriteFile, universalAccess } from "@inrupt/solid-client";
import { getDefaultSession, login } from "@inrupt/solid-client-authn-browser";
import { CheckedItems } from "../../../components/tree-view/CheckTreeView";
import { Environment } from "../../../environment";

export interface IAccessMode {
    checked: boolean;
    append: boolean;
    read: boolean;
    write: boolean;
}

export interface IResource {
    /**
     * @description resource url
     */
    url: string;

    /**
     * @description resource granted access mode
     */
    accessMode: IAccessMode;
}

/**
 * @description resources with received access.
 */
export interface IAccessGranted {
    /**
     * @description webid of the resource owner
     */
    webId: string;

    /**
     * @description list of resources
     */
    resources: IResource[];
}

const getCheckedItems = (items: CheckedItems) => {
    return Object.entries(items)
        // .filter(([_, value]) => value.checked)
        .map(([key, value]) => ({
            key,
            checked: value.checked,
            read: value.read,
            write: value.write,
            append: value.append,
        }));
};

const getBaseUrl = (webid: string) => {

    const parts = webid.split('/'); // Divide a string em partes usando '/' como delimitador
    const baseUrl = parts.slice(0, 4).join('/'); // Seleciona as primeiras 4 partes e junta-as novamente com '/'

    return baseUrl;
}

const grantAccess = async (items: CheckedItems): Promise<void> => {

    const trueCheckedItems = getCheckedItems(items);    

    const sensorsPath = getBaseUrl(getDefaultSession().info.webId || "");
    let accessGranted: IAccessGranted = {
        webId: getDefaultSession().info.webId || '',
        resources: []
    }

    for (const sensor of trueCheckedItems) {
        const resource = `${sensorsPath}/private/sensors/${sensor.key}.ttl`;
        await universalAccess.setAgentAccess(
            resource,         // Resource
            Environment.AGENT_WEBID,     // Agent
            { read: sensor.read, write: sensor.write, append: sensor.append },          // Access object
            { fetch: getDefaultSession().fetch }                         // fetch function from authenticated session
        ).then((newAccess) => {
            const res: IResource = {
                url: resource,
                accessMode: {
                    checked: sensor.checked,
                    append: sensor.append,
                    read: sensor.read,
                    write: sensor.write
                }
            }
            accessGranted.resources.push(res);
        });
    }

    await updateResourcesGranted(accessGranted);

    // const allAccessGranted: IAccessGranted[] = []
    // allAccessGranted.push(accessGranted);
    // saveResourcesGranted(allAccessGranted);
}


const fetchFile = async (authFetch: typeof fetch) => {
    try {
        const fileBlob = await getFile(Environment.URL_FILE_RESOURCE_GRANTED, { fetch: authFetch });

        return await fileBlob.arrayBuffer();

    } catch (error) {
        return new Error((error as { message: string }).message);
    }
}


const updateResourcesGranted = async (newAccessGranted: IAccessGranted) => {
    const authFetch = await AuthService.loginCredentials();
    if (!(authFetch instanceof Error)) {
        let data: IAccessGranted[] = []

        fetchFile(authFetch)
            .then((result) => {
                if (!(result instanceof Error)) {
                    const text = new TextDecoder().decode(result);
                    data = (JSON.parse(text));
                }
            });
        
        // console.log("============ BEFORE ============");
        // const dataCopy: IAccessGranted[] = JSON.parse(JSON.stringify(data));
        // console.log(dataCopy);

        let agent = data.find(agent => agent.webId === newAccessGranted.webId);
        if (agent) {
            for (let res of newAccessGranted.resources) {
                let resource = agent.resources.find(resource => resource.url === res.url);
                if (resource) {
                    resource.accessMode.append = res.accessMode.append;
                    resource.accessMode.read = res.accessMode.read;
                    resource.accessMode.write = res.accessMode.write;
                } else {
                    // Adicionar novo recurso ao agente existente
                    agent.resources.push({ url: res.url, accessMode: res.accessMode });
                }
            }
        } else {
            // Adicionar novo agente com o recurso
            const newAccess: IAccessGranted = {
                webId: newAccessGranted.webId,
                resources: newAccessGranted.resources
            };
            data.push(newAccess);
        }
        // console.log("============ AFTER ============");
        // console.log(data);

        saveResourcesGranted(data);


    }
}

const getAllGrantedByUser = async (webId: string): Promise<IAccessGranted | Error> => {
    const authFetch = await AuthService.loginCredentials();
    let accessgranted: IAccessGranted = {
        webId: webId,
        resources: []
    };
    if (!(authFetch instanceof Error)) {
        try {

            const fileBlob = await getFile(Environment.URL_FILE_RESOURCE_GRANTED, { fetch: authFetch });
            const text = new TextDecoder().decode(await fileBlob.arrayBuffer());
            const data: IAccessGranted[] = JSON.parse(text);
            let agent = data.find(agent => agent.webId === webId);
            if (agent) {
                return agent;
            } else {
                return accessgranted;
            }

        } catch (error) {
            return new Error((error as { message: string }).message || 'Error saving .');
        }
    } else {
        return new Error(authFetch.message);
    }
}

const saveResourcesGranted = async (accessGranted: IAccessGranted[]) => {
    const authFetch = await AuthService.loginCredentials();
    if (!(authFetch instanceof Error)) {
        try {
            await overwriteFile(
                Environment.URL_FILE_RESOURCE_GRANTED,
                new File([JSON.stringify(accessGranted)], Environment.FILE_RESOURCE_GRANTED_NAME, { type: "application/json" }),
                { fetch: authFetch }
            );
        } catch (error) {
            return new Error((error as { message: string }).message || 'Error saving .');
        }
    }
}

const verifyAccessGranted = async () => {

    const authFetch = await AuthService.loginCredentials();

    if (!(authFetch instanceof Error)) {
        universalAccess.getAgentAccess(
            "http://localhost:3000/Home/private/sensors/BodyThermometer.ttl",       // resource  
            "http://localhost:3000/Health/profile/card#me",   // agent
            // { fetch: authFetch }                      // fetch function from authenticated session
            { fetch: getDefaultSession().fetch }                      // fetch function from authenticated session
        ).then((agentAccess) => {
            console.log(agentAccess);
        });
    }
}

const requestAccess = async (fetch: any, resources: string[], ownerWebId: string) => {

    // ExamplePrinter sets the requested access (if granted) to expire in 5 minutes.
    let accessExpiration = new Date(Date.now() + 5 * 60000);

    // Call `issueAccessRequest` to create an access request
    //
    const requestVC = await issueAccessRequest(
        {
            "access": { read: true },
            "resources": resources,   // Array of URLs
            "resourceOwner": ownerWebId,
            "expirationDate": accessExpiration,
            "purpose": ["Alguma coisa"]
        },
        { fetch: fetch } // From the requestor's (i.e., ExamplePrinter's) authenticated session
    );
}


export const ConsentService = {
    grantAccess,
    getAllGrantedByUser
};