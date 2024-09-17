import { Accordion, AccordionDetails, AccordionSummary, Icon, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import { LayoutBasePagina } from "../../shared/layouts";
import { useTheme } from "@emotion/react";
import { styled } from '@mui/material/styles';
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FerramentasDetalhe } from "../../shared/components";
import { Environment } from "../../shared/environment";
import { CloudServices, ICloudData } from "../../shared/services/api/cloud/CloudServices";
import { useDebounce } from "../../shared/hooks";

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


export const ListagemCloud = () => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [rows, setRows] = useState<ICloudData[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const theme = useTheme();

    const [expanded, setExpanded] = useState<string | false>(false);

    const { debounce } = useDebounce(1000);

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '1');
    }, [searchParams]);

    const handleChange =
        (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    useEffect(() => {
        setIsLoading(true);
        debounce(() => {
            CloudServices.getAllClouds()
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {                         
                        alert(result.message);
                        navigate('/home');
                    } else {
                        setTotalCount(result.length);                        
                        setRows(result);
                    }
                });
        });
    }, [pagina]);

    const handleDelete = (webId: string) => {

        if (window.confirm("Delete cloud credential?")) {
            const result = CloudServices.deleteCloud(webId)
            if (result instanceof Error) {
                alert(result.message);
            } else {
                setRows(oldRows => [
                    ...oldRows.filter(oldRow => oldRow.webId !== webId),
                ]);
            }
        }
    }

    return (
        <LayoutBasePagina
            title="Cloud Pod List"
            toolsBar={
                <FerramentasDetalhe
                    mostrarBotaoApagar={false}
                    mostrarBotaoSalvar={false}
                    mostrarBotaoVoltar={false}
                    textoBotaoNovo="Add"
                    aoClicarNovo={() => navigate('/cloud/details/add')}
                />
            }
        >
            <Accordion
                sx={{ margin: 1}}
                expanded={expanded === 'panel1'}
                onChange={handleChange('panel1')}
            >
                <AccordionSummary
                    // expandIcon={<Icon>expand_more</Icon>}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"                   
                >
                    <Typography variant="h6" sx={{ width: '100%', flexShrink: 0 }} color="#eb5151">
                    In our proposal, you can choose to send your local data to a cloud server. This way, you can add your cloud servers here.
                    </Typography>
                </AccordionSummary>
                {/* <AccordionDetails>
                    In our proposal, you can choose to send your local data to a cloud server. This way, we can add your cloud servers here.
                </AccordionDetails> */}
            </Accordion>
            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Ações</StyledTableCell>
                            <StyledTableCell>Cloud Path</StyledTableCell>
                            <StyledTableCell>WebId</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map(row => (
                            <StyledTableRow key={row.webId}>
                                <StyledTableCell>
                                    {/* <IconButton size="small">
                                        <Icon>visibility</Icon>
                                    </IconButton > */}
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(row.webId)}>
                                        <Icon>delete</Icon>
                                    </IconButton >
                                </StyledTableCell>
                                <StyledTableCell>{row.cloudPath}</StyledTableCell>
                                <StyledTableCell>{row.webId}</StyledTableCell>
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
                    </TableFooter>
                </Table>
            </TableContainer>
        </LayoutBasePagina >
    );
}