import axios from "axios";
import { response } from "express";
// axios.defaults.headers.common = {
//   'X-Requested-With': 'XMLHttpRequest',
//   'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
// }
let clearData = (details) => {
  details.name = "";
  details.Id = "";
  details.phone = "";
  details.password = "";
  details.role = "";

  return details;
};
let registerUser = (user) => {
  axios
    .post("https://a326-197-211-5-78.ngrok.io/api/register", user)
    .then((response) => {
      console.log(response.data)
      return response.data;
    })
    .catch((error) => {
      console.log(error.error);
    });
};
let loginUser = (user) => {
  axios
    .post("https://a326-197-211-5-78.ngrok.io/api/login", user)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

let logoutUser = (id) => {};
let updateUser = (id) => {};
export { clearData, registerUser };
