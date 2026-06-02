import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ML_SERVER_URL = process.env.ML_SERVER_URL || 'http://127.0.0.1:8000';

const mlClient = axios.create({
  baseURL: ML_SERVER_URL,
});

export const predictMood = async (data) => {
  try {
    const response = await mlClient.post('/api/ml/predict-mood', data);
    return response.data;
  } catch (error) {
    console.error('Error connecting to ML server:', error.message);
    return null;
  }
};

export const analyzeSentiment = async (note) => {
  try {
    const response = await mlClient.post('/api/ml/analyze-sentiment', { note });
    return response.data;
  } catch (error) {
    console.error('Error connecting to ML server:', error.message);
    return null;
  }
};

export const burnoutRisk = async (data) => {
  try {
    const response = await mlClient.post('/api/ml/burnout-risk', data);
    return response.data;
  } catch (error) {
    console.error('Error connecting to ML server:', error.message);
    return null;
  }
};

export const generateRecommendations = async (mood, sleep) => {
  try {
    const response = await mlClient.post('/api/ml/recommendations', { mood, sleep });
    return response.data;
  } catch (error) {
    console.error('Error connecting to ML server:', error.message);
    return null;
  }
};
