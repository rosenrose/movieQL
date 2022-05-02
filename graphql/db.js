import axios from "axios";

export const people = [
  {
    id: 0,
    name: "con",
    age: 20,
    gender: "male",
  },
  {
    id: 1,
    name: "sole",
    age: 30,
    gender: "female",
  },
  {
    id: 2,
    name: "log",
    age: 40,
    gender: null,
  },
];

let movies = [
  {
    id: 0,
    title: "Star Wars - The new one",
    score: 1,
  },
  {
    id: 1,
    title: "Avengers - The new one",
    score: 4.5,
  },
  {
    id: 2,
    title: "The Godfather I",
    score: 5,
  },
  {
    id: 3,
    title: "Logan",
    score: 3,
  },
];

export const getMovies = () => movies;
export const getMovieById = (id) => movies.find((movie) => movie.id == id);
export const addMovie = (title, score) => {
  const newMovie = {
    id: movies.length,
    title,
    score,
  };
  movies.push(newMovie);
  return newMovie;
};
export const deleteMovie = (id) => {
  const filteredMovies = movies.filter((movie) => movie.id != id);

  if (movies.length === filteredMovies.length) {
    return false;
  } else {
    movies = filteredMovies;
    return true;
  }
};

const API_KEY = process.env.API_KEY;
const ITEMS_URL = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&part=snippet,contentDetails`;
const ITEM_URL = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=snippet,contentDetails`;
const THUMBNAIL_URL = "https://asia-northeast3-get-youtube-thumbnail.cloudfunctions.net/thumbnail";

export const getItems = async (id, max) => {
  let request_url = `${ITEMS_URL}&playlistId=${id}`;

  if (max > 0) {
    request_url = `${request_url}&maxResults=${max}`;
  }

  const items = (
    await axios.get(request_url, {
      responseType: "json",
    })
  ).data.items;

  // return items.map(async (item) => ({
  //   id: item.contentDetails.videoId,
  //   ...extractInfo(item),
  //   thumbnail: (await axios.get(`${THUMBNAIL_URL}?id=${item.contentDetails.videoId}`)).data,
  // }));
  return items.map((item) => {
    const id = item.contentDetails.videoId;
    return axios.get(`${THUMBNAIL_URL}?id=${id}`).then((response) => ({
      id,
      ...extractInfo(item),
      thumbnail: response.data,
    }));
  });
};

export const getItem = async (id) => {
  const item = (
    await axios.get(`${ITEM_URL}&id=${id}`, {
      responseType: "json",
    })
  ).data.items[0];

  // return {
  //   id,
  //   ...extractInfo(item),
  //   thumbnail: (await axios.get(`${THUMBNAIL_URL}?id=${id}`)).data,
  // };
  return axios.get(`${THUMBNAIL_URL}?id=${id}`).then((response) => ({
    id,
    ...extractInfo(item),
    thumbnail: response.data,
  }));
};

function extractInfo(item) {
  const { title, description, publishedAt: date } = item.snippet;
  return { title, description, date };
}
