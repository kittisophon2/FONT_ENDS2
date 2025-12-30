import http from "../http-common";

const getReview = () => {
  return http.get("/review");
};

const  ReviewService = {
    getReview, 
};

export default ReviewService;

