import { SyntheticEvent, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LayoutBasePagina } from "../../shared/layouts";
import { CheckTreeView3, FerramentasDetalhe } from "../../shared/components";
import { Accordion, AccordionDetails, AccordionSummary, Grid, Icon, Typography } from "@mui/material";
import { IObservation, ISensor, SensorServices } from "../../shared/services/api/sensors/SensorsService";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { Node } from 'react-checkbox-tree';
import { Environment } from "../../shared/environment";

// const model = [

//     {
//         value: 'dataid', label: '2024.04.05', children: [
//             { value: 'observationId', label: 'Hora - Valor' },            
//         ]
//     },

// ]

export const SensorDetail: React.FC = () => {
    const { id = 'nova' } = useParams<'id'>();
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoading, setIsLoading] = useState(false);
    const [sensor, setSensor] = useState('false');
    const [items, setItems] = useState<Node[]>([]);

    const [expanded, setExpanded] = useState<string | false>(false);

    const [checked, setChecked] = useState<string[]>([]);

    const splitString = (data: string | undefined, delimitador: string) => {
        if (data !== undefined) {
            const parts = data.split(delimitador); // Divide a string em partes usando '/' como delimitador
            const lastPart = parts[parts.length - 1]; // Seleciona o último elemento do array
            return (lastPart);
        }
    }

    const handleCheck = (checked: string[]) => {
        setChecked(checked);
    };

    const handleChange =
        (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    useEffect(() => {
        console.log('oi');
        if (id !== 'nova') {
            setIsLoading(true);
            setSensor(id);
            
            const s: ISensor = location.state.data;                        

            SensorServices.getObservationsBySensor(getDefaultSession(), id, splitString(s.sensorType, "#") || '')
                .then((result) => {
                    if (result instanceof Error) {
                        alert(result.message);
                        navigate('/sensors');
                    } else {
                        setItems(buildTreeData(result));
                    }
                });
        }
    }, [id]);

    const handleDelete = () => {
        const s: ISensor = location.state.data;    

        SensorServices.deleteObservations(getDefaultSession(), checked, splitString(s.sensorType, "#") || '')
            .then((result) => {
                if (result instanceof Error) {
                    alert(result.message);
                    navigate('/sensors');
                } else {
                    const newItems = items.map(item => ({
                        ...item,
                        children: (item.children !== undefined) ? item.children.filter(child => !checked.includes(child.value)) : []
                    }));
                    setItems(newItems);
                }
            });
    };

    const buildTreeData = (observations: IObservation[]): Node[] => {

        const items: Map<string, Map<string, string>[]> = new Map();
        observations.forEach(obs => {
            if (obs.resultTime !== undefined && obs.observationId !== undefined) {

                const dataTime: Date = new Date(obs.resultTime);

                const hours: number = dataTime.getHours();
                const minutes: number = dataTime.getMinutes();
                const seconds: number = dataTime.getSeconds();

                const time: string = `${hours}:${minutes}:${seconds}`;

                const day: number = dataTime.getDate();
                const month: number = dataTime.getMonth() + 1; // O método getMonth() retorna valores de 0 a 11, então adicionamos 1 para obter o mês correto
                const year: number = dataTime.getFullYear();

                const date: string = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;

                const dataValueMap: Map<string, string> = new Map();
                dataValueMap.set(obs.observationId, time + ' - ' + obs.resultValue || '');

                if (!items.has(date)) {
                    items.set(date, []);
                }
                items.get(date)?.push(dataValueMap);
            }
        });

        const data: Node[] = [];
        items.forEach((mapArray, key) => {
            let parent: Node = {
                value: key,
                label: key,
                children: []
            }
            mapArray.forEach((map, index) => {
                map.forEach((value, mapKey) => {
                    const children: Node = {
                        value: mapKey,
                        label: value
                    }
                    parent.children?.push(children);
                });
            });

            data.push(parent);
        });

        return data;
    }

    const handleSend = async () => {
        if (checked.length > 0) {
            const s: ISensor = location.state.data;
            s.sensorName = splitString(s.sensor, "/");
            s.observation = [];

            for (const obs of checked) {
                const result = await SensorServices.getObservationById(getDefaultSession(), obs, splitString(s.sensorType, "#") || '');
                if (!(result instanceof Error)) {
                    result.observationId = splitString(result.observationId, ":");
                    s.observation?.push(result);
                }
            }
            const result = await SensorServices.sendData2Cloud(s);
            if (result instanceof Error) {
                alert(result.message);
            } else {
                navigate('/sensors')
            }

        } else {
            alert(Environment.SELECT_DATA_SENDER);
        }
    }

    const handleSendRemove = async () => {
        if (checked.length > 0) {
            const s: ISensor = location.state.data;
            s.sensorName = splitString(s.sensor, "/");
            s.observation = [];

            for (const obs of checked) {
                const result = await SensorServices.getObservationById(getDefaultSession(), obs, splitString(s.sensorType, "#") || '');
                if (!(result instanceof Error)) {
                    result.observationId = splitString(result.observationId, ":");
                    s.observation?.push(result);
                }
            }
            const result = await SensorServices.sendData2CloudDelete(s, checked);
            if (result instanceof Error) {
                alert(result.message);
            } else {
                const newItems = items.map(item => ({
                    ...item,
                    children: (item.children !== undefined) ? item.children.filter(child => !checked.includes(child.value)) : []
                }));
                setItems(newItems);
            }

        } else {
            alert(Environment.SELECT_DATA_SENDER);
        }
    }

    return (
        <LayoutBasePagina
            title={id !== 'nova' ? 'Sensor ' + sensor : 'New Sensor'}
            toolsBar={
                <FerramentasDetalhe
                    mostrarBotaoApagar={id !== "nova"}
                    mostrarBotaoNovo={false}
                    mostrarBotaoSalvarEFechar={false}
                    mostrarBotaoSalvar={false}
                    mostrarBotaoEnviarCloud={true}
                    mostrarBotaoEnviarCloudEApagar={true}

                    aoClicarEnviar={() => handleSend()}
                    aoClicarEnviarEApagar={() => handleSendRemove()}
                    aoClicarApagar={() => { handleDelete() }}
                    aoClicarVoltar={() => { navigate('/sensors') }}

                />
            }
        >

            {/* {isLoading && (
                <LinearProgress variant="indeterminate" />
            )} */}

            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                    expandIcon={<Icon>expand_more</Icon>}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography variant="h6" sx={{ width: '33%', flexShrink: 0 }}>
                        Sensor Information
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                        {location.state.data.sensor}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={0.5} flexDirection={'column'}>
                        <Typography>
                            <b> Sensor: </b> {location.state.data.sensor}
                        </Typography>
                        <Typography>
                            <b>Sensor Type: </b> {location.state.data.sensorType}
                        </Typography>
                        <Typography>
                            <b>Unity Type: </b> {location.state.data.unitType}
                        </Typography>
                        <Typography>
                            <b>Parent Class: </b> {location.state.data.parentClass}
                        </Typography>
                        <Typography>
                            <b>Latitude: </b> {location.state.data.lat}
                        </Typography>
                        <Typography>
                            <b>Logitude: </b> {location.state.data.long}
                        </Typography>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary
                    expandIcon={<Icon>expand_more</Icon>}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography variant="h6" sx={{ width: '33%', flexShrink: 0 }}>
                        Sensor Data
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                        The data is grouped by days. Each day shows the collected value and its respective time.
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    {/* <CheckTreeView2 items={items} /> */}
                    <CheckTreeView3 items={items} checked={checked} aoClicarCheck={handleCheck} />
                </AccordionDetails>
            </Accordion>
        </LayoutBasePagina>
    )
}