const grades = {
  1: 'Grade A',
  2: 'Grade B',
  3: 'Grade C',
  4: 'Grade D',
  5: 'Grade E',
};

export const menus = {

  registration: 'Welcome to Mamlaka Foods \nSelect Option:\n1. Register',
  register: {
    firstname: 'Enter your first name\n',
    lastname: 'Enter your last name\n',
    idNumber: 'What is your ID number\n',
    gender: 'What is the gender\n1. Male\n2. Female',
    password: 'Enter your password',
    confirmPassword: 'Confirm your password',
    role: 'Who are you?\n1. Farmer\n2. Buyer',
  },
  login: {
    password: 'Enter your password',

  },
  farmer: {
    updateLocation: '1. Update Location\n',
    addFarmDetails: '2. Add Farm Details\n',
    addProduct: '3. Add product\n',
    updateDetails: '4. Update farmer details\n',
    updateListedProduce: '5. Update listed produce',
    joinGroup: '6. Join Group',
  },
  addfarmDetails: {
    0: 'Enter farm name',
    1: 'Where is your farm\n',
    2: 'Choose a category of foods that you grow\n',
    3: 'Choose a product that you grow\n',
    4: 'What is the farm size in acres',
    success: 'Farm registered successfully',
    failure: 'Farm registration failed',

  },
  updateFarmerDetails: {
    0: 'Enter the variety of produce that you grow',
    1: 'Enter the number of bags per harvest',
    2: 'What is the total size of land that you own?',
    3: 'What is your KRA PIN?',
    4: 'What sort of equipment do you own',
    5: 'What is your produce return levels?',
    6: 'Do you own land (Yes/No)',
    7: 'Do you have a business?(Yes/No)',
    8: 'Are you a part of any group?',
    9: 'What is your total production cost per season?',
    success: 'Farmer details updated successfully',

  },

  addProduct: {

    0: 'Enter the quantity of ',
    1: `How would you grade your produce?\n1.${grades[1]}\n2.${grades[2]}\n3.${grades[3]}\n4. ${grades[4]}\n5. ${grades[5]}`,
    success: 'Product added successfully',
    failure: 'Could not add product',
  },
  updateLocation: {
    0: 'Select region\n',
    1: 'Select county\n',
    2: 'Select subcounty\n',
    3: 'Select location\n',
    4: 'Enter your area',
    success: 'Location Updated',

  },
  errorMessage: 'Error!',
  footer: '\n 00. Back 0.Home',
  viewCart: '\n67. View cart',
  more: '\n98.More',

  submitDetails: 'Submit details?\n 1.Yes',

  buyermenu: {
    viewProducts: '1. View available products',
    myCart: '2. My cart',
    myOrders: '3. My orders',
    groupOrder: '4. Group order\n',
    createGroup: '1. Create Group\n',
    groupToJoin: '1. What group would you like to buy from?\n',
    groupName: '1. What is the name of your group?\n',

  },

};
export default menus;