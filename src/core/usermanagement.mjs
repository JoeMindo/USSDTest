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
  var path = 'https://987b-197-211-5-78.ngrok.io/api/register'
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
    let registrationresponse = await postrequest(postdata,path);
  
    // if (registrationresponse.status === 'success') {
    //   return registrationresponse.status;
    // } else {
    //   return registrationresponse.data.message;
    // }
    
    return registrationresponse.data
    
    
  } catch (error) {
    console.log(error);
  }
 
  
}

let loginUser = async (loginData) => {
  var path = 'https://987b-197-211-5-78.ngrok.io/api/login'
  var postdata = {
    "phone_no": loginData.phone_no,
    "password": loginData.password,
  }
  try {
    var loginresponse = await postrequest(postdata, path);
    return loginresponse
  } catch (error) {
    console.log(error);
  }
}
export { clearData, registerUser,loginUser };
