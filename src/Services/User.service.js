import http from "../http-common";

// ดึงผู้ใช้ทั้งหมด
const getAllUsers = () => {
  return http.get("/auth"); // หรือ /users แล้วแต่ Backend map route ไว้
};

const getUser = (id) => {
  return http.get(`/auth/${id}`);
};

const register = (data) => {
  return http.post("/auth", data);
};

const login = (data) => {
  return http.post("/auth/login", data);
};

const updateUser = (id, data) => {
  const token = localStorage.getItem("token");
  return http.put(`/auth/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`
    },
  });
};

const deleteUser = (id) => {
  const token = localStorage.getItem("token");
  return http.delete(`/auth/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
};

// ✅ เพิ่ม: ฟังก์ชันเปลี่ยน Role
const updateRole = (id, role) => {
  const token = localStorage.getItem("token");
  return http.put(`/auth/role/${id}`, { role }, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
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