import { get } from "https";

export default function userRepository(url) {
  return new Promise((resolve, reject) => {
    const headers = {
      "User-Agent": "Node.js CLI",
    };

      get(url, { headers }, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          if (response.statusCode === 200) {
            resolve(JSON.parse(data));
          } else if (response.statusCode === 404) {
            reject(new Error(`No se encontró el recurso ${url}.`));
          } else {
            reject(new Error(`Error: ${response.statusCode} - ${data}`));
          }
        });
      })
      .on("Error", (error) => {
        reject(error);
      });
  });
}
