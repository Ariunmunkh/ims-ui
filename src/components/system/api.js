import axios from "axios";
import { message } from "antd";
import { getBaseURL } from "./apiconfig";

let errorMessage = "Амжилтгүй боллоо. ";

const auth = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  'Access-Control-Allow-Credentials': true
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: false,
  timeout: 240000,
  headers: auth,
  mode: 'cors'
});

api.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    message.error(errorMessage + error.message);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    if (response.status !== 200) {
      message.error(errorMessage + response.message);
    }

    if (
      !response?.config?.ignoreRetType &&
      response.data.rettype !== undefined &&
      response?.data?.rettype !== 0
    ) {
      message.error(errorMessage + response?.data?.retmsg);
    }

    return response;
  },
  async function (error) {
    if (error.response.status === 401) {
      if (!error.request.responseURL.endsWith("/login")) {
        message.error(errorMessage + error.response.message);
      }
    } else {
      message.error(errorMessage + error.message);
    }
    return Promise.reject(error);
  }
);

export { api };
