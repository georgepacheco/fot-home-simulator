
import { Box, Icon, IconButton, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useDrawerContext } from "../contexts";
import { ReactNode } from "react";


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

            <Box padding={1} display='flex' alignItems='center' gap={1} height={theme.spacing(smDown ? 6 : mdDown ? 8: 12)} >
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
                    variant={smDown ? "h5" : mdDown ? "h4": "h3"}
                    
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

        </Box>
    );
}