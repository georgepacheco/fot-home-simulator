import { Box, Button, Divider, Icon, IconButton, Paper, Skeleton, Theme, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from "react";


interface IFerramentasDetalheProps {
    textoBotaoNovo?: string;
    toolTipText?: React.ReactNode;

    mostrarBotaoNovo?: boolean;
    mostrarBotaoVoltar?: boolean;
    mostrarBotaoApagar?: boolean;
    mostrarBotaoSalvar?: boolean;
    mostrarBotaoSalvarEFechar?: boolean;
    mostrarBotaoEnviarCloud?: boolean;
    mostrarBotaoEnviarCloudEApagar?: boolean;

    mostrarBotaoNovoCarregando?: boolean;
    mostrarBotaoVoltarCarregando?: boolean;
    mostrarBotaoApagarCarregando?: boolean;
    mostrarBotaoSalvarCarregando?: boolean;
    mostrarBotaoSalvarEFecharCarregando?: boolean;
    mostrarBotaoEnviarCloudCarregando?: boolean;
    mostrarBotaoEnviarCloudEApagarCarregando?: boolean;

    aoClicarNovo?: () => void;
    aoClicarVoltar?: () => void;
    aoClicarApagar?: () => void;
    aoClicarSalvar?: () => void;
    aoClicarSalvarEFechar?: () => void;
    aoClicarEnviar?: () => void;
    aoClicarEnviarEApagar?: () => void;
}

export const FerramentasDetalhe: React.FC<IFerramentasDetalheProps> = ({
    textoBotaoNovo = 'Novo',
    toolTipText = '',

    mostrarBotaoNovo = true,
    mostrarBotaoVoltar = true,
    mostrarBotaoApagar = true,
    mostrarBotaoSalvar = true,
    mostrarBotaoSalvarEFechar = false,
    mostrarBotaoEnviarCloud = false,
    mostrarBotaoEnviarCloudEApagar = false,

    mostrarBotaoNovoCarregando = false,
    mostrarBotaoVoltarCarregando = false,
    mostrarBotaoApagarCarregando = false,
    mostrarBotaoSalvarCarregando = false,
    mostrarBotaoSalvarEFecharCarregando = false,
    mostrarBotaoEnviarCloudCarregando = false,
    mostrarBotaoEnviarCloudEApagarCarregando = false,

    aoClicarNovo,
    aoClicarVoltar,
    aoClicarApagar,
    aoClicarSalvar,
    aoClicarSalvarEFechar,
    aoClicarEnviar,
    aoClicarEnviarEApagar
}) => {

    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const theme = useTheme();

    return (

        <Box
            height={theme.spacing(5)}
            marginX={1}
            padding={1}
            paddingX={2}
            display='flex'
            gap={1}
            alignItems='center'
            component={Paper}
        >

            {(mostrarBotaoSalvar && !mostrarBotaoSalvarCarregando) && (
                <Button
                    color='primary'
                    disableElevation
                    variant='contained'
                    onClick={aoClicarSalvar}
                    startIcon={<Icon>save</Icon>}
                >
                    <Typography variant="button" whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                        Save
                    </Typography>
                </Button>
            )}
            {mostrarBotaoSalvarCarregando && (
                <Skeleton width={110} height={60} />
            )}

            {(mostrarBotaoSalvarEFechar && !mostrarBotaoSalvarEFecharCarregando && !smDown && !mdDown) && (
                <Button
                    color='primary'
                    disableElevation
                    variant='outlined'
                    onClick={aoClicarSalvarEFechar}
                    startIcon={<Icon>save</Icon>}
                >
                    <Typography variant="button" whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                        Save and Back
                    </Typography>
                </Button>
            )}
            {(mostrarBotaoSalvarEFecharCarregando && !smDown && !mdDown) && (
                <Skeleton width={180} height={60} />
            )}

            {(mostrarBotaoEnviarCloud && !mostrarBotaoEnviarCloudCarregando) && (
                <Tooltip title="Send the data to your Pod in the Cloud and keep a copy here.">
                    <Button
                        color='primary'
                        disableElevation
                        variant='outlined'
                        onClick={aoClicarEnviar}
                        startIcon={<Icon>send</Icon>}
                    >
                        <Typography variant="button" whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                            Send
                        </Typography>
                    </Button>
                </Tooltip>
            )}
            {mostrarBotaoEnviarCloudCarregando && (
                <Skeleton width={110} height={60} />
            )}

            {(mostrarBotaoEnviarCloudEApagar && !mostrarBotaoEnviarCloudEApagarCarregando) && (

                <Tooltip title="Send the data to your Pod in the Cloud and delete it from here.">
                    <Button
                        color='primary'
                        disableElevation
                        variant='outlined'
                        onClick={aoClicarEnviarEApagar}
                        startIcon={<Icon>send_and_archive</Icon>}
                    >
                        <Typography variant="button" whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                            Send & Delete
                        </Typography>
                    </Button>
                </Tooltip>
            )}
            {mostrarBotaoEnviarCloudEApagarCarregando && (
                <Skeleton width={110} height={60} />
            )}

            {(mostrarBotaoApagar && !mostrarBotaoApagarCarregando) && (
                <Button
                    color='primary'
                    disableElevation
                    variant='outlined'
                    onClick={aoClicarApagar}
                    startIcon={<Icon>delete</Icon>}
                >
                    <Typography variant="button" whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                        Delete
                    </Typography>
                </Button>
            )}
            {mostrarBotaoApagarCarregando && (
                <Skeleton width={110} height={60} />
            )}

            {(mostrarBotaoNovo && !mostrarBotaoNovoCarregando && !smDown) && (
                <Button
                    color='primary'
                    disableElevation
                    variant='contained'
                    onClick={aoClicarNovo}
                    startIcon={<Icon>add</Icon>}
                >
                    <Typography variant="button" whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                        {textoBotaoNovo}
                    </Typography>
                </Button>
            )}
            {(mostrarBotaoNovoCarregando && !smDown) && (
                <Skeleton width={110} height={60} />
            )}

            {(mostrarBotaoVoltar &&
                (mostrarBotaoNovo || mostrarBotaoApagar || mostrarBotaoSalvar || mostrarBotaoSalvarEFechar)
            ) && (
                    <Divider variant="middle" orientation="vertical" />
                )}

            {(mostrarBotaoVoltar && !mostrarBotaoVoltarCarregando) && (
                <Button
                    color='primary'
                    disableElevation
                    variant='outlined'
                    onClick={aoClicarVoltar}
                    startIcon={<Icon>arrow_back</Icon>}
                >
                    <Typography variant="button" whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                        Back
                    </Typography>
                </Button>
            )}

            {mostrarBotaoVoltarCarregando && (
                <Skeleton width={110} height={60} />
            )}

            {/* <Tooltip title={toolTipText}>
                <IconButton aria-label="help" color="primary">
                    <Icon>help</Icon>
                </IconButton>
            </Tooltip> */}
        </Box>

    );
}