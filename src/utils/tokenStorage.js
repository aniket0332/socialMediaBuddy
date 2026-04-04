export const setTokens = (tokens) => {
  Object.entries(tokens).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
};

export const getTokens = () => {
  return localStorage.getItem("accessToken");
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("idToken");
  localStorage.removeItem("refreshToken");

};

export const isAuthenticated = () => {
  return !!getTokens();
};