import { Avatar, Box, Divider, Drawer, Icon, List, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppThemeContext, useDrawerContext } from "../../contexts";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import { getDefaultSession, Session } from "@inrupt/solid-client-authn-browser";
import { useAuthContext } from "../../contexts/AuthContext";
import { IUserProfile, ProfileServices } from "../../services/api/profile/ProfileService";


interface IDrawerProps {
    children: React.ReactNode;
}

interface ListItemLinkProps {
    label: string;
    icon: string;
    to: string;
    onClick: (() => void) | undefined;
}

const ListItemLink: React.FC<ListItemLinkProps> = ({ label, icon, to, onClick }) => {

    const navigate = useNavigate();

    const resolvedPath = useResolvedPath(to);
    const match = useMatch({ path: resolvedPath.pathname, end: false });


    const handleClick = () => {
        navigate(to);
        onClick?.();
    };

    return (
        <ListItemButton selected={!!match} onClick={handleClick}>
            <ListItemIcon>
                <Icon>{icon}</Icon>
            </ListItemIcon>
            <ListItemText primary={label} />
        </ListItemButton>
    );
}

export const MenuLateral: React.FC<IDrawerProps> = ({ children }) => {
    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const { isDrawerOpen, drawerOptions, toggleDrawerOpen } = useDrawerContext();
    const { toggleTheme, themeName } = useAppThemeContext();
    const { logout, isLoggedIn } = useAuthContext();
    const [profile, setProfile] = useState<IUserProfile>();
    const navigate = useNavigate();

    const logoutSession = () =>{
        logout();        
        navigate("/home");
    }


    useEffect(() => {
        // console.log('Use Effect Menu Lateral');
        if (isLoggedIn) {
            ProfileServices.getProfile()
                .then((result) => {
                    if (!(result instanceof Error)) {
                        setProfile(result);
                    }
                    // console.log(result);
                });
        }
    }, [isLoggedIn]);


    return (
        <>
            <Drawer open={isDrawerOpen} variant={smDown ? 'temporary' : "permanent"} onClose={toggleDrawerOpen}>
                <Box width={theme.spacing(28)} height='100%' display='flex' flexDirection='column'>

                    <Box width='100%' height={theme.spacing(20)} display='flex' alignItems='center' justifyContent='center' flexDirection='column'>
                        {/* <Avatar src='' sx={{ height: theme.spacing(8), width: theme.spacing(8) }} /> */}
                        {/* {(isLoggedIn) && (
                            <Typography align="center" variant="h6" padding={1}> Welcome <br /> {profile?.firstName + " " + profile?.lastName} </Typography>
                        )} */}
                        {isLoggedIn ? (
                            <Typography align="center" variant="h6" padding={1}>
                                Welcome <br /> {profile?.firstName + " " + profile?.lastName}
                            </Typography>
                        ) : (
                            <Typography align="center" variant="h6" padding={1}>
                                Welcome
                            </Typography>
                        )}
                    </Box>

                    <Divider />

                    <Box flex={1}>
                        <List component="nav">
                            {drawerOptions.map(drawerOption => (
                                <ListItemLink
                                    key={drawerOption.path}
                                    icon={drawerOption.icon}
                                    to={drawerOption.path}
                                    label={drawerOption.label}
                                    onClick={smDown ? toggleDrawerOpen : undefined}
                                />
                            ))}
                        </List>
                    </Box>

                    <Box>
                        <List component="nav">
                            <ListItemButton onClick={toggleTheme}>
                                <ListItemIcon>
                                    <Icon>dark_mode</Icon>
                                </ListItemIcon>
                                <ListItemText primary={themeName === 'dark' ? 'Light Mode' : "Dark Mode"} />
                            </ListItemButton>

                            {(isLoggedIn) && (
                                <ListItemButton onClick={logoutSession}>
                                    <ListItemIcon>
                                        <Icon>logout</Icon>
                                    </ListItemIcon>
                                    <ListItemText primary={'Logout'} />
                                </ListItemButton>
                            )}
                        </List>
                    </Box>
                </Box>
            </Drawer>

            <Box height='100vh' marginLeft={smDown ? 0 : theme.spacing(28)}>
                {children}
            </Box>
        </>

    );
};