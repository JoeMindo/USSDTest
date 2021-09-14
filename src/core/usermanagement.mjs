import axios from "axios";
let csrfCookie = Cookies.get('XSRF-TOKEN');
let clearData = (details) => {
  details.name = "";
  details.Id = "";
  details.phone = "";
  details.password = "";
  details.role = "";

  return details;
};
let registerUser = (user) => {
  axios.post('https://53b9-197-211-5-78.ngrok.io/register', user, {
    headers: {
      'x-xsrf-token': csrfCookie,
    }
  })
  .then((response) => {
  return response.data;
  })
  .catch((error) => {
    console.log(error);
  });
};
export { clearData, registerUser };
