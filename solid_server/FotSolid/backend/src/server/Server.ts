import express from 'express';
import cors from 'cors';
import {router} from './routes';
import 'dotenv/config';

const server = express();

// server.use(cors({
//     // origin: '*'
//     origin: process.env.ENABLED_CORS?.split(';') || []
// }));

server.use(cors());

server.use(express.json());

server.use(router);

export { server };