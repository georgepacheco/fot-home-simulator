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
import { getDefaultSession, handleIncomingRedirect, login } from '@inrupt/solid-client-authn-browser';
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

  const [openTerms, setOpenTerms] = useState(false);

  const handleOpenTerms = () => setOpenTerms(true);
  const handleCloseTerms = () => setOpenTerms(false);

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
    if (webId.trim() === '') {
      alert('Enter your WebId.');
    } else {
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
  }

  // const loginteste = async () => {
  //   try {
  //     await login({
  //       // oidcIssuer: "http://10.27.0.62:3000",
  //       oidcIssuer: "http://54.210.40.21:3000",
  //       // oidcIssuer: "http://localhost:3000",
  //       // redirectUrl: new URL("/", "http://10.27.0.62:3001").toString(),
  //       // redirectUrl: new URL("/", "http://3.86.13.252:3001").toString(),
  //       redirectUrl: new URL(window.location.href).toString(),
  //       clientName: "Fot Solid",
  //     });
  //   } catch (error) {
  //     console.error('Login error:', error);
  //   }
  // }

  useEffect(() => {

    const initialize = async () => {

      const info = await handleIncomingRedirect();
      console.log(getDefaultSession());

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
            You need to log in your PDS and grant us access to you data. Let's start.
          </Typography>

          <Typography
            fontWeight='bold'
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
          >
            This is not a real application. Our sole purpose here is to simulate how a real application would proceed to use your data and how we can act in this context.
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

            {/* <Button variant="contained" color="primary" onClick={loginteste}>
              Login
            </Button> */}


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
            <Link href="#" color="primary" onClick={handleOpenTerms}>
              Terms & Conditions
            </Link>
            .
          </Typography>


          <Modal
            open={openTerms}
            onClose={handleCloseTerms}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={
              {
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 750,
                height: 700,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }
            }>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Termo de Concordância para Acesso a Dados de Sensores do PDS
              </Typography>

              <Typography variant="body1" paragraph>
                Ao utilizar esta aplicação médica, você concorda com os seguintes termos:
              </Typography>

              <Typography variant="body2" paragraph>
                <strong>1. Acesso a Dados:</strong> Esta aplicação não coleta dados diretamente do seu dispositivo. Ela solicita acesso aos dados de seus sensores que estão armazenados no seu Personal Data Store (PDS).
              </Typography>

              <Typography variant="body2" paragraph>
                <strong>2. Finalidade do Acesso:</strong> Os dados serão acessados exclusivamente para permitir que o seu médico pessoal avalie sua saúde e tome decisões informadas sobre seu tratamento. A partir da análise de padrões anormais de dados coletados por sensores, como variações súbitas de temperatura corporal, podemos detectar doenças infecciosas antes que os sintomas se agravem. Ou a partir dos dados de batimentos cardíacos e níveis de oxigênio no sangue, podemos monitorar o coração em tempo real e alertar para anomalias antes que um ataque cardíaco ocorra.
              </Typography>

              <Typography variant="body2" paragraph>
                <strong>3. Compartilhamento de Dados:</strong> Os seus dados não serão compartilhados com terceiros sem o seu consentimento explícito.
              </Typography>

              <Typography variant="body2" paragraph>
                <strong>4. Armazenamento de Dados:</strong> Esta aplicação não armazena seus dados. Todos os dados acessados permanecem em seu PDS e só são utilizados enquanto você mantiver o consentimento.
              </Typography>

              <Typography variant="body2" paragraph>
                <strong>5. Revogação de Consentimento:</strong> Você pode cancelar a qualquer momento o consentimento dado para o acesso aos seus dados de sensores através das configurações do seu PDS. Após a revogação, a aplicação deixará de acessar os seus dados.
              </Typography>

              <Typography variant="body1" paragraph>
                Ao clicar em "<strong>Start Now</strong>", você concorda com os termos acima e autoriza o acesso aos dados de sensores.
              </Typography>

              <Button onClick={handleCloseTerms} variant="contained" color="primary" sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                Fechar
              </Button>
            </Box>
          </Modal>
        </Stack>

        {!isLoadingButton && (
          <SensorBoxView
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            webId={webId}
            sensorData={sensors}
          ></SensorBoxView>
        )}
      </Container>
    </Box>
  );
}

