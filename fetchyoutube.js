// Import axios with the appropriate syntax
const axios = require('axios').default;

const fetchYoutube = async (query) => {
  const options = {
    method: 'GET',
    url: 'https://youtube-v31.p.rapidapi.com/search',
    params: {
        q: query,
        part: 'snippet,id',
        regionCode: 'US',
        maxResults: '50',
        order: 'date'
      },
    headers: {
        'X-RapidAPI-Key': 'bdff66d5bfmsha6b120b80df685dp19edd1jsnd5e8f666557b',
        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
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

module.exports = fetchYoutube;
