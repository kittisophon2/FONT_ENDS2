import http from "../http-common";

const getAllUsers = () => {
  return http.get("/auth");
};

// ✅ แก้ไข: เปลี่ยน path เป็น /auth
const getUser = (id) => {
  return http.get(`/auth/${id}`);
};

const register = (data) => {
  return http.post("/auth", data); // หรือ /auth/register ถ้า backend ตั้งไว้
};

const login = (data) => {
  return http.post("/auth/login", data);
};

const updateUser = (id, data) => {
  return http.put(`/auth/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteUser = (id) => {
  return http.delete(`/auth/${id}`);
};

const updateRole = (id, role) => {
  return http.put(`/auth/role/${id}`, { role });
};

const UserService = {
  getAllUsers,
  getUser,
  register,
  login,
  updateUser,
  deleteUser,
  updateRole
};

export default UserService;