import "regenerator-runtime/runtime";
import "core-js/stable";
import "whatwg-fetch";
import "../css/index.css";
import { throttle } from "lodash";

export default class AutoComplete {
  constructor(inputId, loadData, makeItem, onSelect) {
    this.inputId = inputId;
    this.loadData = loadData;
    this.makeItem = makeItem;
    this.onSelect = onSelect;

    this.resultList = [];
    this.focus = [];

    this.autocompleteInput = document.querySelector(`.${inputId}`);
    this.autocompleteList = document.createElement("ul");

    this.init();
  }

  init = () => {
    this.autocompleteList.classList.add("autocomplete-list");
    this.autocompleteInput.insertAdjacentElement(
      "afterend",
      this.autocompleteList
    );

    this.autocompleteInput.addEventListener("blur", this.closeAutocompleteList);
    this.autocompleteInput.addEventListener("click", this.openAutocompleteList);
    this.autocompleteInput.addEventListener(
      "input",
      throttle(async () => {
        const data = await this.loadData(this.autocompleteInput.value);

        // initialize
        this.autocompleteList.innerHTML = "";
        this.resultList = [];
        this.focus = -1;
        this.openAutocompleteList();

        for (let i = 0; i < data.length; i += 1) {
          const { id, title } = data[i];
          const elemId = `ac_${id}`;
          const item = `<li id="${elemId}" class="autocomplete-list-item"></li>`;
          this.autocompleteList.insertAdjacentHTML("beforeend", item);

          const newElement = document.querySelector(`#${elemId}`);
          newElement.appendChild(this.makeItem(data[i]));

          newElement.setAttribute("key", title);
          this.resultList = [...this.resultList, newElement];
          newElement.onmouseover = () => {
            newElement.classList.add("highlight");
          };
          newElement.onmouseout = () => {
            newElement.classList.remove("highlight");
          };
          newElement.onmousedown = () => {
            this.autocompleteInput.value = title;
            this.closeAutocompleteList();
            this.onSelect(data[i]);
          };
        }
      }, 500)
    );
    this.autocompleteInput.addEventListener("keydown", (event) => {
      const { key } = event;
      this.openAutocompleteList();
      if (key.includes("Down")) {
        event.preventDefault();

        this.focus =
          this.focus === -1 ? 0 : (this.focus + 1) % this.resultList.length;
        this.highlightOnItem();
        return;
      }

      if (key.includes("Up")) {
        event.preventDefault();
        this.focus =
          this.focus <= 0
            ? this.resultList.length - 1
            : (this.focus - 1) % this.resultList.length;
        this.highlightOnItem();
        return;
      }
      if (key.includes("Enter")) {
        event.preventDefault();
        const title = this.resultList[this.focus].getAttribute("key");
        this.autocompleteInput.value = title;
        this.closeAutocompleteList();
      }
    });
  };

  closeAutocompleteList = () => {
    this.autocompleteList.classList.add("hide");
  };

  openAutocompleteList = () => {
    this.autocompleteList.classList.remove("hide");
  };

  highlightOnItem = () => {
    for (let i = 0; i < this.resultList.length; i += 1) {
      if (this.focus === i) this.resultList[i].classList.add("highlight");
      else this.resultList[i].classList.remove("highlight");
    }
  };
}
