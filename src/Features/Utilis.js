import Axios from "axios";
import { GetNewToken } from "./Kitchen/KitchenSlice";
import { useMenuContext } from "../MainCode/SideBarLinkPage/Menus/MenuContext";
import { store } from "./Store/store";

// const baseURL = "http://192.168.220.144:85";
const baseURL = "http://10.10.64.21:85";

// Function to retrieve the authorization token
const getToken = () => {
  try {
    const token = localStorage.getItem("auth");
    if (token) {
      const { accesstoken } = JSON.parse(token);
      return accesstoken;
    }
    return null;
  } catch (error) {
    // console.error("Error retrieving token:", error);
    throw error; // Propagate the error
  }
};

// const getRefreshToken = () => {
//   try {
//     const token = localStorage.getItem("auth");
//     if (token) {
//       const { refreshtoken } = JSON.parse(token);
//       return refreshtoken;
//     }
//     return null;
//   } catch (error) {
//     // console.error("Error retrieving token:", error);
//     throw error; // Propagate the error
//   }
// };

export const axios = Axios.create({ baseURL });

export const axiosWithAuth = () => {
  const token = getToken();

  return Axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};

const instance = Axios.create();

instance.interceptors.request.use((config) => {
  const token = getToken();
  config.baseURL = baseURL;
  config.timeout = 10000;
  config.headers.Authorization = `Bearer ${token}`;

  // console.log(token, "Token");
  return config;
});

instance.interceptors.response.use(
  (response) => {
    // console.log("Response:", response);
    return response;
  },
  async (error) => {
    // Log detailed error response if available
    if (error?.response && error.response.status === 401) {
      localStorage.removeItem("auth");
      store.dispatch(GetNewToken({ Email: userData, UserId: userData }));
      // const { userData } = useMenuContext();
      // const token = await GetNewToken({ Email: userData, UserId: userData });
      // localStorage.setItem("auth", JSON.stringify({ Accesstoken: token }));
      // window.location.reload()
      // console.log(checkAuths, "After")
      return null;
    }
    return Promise.reject(error);
  }
);

export default instance;
