import { Body } from "./Body";

export class Manager {
  cardHTML: HTMLElement;
  containerHTML: HTMLElement;
  formHTML: HTMLFormElement = document.querySelector(
    ".form"
  ) as HTMLFormElement;
  searchInput: HTMLInputElement;
  API_URL: string =
    "https://api.le-systeme-solaire.net/rest/bodies?filter[]=englishName,sw,";
  IMAGE_URL_Start: string =
    "https://astrogeology.usgs.gov/search/images/map-index/";
  IMAGE_URL_End: string = "-rpif.png";
  bodies: Array<Body> = [];
  savedBodies: Array<string> = [];

  constructor() {
    // LocalStorage reseter
    // localStorage.clear();

    // Set HTMLElements
    this.cardHTML = document.querySelector(".card") as HTMLElement;
    this.containerHTML = document.querySelector(".container") as HTMLElement;
    this.searchInput = this.formHTML.elements[0] as HTMLInputElement;
    this.cardHTML.remove();

    // Load localStorage into savedBodies array
    const savedBodiesString = localStorage.getItem("savedBodies");

    if (savedBodiesString) {
      try {
        const savedBodies: string[] = JSON.parse(savedBodiesString);
        savedBodies.forEach((element: string) => {
          this.savedBodies.push(element);
        });
      } catch (error) {
        console.error("Erreur de parsing des données sauvegardées :", error);
      }
    }

    this.formHTML.addEventListener("submit", (e) => {
      this.bodies = [];
      this.containerHTML.innerHTML = "";
      e.preventDefault();
      const query = this.searchInput.value;
      this.fetchBodyData(this.API_URL + query);
    });

    // Detect click to go to saves page
    document.querySelectorAll(".saveButton").forEach(saveButton => {
      saveButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.bodies = [];
        this.containerHTML.innerHTML = "";
        this.savedBodies.forEach((e) => {
          this.fetchBodyData(this.API_URL + e);
        });
      })
    });
  }

  fetchBodyData = async (url: string) => {
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.bodies.length > 0) {
          data.bodies.forEach((b: any) => {
            const fullURL =
              this.IMAGE_URL_Start +
              b.englishName.toLowerCase() +
              this.IMAGE_URL_End;

            const clonedCard = this.cardHTML.cloneNode(true) as HTMLElement;
            clonedCard.addEventListener("bodySave", (evt) => {
              this.onBodySave((evt as CustomEvent).detail);
            });

            let isSaved: boolean = false;
            if (this.savedBodies.indexOf(b.englishName) > -1) {
              isSaved = true;
            }

            const body = new Body(
              isSaved,
              clonedCard,
              b.englishName,
              fullURL,
              b.bodyType,
              b.gravity,
              b.mass.massValue,
              b.mass.massExponent,
              b.avgTemp,
              b.isPlanet,
              b.moons,
              b.aroundPlanet
            );

            this.bodies.push(body);
            this.containerHTML.appendChild(body.cardHTML);
          });
        } else {
          console.log("No results for this query");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onBodySave = (e: Event) => {
    if (!(this.savedBodies.indexOf(String(e)) > -1)) {
      this.savedBodies.push(String(e));
      this.refreshLocalStorage();
    } else {
      console.log(this.savedBodies.indexOf(String(e)));
      this.savedBodies.splice(this.savedBodies.indexOf(String(e)), 1);
      this.refreshLocalStorage();
    }
  };

  refreshLocalStorage = () => {
    localStorage.clear;
    localStorage.setItem("savedBodies", JSON.stringify(this.savedBodies));
    console.log(
      "localStorage contains :",
      JSON.parse(localStorage.getItem("savedBodies")!)
    );
  };
}
