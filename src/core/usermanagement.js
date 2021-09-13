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
    let response = axios.post("http://sampleUrl.com", user);
    return response.data;
  } catch (error) {
    return error;
  }
};
export { clearData, registerUser };
