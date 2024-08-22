import { Box, Paper, Typography, useTheme } from "@mui/material";
import { FerramentasListagem } from "../../shared/components";
import { LayoutBasePagina } from "../../shared/layouts";
import { getDefaultSession, handleIncomingRedirect } from "@inrupt/solid-client-authn-browser";
import { useEffect, useState } from "react";

import { AuthService } from "../../shared/services/api/auth/AuthService";
import { useAuthContext } from "../../shared/contexts/AuthContext";
import { ConsentService } from "../../shared/services/api/consent/ConsentService";



export const Dashboard = () => {
    const theme = useTheme();

    // const [session, setSessionInfo] = useState<ISessionInfo | null | undefined>();
    const [idp, setIdp] = useState<string>('');

    const { setLogin } = useAuthContext();

    // // Function to handle incoming authentication redirect
    // async function handleRedirect() {
    //     // Check if there is an incoming authentication redirect
    //     if (!getDefaultSession().info.isLoggedIn) {
    //         const incomingRedirect = await handleIncomingRedirect();
    //         if (incomingRedirect) {
    //             console.log('Redirect completed successfully!');
    //         }
    //         console.log(getDefaultSession().info.webId);
    //     }
    //     // console.log(getDefaultSession().info);
    // }

    // // Check if the user is already logged in
    // async function checkLoggedIn() {

    //     if (getDefaultSession().info.isLoggedIn) {
    //         console.log('User is already logged in.');
    //         const webId = getDefaultSession().info.webId;

    //         // getSensors()



    //         // console.log(await getPodUrlAll(webId || '', { fetch: fetch }));
    //         // // mypods.forEach((mypod) => {
    //         // //     console.log(mypod);
    //         // // });

    //         // // Optionally, fetch the user's profile data
    //         // const profileResponse = await fetch(webId || '');
    //         // if (profileResponse.ok) {
    //         //     const profileData = await profileResponse.text();
    //         //     console.log('User profile data:', profileData);
    //         // }
    //         return true;
    //     } else {
    //         console.log('User is not logged in.');
    //         return false;
    //     }
    // }

    useEffect(() => {
        
        handleIncomingRedirect({
            // restorePreviousSession: true,
          })
            .then((info) => {
                if (info && info.isLoggedIn) {
                    console.log("logado");                    
                    // setSessionInfo(info as ISessionInfo);
                    
                    ConsentService.grantAccess2Simulation(getDefaultSession().info.webId);
                    setLogin();
                } else {
                    console.log(info);
                    console.log("nao logado");
                    // setSessionInfo(null);
                }
            });

        // console.log('qualquer coisa')
            
    }, []);

    const connectPod = () => {
        // alert("idp: " + idp);
        if (idp !== ""){
            AuthService.auth(idp);
            
        } else {
            alert ("Necessário preencher o endereço do seu servidor de Pod.");
        }
    }

    return (
        <LayoutBasePagina
            title="FoT Solid Dashboard"
            toolsBar={(
                <FerramentasListagem
                    mostrarInputBusca
                    placeHolder="http://localhost:3000"
                    textoBotaoNovo="Connect Pod"
                    aoMudarTextoBusca={texto => setIdp(texto)}
                    aoClicarNovo={connectPod}
                />
            )}>

            <Box
                overflow='hidden'
                marginX={1}
                padding={1}
                paddingX={2}
                gap={1}
                alignItems='center'
                flexDirection='column'
                component={Paper}
            >

                <Typography variant="h3">
                    What is this?
                </Typography>
                <Typography variant="body2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ultrices, est ut sollicitudin gravida,
                    sapien enim efficitur turpis, vitae tristique nisi mi vel odio. Etiam fringilla, felis nec convallis viverra,
                    nibh tortor posuere turpis, eu efficitur lacus massa eu sapien. Vestibulum euismod a purus nec bibendum. Sed
                    vestibulum mi neque, sollicitudin scelerisque nisi tempus nec. Suspendisse gravida interdum urna, et ullamcorper
                    lectus commodo non. Proin condimentum leo a interdum gravida. Proin et nulla a nisi gravida cursus.
                </Typography>
                <Typography variant="body2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ultrices, est ut sollicitudin gravida,
                    sapien enim efficitur turpis, vitae tristique nisi mi vel odio. Etiam fringilla, felis nec convallis viverra,
                    nibh tortor posuere turpis, eu efficitur lacus massa eu sapien. Vestibulum euismod a purus nec bibendum. Sed
                    vestibulum mi neque, sollicitudin scelerisque nisi tempus nec. Suspendisse gravida interdum urna, et ullamcorper
                    lectus commodo non. Proin condimentum leo a interdum gravida. Proin et nulla a nisi gravida cursus.
                </Typography>


            </Box>


        </LayoutBasePagina>
    );
};

