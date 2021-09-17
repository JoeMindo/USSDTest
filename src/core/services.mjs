import axios from 'axios';
import jwt from 'jsonwebtoken';


let createToken = async (payload) => {
    try {
        let token = await jwt.sign(payload, 'this is secret');
        return token

    } catch (error) {
        console.log(;
    }
    

    
}
export let postrequest = async (params, endpoint, phone = null, fcmtoken = null) => {
    let token = createToken(params).then((result) => {
        return result
    });
    try {
        if (fcmtoken) {
            token = fcmtoken
        }
        if (token) {
            let response = await axios.post(endpoint, params, { headers: { 'Authorization': 'Bearer ' + token } })
        } else  {
            let response = await axios.post(endpoint, params, { headers: {} });
        }
    
        
    } catch (error) {
        console.log(error);
    }
}
export let patchrequest = async (params, endpoint, phone = null, fcmtoken = null) => {
    try {
        if (fcmtoken) {
            let token = fcmtoken
        } else {
            let token = localStorage.getItem('token')
        }
        if (token) {
            let response = await axios.patch(endpoint, params, { headers: { 'Authorization': 'Bearer ' + token } })
        } else {
            let response = await axios.patch(endpoint, params, { headers: {} });
        }
    } catch (error) {
        console.log(error);
    }
}
