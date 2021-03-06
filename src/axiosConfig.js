import axios from 'axios';
import QS from 'qs';

let config = {
  paramsSerializer: function(params) {
    return QS.stringify(params);
  },
  validateStatus: function (status) {
    return status < 501 && status >= 200;
  }
}

axios.defaults.paramsSerializer = config.paramsSerializer;
axios.defaults.validateStatus = config.validateStatus;

axios.interceptors.response.use(function (response) {
  if(response.status == 403) {
    window.location.href = window.location.origin + window.location.pathname + '#/login';
    return;
  }
  return response;
}, function (error) {
  console.log(error);
  return Promise.reject(error);
});

export default axios;
