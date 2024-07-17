import React, { useState } from "react";
import { LayoutBasePagina } from "../../shared/layouts";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Card, CardActions, CardContent, Paper, TextField, Typography } from "@mui/material";
import * as yup from 'yup';
import { CloudServices, ICloudData } from "../../shared/services/api/cloud/CloudServices";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { Environment } from "../../shared/environment";


interface ICloudDetailsProps {
    children?: React.ReactNode;
}

const addSchema = yup.object().shape({
    cloud: yup.string().required(),
    webId: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
});

export const CloudDetail: React.FC<ICloudDetailsProps> = () => {

    const { id = 'add' } = useParams<'id'>();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [cloud, setCloud] = useState('');
    const [webId, setWebId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [cloudError, setCloudError] = useState('');
    const [webIdError, setWebIdError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleAdd = () => {

        addSchema
            .validate({ email, password, cloud, webId }, { abortEarly: false })
            .then(dadosValidados => {

                const cloudData: ICloudData = {
                    cloudPath: dadosValidados.cloud,
                    webId: dadosValidados.webId,
                    email: dadosValidados.email,
                    password: dadosValidados.password
                }

                CloudServices.addCloud(cloudData)
                    .then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            alert(result.message);
                        } else {
                            navigate('/cloud');
                        }
                    });

            })
            .catch((errors: yup.ValidationError) => {
                errors.inner.forEach(error => {
                    if (error.path === 'cloud') {
                        setCloudError(error.message);
                    } else if (error.path === 'email') {
                        setEmailError(error.message);
                    } else if (error.path === 'password') {
                        setPasswordError(error.message);
                    }
                })
            });
    }

    return (

        <LayoutBasePagina
            title='FoT Solid Dashboard'
        >

            <Box
                overflow='hidden'
                //   marginX={1}
                //   padding={1}
                //   paddingX={2}
                gap={1}
                alignItems='center'
                flexDirection='column'
                component={Paper}
            >
                <Card>
                    <CardContent>
                        <Box display='flex' flexDirection='column' gap={2} width='100%'>
                            <Typography variant="h4"> Add new cloud pod</Typography>
                            <TextField
                                label='Cloud Address'
                                placeholder="example: http://myserver.com:3000"
                                fullWidth
                                value={cloud}
                                error={!!cloudError}
                                helperText={cloudError}
                                onChange={e => setCloud(e.target.value)}
                                onKeyDown={() => setCloudError('')}
                            />

                            <TextField
                                label='WebId'
                                placeholder="example: http://myserver:3000/MyPod/profile/card#me"
                                fullWidth
                                value={webId}
                                error={!!webIdError}
                                helperText={webIdError}
                                onChange={e => setWebId(e.target.value)}
                                onKeyDown={() => setWebIdError('')}
                            />

                            <TextField
                                label='Email'
                                type="email"
                                fullWidth
                                value={email}
                                error={!!emailError}
                                helperText={emailError}
                                onChange={e => setEmail(e.target.value)}
                                onKeyDown={() => setEmailError('')}
                            />

                            <TextField
                                label='Password'
                                type="password"
                                fullWidth
                                value={password}
                                error={!!passwordError}
                                helperText={passwordError}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={() => setPasswordError('')}
                            />
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Box width='100%' display='flex' justifyContent='center' gap={1}>
                            <Button
                                variant="contained"
                                onClick={() => handleAdd()}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/cloud')}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </CardActions>
                </Card>
            </Box>

        </LayoutBasePagina>

    );
}