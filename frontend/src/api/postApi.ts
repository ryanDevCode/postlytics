import axiosClient from "./axiosClient";

export const postApi = {
  getAll: () => axiosClient.get("/posts"),
  create: (content: string) => axiosClient.post("/posts", { post: { content } }),
};
