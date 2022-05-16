import axios from 'axios';
import { useEffect, useState } from 'react';
import { getData } from '../src/utils';

const URL_STAGING = 'https://api.testing.laurelgamingdev.com';

const URL_LOCAL = 'http://192.168.1.105:8000'
export const API_URL = URL_STAGING;

const client: any = axios.create({
  baseURL: API_URL,
});

client.interceptors.request.use(
  async (config: any) => {
    const token = await getData('userToken');
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
);

export const useAxios = (
  url: string,
  method: string = 'get',
  body?: any,
  headers?: any,
) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setloading] = useState(true);
  const fetchData = async () => {
    const token = await getData('userToken');
    const _headers = headers ? JSON.parse(headers) : {};
    const _body = body ? JSON.parse(body) : {};
    client[method](
      url,
      _body,
      {
        headers: { ..._headers, Authorization: `Bearer ${token}` },
      },
    )
      .then((res: any) => {
        setData(res.data);
      })
      .catch((err: any) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, error, loading, refetch: fetchData };
};

interface axiosOptions {
  onComplete?: (data: any) => void;
  onError?: (error: any) => void;
  headers?: object;
};

export const useAxiosMutation = (url: string, options?: axiosOptions) => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleMutation: ((body: any) => Promise<void>) | any = async (
    body: any,
  ) => {
    try {
      setLoading(true);
      const token = await getData('userToken');
      const _headers = options?.headers || {};
      const response = await client.post(url, body, {
        headers: { ..._headers, Authorization: `Bearer ${token}` },
      });
      setLoading(false);
      if (options?.onComplete) {
        options?.onComplete(response);
      }
    } catch (error) {
      setLoading(false);
      if (options?.onError) {
        options?.onError(error);
      }
    }
  };
  return [handleMutation, { loading }];
};

export const useService = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setloading] = useState(true);
  const fetchData = async (url: string, method: string = 'get', body?: any, headers?: any,) => {
    try {
      const token = await getData('userToken');

      const _headers = headers ? headers : {};

      const _body = body ? body : {};
      const res = await client[method](
        url,
        {
          headers: { ..._headers, Authorization: `Bearer ${token}` },
          data: _body
        },
      )
      setData(res.data);
      setloading(false);
    } catch (error: any) {
      console.log(error);
      setError(error);
      setloading(false);

    }

  };

  return { fetchData, data, error, loading };
};

export const fetchPost = async (url: string, body?: any, headers?: any,) => {
  try {
    const token = await getData('userToken');
    const _headers = headers ? headers : {};
    const _body = body ? body : {};
    const res = await client.post(
      url,
      _body,
      {
        headers: { ..._headers, Authorization: `Bearer ${token}` }
      },
    )
    return res
  } catch (error: any) {
    console.log(error);
    throw error
  }

};

export default client;
