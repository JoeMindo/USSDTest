import axios from "axios";
import { postrequest } from './services.mjs'

let clearData = (details) => {
  details.name = "";
  details.Id = "";
  details.phone = "";
  details.password = "";
  details.role = "";

  return details;
};
let registerUser = async (regdata) => {
  var path = 'https://fc79-197-211-5-78.ngrok.io/api/register'
  var postdata = {
      "phone_no":regdata.phone_no,
    "first_name": regdata.first_name,
      "last_name":regdata.last_name,
      "id_no":regdata.id_no,
    "role_id": regdata.role_id,
    "email": regdata.email,
    "password": regdata.password,
    "password_confirmation": regdata.password_confirmation,
    "gender": regdata.gender,

      
  }
  try {
    var registrationresponse = await postrequest(postdata,path);
  
    if (registrationresponse.status === 'success') {
      return registrationresponse.status;
    } else {
      return registrationresponse.data.message;
    }
    
  } catch (error) {
    throw new Error(error);
  }
 
  
}

let loginUser = async (loginData) => {
  var path = 'https://fc79-197-211-5-78.ngrok.io/api/login'
  var postdata = {
    "phone_no": loginData.phone_no,
    "password": loginData.password,
  }
  try {
    var loginresponse = await postrequest(postdata, path);
    if (loginresponse === 'success') {
      return loginresponse.status;
    } else {
      return loginresponse.data.message;
    }
  } catch (error) {
    throw new Error(error);
  }
}
export { clearData, registerUser };
