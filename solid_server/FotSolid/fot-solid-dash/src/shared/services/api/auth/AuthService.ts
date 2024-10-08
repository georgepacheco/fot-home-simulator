import { login } from "@inrupt/solid-client-authn-browser";
import { useAuthContext } from "../../../contexts/AuthContext";


const auth = async (idp: string) => {    
    
    try {
        await login({
            oidcIssuer: idp,
            redirectUrl: new URL(window.location.href).toString(),            
            // redirectUrl: "https://192.168.0.111:3001/home",
            clientName: "Fot Solid",             
        });
    } catch (error) {
        console.error('Login error:', error);
    }
}

export const AuthService = {
    auth
};