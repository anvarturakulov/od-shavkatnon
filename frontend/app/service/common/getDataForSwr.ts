export const getDataForSwr = async (url: string, token: string | undefined) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await fetch(url, config);
  return await response.json();
};
