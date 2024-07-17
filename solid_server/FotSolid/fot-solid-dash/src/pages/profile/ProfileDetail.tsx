import { Box, Button, Card, CardActions, CardContent, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { LayoutBasePagina } from "../../shared/layouts";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IUserProfile, ProfileServices } from "../../shared/services/api/profile/ProfileService";
import { useDebounce } from "../../shared/hooks";

export const ProfileDetail = () => {

    const navigate = useNavigate();
    const { debounce } = useDebounce(1000);
    const [isLoading, setIsLoading] = useState(true);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('');



    useEffect(() => {
        setIsLoading(true);
        debounce(() => {
            ProfileServices.getProfile()
                .then((profile) => {                    
                    setIsLoading(false);
                    if (profile instanceof Error) {
                        alert(profile.message);
                        navigate('/home');
                    } else {
                        setFirstName(profile.firstName);
                        setLastName(profile.lastName);
                        setBirthday(profile.birthday);
                        setEmail(profile.email);
                        setGender(profile.gender);
                    }
                });
        });
    }, []);

    const handleSave = () => {

        const profile: IUserProfile = {
            firstName: firstName,
            lastName: lastName,
            birthday: birthday,
            email: email,
            gender: gender
        }

        ProfileServices.updateProfile(profile)
            .then((result) => {
                if (result instanceof Error){
                    alert (result.message);
                } else {
                    navigate ('/home');
                }
            });
    }

    return (
        <LayoutBasePagina
            title='User Profile'
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
                            <Typography variant="h4"> Update your profile</Typography>
                            <TextField
                                label='First Name'
                                placeholder=""
                                fullWidth
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                            // error={!!firstNameError}
                            // helperText={firstNameError}
                            // onKeyDown={() => setFirstNameError('')}
                            />

                            <TextField
                                label='Last Name'
                                placeholder=""
                                fullWidth
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                            // error={!!webIdError}
                            // helperText={webIdError}
                            // onKeyDown={() => setWebIdError('')}
                            />

                            <TextField
                                label='Email'
                                type="email"
                                fullWidth
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                            // error={!!emailError}
                            // helperText={emailError}
                            // onKeyDown={() => setEmailError('')}
                            />

                            <TextField
                                label='Birthday'
                                fullWidth
                                onChange={e => setBirthday(e.target.value)}
                                value={birthday}
                            // error={!!passwordError}
                            // helperText={passwordError}
                            // onKeyDown={() => setPasswordError('')}
                            />

                            <FormControl fullWidth>
                                <InputLabel id="gender-label">Gender</InputLabel>
                                <Select
                                    label="Gender"
                                    labelId="gender-label"
                                    value={gender}
                                    onChange={e => setGender(e.target.value)}
                                // onChange={handleChange}
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Box width='100%' display='flex' justifyContent='center' gap={1}>
                            <Button
                                variant="contained"
                                onClick={() => handleSave()}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/home')}
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