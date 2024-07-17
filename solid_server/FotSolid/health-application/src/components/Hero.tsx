import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, alpha, Checkbox, FormControlLabel, FormGroup, Grid, Icon, LinearProgress, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AlignHorizontalRight, Title } from '@mui/icons-material';
import { ConsentService } from '../shared/services/api/consent/ConsentService';
import { getDefaultSession, handleIncomingRedirect } from '@inrupt/solid-client-authn-browser';
import { useAuthContext } from '../shared/contexts/AuthContext';
import { AuthService } from '../shared/services/api/auth/AuthService';
import { CheckedItems, CheckTreeView } from '../shared/components/tree-view/CheckTreeView';
import { IObservation, ISensor, SensorServices, SensorType } from '../shared/services/api/sensors/SensorsService';
import { SensorBoxView } from '../shared/components/sensor-view/SensorBoxView';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const getBaseUrl = (webid: string, slice: number) => {

  const parts = webid.split('/'); // Divide a string em partes usando '/' como delimitador
  const baseUrl = parts.slice(0, slice).join('/'); // Seleciona as primeiras 4 partes e junta-as novamente com '/'

  return baseUrl;
}


export default function Hero() {
  const [idp, setIdp] = useState<string>('');
  const [webId, setWebId] = useState<string>('');
  const [open, setOpen] = useState(false);
  const { setLogin, isLoggedIn } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(true);
  const [sensors, setSensors] = useState<ISensor[]>([]);

  const initialCheckedItems: CheckedItems = {
    BloodPressureSensor: { checked: false, read: false, write: false, append: false },
    BodyThermometer: { checked: false, read: false, write: false, append: false },
    ECG: { checked: false, read: false, write: false, append: false },
    Glucometer: { checked: false, read: false, write: false, append: false },
    HumiditySensor: { checked: false, read: false, write: false, append: false },
    PulseOxymeter: { checked: false, read: false, write: false, append: false },
  };

  const [checkedItems, setCheckedItems] = useState<CheckedItems>(initialCheckedItems);

  const handleChange = (updatedCheckedItems: CheckedItems) => {
    setCheckedItems(updatedCheckedItems);
  };

  const handleGrant = () => {

    localStorage.setItem('sensors', JSON.stringify(checkedItems));
    setOpen(false);
    AuthService.loginWeb(checkedItems, idp);

  }

  const loadCheckBox = (): {} => {
    let sensorItems = localStorage.getItem('sensors');
    if (sensorItems) {
      return JSON.parse(sensorItems);
    }
    return {};
  }

  const handleClose = () => setOpen(false);

  const handleOpen = () => {
    setWebId(webId);
    setIdp(getBaseUrl(webId, 3));
    setOpen(true);
  }

  const getSensorName = (resourceUrl: string) => {
    const filenameWithExtension = resourceUrl.split('/').pop();

    const name = filenameWithExtension?.split('.').slice(0, -1).join('.');

    return name || '';
  }

  const handleGrantMore = async () => {
    const accessGranted = await ConsentService.getAllGrantedByUser(webId);
    localStorage.setItem('webId', webId);

    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = { ...prevCheckedItems };
      if (!(accessGranted instanceof Error)) {
        accessGranted.resources.forEach((resource) => {
          const resourceName = getSensorName(resource.url);

          if (resourceName in updatedCheckedItems) {
            updatedCheckedItems[resourceName] = {
              checked: resource.accessMode.checked,
              read: resource.accessMode.read,
              write: resource.accessMode.write,
              append: resource.accessMode.append,
            };
          }
        });
      }
      return updatedCheckedItems;
    });
    handleOpen();
  }

  const startNow = async () => {
    const sensorsGranted = await SensorServices.getAllSensors(getBaseUrl(webId, 4));
    localStorage.setItem('webId', webId);


    if (!(sensorsGranted instanceof Error)) {
      if (sensorsGranted.length === 0) {
        handleOpen();
      } else {
        setSensors(sensorsGranted);
      }
    }
  }

  useEffect(() => {

    const initialize = async () => {

      const info = await handleIncomingRedirect();

      if (info && info.isLoggedIn) {
        setLogin();
        const items = loadCheckBox();
        // console.log(items);

        const id = localStorage.getItem('webId');
        if (id !== null && id !== undefined) {
          setWebId(id);
        }

        // console.log(`Webid Storage: ${localStorage.getItem('webId')}`);
        // console.log(`Webid: ${webId}`);

        await ConsentService.grantAccess(items);

        const result = await SensorServices.getAllSensors(getBaseUrl(localStorage.getItem('webId') || '', 4));
        if (!(result instanceof Error)) {
          setSensors(result);
        }

        localStorage.removeItem('sensors');
        localStorage.removeItem('webId');
      } else {
        // console.log(`Webid: ${webId}`);
        // console.log("nao logado");
      }
      setIsLoadingButton(false);
    };
    setIsLoadingButton(true);
    initialize();
  }, []);

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(3.5rem, 10vw, 4rem)',
            }}
          >
            A FoT Application Example&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: 'clamp(3rem, 10vw, 4rem)',
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              }}
            >

            </Typography>
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
          >
            Explore our example to understand our approach to managing privacy risks.
            You need to provide access to your data. It is your choice.
            You will decide which data we will have access to.
            <br />
            You need to log in your Pod and grant us access to you data. Let's start.
          </Typography>


          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
          >

            {isLoadingButton && (

              <Box>
                loading ...
                <LinearProgress variant="indeterminate" />
              </Box>
            )}

            {!isLoadingButton && (
              <TextField
                id="outlined-basic"
                hiddenLabel
                size="small"
                variant="outlined"
                aria-label="Enter your WebId"
                placeholder="Your WebId"
                inputProps={{
                  autoComplete: 'off',
                  'aria-label': 'Enter your WebId',
                }}
                value={webId}
                onChange={e => setWebId(e.target.value)}

              />)}


            {(sensors.length > 0 || isLoggedIn) && (!isLoadingButton) && (<Button variant="contained" color="primary" onClick={handleGrantMore}>
              Grant More Access
            </Button>)}

            {(sensors.length === 0) && (!isLoadingButton) && (<Button variant="contained" color="primary" onClick={startNow}>
              Start now
            </Button>)}


            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Grant access to data from these kind of sensors:
                </Typography>

                <CheckTreeView checkedItems={checkedItems} handleChange={handleChange}></CheckTreeView>

                <Box
                  display="flex"
                  justifyContent="flex-end"
                  gap={1}
                >
                  <Button variant='contained' color='info' onClick={handleGrant}>
                    Grant Access
                  </Button>
                  <Button variant='contained' color='error' onClick={handleClose}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Modal>
          </Stack>



          <Typography variant="caption" textAlign="center" sx={{ opacity: 0.8 }}>
            By clicking &quot;Start now&quot; you agree to our&nbsp;
            <Link href="#" color="primary">
              Terms & Conditions
            </Link>
            .
          </Typography>


        </Stack>

        {!isLoadingButton && (
          <SensorBoxView
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            webId={webId}
            sensorData={sensors}
          ></SensorBoxView>
        )}

        {/* {(sensors.length > 0 || isLoggedIn) && (<Box
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
          {sensors.map((row, index) => (
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
        </Box>)} */}
      </Container>
    </Box>
  );
}

