import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const token = import.meta.env.VITE_API_TOKEN;

export const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

export const fetchHomeCardData = async () => {
  try {
    const response = await axiosInstance.get(`/api/wiki-games`, {
      
      params: {
        populate: 'logo',
      }
    });
    const homeCardData = response.data.data;

    if (!homeCardData || homeCardData.length === 0) {
      console.warn('No data found for HomeCard.');
      return [];
    }

    return homeCardData;
  } catch (error) {
    console.error('Error fetching HomeCard data:', error);
    throw error;
  }
};

export const fetchChaptersForGame = async (gameId: number) => {
  try {
    const response = await axiosInstance.get(`/api/wiki-games/${gameId}`, {
      params: {
        populate: 'chapter.logo',
      }
    });

    const chaptersData = response.data.data;

    if (!chaptersData || chaptersData.length === 0) {
      console.warn('No data found for chapters.');
      return [];
    }

    return chaptersData;
  } catch (error) {
    console.error('Error fetching chapters data:', error);
    throw error;
  }
};


export const fetchPageData = async (page: string) => {
  const response = await fetch(`https://app.charmverse.io/api/v1/pages/${page}`);

  if (!response.ok) {
    throw new Error(`Error fetching page data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};


