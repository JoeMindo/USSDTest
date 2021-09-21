import axios from 'axios';
import { postrequest } from './services.js';


let addUrl;
let addproduct = async (productdata) => {
    let postdata = {
        product_name: productdata.product_name,
        product_price: productdata.product_price,
        product_description: productdata.product_description,
        product_category: productdata.product_category,
        product_image: productdata.product_image,
        product_quantity: productdata.product_quantity,

    }
    try {
        let productaddresponse = await postrequest(postdata, addUrl);
        return productaddresponse;
    } catch (error) {
        return error;
    }
}


let updateproduct = async (productdata,id) => {
    try {
        let productupdateresponse = await postrequest(productdata, id);
        return productupdateresponse.data;

    } catch (error) {
        throw new Error(error);
    }
}

let deleteproduct = async (id) => {
    try {
        
    } catch (error) {
        throw new Error(error);
    }
}