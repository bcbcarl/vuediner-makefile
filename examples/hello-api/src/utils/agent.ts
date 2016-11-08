const qs = require("qs");

const contains = (value, list: Array<any>) => list.some(x => x === value);
const isPlainObject = (value) => Object.prototype.toString.call(value) === "[object Object]";

export default class Agent {
  private url: string;
  private method: string;
  private contentType: string;
  private formData: FormData;
  private body: string | FormData;
  private headers: string[] | { [index: string]: string; };
  private credentials: string;
  private queryObj: Object;
  private response: Object;

  constructor(baseUrl: string) {
    this.url = baseUrl;
    this.method = "GET";
    this.contentType = "application/json";
    this.headers = {};
    this.queryObj = {};
    this.response = {};
  }

  public get(url: string) {
    this.method = "GET";
    this.url += url;
    return this;
  }

  public post(url: string) {
    this.method = "POST";
    this.url += url;
    return this;
  }

  public put(url: string) {
    this.method = "PUT";
    this.url += url;
    return this;
  }

  public patch(url: string) {
    this.method = "PATCH";
    this.url += url;
    return this;
  }

  public del(url: string) {
    this.method = "DELETE";
    this.url += url;
    return this;
  }

  public withCredentials(credentials = "same-origin") {
    this.credentials = credentials;
    return this;
  }

  public type(contentType: string) {
    const types = {
      json: "application/json",
      form: "application/x-www-form-urlencoded"
    };
    this.contentType = types[contentType] || contentType;
    return this;
  }

  public query(obj) {
    this.queryObj = Object.assign({}, this.queryObj, obj);
    return this;
  }

  public attach(field: string, file: File, filename?: string) {
    this.contentType = "multipart/form-data";
    this.formData = new FormData();
    this.formData.append(field, file, filename || file.name);
    return this;
  }

  public send(data: {}) {
    if (!isPlainObject(data)) {
      throw new Error("Data MUST be an object.");
    }

    if (!contains(this.method, ["POST", "PUT", "PATCH"])) {
      throw new Error(`Method ${this.method} is not allowed. You MUST send a "POST", "PUT", or "PATCH" request.`);
    }

    if (!Object.keys(data).length) {
      return this;
    }

    // auto-detect attachment content-type
    if (this.contentType !== "multipart/form-data") {
      this.setContentType(this.contentType);
    }
    this.setBody(this.contentType, data);
    return this;
  }

  public setContentType(contentType) {
    this.headers["Content-Type"] = contentType;
  }

  public getContentType() {
    return this.contentType;
  }

  public setBody(contentType: string, data: any) {
    const serialize = {
      "application/json": JSON.stringify,
      "application/x-www-form-urlencoded": qs.stringify,
      "multipart/form-data": (obj: {}) => Object.keys(obj).reduce(
        (f: FormData, k: string) => (f.append(k, obj[k]), f),
        this.formData
      )
    };
    const f = serialize[this.contentType];
    this.body = f ? f(data) : data;
  }

  public getBody(contentType: string, data: {}) {
    return this.body;
  }

  public getUrl() {
    return (Object.keys(this.queryObj).length > 0)
      ? `${this.url}?${qs.stringify(this.queryObj)}`
      : this.url;
  }

  public end(callback?: (value: any) => any) {
    let fetchParams: any = {
      method: this.method,
      headers: this.headers
    };

    if (this.body) {
      fetchParams.body = this.body;
    }

    if (this.credentials) {
      fetchParams.credentials = this.credentials;
    }

    const promise = fetch(this.getUrl(), fetchParams)
      .then((res) => res.json());

    return callback
      ? promise.then(callback)
      : promise;
  }

  public then(resolve: (value: any) => any | Promise<{}>, reject?: (reason: any) => void) {
    return this.end()
      .then(resolve, reject);
  }
}
