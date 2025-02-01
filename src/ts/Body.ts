export class Body {
  // Body properties
  name: string;
  imageURL: string;
  bodyType: string;
  gravity: number;
  massValue: number;
  massExponent: number;
  temp: number;
  isPlanet: boolean;
  moons: Array<object>;
  aroundPlanet: object;
  aroundPlanetName: string = "";
  isSaved: boolean;

  // HTML Elements
  cardHTML: HTMLElement;
  imageHTML: HTMLImageElement;
  titleHTML: HTMLElement;
  bodyTypeHTML: HTMLElement;
  gravityHTML: HTMLElement;
  massHTML: HTMLElement;
  tempHTML: HTMLElement;
  orbitDataTextHTML: HTMLElement;
  orbitDataValueHTML: HTMLElement;
  saveButton: HTMLButtonElement;

  constructor(
    isSaved: boolean,
    html: HTMLElement,
    name: string,
    imageURL: string,
    bodyType: string,
    gravity: number,
    massValue: number,
    massExponent: number,
    temp: number,
    isPlanet: boolean,
    moons: Array<object>,
    aroundPlanet: object
  ) {
    // Set body properties
    this.isSaved = isSaved;
    this.name = name;
    this.imageURL = imageURL;
    this.bodyType = bodyType;
    this.gravity = gravity;
    this.massValue = massValue;
    this.massExponent = massExponent;
    this.temp = temp;
    this.isPlanet = isPlanet;
    this.moons = moons;
    this.aroundPlanet = aroundPlanet;

    // Set HTML Elements
    this.cardHTML = html;
    this.titleHTML = this.cardHTML.querySelector(".bodyName") as HTMLElement;
    this.imageHTML = this.cardHTML.querySelector(
      ".bodyImage"
    ) as HTMLImageElement;
    this.bodyTypeHTML = this.cardHTML.querySelector(".bodyType") as HTMLElement;
    this.gravityHTML = this.cardHTML.querySelector(
      ".bodyGravity"
    ) as HTMLElement;
    this.massHTML = this.cardHTML.querySelector(".bodyMass") as HTMLElement;
    this.tempHTML = this.cardHTML.querySelector(".bodyTemp") as HTMLElement;
    this.orbitDataTextHTML = this.cardHTML.querySelector(
      ".bodyOrbitText"
    ) as HTMLElement;
    this.orbitDataValueHTML = this.cardHTML.querySelector(
      ".bodyOrbitValue"
    ) as HTMLElement;
    this.saveButton = this.cardHTML.querySelector(
      ".cardSave"
    ) as HTMLButtonElement;

    // Dispatch custom event for save on click
    this.saveButton.addEventListener("click", () => {
      const saveEvent = new CustomEvent("bodySave", { detail: this.name });
      this.cardHTML.dispatchEvent(saveEvent);
      this.toggleSaveStyle();
    });

    // Customize card content with body properties
    this.customizeCard();
  }

  customizeCard = () => {
    this.editData();
    this.blurImage();
    this.setSaveStyle();
  };

  setSaveStyle = () => {
    if (this.isSaved) {
      this.setSaved();
    } else {
      this.setUnsaved();
    }
  };

  toggleSaveStyle = () => {
    if (this.isSaved) {
      this.setUnsaved();
      this.isSaved = false;
    } else {
      this.setSaved();
      this.isSaved = true;
    }
  };

  setUnsaved = () => {
    this.saveButton.classList.remove("card__saveButton--saved");
    this.saveButton.classList.add("card__saveButton--unsaved");
  };

  setSaved = () => {
    this.saveButton.classList.add("card__saveButton--saved");
    this.saveButton.classList.remove("card__saveButton--unsaved");
  };

  editData = () => {
    if (this.isPlanet) {
      this.orbitDataTextHTML.innerText = "Number of moons :";
      if (this.moons) {
        this.orbitDataValueHTML.innerText = String(this.moons.length);
      }else{
        this.orbitDataValueHTML.innerText = "0";

      }
    } else {
      this.fetchBodyName(this.aroundPlanet.rel);
      this.orbitDataTextHTML.innerText = "Orbiting around :";
    }

    this.titleHTML.innerText = this.name;
    this.imageHTML.src = this.imageURL;
    this.tempHTML.innerText = this.temp + " K";
    this.gravityHTML.innerText = Math.round(this.gravity * 100) / 100 + " g";
    this.bodyTypeHTML.innerText = this.bodyType;
    this.massHTML.innerHTML =
      Math.round(this.massValue * 100) / 100 +
      "×10<sup>" +
      this.massExponent +
      "</sup> kg";
  };

  blurImage = () => {
    const blurImage = this.imageHTML.cloneNode(true) as HTMLImageElement;
    blurImage.style.filter = "blur(200px)";
    blurImage.style.opacity = "0.65";
    blurImage.style.zIndex = "2";
    this.cardHTML.appendChild(blurImage);
  };

  fetchBodyName = async (url: string) => {
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        this.aroundPlanetName = data.englishName;
        this.orbitDataValueHTML.innerText = this.aroundPlanetName;
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
