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
    return new Promise((resolve, reject) => {
      axios({
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
}