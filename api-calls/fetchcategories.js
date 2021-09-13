import axios from "axios";
async function fetchCategories() {
  let results = "";
  try {
    const response = await axios.get(
      "https://c22d-197-211-5-78.ngrok.io/prodcategories"
    );
    response.data.forEach((category) => {
      results += `\n${category.id}. ${category.category_name}`;
    });
    return results;
  } catch (error) {
    console.log(error);
  }
}

export { fetchCategories };
