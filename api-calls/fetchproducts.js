async function fetchProducts() {
  let results = "";
  try {
    const response = await axios.get(
      "https://c22d-197-211-5-78.ngrok.io/prodcategories"
    );
    response.data.forEach((product) => {
      results += `\n${product.id}. ${product.name} ${product.type} ${product.price}`;
    });
    return results;
  } catch (error) {
    throw new Error(error);
  }
}
