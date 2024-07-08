import { Router } from "express";
import { save } from "../controllers/Save";
import cors from 'cors';

const router = Router();

router.get('/', (req, res) => {
    return res.send('Hello API Node for Community Solid Server!');
});

// router.options('/save', cors());
router.post('/save', save);

export { router };