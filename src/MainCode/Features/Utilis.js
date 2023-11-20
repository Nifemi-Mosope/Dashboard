import Axios from "axios";

const baseURL = "http://192.168.226.144:85";

export const axios = Axios.create({ baseURL });

export const axiosWithAuth = (token) =>
  Axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      Authorization: "Bearer " + token,
    },
});