import axios from "axios";
import bodyParser from 'body-parser';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';

const csrfMiddleware = csurf({
	cookie: true
});
let clearData = (details) => {
  details.name = "";
  details.Id = "";
  details.phone = "";
  details.password = "";
  details.role = "";

  return details;
};
let registerUser = (user) => {
  axios.post('https://53b9-197-211-5-78.ngrok.io/register', user
    
  )
  .then((response) => {
  return response.data;
  })
  .catch((error) => {
    console.log(error);
  });
};
export { clearData, registerUser, csrfMiddleware };
