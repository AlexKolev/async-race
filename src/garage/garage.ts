import { Car } from '../cars/carInterface';
import { BASE_URL, ADD_PATH } from '../consts';
import { generateCarObject, generateColor, carImage } from '../utils';

export class Garage {
  currentCar: Car[];

  pageNum: number;

  limit: number;

  totalCars: string;

  numberGenerate: number;

  inputName: string;

  inputColor: string;

  inputNameUpd: string;

  inputColorUpd: string;

  carForUpdate: Car;

  constructor() {
    this.currentCar = [];
    this.pageNum = 1;
    this.limit = 7;
    this.totalCars = '';
    this.numberGenerate = 100;
    this.inputName = '';
    this.inputColor = '';
    this.inputNameUpd = '';
    this.inputColorUpd = '';
    this.carForUpdate = { name: '', color: '', id: -1 };
  }

  static addCar = async (data: { name: string; color: string }) => {
    try {
      // const response: Response =
      await fetch(`${BASE_URL}${ADD_PATH.garage}`, {
        method: 'POST',
        body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // console.log(response.status);
      // console.log(await response.json());
    } catch (err) {
      // перехватит любую ошибку в блоке try: и в fetch, и в response.json
      console.log((err as Error).message);
      // return {};
    }
  };

  static updateCar = async (data: { name: string; color: string }, id: number) => {
    const response: Response = await fetch(`${BASE_URL}${ADD_PATH.garage}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.status);
    console.log(await response.json());
  };

  genCar() {
    for (let i = 0; i < this.numberGenerate; i += 1) {
      Garage.addCar({ name: generateCarObject(), color: generateColor() });
    }
  }

  getCars = async (page: number, limit: number) => {
    try {
      const response: Response = await fetch(`${BASE_URL}${ADD_PATH.garage}?_page=${page}&_limit=${limit}`);
      // console.log(response.status);
      this.totalCars = response.headers.get('X-Total-Count') as string;
      this.currentCar = await response.json();
      // return {items: data, totalCount: totalCount};
    } catch (err) {
      // перехватит любую ошибку в блоке try: и в fetch, и в response.json
      console.log((err as Error).message);
      // return {};
    }
  };

  static delCars = async (id: number) => {
    try {
      const response: Response = await fetch(`${BASE_URL}${ADD_PATH.garage}/${id}`, { method: 'DELETE' });
      console.log(response.status);
      console.log(await response.json());
      // return {items: data, totalCount: totalCount};
    } catch (err) {
      // перехватит любую ошибку в блоке try: и в fetch, и в response.json
      console.log((err as Error).message);
      // return {};
    }
  };

  static startEngine = async (id: number) => {
    try {
      const response: Response = await fetch(`${BASE_URL}${ADD_PATH.engine}?id=${id}&status=started`, { method: 'PATCH' });
      return await response.json();
    } catch (err) {
      // перехватит любую ошибку в блоке try: и в fetch, и в response.json
      console.log((err as Error).message);
      return {};
    }
  };

  static driveMode = async (id: number) => {
    try {
      const response: Response = await fetch(`${BASE_URL}${ADD_PATH.engine}?id=${id}&status=drive`, { method: 'PATCH' });
      return response.status;
    } catch (err) {
      // перехватит любую ошибку в блоке try: и в fetch, и в response.json
      console.log((err as Error).message);
      return {};
    }
  };

  private carItemClick = (e: Event) => {
    const target = e.target as Element;
    // target = target.parentNode as Element;
    // while (!target.classList.contains('car-garage-item')) {
    //   target = target.parentNode as Element;
    // }
    const idCar = +(target.getAttribute('data-id') as string);
    if (this.currentCar.find((el) => (el.id === idCar))) {
      this.carForUpdate = this.currentCar.find((el) => (el.id === idCar)) as Car;
    }
    const carUpdName = document.querySelector('.car-update') as HTMLInputElement;
    const carUpdColor = document.querySelector('.car-update-color') as HTMLInputElement;
    carUpdName.value = this.carForUpdate.name;
    carUpdColor.value = this.carForUpdate.color;

    this.inputNameUpd = carUpdName.value;
    this.inputColorUpd = carUpdColor.value;
  };

  private carItemDelClick = async (e: Event) => {
    const target = e.target as Element;
    // target = target.parentNode as Element;
    // while (!target.classList.contains('car-garage-item')) {
    //   target = target.parentNode as Element;
    // }
    const idCar = +(target.getAttribute('data-id') as string);
    await Garage.delCars(idCar);
    const totalcars = document.querySelector('.totalcars-garage') as Element;
    this.totalCars = `${+this.totalCars - 1}`;
    totalcars.innerHTML = `Cars in Garage ${this.totalCars}`;
    this.drawCars(document.querySelector('main') as Element);
  };

  static carStartClick = async (e: Event) => {
    const target = e.target as Element;
    const idCar = +(target.getAttribute('data-id') as string);
    const { velocity, distance } = await Garage.startEngine(idCar);
    console.log({ velocity, distance });
    console.log(distance / velocity);

    const elemC = document.querySelector(`.car-flag[data-id="${idCar}"]`) as Element;
    console.log(elemC.getBoundingClientRect());

    const elemF = document.querySelector(`.wraper-car-svg[data-id="${idCar}"]`) as Element;
    console.log(elemF.getBoundingClientRect());

    const status = await Garage.driveMode(idCar);
    console.log(status);
  };

  drawCars = async (garageMain: Element) => {
    await this.getCars(this.pageNum, this.limit);
    const carsGarage = garageMain.querySelector('.cars-garage') as Element;
    carsGarage.innerHTML = '';
    for (let i = 0; i < this.currentCar.length; i += 1) {
      carsGarage.insertAdjacentHTML(
        'beforeend',
        `<div class="car-garage-item" data-id="${this.currentCar[i].id}">
          <div class = "car-header">
            <button class="select-car" data-id="${this.currentCar[i].id}">Select</button>
            <button class="remove-car" data-id="${this.currentCar[i].id}">Remove</button>
            <p class="car-name">${this.currentCar[i].name}</p>
            <button class = "engine-start" data-id="${this.currentCar[i].id}">Start</button>
            <button class = "engine-stop" data-id="${this.currentCar[i].id}">Stop</button>
          </div>
          <div class = "car-race">
            <div class="wraper-car-svg" data-id="${this.currentCar[i].id}">${carImage(this.currentCar[i].color)}</div>
            <div class = "car-flag" data-id="${this.currentCar[i].id}">⚑</div>
          </div>
        </div>`,
      );
    }
    const carItems = document.querySelectorAll('.select-car');
    carItems.forEach((carItem) => {
      carItem.addEventListener('click', this.carItemClick);
    });

    const carItemsDel = document.querySelectorAll('.remove-car');
    carItemsDel.forEach((carItem) => {
      carItem.addEventListener('click', this.carItemDelClick);
    });

    const carsStart = document.querySelectorAll('.engine-start');
    carsStart.forEach((carStart) => {
      carStart.addEventListener('click', Garage.carStartClick);
    });
  };

  private checkDisableBtn(prevBtn: Element, nextBtn: Element) {
    if (this.pageNum === 1) {
      prevBtn.setAttribute('disabled', 'true');
    } else {
      prevBtn.removeAttribute('disabled');
    }
    if ((this.pageNum - 1) * this.limit + this.currentCar.length < +this.totalCars) {
      nextBtn.removeAttribute('disabled');
    } else {
      nextBtn.setAttribute('disabled', 'true');
    }
  }

  private addGarageHeader(garageMain: Element) {
    garageMain.insertAdjacentHTML(
      'afterbegin',
      `<div class = "garage-header">
        <div class = "garage-header-section">
          <input type="text" autocomplete="on" class="car-add"><input type="color" class="car-add-color" value="#FFFFFF"> <button class="add">Create</button>
        </div>  
        <div class = "garage-header-section">
          <input type="text" autocomplete="on" class="car-update"><input type="color" class="car-update-color" value="#FFFFFF"> <button class="update">Update</button>
        </div>  
        <div class = "garage-header-section"> 
          <button class="race">Race</button>
          <button class="reset">Reset</button>
          <button class="generate-cars">Generate ${this.numberGenerate} Cars</button>
        </div>  
      <h3 class="totalcars-garage">Cars in Garage ${this.totalCars}</h3>
      <h4 class="page-num-garage">Page ${this.pageNum}</h4>
      </div>`,
    );
    const carName = document.querySelector('.car-add') as HTMLInputElement;
    carName.value = this.inputName;
    carName.addEventListener('input', () => {
      this.inputName = carName.value;
    });

    const carColor = document.querySelector('.car-add-color') as HTMLInputElement;
    if (this.inputColor) {
      carColor.value = this.inputColor;
    }

    carColor.addEventListener('input', () => {
      this.inputColor = carColor.value;
    });

    const add = document.querySelector('.add') as Element;
    add.addEventListener('click', () => {
      if (carName.value) {
        Garage.addCar({ name: carName.value, color: carColor.value });
        this.drawGarage();
      }
      this.inputColor = '';
      this.inputName = '';
    });

    const carUpdName = document.querySelector('.car-update') as HTMLInputElement;
    carUpdName.value = this.inputNameUpd;
    carUpdName.addEventListener('input', () => {
      this.inputNameUpd = carUpdName.value;
    });

    const carUpdColor = document.querySelector('.car-update-color') as HTMLInputElement;
    if (this.inputColorUpd) {
      carUpdColor.value = this.inputColorUpd;
    }

    carUpdColor.addEventListener('input', () => {
      this.inputColorUpd = carUpdColor.value;
    });

    const update = document.querySelector('.update') as Element;
    update.addEventListener('click', () => {
      if (this.carForUpdate.name) {
        Garage.updateCar({ name: carUpdName.value, color: carUpdColor.value },
          this.carForUpdate.id);
        this.drawGarage();
      }
      this.inputColorUpd = '#FFFFFF';
      this.inputNameUpd = '';
    });

    const generate = document.querySelector('.generate-cars') as Element;
    generate.addEventListener('click', () => {
      this.genCar();
      this.drawGarage();
    });
  }

  private addPrevNextBtn(garageMain: Element) {
    garageMain.insertAdjacentHTML(
      'beforeend',
      `<div class = "garage-navigate-btn">
        <button class="prev-garage">Prev</button>
        <button class="next-garage">Next</button>
       </div> 
        `,
    );
    const prevBtn = document.querySelector('.prev-garage') as Element;
    const nextBtn = document.querySelector('.next-garage') as Element;

    prevBtn.addEventListener('click', () => {
      this.pageNum -= 1;
      const page = document.querySelector('.page-num-garage') as Element;
      page.innerHTML = `Page ${this.pageNum}`;
      this.drawCars(garageMain);
      this.checkDisableBtn(prevBtn, nextBtn);
    });

    nextBtn.addEventListener('click', () => {
      this.pageNum += 1;
      const page = document.querySelector('.page-num-garage') as Element;
      page.innerHTML = `Page ${this.pageNum}`;
      this.drawCars(garageMain);
      this.checkDisableBtn(prevBtn, nextBtn);
    });
  }

  drawGarage = async () => {
    const garageMain = document.querySelector('main') as Element;
    garageMain.innerHTML = '';
    garageMain.insertAdjacentHTML(
      'beforeend',
      '<div class="cars-garage"></div>',
    );

    await this.drawCars(garageMain);
    this.addGarageHeader(garageMain);
    this.addPrevNextBtn(garageMain);

    const prevBtn = document.querySelector('.prev-garage') as Element;
    const nextBtn = document.querySelector('.next-garage') as Element;
    this.checkDisableBtn(prevBtn, nextBtn);
  };

  renderCarage() {
    this.drawGarage();
  }
}

export default Garage;
