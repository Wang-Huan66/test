import http from "./http";
export const LoginApi = (formData) => http.post("/login", formData);
export const layoutApi = () => http.get("/layout");
export const goodsListApi = (body) => http.post("/list", body);
export const addApi = (body) => http.post("/add", body);
export const editApi = (body) => http.post("/edit", body);
export const delApi = (body) => http.post("/del", body);
