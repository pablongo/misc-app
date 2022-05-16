import client from "../../client";

export const getUniversalUsersServices = (
  search: string,
  page: number,
  take: number
) => {
  return client.post('/api/auth/getUniversalUsers', {
    search,
    page,
    take
  });
};