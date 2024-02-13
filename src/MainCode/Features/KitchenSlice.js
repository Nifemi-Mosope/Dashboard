import {axios, axiosWithAuth} from '../Features/Utilis'
import instance from '../Features/Utilis'

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
        return response.data
    } catch(error) {
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
        return response.data
    } catch(error) {
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
        return response.data
    } catch (error) {
        return error?.response?.data
    }
}

export async function ResendVerifyEmail(data) {
    try {
        const path = BASE_PATH + `/ResendVerifyEmail?Email=${data.Email}`;
        const response = await axios.get(path, data);
        return response.data;
      } catch (error) {
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
        const response = await axios.post(path, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function Forgotpassword(data) {
    try {
        const payload = {
            Email: data.Email
        }
        const path = BASE_PATH + `/ForgotPassword?Email=${data.Email}`;
        const response = await axios.post(path, payload);
        return response.data;
    } catch (error) {
        return error?.response?.data
    }
}

export async function ResetPasswords(data) {
    try{
        const payload = {
            Email: data.Email,
            OTP: data.OTP,
            NewPassword: data.NewPassword,
        }
        const path = BASE_PATH + "/ResetPassword"
        const response = await axios.put(path, payload)
        return response.data
    } catch(error) {
        return error?.response?.data
    }
}

export async function DeleteStaff(data, auth) {
    try {
        const path = `${BASE_PATH}/DeleteStaff?Email=${data}`;
        const response = await instance.delete(path);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function CreateMenu(data, auth, userData){
    try {
        const isBasicStaff = userData.Role === 'basic';
        const kitchenId = isBasicStaff ? userData.KitchenId : userData.Id;
        const payload = {
            KitchenId: kitchenId,
            FoodName: data.FoodName,
            Category: data.Category,
            Class: data.Class,
            Price: data.Price,
            TotalQuantity: data.TotalQuantity,
            Status: data.Status
        }

        const path = BASE_PATH + "/CreateMenu"
        const response = await instance.post(path, payload)
        return response.data
    } catch (error) {
        return error?.response?.data
    }
}

export async function GetKitchenMenus(userData, auth) {
    try {
      if (userData && userData.Id) {
        const isBasicStaff = userData.Role === 'basic';
  
        const kitchenId = isBasicStaff ? userData.KitchenId : userData.Id;
        const path = BASE_PATH + `/GetKitchenMenus?KitchenId=${kitchenId}`;
  
        const response = await instance.get(path);
        return response.data;
      } else {
        console.error("Invalid userData object passed to GetMenus function");
        return null;
      }
    } catch (error) {
      return error?.response?.data;
    }
}  

export async function DeleteKitchen(data, auth) {
    try {
      const path = BASE_PATH + `/Delete?Email=${data.Email}`;
      const response = await instance.delete(path);
      return response.data;
    } catch (error) {
        return error?.response?.data
    }
}

export async function GetReviews(userData, auth) {
    try {
        if (userData && userData.Id) {
        const isBasicStaff = userData.Role === 'basic';
  
        const kitchenId = isBasicStaff ? userData.KitchenId : userData.Id;
        const path = BASE_PATH + `/GetReviewsByKitchenId?KitchenId=${kitchenId}`;
        const response = await instance.get(path);
        if(response){
            return response.data;
        }
      } else {
        console.error("Invalid userData object passed to GetReviews function");
        return null;
      }
    } catch (error) {
      return error?.response?.data;
    }
}

export async function UpdateMenu(menuId, data, auth) {
    try {
      const payload = {
        TotalQuantity: data.TotalQuantity,
        Price: data.Price,
        Status: data.Status,
      };
  
      const path = BASE_PATH + `/UpdateMenu?MenuId=${menuId}`;
      const response = await instance.put(path, payload);
      return response.data;
    } catch (error) {
      return error?.response?.data;
    }
}

export async function DeleteMenu( auth, menus){
    try {
        const path = BASE_PATH + `/DeleteMenu?MenuId=${menus.Id}`
        const response = await instance.delete(path)
        return response.data
    } catch (error) {
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
        const response = await instance.post(path, payload)
        return response.data
    }
     catch (error) {
        return error?.response?.data;
    }
}

export async function GetKitchenOrders(data, auth) {
    try {
        const path = BASE_PATH + `/GetKitchenOrders?Email=${data.KitchenEmail}`
        const response = await instance.get(path)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export async function UploadImage(data) {
    try {
      const payload = new FormData();
      payload.append('file', data.get('image'));
      payload.append('Id', data.get('KitchenId'));
      const path = BASE_PATH + `/Upload?KitchenId=${data.get('KitchenId')}`;
      const response = await axios.post(path, payload);
      return response.data;
    } catch (error) {
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
            OrderId: data.OrderId,
        }
        const path = BASE_PATH + "/SendNotification"
        const response = await instance.post(path, payload)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export async function NotifyEveryone(data, auth, userData) {
    try {
        const isBasicStaff = userData.Role === 'basic';
        const kitchenId = isBasicStaff ? userData.KitchenId : userData.Id;

        const payload = {
            KitchenId: kitchenId,
            Title: data.Title,
            UserId: data.UserId,
            Message: data.Message,
        }
        const path = BASE_PATH + "/NotifiyAllUsers"
        const response = await instance.post(path, payload)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export async function GetStaff(data, auth) {
    try {
        const path = BASE_PATH + `/GetKitchenStaff?Email=${data.KitchenEmail}`
        const response = await instance.get(path)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}