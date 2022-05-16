import { useEffect, useState } from "react";
import { getUniversalUsersServices } from "../../services/UniversalUsers";

export const useUniversalUsers = (
  search: string,
  page: number,
  take: number
) => {
  const [loading, setLoading] = useState(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState(false);
  const [data, setData] = useState({
    page,
    take,
    count: 0,
    totalPages: 0,
    users: []
  });
  const [error, setError] = useState(null);
  const checkLoadMore = data.page < data.totalPages;
  const getUniversalUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUniversalUsersServices(search, page, take);
      setData(response.data);
      setLoading(false);
    } catch (error: any) {
      setError(error);
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      if (checkLoadMore) {
        setError(null);
        setLoadingLoadMore(true);
        const response = await getUniversalUsersServices(search, data.page + 1, take);
        let users = [...data.users];
        users = users.concat(response.data.users);
        setData({
          ...response.data,
          users
        });
        setLoadingLoadMore(false);
      }
    } catch (error: any) {
      setError(error);
      setLoadingLoadMore(false);
    }
  };

  const updateData = (user: any) => {
    if (user.id) {
      const index = data.users.findIndex((value: any) => value.id === user.id);
      if (index !== -1) {
        let cloneData: any = [...data.users];
        cloneData[index] = user;
        setData({
          ...data,
          users: cloneData
        });
      }
    }
  };

  useEffect(() => {
    let idTimer = setTimeout(() => getUniversalUsers(), 1200)
    return () => clearTimeout(idTimer);
  }, [search]);

  return {
    loading,
    error,
    data,
    loadMore,
    loadingLoadMore,
    updateData,
    checkLoadMore
  };
}