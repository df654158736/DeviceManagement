import axios from "axios";
import {
  Modal
} from "antd";
export default class Axios {
  static ajax(options) {
    let loading;
    if (options.data && options.data.isShowLoading !== false) {
      loading = document.getElementById("ajaxloading");
      loading.style.display = "block";
    }
    let baseApi = "http://139.224.223.197:8080/device";
    let userInfo = JSON.parse(localStorage.getItem('user'));
    let token = "";
    if (userInfo) {
      token = userInfo.token
    }
    return new Promise((resolve, reject) => {
      axios({
        headers: {
          token: token
        },
        url: options.url,
        method: options.method,
        baseURL: baseApi,
        timeout: 5000,
        data: options.data.params
      }).then(response => {
        if (options.data && options.data.isShowLoading !== false) {
          loading = document.getElementById('ajaxloading');
          loading.style.display = "none";
        }

        if (response.status == "200") { //eslint-disable-line
          let res = response.data;
          if (res.code == "0000") { //eslint-disable-line
            resolve(res.data);
          } else {
            Modal.info({
              title: "提示",
              content: res.message
            });
          }
        } else {
          reject(response.data);
        }
      });
    });
  }


  static ajaxExcel(options) {
    let loading;
    if (options.data && options.data.isShowLoading !== false) {
      loading = document.getElementById("ajaxloading");
      loading.style.display = "block";
    }
    let baseApi = "http://139.224.223.197:8080/device";
    let userInfo = JSON.parse(localStorage.getItem('user'));
    let token = "";
    let fileName = options.fileName;
    if (userInfo) {
      token = userInfo.token
    }
    return new Promise((resolve, reject) => {
      axios({
        headers: {
          token: token
        },
        url: options.url,
        method: options.method,
        baseURL: baseApi,
        timeout: 5000,
        data: options.data.params,
        responseType: "arraybuffer",
      }).then(response => {
        if (options.data && options.data.isShowLoading !== false) {
          loading = document.getElementById('ajaxloading');
          loading.style.display = "none";
        }

        let blob = new Blob([response.data], {
          type: "application/vnd.ms-excel;charset=utf-8"
        });
        let objectUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = fileName;
        link.click();

        window.URL.revokeObjectURL(link.href);
      });
    });
  }


  static ajaxAsync(options) {
    let loading;
    if (options.data && options.data.isShowLoading !== false) {
      loading = document.getElementById("ajaxloading");
      loading.style.display = "block";
    }
    let baseApi = "http://139.224.223.197:8080/device";
    let userInfo = JSON.parse(localStorage.getItem('user'));
    let token = "";
    if (userInfo) {
      token = userInfo.token
    }
    return new Promise((resolve, reject) => {
      axios({
        headers: {
          token: token
        },
        url: options.url,
        method: options.method,
        baseURL: baseApi,
        timeout: 5000,
        data: options.data.params,
        responseType: "arraybuffer",
      })
    });
  }
}