import { login } from "@inrupt/solid-client-authn-browser";
import { useAuthContext } from "../../../contexts/AuthContext";


const auth = async (idp: string) => {    
    try {
        await login({
            oidcIssuer: idp,
            // redirectUrl: new URL(window.location.href).toString(),
            redirectUrl: "http://10.27.0.62:3001/home",
            clientName: "Fot Solid",             
        });
    } catch (error) {
        console.error('Login error:', error);
    }
}

export const AuthService = {
    auth
};