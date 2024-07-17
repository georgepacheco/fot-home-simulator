
import { Avatar, Box, Button, Icon, Paper, TextField, Typography, useTheme } from "@mui/material"
import { useCallback, useEffect, useRef } from "react";



interface IFerramentasListagemProps {
    // children: React.ReactNode;
    textoBusca?: string;
    placeHolder?: string
    mostrarInputBusca?: boolean;
    aoMudarTextoBusca?: (novoTexto: string) => void;
    textoBotaoNovo?: string;
    mostrarBotaoNovo?: boolean;
    aoClicarNovo?: () => void;
}

export const FerramentasListagem: React.FC<IFerramentasListagemProps> = ({
    textoBusca = '',
    placeHolder = '',
    mostrarInputBusca = false,
    aoMudarTextoBusca,
    aoClicarNovo,
    textoBotaoNovo = 'Novo',
    mostrarBotaoNovo = true
}) => {

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
            <Box flex={5} display='flex'>
                {mostrarInputBusca && (<TextField
                    size="small"
                    autoFocus                    
                    placeholder={placeHolder}
                    variant="standard"                    
                    // value={textoBusca}
                    fullWidth
                    onChange={(e) => aoMudarTextoBusca?.(e.target.value)}
                />)}
            </Box>

            <Box flex={1} display='flex' justifyContent='end'>
                {mostrarBotaoNovo && (
                    <Button
                        color="primary"
                        disableElevation
                        variant="contained"
                        startIcon={<Avatar alt="solid" src='/solid.svg' sx={{ height: theme.spacing(3), width: theme.spacing(3) }} />}
                        onClick={aoClicarNovo}
                    >
                        <Typography variant="button" whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                            {textoBotaoNovo}
                        </Typography>
                    </Button>
                )}
            </Box>
        </Box>
    )
}