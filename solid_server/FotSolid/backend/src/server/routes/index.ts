import { Router } from "express";
import { save } from "../controllers/Save";

const router = Router();

router.get('/', (req, res) => {
    return res.send('Hello API Node for Community Solid Server!');
});

router.post('/save', save);

// router.get('/sensors', SolidController.allSensorsValidation, SolidController.getAllSensors);
// router.get('/sensor/:id/observations', SolidController.observationQueryValidation,
//     SolidController.observationBodyValidation,
//     SolidController.getObservationsBySensor);

// router.get('/getAuthorization', SolidController.userValidation, SolidController.getAuthorizationToken);

// router.post('/profile', SolidController.getProfile);

// router.post ('/save', SolidController.saveValidation, SolidController.save);

// router.post('/savefot', SolidController.saveFromFot);

// router.post ('/sender', SolidController.sender);

// router.post('/remove', SolidController.remove);

// router.post('/teste', SolidController.teste);

export { router };