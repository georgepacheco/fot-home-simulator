import { Navigate, Route, Routes } from "react-router-dom";
import { useDrawerContext } from "../shared/contexts";
import { useEffect } from "react";
import { CloudDetail, Dashboard, ListagemCloud, ListagemConsentimento } from "../pages";
import { ListagemSensores } from "../pages/sensors/ListagemSensores";
import { SensorDetail } from "../pages/sensors/SensorsDetail";
import { DataCloud } from "../pages/cloud/DataCloud";
import { ProfileDetail } from "../pages/profile/ProfileDetail";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';


export const AppRoutes = () => {

    const { toggleDrawerOpen, handleSetDrawerOptions } = useDrawerContext();

    useEffect(() => {
        handleSetDrawerOptions([
            {
                icon: 'home',
                path: '/home',
                label: 'Home',
            },
            {
                icon: 'person',
                path: '/profile',
                label: 'Profile',
            },
            {
                icon: 'sensors',
                path: '/sensors',
                label: 'Sensors',
            },
            {
                icon: 'cloud',
                path: '/cloud',
                label: 'Cloud'
            },
            {
                icon: 'assignment-turnedin',
                path: '/consent',
                label: 'Consent'
            },
        ]);
    }, []);

    return (
        <Routes>
            <Route path="/home" element={<Dashboard />} />

            <Route path="/profile" element={<ProfileDetail />} />

            <Route path="/sensors" element={<ListagemSensores />} />

            <Route path="/cloud" element={<ListagemCloud />} />
            
            <Route path="/consent" element={<ListagemConsentimento />} />

            <Route path="/sensors/details/:id" element={<SensorDetail />} />

            <Route path="/cloud/details/:id" element={<CloudDetail />} />

            <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    );
};