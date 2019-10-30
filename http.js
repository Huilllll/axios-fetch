// qs: 依赖包， 将对象变成url - incode格式, 或者将url - incode格式变成对象， 格式转换插件

// 1.基于xmlHtppRequest的jquery  2.axios
import axios from 'axios'
import qs from 'qs'
//将axios进行二次封装

//基于环境配置(开发环境、测试环境、跟生产环境)
//1.根据环境变量区分接口的配置
switch (process.env.NODE_ENV) {
  case "production":
    axios.defaults.baseURL = "http://127.0.0.1:3000"
    break;
  case "test":
    axios.defaults.baseURL = "http://192.168.20.12:8080"
    break;
  default:
    axios.defaults.baseURL = "http://127.0.0.1:3000";
}

// 2.设置超时时间和跨域是否允许携带凭证
axios.defaults.timeout = 1000;
// `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
// 如果请求话费了超过 `timeout` 的时间，请求将被中断
axios.defaults.withCredentials = true; // `withCredentials` 表示跨域请求时是否需要使用凭证

//3.设置请求头传递数据的格式 x-www-form-urlencoded
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencode'
axios.defaults.transformRequest = data => qs.stringify(data);

//4. 设置请求拦截器: 客户端发送请求 =》[请求拦截器]=》服务器
//TOKEN校验（JWT）:接收服务器返回的token,存储到vuex/本地存储中。每一次向服务器发送请求，我们应该把token带上
axios.interceptors.request.use(config => {
  //携带上token
  let token = localStorage.getItem('token');
  token && (config.headers.Authorization = token);
  return config;
}, error => {
  return Promise.reject(error)
});

// 5.响应拦截器：服务器返回信息 =》【拦截的统一处理】=》 客户端js获取到信息
// axios.defaults.validateStatus = status => {
//   // 自定义响应式的http状态码
//   return /^(2|3)\d{2}$/.test(status)
// }  判断状态码
axios.interceptors.response.use(response => {
  return response.data;
}, error => {
  let {
    response
  } = error;
  if (response) {
    //=>服务器最起码返回结果了
    switch (response.status) {
      case 401: //=》权限
        break;
      case 403: // 服务器已经请求但是拒绝执行(token或session过期)
        breack;
      case 404: //=》找不到页面
        break;

    }
  } else {
    //=> = 服务器连结果都没有返回
    if (!window.navigator.onLine) {
      // 断网处理：可以跳转到断网页面
      return;
    }
    return Promise.reject(error);
  }
})

// axios.get(url, {
//   params: {

//   }
// }).then(Response => {

// }).catch(error => {

// })

export default axios;
