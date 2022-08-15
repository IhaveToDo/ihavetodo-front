import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URI,
});

export default client;
