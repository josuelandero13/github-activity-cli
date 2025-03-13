
import { createInterface } from "readline";
import userRepository from "./service/userRepo.js";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu() {
  console.log("\nSelecciona una opción:");
  console.log("1. Ver actividad reciente (eventos públicos)");
  console.log("2. Ver repositorios públicos");
  console.log("3. Ver seguidores");
  console.log("4. Salir");
}

async function getRecentActivity(username) {
  const response = await userRepository(
    `https://api.github.com/users/${username}/events/public`
  );

  if (response.length === 0) {
    console.log(
      `No se encontró actividad reciente para el usuario ${username}.`
    );
    return;
  }

  console.log(`\nActividad reciente de ${username}:`);
  response.forEach((event) => {
    const date = new Date(event.created_at).toLocaleString();
    console.log(`- ${event.type} en ${event.repo.name} (${date})`);
  });
}

async function getPublicRepos(username) {
  const repos = await userRepository(
    `https://api.github.com/users/${username}/repos`
  );

  if (repos.length === 0) {
    console.log(
      `No se encontraron repositorios públicos para el usuario ${username}.`
    );
    return;
  }

  console.log(`\nRepositorios públicos de ${username}:`);
  repos.forEach((repo) => {
    console.log(`- ${repo.name}: ${repo.description || "Sin descripción"}`);
  });
}

async function getFollowers(username) {
  const followers = await userRepository(
    `https://api.github.com/users/${username}/followers`
  );

  if (followers.length === 0) {
    console.log(`No se encontraron seguidores para el usuario ${username}.`);
    return;
  }

  console.log(`\nSeguidores de ${username}:`);
  followers.forEach((follower) => {
    console.log(`- ${follower.login}`);
  });
}

async function showRepoData() {
  rl.question("Ingresa el nombre de usuario de GitHub: ", async (username) => {
    if (!username) {
      console.error("Por favor, proporciona un nombre de usuario de GitHub.");
      rl.close();
      return;
    }

    showMenu();

    rl.question("\nElige una opción (1-4): ", async (option) => {
      switch (option) {
        case "1":
          await getRecentActivity(username);
          break;
        case "2":
          await getPublicRepos(username);
          break;
        case "3":
          await getFollowers(username);
          break;
        case "4":
          console.log("Saliendo...");
          rl.close();
          return;
        default:
          console.error(
            "Opción no válida. Por favor, elige una opción del 1 al 4."
          );
          break;
      }

      showRepoData();
    });
  });
}

showRepoData();
