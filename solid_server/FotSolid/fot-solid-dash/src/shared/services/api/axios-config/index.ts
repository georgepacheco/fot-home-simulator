import axios from 'axios';
import { errorInterceptor, responseInterceptor } from './interceptors';
import { Environment } from '../../../environment';

const Api = axios.create({
    baseURL: Environment.URL_BASE_CLOUD
});

const apiCloud = (baseURL: string) => {
    return axios.create ({
        baseURL: baseURL
    });
}

Api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error),
);

export { Api, apiCloud };