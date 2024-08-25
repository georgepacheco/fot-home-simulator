import express from 'express';
import cors from 'cors';
import { router } from './routes';
import 'dotenv/config';

const server = express();

// server.use(cors({
//     // origin: '*'
//     origin: process.env.ENABLED_CORS?.split(';') || []
// }));

const basePath = '/api';

server.use(cors());

server.use(basePath, express.json());

server.use(basePath, router);

export { server };