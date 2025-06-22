// API Endpoints
const API_ENDPOINTS = {
  FETCH_YEARLY_DATA: (type) => `/api/energy/useData/year/${type.toLowerCase()}`,
  FETCH_MONTHLY_DATA: (type) => `/api/energy/useData/month/${type.toLowerCase()}`,
  FETCH_HOURLY_DATA: (type) => `/api/energy/useData/hour/${type.toLowerCase()}`,
  POST_HOURLY_DATA: (type) => `/api/energy/fetchData/hour/${type.toLowerCase()}`,
  POST_PRODUCTION_DATA: '/api/energy/totalProduction'
};

// API Functions
export const fetchYearlyData = async (type) => {
  const response = await fetch(API_ENDPOINTS.FETCH_YEARLY_DATA(type));
  if (!response.ok) throw new Error(`Failed to fetch yearly ${type} data`);
  return response.json();
};

export const fetchMonthlyData = async (type) => {
  const response = await fetch(API_ENDPOINTS.FETCH_MONTHLY_DATA(type));
  if (!response.ok) throw new Error(`Failed to fetch monthly ${type} data`);
  return response.json();
};

export const fetchHourlyData = async (type) => {
  // First try to post hourly data if needed
  try {
    // You might want to pass some default/empty data here
    // or get the actual data from somewhere before posting
    const postData = []; // Replace with actual data if needed
    await postHourlyData(type, postData);
    console.log(`Successfully posted hourly ${type} data before fetching`);
  } catch (postError) {
    console.warn(`Could not post hourly ${type} data before fetching:`, postError.message);
    // Continue with fetch even if post fails
  }

  // Then fetch the hourly data
  const response = await fetch(API_ENDPOINTS.FETCH_HOURLY_DATA(type));
  if (!response.ok) throw new Error(`Failed to fetch hourly ${type} data`);
  
  const result = await response.json();
  console.log(`Successfully fetched hourly ${type} data`, result);
  return result;
};

export const postHourlyData = async (type, data) => {
  const response = await fetch(API_ENDPOINTS.POST_HOURLY_DATA(type), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error(`Failed to post hourly ${type} data`);
  return response.json();
};

export const postProductionData = async (data) => {
  const response = await fetch(API_ENDPOINTS.POST_PRODUCTION_DATA, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to post production data');
  return response.json();
};