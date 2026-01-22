import http from "../http-common";

const getReview = () => {
  return http.get("/reviews");
};

const  ReviewService = {
    getReview, 
};

export default ReviewService;

