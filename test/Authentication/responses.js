export const registerResponse = {
  status: 'success',
  data: {
    phone_no: '+254710431513',
    first_name: 'Test',
    last_name: 'User',
    id_no: '345637271',
    role_id: '1',
    email: 'user@email.com',
    password: '123456789',
    password_confirmation: '123456789',
    gender: 'Male',
  },
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMjU5YTg0NmI4MzBlNjVjMDNiZjZlZjJlYzU3MjcxN2M2NWQ5MWI4YzQxOGM2MmMzMGE3NGJlNTg5ZjYwYTgxMWMxNGEyMzcyNTVkOTY2NzAiLCJpYXQiOjE2MzgyMDk2MDAuNzkzMDk1LCJuYmYiOjE2MzgyMDk2MDAuNzkzMTA0LCJleHAiOjE2Njk3NDU2MDAuNzY5MzI0LCJzdWIiOiIyNSIsInNjb3BlcyI6W119.ow6dwMZBWYJ_Xe44lWVlAjQFT5q54mbH-3Jk7eqUz9H6s0wehJeEAAwxzAIRDe6-sw3OYmPTzEmCeJ8Y61GNV77ZsmsFL75iwhwxlllR0yiBeBXOJGTgMMmYxQNZMRtVMd1o1BUNRk833eUljsagtyeN8_6XQ_p5OnCjSUq4cWXst68yeXEYnOevHF7DrPtmdMHSJJ2wckcFl4GbcpNJ4PQIpLDWoLAuasb06fyQiNEozJ0rLP-4b9q6EXZPOmUIJtY5g4egZgti1K8SIvcUtkd1l3o_Wt-HLKUudKZlx_6XW2_0VYGg7WwfXkabSNSp83QmXnrfqlanDGspp6u1kLIWC3w-H_AN2CAGKZGdiKNlWn3Un9Q7szMTAL14vyvpGmtF4fFg4GZiu3G1rBjUBmPv1VrqAzl4ryRCWrlkIQbRKuyxcAcVORJOzJUL5DF2KV2ZCThfHJjH4H7N1lr9krhxAY8cOkzyN8_NeKbWhgTxcjrrO6CKuJyiXEL3cam2w1u7S2As6JWSlGN3ZVPBWGc7kSSFo47vFIg1hewTmARDZdVNx5auriysDuaYGZhagrQNprnYbOQIkmJcY2Cu5d0eJxbyArOOd8RAfFNSewasUHyeDmJnpUmBeNmKqaeZjPhonUZTNz2dCfBlfGORaVJR3umKXDeIEQZamqR9Alk',
};

export const loginResponseSuccess = {
  status: 'success',
  login: 'true',
  role_id: 3,
  role: 'buyer',
  user_id: 2,
  location: false,
  geo_status: false,
  token: {
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMGJlZDE2YjZmOGZmNWE5MjJiMjE4YjU2YzVhNzk2ZTY2Mjg5NmUxZDEyMTg2MTQ5YWVjMmRiNzgxMjIxZDFjYTRiODY4ZWU3OGM2ODYwODYiLCJpYXQiOjE2MzgyMDk1NTIuNDEwNTIzLCJuYmYiOjE2MzgyMDk1NTIuNDEwNTI5LCJleHAiOjE2Njk3NDU1NTIuMzcxMjgsInN1YiI6IjIiLCJzY29wZXMiOltdfQ.t2x_VOpASeFzbAXp0p9GUhCqx22He0JvSPU-m8-tzZFskSvBfh_jRdTyAS32g9gq__BO9Ad-5tLBK55VcEAUUbN6Vr1nACA__PGA5x4Jd0akFXxLymnKdYlw-vmLoSdJqmdlgMUJQ_Hh9iZfMhtO92vHtTWZx2G3E5KN0UsfdNhFbdex7Ite2HrWNS1rGNtrjDrn9z0tAAI3Jyeb8sjuNeZSE-MwA1IFVkncW5CP1GkkMjQW9JTLwxm4WI0ZCCv8UFRae-GvmQ-MzeBe85gui4vrYl8ionooJGDFQ_Sk9WItTrCYDgtMQqHSRN6vGaWrZIIIGIzon9h4uIP2jsoG4U75X9zCpcZzaeTOkyQVXoq5csAvTD7t5vcrhGjJFoR2uyliE5w9gn4UyRsDJS_CHjmVz_UaKWHFCMmEfxo7XE_w2VpsbEW4KMWCVP59wqTsAgYWv_nLp6ORh9_eBatEVovrA-2e2iF9QYk9Y2Ae3GxvRtgmHVbBiyQJhVvGkuH23CexJDTdqFPlAcP8fsm-RR0iAOQWaqmb7mt8GdzpZVBnWgZLH9ea56O_1XcyGyte7HhTElFzsTSE03QjP6VnQDYVKiKXok4UbzplWIiYoFRzOXUQfCoPmHsDAMmCL1_KQyf-6H2GiyNovsqBMpdcAFZgV8YeaA_OK9w__XtmGkE',
    userId: 2,
  },
};
export const loginResponseFailure = {

  status: 'error',
  message: 'kindly check your credentials',

};
export const registrationFailureMissingFields = {
  status: 'error',
  data: {
    phone_no: null,
    password: null,
    password_confirmation: null,
    role_id: null,
  },
  errors: {
    phone_no: [
      'The phone no field is required.',
    ],
    password: [
      'The password field is required.',
    ],
    role_id: [
      'The role id must be a string.',
    ],
  },
};

export const registrationFailureDuplicateNumber = {
  status: 'error',
  data: {
    phone_no: '0713289481',
    password: null,
    password_confirmation: null,
    role_id: null,
  },
  errors: {
    phone_no: [
      'The phone no has already been taken.',
    ],
    password: [
      'The password field is required.',
    ],
    role_id: [
      'The role id must be a string.',
    ],
  },
};
export const registrationFailureWrongDataTypeForFields = {
  status: 'error',
  data: {
    phone_no: '254700000567',
    password: 'TestPass',
    password_confirmation: 'TestPass',
    role_id: 1,
  },
  errors: {
    role_id: [
      'The role id must be a string.',
    ],
  },

};
export const registrationFailurePasswordTooShort = {
  status: 'error',
  data: {
    phone_no: '254700000567',
    password: 'Test',
    password_confirmation: 'Test',
    role_id: '1',
  },
  errors: {
    password: [
      'The password must be at least 8 characters.',
    ],
  },

};

export const isUserSuccess = {
  status: 'success',
  message: true,
  role: 'Farmer',
  user_id: 1,
};

export const isUserFailure = {
  status: 'error',
  message: false,
};
export default registerResponse;