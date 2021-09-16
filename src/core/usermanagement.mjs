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
let registerUser = async (regdata, phone) => {
  var path = 'https://38ed-197-211-5-78.ngrok.io/api/register'
  var postdata = {
      "phone_no":phone,
      "first_name":regdata.first_name,
      "last_name":regdata.last_name,
      "id_no":regdata.id_no,
    "role": regdata.role,
    "email": regdata.email,
    "password": regdata.password,
    "password_confirmation": password_confirmation,
    "gender": regdata.gender

      
  }
  var registrationresponse = await postrequest(postdata,path);
  
  return false;
  
}

export default { clearData, registerUser };
