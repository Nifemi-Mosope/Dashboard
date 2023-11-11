import {axios, axiosWithAuth} from '../Features/Utilis'

const BASE_PATH = "/Kitchen"
export async function SignUp(data){
    try {
        const payload = {
            KitchenName: data.KitchenName ,
            KitchenEmail: data.KitchenEmail,
            ManagerFirstName: data.ManagerFirstName,
            ManagerLastName: data.ManagerLastName,
            ManagerPhone: data.ManagerPhone,
            ManagerEmail: data.ManagerEmail,
            Password: data.Password,
            University: data.University,
            AccountNumber: data.AccountNumber,
            AccountName: data.AccountName,
            BankCode: data.BankCode,
            BankName: data.BankName,
        }
        const path = BASE_PATH + "/Create"
        const response = await axios.post(path, payload)
        console.log(response)
        return response.data
    } catch(error) {
        console.log(error?.response?.data)
        return error?.response?.data
    } 
}

export async function Signin(data){
    try{
        const payload = {
            Email: data.Email,
            Password: data.Password,
        };
        const path = BASE_PATH + "/SignIn"
        const response = await axios.post(path, payload)
        // console.log("Response", response)
        return response.data
    } catch(error) {
        console.log(error?.response?.data)
        return error?.response?.data
    }
}

export async function VerifyEmail(data){
    try {
        const payload = {
            Email: data.Email,
            EmailOTP: data.EmailOTP,
        };
        const path = BASE_PATH + "/VerifyEmail"
        const response = await axios.put(path, payload)
        // console.log(response)
        return response.data
    } catch (error) {
        console.log(error?.response?.data)
        return error?.response?.data
    }
}

export async function ResendVerifyEmail(data) {
    try {
        const path = BASE_PATH + `/ResendVerifyEmail?Email=${data.Email}`;
        const response = await axios.get(path, data);
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error?.response?.data)
        return error?.response?.data
      }
}

