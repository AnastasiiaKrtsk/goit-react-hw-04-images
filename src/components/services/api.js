import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39396676-c0c133f58b190a4076952b22b';

export const getImages = async (searchValue, page) => {
  const response = await axios.get(
    `${BASE_URL}?q=${searchValue}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
  );

  return response;
};
