/*
Location Specific

 */

export const regions = {

  data: [
    {
      id_regions: 1,
      region_name: 'Nairobi',
      created_at: '2017-06-01 15:00:00',
    },
    {
      id_regions: 2,
      region_name: 'Central',
      created_at: '2017-06-01 15:00:00',
    },
    {
      id_regions: 3,
      region_name: 'Rift Valley',
      created_at: '2017-06-01 15:00:00',
    },
    {
      id_regions: 4,
      region_name: 'Nyanza',
      created_at: '2017-06-01 15:00:00',
    },
    {
      id_regions: 5,
      region_name: 'Western',
      created_at: '2017-06-01 15:00:00',
    },
    {
      id_regions: 6,
      region_name: 'Eastern',
      created_at: '2017-06-01 15:00:00',
    },
    {
      id_regions: 7,
      region_name: 'North Eastern',
      created_at: null,
    },
    {
      id_regions: 8,
      region_name: 'Coast',
      created_at: '2017-06-01 15:00:00',
    },
  ],

};

export const counties = {
  data: [
    {
      id: 47,
      county_name: 'NAIROBI',
      contact: null,
      region_id: '1',
      status: 0,
      created_at: null,
      updated_at: null,
    },
  ],
};

export const subcounties = {
  data: [
    {
      id: 185,
      sub_county_name: 'DAGORETTI NORTH',
      region_id: 1,
      county_id: 47,
      created_at: null,
      updated_at: null,
    },
    {
      id: 186,
      sub_county_name: 'DAGORETTI SOUTH',
      region_id: 1,
      county_id: 47,
      created_at: null,
      updated_at: null,
    },
    {
      id: 187,
      sub_county_name: 'EMBAKASI CENTRAL',
      region_id: 1,
      county_id: 47,
      created_at: null,
      updated_at: null,
    },
    {
      id: 188,
      sub_county_name: 'EMBAKASI EAST',
      region_id: 1,
      county_id: 47,
      created_at: null,
      updated_at: null,
    },
    {
      id: 189,
      sub_county_name: 'EMBAKASI NORTH',
      region_id: 1,
      county_id: 47,
      created_at: null,
      updated_at: null,
    },
    {
      id: 190,
      sub_county_name: 'EMBAKASI SOUTH',
      region_id: 1,
      county_id: 47,
      created_at: null,
      updated_at: null,
    },
    {
      id: 191,
      sub_county_name: 'EMBAKASI WEST',
      region_id: 1,
      county_id: 47,
      created_at: null,
      updated_at: null,
    },
    {
      id: 192,
      sub_county_name: 'KAMUKUNJI',
      region_id: 1,
      county_id: 47,
      created_at: null,
      updated_at: null,
    },
    {
      id: 193,
      sub_county_name: 'KASARANI',
      region_id: 1,
      county_id: 47,
      created_at: null,
      updated_at: null,
    },
    {
      id: 194,
      sub_county_name: 'KIBRA',
      region_id: 1,
      county_id: 47,
      created_at: null,
      updated_at: null,
    },
  ],
};

export const locations = {
  data: [
    {
      id: 636,
      location_name: 'BAHARI',
      county_id: 5,
      sub_county_id: 130,
      status: 1,
      created_at: null,
      updated_at: null,
    },
    {
      id: 637,
      location_name: 'HINDI',
      county_id: 5,
      sub_county_id: 130,
      status: 1,
      created_at: null,
      updated_at: null,
    },
    {
      id: 638,
      location_name: 'HONGWE',
      county_id: 5,
      sub_county_id: 130,
      status: 1,
      created_at: null,
      updated_at: null,
    },
    {
      id: 639,
      location_name: 'MKOMANI',
      county_id: 5,
      sub_county_id: 130,
      status: 1,
      created_at: null,
      updated_at: null,
    },
    {
      id: 640,
      location_name: 'MKUNUMBI',
      county_id: 5,
      sub_county_id: 130,
      status: 1,
      created_at: null,
      updated_at: null,
    },
    {
      id: 641,
      location_name: 'SHELLA',
      county_id: 5,
      sub_county_id: 130,
      status: 1,
      created_at: null,
      updated_at: null,
    },
    {
      id: 642,
      location_name: 'WITU',
      county_id: 5,
      sub_county_id: 130,
      status: 1,
      created_at: null,
      updated_at: null,
    },
  ],
};
export const geoArea = {
  id: 1,
  countyID: 19,
  subcountyID: 238,
  locationID: 1183,
  area: 'Mahiga Meru',

};

export const locationError = {
  status: 'Error',
  items: 'Location not found',
};
export const geoAreaError = {
  message: 'Could not update location, try again later',

};

export const geoAreaSuccess = {
  message: 'Location Updated',
};

export const farmSaveSuccess = {
  status: 'success',
};

export const farmSaveFailure = {
  status: 'error',
  message: 'Some error message',
};

export const getUserFarmsSuccess = {
  status: 'success',
  message: {
    data: [
      {
        id: 4,
        user_id: 31,
        farm_name: 'This farm',
        farm_description: '1',
        farm_location: 'Kenya',
        farm_size: '299',
        created_at: '2022-01-05T04:43:00.000000Z',
        updated_at: '2022-01-05T04:43:00.000000Z',
      },
      {
        id: 6,
        user_id: 31,
        farm_name: 'here',
        farm_description: '1',
        farm_location: 'here',
        farm_size: '200',
        created_at: '2022-01-05T04:55:11.000000Z',
        updated_at: '2022-01-05T04:55:11.000000Z',
      },
    ],
  },

};

export const userFarmsAreNil = {
  status: 'error',
  message: 'User has no registered farms',

};
export default regions;