import { Accordion, AccordionDetails, AccordionSummary, alpha, Box, Grid, Icon, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import { useAuthContext } from "../../contexts/AuthContext";
import { IObservation, ISensor, SensorServices } from "../../services/api/sensors/SensorsService";
import { SyntheticEvent, useEffect, useState } from "react";
import { getBaseUrl } from "../../../components/Hero";


interface ISensorViewProps {
    sensorData: ISensor[];
    webId: string;
    isLoading: boolean;
    setIsLoading: ((status: boolean) => void);
}

export const SensorBoxView: React.FC<ISensorViewProps> = ({ sensorData, webId, isLoading, setIsLoading }) => {

    const { isLoggedIn } = useAuthContext();
    const [expanded, setExpanded] = useState<string | false>(false);

    const getLastPart = (url: string, delimiter: string) => {
        const parts = url.split(delimiter);
        return parts[parts.length - 1];
    }

    const getObservations = async (sensorIndex: number): Promise<IObservation[] | Error> => {
        const sensorType = sensorData[sensorIndex].sensorType;
        const sensorTypeName = getLastPart(sensorType || '', '#');
        sensorData[sensorIndex].sensorName = getLastPart(sensorData[sensorIndex].sensor || '', "/");

        const observations = await SensorServices.getObservationsBySensor(getBaseUrl(webId, 4),
            sensorData[sensorIndex].sensorName || '',
            sensorTypeName);

        return observations;
    }

    const handleChangeAccordion =
        (panel: string, sensorIndex: number) => (event: SyntheticEvent, isExpanded: boolean) => {
            setIsLoading(true);
            setExpanded(isExpanded ? panel : false);
            if (isExpanded) {
                (getObservations(sensorIndex))
                    .then((result) => {
                        setIsLoading(false);
                        if (!(result instanceof Error)) {
                            sensorData[sensorIndex].observation = result;
                        }
                    });
            }
        };

    useEffect(() => {
        console.log(sensorData);

    }, [sensorData]);

    return (
        <Box sx={{ margin: 1 }}>
            {(sensorData.length > 0 || isLoggedIn) && (<Box
                id="image"
                sx={(theme) => ({
                    mt: { xs: 8, sm: 10 },
                    alignSelf: 'center',
                    height: { xs: 200, sm: 700 },
                    width: '100%',
                    backgroundImage:
                        theme.palette.mode === 'light'
                            ? 'url("/static/images/templates/templates-images/hero-light.png")'
                            : 'url("/static/images/templates/templates-images/hero-dark.png")',
                    backgroundSize: 'cover',
                    borderRadius: '10px',
                    outline: '1px solid',
                    outlineColor:
                        theme.palette.mode === 'light'
                            ? alpha('#BFCCD9', 0.5)
                            : alpha('#9CCCFC', 0.1),
                    boxShadow:
                        theme.palette.mode === 'light'
                            ? `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}`
                            : `0 0 24px 12px ${alpha('#033363', 0.2)}`,
                })}
            >
                {sensorData.map((row, index) => (
                    <Accordion
                        key={`panel${index}`}
                        expanded={expanded === `panel${index}`}
                        onChange={handleChangeAccordion(`panel${index}`, index)}>
                        <AccordionSummary
                            expandIcon={<Icon>expand_more</Icon>}
                            aria-controls="panel1bh-content"
                            id={`panel1bh-header${index}`}
                            key={`panel1bh-header${index}`}
                        >
                            <Typography variant="h6" sx={{ width: '33%', flexShrink: 0 }}>
                                Sensor Information
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>
                                {row.sensor}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails key={`panel-detail${index}`}>
                            <Grid key={`panel-grid${index}`} container spacing={0.5} flexDirection={'column'}>
                                <Typography>
                                    <b>Sensor Type: </b> {row.sensorType}
                                </Typography>
                                <Typography>
                                    <b>Unity Type: </b> {row.unitType}
                                </Typography>
                                <Typography>
                                    <b>Data: </b>
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Value</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Time</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {row.observation && row.observation.map((obs) => {
                                                const [date, time] = obs.resultTime?.split(' ') ?? [];
                                                return (
                                                    <TableRow
                                                        key={obs.observationId}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell> {obs.resultValue}</TableCell>
                                                        <TableCell>{date}</TableCell>
                                                        <TableCell>{time}</TableCell>

                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                        <TableFooter>
                                            {isLoading && (
                                                <TableRow>
                                                    <TableCell colSpan={2}>
                                                        <LinearProgress variant="indeterminate" />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableFooter>
                                    </Table>
                                </TableContainer>

                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>)}
        </Box>
    );
}