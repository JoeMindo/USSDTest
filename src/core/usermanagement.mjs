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
let registerUser = async (user) => {
  axios
    .post("https://a326-197-211-5-78.ngrok.io/api/register", {
      
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        id_no: user.id_no,
        email: user.email,
        gender: user.gender,
        password: user.password,
        password_confirmation: user.password_confirmation
      
    })
    .then((response) => {
      console.log(response.data.message)
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
let loginUser = (user) => {
  axios
    .post("https://a326-197-211-5-78.ngrok.io/api/login", user)
    .then((response) => {
      console.log(response.data.message)
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

let logoutUser = (id) => {};
let updateUser = (id) => {};
export { clearData, registerUser };
// registerUser({
//   first_name: "Joe",
//   last_name: "Someone",
//   id_no: "357414700",
//   email: "joe@test.com",
//   password: "password123",
//   gender: "Male",
//   password_confirmation: "password123"
// }).then((response) => {
//   console.log(response)
// })