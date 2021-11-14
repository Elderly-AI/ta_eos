const port: string = "3000";

const URLS = {
  inside: "api/v1/users/",
  logOut: "api/v1/users/logout/",
  registr: `http://127.0.0.1:${port}/api/v1/users/`,
  login: `http://127.0.0.1:${port}/api/v1/users/login/`,
  math: { // Добавляем сюда новые ручки
    directCode: {
      leftShift: (f: string, s: string) =>
        `http://127.0.0.1:${port}/api/v1/calculations/direct_code/left_shift/?first_value=${f}&second_value=${s}`,
      rightShift: (f: string, s: string) =>
          `http://127.0.0.1:${port}/api/v1/calculations/direct_code/right_shift/?first_value=${f}&second_value=${s}`,
    },
  },
};

export default URLS;
