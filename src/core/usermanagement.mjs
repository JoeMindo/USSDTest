import axios from "axios";
let clearData = (userDetails) => {
  userDetails.name = "";
  userDetails.Id = "";
  userDetails.phone = "";
  userDetails.password = "";
  userDetails.role = "";

  return userDetails;
};
let registerUser = (user) => {
  console.log(user)
  axios.post('https://53b9-197-211-5-78.ngrok.io/register', user)
  .then((response) => {
   console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });
};
export { clearData, registerUser };
