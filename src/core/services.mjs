import axios from 'axios';

export let postrequest =  async (params, endpoint, phone = null, fcmtoken = null) => {
    try {
        if (fcmtoken) {
            let token = fcmtoken
        } else {
            let token = localStorage.getItem('token')
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
