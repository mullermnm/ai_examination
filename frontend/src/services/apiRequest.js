import apiService from "./apiService";
import { handleError } from "./handleErrorService";

export default {
  async request(axios, api = {}) {
    const requestData = this.getRequestData(api);
    try {
      const response = await axios(requestData);
      return response.data
        ? { code: response.status, ...response.data }
        : { error: true, message: "server error" };
    } catch (error) {
      try {
        if (error.response.status == 422)
          return {
            error: true,
            code: 422,
            joiError: true,
            joi: error.response.data.message || error.response.data,
          };
      } catch (error) {
        return { error: true, message: error.toString() }; // handleError(error);
      }
      return {
        error: true,
        message: error.response.data?.message || error.toString() || "Ooops, network error!",
      }; // handleError(error);
    }
  },

  async streamRequest(params) {
    const requestData = {
      url: params.url,
      method: params.method,
      data: params.data,
      responseType: "stream",
      transformRequest: params.transformRequest,
      transformResponse:
        params.transformResponse ||
        ((data) => {
          console.log(data);
        }),
    };

    try {
      const data = await apiService.customRequest(requestData);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
  async getApplication(params) {
    const requestData = {
      url: params.url,
      method: params.method,
      data: params.data,
      responseType: params.responseType,
    };

    try {
      const data = await apiService.customRequest(requestData);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },
  async upload(axios, api = {}) {
    let requestData = this.getRequestData(api);
    requestData.headers = { "Content-Type": "multipart/form-data" };

    try {
      const response = await axios(requestData);
      return response.data
        ? { code: response.status, ...response.data }
        : { error: true, message: "server error" };
    } catch (error) {
      console.log(error);
      try {
        if (error.response.status == 422)
          return {
            error: true,
            code: 422,
            joiError: true,
            joi: error.response.data,
          };
      } catch (error) {
        return { error: true, message: "Ooops, network error" }; // handleError(error);
      }
      return {
        error: true,
        message: error.response.data.message || "Ooops, network error!",
      }; // handleError(error);
    }
  },

  getRequestData(api) {
    let { method, url = "", params = [], data, query } = api;

    // Handle URL with placeholders
    let [base, ...placeholders] = url.split("/:");
    if (placeholders.length > 0 && params.length > 0) {
      params.map((e, i) => placeholders[i]);
      url = base + "/" + params.join("/");
    }

    // Handle query parameters
    if (query) {
      url += "?" + Object.entries(query)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
    }

    // Clean up empty data fields
    if (data) {
      data = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {});
    }

    return {
      url,
      method,
      data,
    };
  },
};
