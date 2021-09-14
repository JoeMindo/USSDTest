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
    response.then((text) => {
      return text

    });
  } catch (error) {
    return error;
  }
};
export { clearData, registerUser };
