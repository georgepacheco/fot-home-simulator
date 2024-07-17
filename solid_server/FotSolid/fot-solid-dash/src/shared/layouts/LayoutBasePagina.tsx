
import { Box, Icon, IconButton, Paper, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useDrawerContext } from "../contexts";
import { ReactNode } from "react";
import GitHubIcon from '@mui/icons-material/GitHub';

interface ILayoutBaseProps {
    children: ReactNode;
    title: string;
    toolsBar?: ReactNode;
}

export const LayoutBasePagina: React.FC<ILayoutBaseProps> = ({ children, title, toolsBar }) => {
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const theme = useTheme();
    // const smDown = useMediaQuery(theme.breakpoints.down('sm'));

    const { toggleDrawerOpen } = useDrawerContext();

    return (
        <Box height='100%' display='flex' flexDirection='column' gap={1}>

            <Box padding={1} display='flex' alignItems='center' gap={1} height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)} >
                {smDown && <IconButton onClick={toggleDrawerOpen}>
                    <Icon>
                        menu
                    </Icon>
                </IconButton>
                }

                <Typography
                    whiteSpace='nowrap'
                    overflow='hidden'
                    textOverflow='ellipsis'
                    variant={smDown ? "h5" : mdDown ? "h4" : "h3"}

                >
                    {title}
                </Typography>
            </Box>

            {toolsBar && <Box >
                {toolsBar}
            </Box>}

            <Box flex={1} overflow='auto'>
                {children}
            </Box>

            <Box
                padding={1}
                overflow='hidden'
                alignItems='center'
                flexDirection='column'
                component={Paper}
                height={50}
                alignContent='center'
                textAlign='right'
            >
                
                <IconButton
                    color="inherit"
                    href="https://github.com/georgepacheco/fot-solid-dash.git"
                    aria-label="GitHub"
                    sx={{ alignSelf: 'center' }}
                >
                    <GitHubIcon></GitHubIcon>
                </IconButton>

            </Box>
        </Box >
    );
}