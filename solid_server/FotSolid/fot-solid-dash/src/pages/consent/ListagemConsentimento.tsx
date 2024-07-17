import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel, Grid, Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableFooter, TableHead, TableRow, Typography, useTheme } from "@mui/material";
import { LayoutBasePagina } from "../../shared/layouts";
import { FerramentaLogado, FerramentasDetalhe, FerramentasListagem } from "../../shared/components";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { ISensor, SensorServices, SensorType } from "../../shared/services/api/sensors/SensorsService";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { styled } from '@mui/material/styles';
import { getBaseUrl, useDebounce } from "../../shared/hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Environment } from "../../shared/environment";
import { ConsentService, IResource } from "../../shared/services/api/consent/ConsentService";
import { CheckBox } from "@mui/icons-material";

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



const getSensorType = (sensorTypeUrl: string): string => {
    const parts = sensorTypeUrl.split('/');
    const lastPart = parts[parts.length - 1];

    const sensorType = lastPart.substring(0, lastPart.lastIndexOf('.'));
    let sensorTypeName: string = '';

    switch (sensorType) {
        case "BloodPressureSensor":
            sensorTypeName = "Blood Pressure Sensor";
            break;
        case "BodyThermometer":
            sensorTypeName = "Body Thermometer";
            break;
        case "ECG":
            sensorTypeName = "ECG";
            break;
        case "Glucometer":
            sensorTypeName = "Glucometer";
            break;
        case "HumiditySensor":
            sensorTypeName = "Humidity Sensor";
            break;
        case "PulseOxymeter":
            sensorTypeName = "Pulse Oxymeter";
            break;
        case "SmokeDetector":
            sensorTypeName = "Smoke Detector";
            break;
        case "AirThermometer":
            sensorTypeName = "Air Thermometer";
            break;


    }
    return sensorTypeName;
}

export const ListagemConsentimento = () => {
    const theme = useTheme();

    const { debounce } = useDebounce(1000);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [rows, setRows] = useState<IResource[]>([]);
    const [changes, setChanges] = useState<IResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const [index, webId, permission] = event.target.name.split('.');
        const newRows = rows.map((row, i) => {
            if (i.toString() === index) {
                const newAgents = row.agent.map(agent => {
                    if (agent.webId === webId) {
                        return { ...agent, [permission]: event.target.checked };
                    }
                    return agent;
                });
                return { ...row, agent: newAgents };
            }
            return row;
        });
        setRows(newRows);
    };


    const handleSave = async () => {
        await ConsentService.updateAccess(rows);
        navigate('/home');
    }

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '1');
    }, [searchParams]);


    useEffect(() => {

        ConsentService.getAllGrantAccess(getBaseUrl(getDefaultSession().info.webId || '', 0, 4))
            .then((result) => {
                if (result instanceof Error) {
                    alert(result.message);
                    navigate('/home');
                } else {
                    setRows(result);
                    setTotalCount(result.length);
                }
                setIsLoading(false);
            });
    }, [busca, pagina]);



    return (
        <LayoutBasePagina
            title="Consent List"
            toolsBar={

                <FerramentasDetalhe
                    mostrarBotaoSalvar={true}
                    mostrarBotaoApagar={false}
                    mostrarBotaoNovo={false}
                    mostrarBotaoVoltar={false}

                    aoClicarSalvar={handleSave}

                    toolTipText={
                        <React.Fragment>
                            <Typography color="inherit">Description</Typography>
                            Here, you will find the list of all agents (applications)
                            with access to your sensor data. You can revoke or grant
                            new access permissions.
                        </React.Fragment>
                    }
                />
            }
        >

            {rows.map((row, index) => (
                <Accordion
                    key={`panel${index}`}
                // expanded={expanded === `panel${index}`}
                // onChange={handleChangeAccordion(`panel${index}`, index)}
                >
                    <AccordionSummary
                        expandIcon={<Icon>expand_more</Icon>}
                        aria-controls="panel1bh-content"
                        id={`panel1bh-header${index}`}
                        key={`panel1bh-header${index}`}
                    >
                        <Typography variant="h6" sx={{ width: '33%', flexShrink: 0 }}>
                            {getSensorType(row.resourceUrl)}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                            {/* {row.resourceUrl} */}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails key={`panel-detail${index}`}>

                        {row.agent.map((agent) => {
                            return (
                                <TableContainer component={Paper} sx={{ mb: 2 }}>
                                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ backgroundColor: 'lightgray' }} colSpan={3}>Agent: {agent.webId}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow
                                                key={agent.webId}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={agent.read}
                                                                onChange={handleChange}
                                                                name={`${index}.${agent.webId}.read`}
                                                            />
                                                        }
                                                        label="Read"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={agent.write}
                                                                onChange={handleChange}
                                                                name={`${index}.${agent.webId}.write`}
                                                            />
                                                        }
                                                        label="Write"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={agent.append}
                                                                onChange={handleChange}
                                                                name={`${index}.${agent.webId}.append`}
                                                            />
                                                        }
                                                        label="Append"
                                                    />
                                                </TableCell>
                                            </TableRow>

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )
                        })}
                    </AccordionDetails>
                </Accordion>
            ))}
            {isLoading && (
                <LinearProgress variant="indeterminate" />
            )}
        </LayoutBasePagina>
    );
}