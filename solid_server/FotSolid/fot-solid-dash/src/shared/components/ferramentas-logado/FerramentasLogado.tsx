import { Box, Paper, Typography, useTheme } from "@mui/material";


interface IFerramentaLogadoProps {
    information?: string;
}

export const FerramentaLogado: React.FC<IFerramentaLogadoProps> = ({information}) => {
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
                <Typography variant="h6" color='#eb5151' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
                    {information}
                </Typography>
            </Box>

            <Box flex={1} display='flex' justifyContent='end'>
                
            </Box>
        </Box>
    );
}