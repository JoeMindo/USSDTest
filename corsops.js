import axios from 'axios';

let postrequest = async (endpoint, data) => {
    let endpoint = "https://a326-197-211-5-78.ngrok.io/api/register"
    try {
        let response = await axios.post(endpoint, data);
        return response.data;
       
    } catch (error) {
        console.log(error)
    }
   
            
}

let getrequest = async (endpoint) => {
    let response = await axios.get(endpoint);
    return response.data;
}

let patchrequest = async (endpoint, data) => {
    let response = await axios.patch(endpoint, data);
    return response.data;
}

let deleterequest = async (endpoint,id) => {
    let response = await axios.delete(endpoint,id);
    return response.data;
}
