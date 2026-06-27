const axios = require('axios');

const API_BASE = process.env.RESEARCH_QUEST_APP_SERVICES;
const API_KEY = process.env.EXTERNAL_PAPER_API_KEY;

exports.performSimpleSearch = async (subject) => {
  try {
    const payload = {
      subject: subject,
      api_key: API_KEY,
      database: "all"
    };

    const response = await axios.post(
      `${API_BASE}advanced_title_gen/papersapi/basepapers_simple_search`, 
      payload
    );
    
    // The API returns databases_used, keywords_used, papers, time_taken, token_usage
    return response.data;
  } catch (error) {
    console.error('Simple Search API Error:', error?.response?.data || error.message);
    throw new Error('Failed to fetch simple search results from external API.');
  }
};

exports.performDeepSearch = async ({ subject, specialization, keywords }) => {
  try {
    const payload = {
      subject: subject,
      specialization: specialization,
      api_key: API_KEY,
      keywords: keywords,
      database: "all"
    };

    const response = await axios.post(
      `${API_BASE}advanced_title_gen/papersapi/basepapers_deep_search`, 
      payload
    );
    
    // The API returns databases_used, keywords_used, papers, time_taken, token_usage
    return response.data;
  } catch (error) {
    console.error('Deep Search API Error:', error?.response?.data || error.message);
    throw new Error('Failed to fetch deep search results from external API.');
  }
};