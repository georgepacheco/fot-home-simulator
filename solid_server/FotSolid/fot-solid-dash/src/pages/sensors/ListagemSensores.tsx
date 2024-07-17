import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableFooter, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import { LayoutBasePagina } from "../../shared/layouts";
import { FerramentaLogado } from "../../shared/components";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { ISensor, SensorServices, SensorType } from "../../shared/services/api/sensors/SensorsService";
import { useEffect, useMemo, useState } from "react";
import { styled } from '@mui/material/styles';
import { useDebounce } from "../../shared/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Environment } from "../../shared/environment";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const splitString = (data: string | undefined) => {
    if (data !== undefined) {
        const parts = data.split('/'); // Divide a string em partes usando '/' como delimitador
        const lastPart = parts[parts.length - 1]; // Seleciona o último elemento do array
        return (lastPart);
    }
}

export const ListagemSensores = () => {
    const theme = useTheme();

    const { debounce } = useDebounce(1000);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [rows, setRows] = useState<ISensor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '1');
    }, [searchParams]);


    useEffect(() => {

        debounce(() => { 
            SensorServices.getAllSensors(getDefaultSession())
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/home');
                    } else {
                        setRows(result);
                        setTotalCount(result.length);
                    }
                });
        });

        // SensorServices.teste();

    }, [busca, pagina]);



    return (
        <LayoutBasePagina
            title="Sensors List"
            toolsBar={
                <FerramentaLogado
                    information={`Data about me at: ${getDefaultSession().info.webId}.`}                    
                />
            }
        >

            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Ações</StyledTableCell>
                            <StyledTableCell>Sensor Name</StyledTableCell>
                            <StyledTableCell>Sensor Type</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <StyledTableRow key={row.sensor}>
                                <StyledTableCell>
                                    <IconButton size="small" onClick={() => navigate(`/sensors/details/${splitString(row.sensor)}`, { state: { data: row } })}>
                                        <Icon>visibility</Icon>
                                    </IconButton >
                                    <IconButton size="small">
                                        <Icon>delete</Icon>
                                    </IconButton >
                                    {/* <IconButton size="small">
                                        <Icon>edit</Icon>
                                    </IconButton> */}
                                </StyledTableCell>
                                <StyledTableCell>{splitString(row.sensor)}</StyledTableCell>
                                <StyledTableCell>{splitString(row.sensorType)}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <LinearProgress variant="indeterminate" />
                                </TableCell>
                            </TableRow>
                        )}

                        {(totalCount > 0 && totalCount > Environment.LIMITE_LINHAS) && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Pagination
                                        page={pagina}
                                        count={Math.ceil(totalCount / Environment.LIMITE_LINHAS)}
                                        onChange={(_, newPage) => setSearchParams({ busca, pagina: newPage.toString() }, { replace: true })}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableFooter>
                </Table>
            </TableContainer>

        </LayoutBasePagina>
    );
}