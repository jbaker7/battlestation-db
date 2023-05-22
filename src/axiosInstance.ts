import axios from 'axios';

export const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_LOCATION,
    headers: {
      "Content-type": "application/json",
    },
  });