export async function GetBank() {
    try {
      const path = BASE_PATH + "/GetBanks";
      const response = await axios.get(path);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
}

export async function ValidateBank(data) {
    try {
        const payload = {
            AccountNumber: data.AccountNumber,
            BankCode: data.BankCode,
            ShouldProceed: data.ShouldProceed,
        };

        const path = BASE_PATH + `/ValidateKitchenBank?Email=${data.KitchenEmail}`;
        console.log(data.KitchenEmail)
        const response = await axios.post(path, payload);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function Forgotpassword(data) {
    try {
        const payload = {
            Email: data.Email
        }
        console.log(payload)
        const path = `${BASE_PATH}/ForgotPassword?Email=${data.Email}`;
        const response = await axios.post(path, payload);
        console.log(response);
        console.log(payload)
        return response.data;
    } catch (error) {
        console.log(error?.response?.data)
        return error?.response?.data
    }
}

export async function ResetPassword(data) {
    try{
        const path = BASE_PATH + "/ResetPassword"
        const response = await axios.put(path, data)
        console.log(response)
        return response
    } catch(error) {
        console.log(error)
    }
}

export async function DeleteStaff(data) {
    const payload = {
        Id: data.Id 
    }
    try {
        const path = `${BASE_PATH}/DeleteStaff?Email=${data.Id}`;
        const response = await axios.delete(path, payload);
        console.log(response);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function CreateMenu(data, auth){
    try {
        const payload = {
            KitchenId: data.KitchenId,
            FoodName: data.FoodName,
            Category: data.Category,
            Class: data.Class,
            Price: data.Price,
            TotalQuantity: data.TotalQuantity,
            Status: data.Status
        }
        // console.log(data)
        // console.log(payload)
        const path = BASE_PATH + "/CreateMenu"
        const response = await axiosWithAuth(auth.accesstoken).post(path, payload)
        // console.log(response)
        return response.data
    } catch (error) {
        // console.log("Create Menu Error: ",error?.response?.data)
        return error?.response?.data
    }
}

export async function GetKitchenMenus(userData, auth) {
    try {
        if (userData && userData.Id) {
        const path = BASE_PATH + `/GetKitchenMenus?KitchenId=${userData.Id}`;
        const response = await axiosWithAuth(auth.accesstoken).get(path);
        return response.data;
      } else {
        console.error("Invalid userData object passed to GetMenus function");
        return null;
      }
    } catch (error) {
      console.log(error?.response?.data);
      return error?.response?.data;
    }
}

export async function DeleteKitchen(data, auth) {
    try {
      const path = BASE_PATH + `/Delete?Email=${data.Email}`;
      const response = await axiosWithAuth(auth.accesstoken).delete(path);
    //   console.log(response)
      return response.data;
    } catch (error) {
        console.log(error?.response?.data)
        return error?.response?.data
    }
}

export async function GetReviews(userData, auth) {
    try {
        // console.log(auth)
        if (userData && userData.Id) {
        const path = BASE_PATH + `/GetReviewsByKitchenId?KitchenId=${userData.Id}`;
        const response = await axiosWithAuth(auth.accesstoken).get(path);
        if(response){
            console.log('Reviews data' , response.data);
            return response.data;
        }
      } else {
        console.error("Invalid userData object passed to GetReviews function");
        return null;
      }
    } catch (error) {
      console.log(error?.response?.data);
      return error?.response?.data;
    }
}

export async function UpdateMenu(data, auth){
    try {
        const payload = {
            TotalQuantity: data.TotalQuantity,
            Price: data.Price,
            Status: data.Status
        }
        const path = BASE_PATH + `/UpdateMenu?MenuId=${data.MenusId}`
        const response = await axiosWithAuth(auth.accesstoken).put(path, payload)
        console.log(response)
        return response.data
    } catch (error) {
        console.log(error?.response?.data);
        return error?.response?.data;
    }
}

export async function DeleteMenu( auth, menus){
    try {
        const path = BASE_PATH + `/DeleteMenu?MenuId=${menus.Id}`
        const response = await axiosWithAuth(auth.accesstoken).delete(path)
        // console.log(response)
        return response.data
    } catch (error) {
        console.log(error?.response?.data);
        return error?.response?.data;
    }
}
  
export async function AddStaff(data, auth) {
    try {
        const payload = {
            KitchenId: data.KitchenId,
            FirstName: data.FirstName,
            LastName: data.LastName,
            Email: data.Email,
            Password: data.Password,
            Phone: data.Phone,
            University: data.University,
            Role: data.Role
        }
        const path = BASE_PATH + "/AddStaff"
        const response = await axiosWithAuth(auth.accesstoken).post(path, payload)
        console.log(response)
        return response.data
    }
     catch (error) {
        console.log(error?.response?.data);
        return error?.response?.data;
    }
}

export async function GetKitchenOrders(data, auth) {
    try {
        // console.log(data, ' Auth ', auth)
        const path = BASE_PATH + `/GetKitchenOrders?Email=${data.KitchenEmail}`
        const response = await axiosWithAuth(auth.accesstoken).get(path)
        // console.log( 'Response-1: ' ,response)
        return response.data
    } catch (error) {
        console.log(error?.response?.data);
        return error?.response?.data;
    }
}

export async function UploadImage(data) {
    try {
      const payload = new FormData();
      payload.append('file', data.get('image'));
      payload.append('Id', data.get('KitchenId'));
    //   console.log(payload);
      const path = BASE_PATH + `/Upload?KitchenId=${data.get('KitchenId')}`;
      const response = await axios.post(path, payload);
      console.log(response);
      return response.data;
    } catch (error) {
    //   console.log(error?.response?.data);
      return error?.response?.data;
    }
}

export async function SendNotification(data, auth) {
    try {
        const payload = {
            KitchenId: data.KitchenId,
            Title: data.Title,
            UserId: data.UserId,
            Message: data.Message,
        }
        const path = BASE_PATH + "/SendNotification"
        const response = await axiosWithAuth(auth.accesstoken).post(path, payload)
        console.log(response)
        return response.data
    } catch (error) {
        console.log(error?.response?.data);
        return error?.response?.data;
    }
}