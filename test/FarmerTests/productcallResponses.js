const categoriesFound = {
  status: 'success',
  data: {
    data: [
      {
        id: 1,
        category_name: 'Vegetables',
        slug: 'vegetables',
        description: 'This includes all fresh green leafy vegetables',
        created_at: '2022-01-04T01:54:42.000000Z',
        updated_at: '2022-01-04T01:54:42.000000Z',
        products: [],
        farm_products: [],
      },
      {
        id: 2,
        category_name: 'Fruits',
        slug: 'fruits',
        description: 'This includes all fruits',
        created_at: '2022-01-04T01:54:42.000000Z',
        updated_at: '2022-01-04T01:54:42.000000Z',
        products: [],
        farm_products: [],
      },
      {
        id: 3,
        category_name: 'Dairy',
        slug: 'dairy',
        description: 'Dairy',
        created_at: '2022-01-04T01:54:42.000000Z',
        updated_at: '2022-01-04T01:54:42.000000Z',
        products: [],
        farm_products: [],
      },
    ],

  },
};

export const categoriesNotFound = {
  status: 'error',
  message: 'No categories found',
};

export const categoriesServerError = {
  status: 'error',
  message: 'Server error',
};

export default categoriesFound;