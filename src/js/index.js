import "regenerator-runtime/runtime";
import "core-js/stable";
import "whatwg-fetch";
import "../css/index.css";
import { createServer, Model } from "miragejs";
import AutoComplete from "./autocomplete";

// createServer({
//   models: {
//     movie: Model,
//   },
//   routes() {
//     this.get("/api/movies/", (schema) => {
//       return schema.movies.all();
//     });
//   },
//   seeds(server) {
//     server.create("movie", { id: 1, title: "Inception" });
//     server.create("movie", { id: 2, title: "Interstellar" });
//     server.create("movie", { id: 3, title: "Shutter Island" });
//     server.create("movie", { id: 4, title: "Titanic" });
//     server.create("movie", { id: 5, title: "Wolf in the street" });
//     server.create("movie", { id: 6, title: "Greate Gatsby" });
//     server.create("movie", { id: 7, title: "Mars" });
//     server.create("movie", {
//       id: 8,
//       title: "Charly and The Chocolate Factory",
//     });
//     server.create("movie", { id: 9, title: "Saw" });
//     server.create("movie", { id: 10, title: "Dunkirk" });
//     server.create("movie", { id: 11, title: "Nanny Mcphy" });
//     server.create("movie", { id: 12, title: "Harry Potter" });
//   },
// });

const loadData = async (query) => {
  console.log(query);
  const apiKey = `26991cf96cfd4a85a7dc2670ece3b80b`;
  const response = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}`
  );
  const { results } = await response.json();
  console.log(results);
  return results;
};

const makeItem = (item) => {
  const { title, image, id } = item;
  const element = document.createElement("div");
  const textElem = document.createElement("div");
  textElem.innerText = title;
  const imageElem = document.createElement("img");
  imageElem.src = image;
  element.appendChild(textElem);
  element.appendChild(imageElem);
  return element;
};

const onSelect = (item) => {
  console.log(item);
  alert(item.title);
};

const init = async () => {
  new AutoComplete("autocomplete", loadData, makeItem, onSelect);
};

init();
