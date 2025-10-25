import axiosClient from "./axiosClient";

export const authApi = {
  signup: (email: string, password: string, passwordConfirmation: string) =>
    axiosClient.post("/users", {
      user: { email, password, password_confirmation: passwordConfirmation },
    }),

  login: (email: string, password: string) =>
    axiosClient.post("/users/sign_in", {
      user: { email, password },
    }),
};
