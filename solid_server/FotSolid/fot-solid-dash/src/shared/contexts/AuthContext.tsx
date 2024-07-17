import { getDefaultSession, ISessionInfo, Session } from "@inrupt/solid-client-authn-browser";
import React, { createContext, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";


interface IAuthContextData {
    // sessionInfo: ISessionInfo | null | undefined;
    // session: Session | null | undefined;
    isLoggedIn: boolean;
    logout: () => void;
    setLogin: () => void;
}

const AuthContext = createContext({} as IAuthContextData);

interface IAuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {

    // const [session, setSession] = useState<Session | null | undefined>();
    const [isLoggedIn, setIsLoggedin] = useState(false);

    const setLogin = useCallback(() => {
        setIsLoggedin(getDefaultSession().info.isLoggedIn);
    }, []);

    const logout = useCallback(async () => {
        await getDefaultSession().logout();
        setIsLoggedin(false);
    }, []);

    return (
        <AuthContext.Provider value={{ logout, isLoggedIn , setLogin}}>
            {children}
        </AuthContext.Provider>

    );
};

export const useAuthContext = () => useContext(AuthContext);