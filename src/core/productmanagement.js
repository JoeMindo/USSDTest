/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
import axios from 'axios';
import { BASEURL } from '../config/urls.js';

// let addUrl;
// const addproduct = async (productdata) => {
//   const postdata = {
//     product_name: productdata.product_name,
//     product_price: productdata.product_price,
//     product_description: productdata.product_description,
//     product_category: productdata.product_category,
//     product_image: productdata.product_image,
//     product_quantity: productdata.product_quantity,

//   };
//   try {
//     const productaddresponse = await postrequest(postdata, addUrl);
//     return productaddresponse;
//   } catch (error) {
//     return error;
//   }
// };

// const updateproduct = async (productdata, id) => {
//   try {
//     const productupdateresponse = await postrequest(productdata, id);
//     return productupdateresponse.data;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

// const deleteproduct = async (id) => {
//   try {

//   } catch (error) {
//     throw new Error(error);
//   }
// };
const optionProducts = [];
async function fetchCategories() {
  let results = '';
  try {
    const response = await axios.get(`${BASEURL}/api/prodcategories`);
    response.data.forEach((category) => {
      optionProducts.push(category.id);
      results += `\n${category.id}. ${category.category_name}`;
    });
    return results;
  } catch (error) {
    throw new Error(error);
  }
}
async function fetchProducts(id) {
  let results = '';
  const farmOfferings = '';
  try {
    const response = await axios.get(`${BASEURL}/api/prodcategories`);
    response.data.forEach((item) => {
      item.products.forEach((description) => {
        if (description.category_id === id) {
          results += `${description.id}. ${description.product_name} `;
        }
      });
    });
    return results;
  } catch (error) {
    throw new Error(error);
  }
}
const fetchFarmOfferings = async (id) => {
  let farmOfferings = '';
  try {
    const response = await axios.get(`${BASEURL}/api/prodcategories`);
    response.data.forEach((item) => {
      item.farm_products.forEach((farmItem) => {
        if (farmItem.product_id === id) {
          farmOfferings += `farm_id:${farmItem.farm_id}. units: ${farmItem.units} grade: ${farmItem.grade}\n `;
        }
      });
    });
    return farmOfferings;
  } catch (error) {
    throw new Error(error);
  }
};

const addProduct = async (productdata) => {
  try {
    const newProduct = axios.post(`${BASEURL}/api/farmcatalog/save`, productdata);
    console.log(newProduct);
    return newProduct;
  } catch (err) {
    throw new Error(err);
  }
};

const getSpecificProduct = async (id) => {
  try {
    const specificProduct = axios.get(`${BASEURL}/api/product/${id}`);
    return specificProduct;
  } catch (err) {
    throw new Error(err);
  }
};
export {
  fetchCategories, fetchProducts, addProduct, getSpecificProduct, fetchFarmOfferings,
};