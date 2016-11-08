import Agent from "./agent";

const validator = require("is-my-json-valid");

const baseUrl = "http://www.reddit.com";

export const get = (url: string) => {
  const request = new Agent(baseUrl);
  return request.get(url).withCredentials();
};

export const post = (url: string) => {
  const request = new Agent(baseUrl);
  return request.post(url).withCredentials();
};

export const patch = (url: string) => {
  const request = new Agent(baseUrl);
  return request.patch(url).withCredentials();
};

export const del = (url: string) => {
  const request = new Agent(baseUrl);
  return request.del(url).withCredentials();
};

export const validate = (schema, data) => {
  const validateFn = validator(schema);
  if (!validateFn(data)) {
    const error = validateFn.errors[0];
    throw new TypeError(`\`${error.field}\` ${error.message}`);
  }
  return data;
};
