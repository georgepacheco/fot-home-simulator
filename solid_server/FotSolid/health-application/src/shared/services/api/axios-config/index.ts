import axios from 'axios';
import { errorInterceptor, responseInterceptor } from './interceptors';
import { Environment } from '../../../environment';


const Api = axios.create({
    baseURL: Environment.URL_BASE_CLOUD
});

Api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error),
);

export { Api };