import http from "../http-common";

const getCategories = () => {
  return http.get("/categories");
};

const CategoryService = {
  getCategories, // แก้จาก getCategory เป็น getCategories
};

export default CategoryService;

