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
        if (idp !== "") {
            AuthService.auth(idp);

        } else {
            alert("Necessário preencher o endereço do seu servidor de Pod.");
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

                <Typography
                    variant="h3"
                    sx={{
                        textAlign: 'justify',    // Alinhamento justificado
                        lineHeight: 1.5,         // Aumenta o espaçamento entre as linhas
                        marginBottom: 2          // Espaço entre parágrafos
                    }}>
                    What is this?
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        textAlign: 'justify',    // Alinhamento justificado
                        lineHeight: 1.5,         // Aumenta o espaçamento entre as linhas
                        marginBottom: 2          // Espaço entre parágrafos
                    }}>
                    Data privacy involves protecting personal information from unauthorized access, use,
                    and sharing. Privacy violations can lead to harm, such as identity theft, financial
                    fraud, and the exposure of personal information that could damage a person's reputation
                    and security. The advent of IoT technologies has enriched our daily lives by enabling
                    interconnected devices to generate and collect an increasing amount of data and enabling
                    the creation of more personalized and valuable services. While the IoT promotes many
                    benefits in our everyday lives, from financial transactions to personal communications,
                    it makes personal information even more vulnerable to access by unauthorized third
                    parties worldwide. Its technologies and characteristics have the potential to amplify
                    privacy issues, posing a trade-off between the convenience of the technology's diverse
                    services and users' privacy concerns.
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        textAlign: 'justify',    // Alinhamento justificado
                        lineHeight: 1.5,         // Aumenta o espaçamento entre as linhas
                        marginBottom: 2          // Espaço entre parágrafos
                    }}>
                    Here, we present a simulation of our proposal, named FoT-PDS, to address privacy issues in IoT. We adopt a Personal Data Store (PDS) as the storage mechanism and leverage its associated benefits: control, transparency, trust, and awareness. We argue that a PDS serves as a solution to mitigate privacy issues in IoT. A PDS refers to a secure and private repository service dedicated to managing the user's data, allowing them to store, manage, and share personal data and digital assets while controlling who can access and utilize them. In short, the basic idea is that the data remains under the user's control, and any use or processing will only occur with their <b>explicit consent</b>.
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        textAlign: 'justify',    // Alinhamento justificado
                        lineHeight: 1.5,         // Aumenta o espaçamento entre as linhas
                        marginBottom: 2          // Espaço entre parágrafos
                    }}>
                    As depicted in Figure 1, our proposed scenario encompasses a monitored building and apartments through smart devices. The generated and collected data from devices are stored in your PDS, and you maintain control over the dissemination, storage, and usage.
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', // Alinha a imagem e a legenda ao centro
                        marginTop: '16px'
                    }}
                >
                    <img
                        src="/smart-building-scenario.png" // Substitua pelo URL da sua imagem
                        alt="Descrição da imagem"
                        style={{
                            width: '100%',    // Define a largura da imagem como 100% do contêiner
                            maxWidth: '700px', // Define uma largura máxima
                            display: 'block',  // Remove o espaço extra abaixo da imagem
                            marginBottom: '8px' // Espaço abaixo da imagem
                        }}
                    />
                    <Typography variant="caption" color="textSecondary" marginBottom={2}>
                        <b>Figure 1 - Smart Building Scenario.</b>
                    </Typography>
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        textAlign: 'justify',    // Alinhamento justificado
                        lineHeight: 1.5,         // Aumenta o espaçamento entre as linhas
                        marginBottom: 2          // Espaço entre parágrafos
                    }}>
                    Here, you can find and manage:
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        textAlign: 'justify',    // Alinhamento justificado
                        lineHeight: 1.5,         // Aumenta o espaçamento entre as linhas
                        marginBottom: 2          // Espaço entre parágrafos
                    }}>
                    <ol>
                        <li>
                            <Typography variant="body2">
                                Your data profile;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                Your sensor's data;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2">
                                Your clouds' repositories;
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2">
                                Your granted consent;
                            </Typography>
                        </li>
                    </ol>
                </Typography>

            </Box>


        </LayoutBasePagina>
    );
};

