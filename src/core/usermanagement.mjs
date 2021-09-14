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
  try {
    let response = axios.post("http://localhost:3030/user", user);
    return response.data;
  } catch (error) {
    return error;
  }
};
export { clearData, registerUser };
