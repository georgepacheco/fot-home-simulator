import { login } from "@inrupt/solid-client-authn-browser";
import { useAuthContext } from "../../../contexts/AuthContext";


const auth = async (idp: string) => {    
    console.log("idp: " + idp);
    console.log("url: " + new URL(window.location.href).toString());
    try {
        await login({
            oidcIssuer: idp,
            redirectUrl: new URL(window.location.href).toString(),            
            clientName: "Fot Solid",             
        });
    } catch (error) {
        console.error('Login error:', error);
    }
}

export const AuthService = {
    auth
};