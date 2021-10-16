/* eslint-disable import/prefer-default-export */
export const menus = {

  registration: 'Welcome to Mamlaka Foods \nSelect Option:\n1. Register',
  register: {
    firstname: 'Enter your first name\n',
    lastname: 'Enter your last name\n',
    idNumber: 'What is your ID number\n',
    gender: 'What is the gender\n1. Male\n2. Female',
    password: 'Enter your password',
    confirmPassword: 'Confirm your password',
    role: 'Who are you?\n1. Farmer\n2. Buyer\n3. DEAN',
  },
  login: {
    password: 'Enter your password',

  },
  farmer: {
    updateLocation: '1. Update Location\n',
    addFarmDetails: '2. Add Farm Details\n',
    addProduct: '3. Add product\n',
    updateDetails: '4. Update farmer details\n',
  },
  addfarmDetails: {
    0: 'Enter farm name',
    1: 'Enter farm location',
    2: 'Choose a category of foods that you grow\n',
    3: 'Choose a product that you grow\n',
    4: 'What is a capacity per harvest in bags',
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
    grades: {
      1: '1. Grade A',
      2: '2. Grade B',
      3: '3. Grade C',
      4: '4. Grade D',
      5: '5. Grade E',
    },
    quantity: 'Enter the quantity of ',
    grade: 'How would you grade your produce?\n',
    success: 'Product added successfully',
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
  footer: '\n 98. Home 99.Back',
  submitDetails: 'Submit details?\n 1.Yes',

};
