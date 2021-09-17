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
  var path = 'https://fc79-197-211-5-78.ngrok.io/api/register'
  var postdata = {
      "phone_no":regdata.phone_no,
      "first_name":regdata.first_name,
      "last_name":regdata.last_name,
      "id_no":regdata.id_no,
    "role_id": regdata.role_id,
    "email": regdata.email,
    "password": regdata.password,
    "password_confirmation": regdata.password_confirmation,
    "gender": regdata.gender

      
  }
  try {
    var registrationresponse = await postrequest(postdata,path);
  
    registrationresponse.then((response) => {
      return response
    })
    
  } catch (error) {
    return error
  }
 
  
}

export { clearData, registerUser };
