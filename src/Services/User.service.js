import http from "../http-common";

const get = () => {
  return http.get("/registers");
};

const postUser = (data) => {
  return http.post("/registers", data, {
    headers: { "Content-Type": "multipart/form-data" }, // สำหรับอัปโหลดรูปภาพ
  });
};

const login = (data) => {
  return http.post("/registers/login", data);
};

// New function to get user by ID
const getUser = (id) => {
  return http.get(`/registers/${id}`);
};

const UserService = {
  get,
  postUser,
  login,
  getUser, // Add the new function here
};

export default UserService;