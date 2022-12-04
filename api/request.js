/* eslint-disable arrow-parens */
/* eslint-disable arrow-body-style */
import axios from 'axios';
import config from 'utils/config';
import queryString from 'query-string';
import authApi from './auth';
import RequestError from './requestError';

export const axiosInstance = axios.create({
  responseType: 'json',
  withCredentials: true,
  baseURL: config('public_api_base_url'),
});

export const googleStorageApiInstance = axios.create({
  responseType: 'json',
  withCredentials: true,
  baseURL: 'https://storage.googleapis.com/cdn-spotii-me/shop-directory',
});

const buildRequestConfig = (token, conf = {}) => {
  let bearer = {
  };

  if (token) {
    bearer = {
      Authorization: `Bearer ${token}`,
    };
  }

  return {
    ...conf,
    headers: {
      ...bearer,
      ...conf.headers,
    },
    paramsSerializer(params) {
      return queryString.stringify(params, { skipNull: true, arrayFormat: 'none' });
    },
  };
};

const catchError = (error) => {
  throw new RequestError(error);
};

const Request = {
  send: requestConfig => {
    return authApi.getToken().then(token => {
      return axiosInstance.request(buildRequestConfig(token, requestConfig));
    });
  },

  sendNoToken: requestConfig => {
    return axiosInstance.request(buildRequestConfig(null, requestConfig));
  },

  getNoToken: (url, params) => Request.sendNoToken({
    method: 'GET',
    url,
    params,
  }).catch(catchError),

  get: (url, params) => Request.send({
    method: 'GET',
    url,
    params,
  }).catch(catchError),

  post: (url, data) => Request.send({
    method: 'POST',
    url,
    data,
  }).catch(catchError),

  patch: (url, data) => Request.send({
    method: 'PATCH',
    url,
    data,
  }).catch(catchError),

  put: (url, data) => Request.send({
    method: 'PUT',
    url,
    data,
  }).catch(catchError),

  del: (url, data) => Request.send({
    method: 'DELETE',
    url,
    data,
  }).catch(catchError),
};

export default Request;
