// Import axios with the appropriate syntax
const axios = require('axios').default;

const fetchdata = async (query) => {
  const options = {
    method: 'GET',
    url: 'https://food-recipes-with-images.p.rapidapi.com/',
    params: {
      q: query  // Use the query parameter here
    },
    headers: {
      'X-RapidAPI-Key': '4256f33c53mshadf22524853c1a3p13232cjsnac0e51c657f9',
      'X-RapidAPI-Host': 'food-recipes-with-images.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

module.exports = fetchdata;
