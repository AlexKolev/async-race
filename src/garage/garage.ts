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

  private carItemClick = (e: Event) => {
    let target = e.target as Element;
    // console.log(target);
    target = target.parentNode as Element;
    // console.log(target);
    while (!target.classList.contains('car-garage-item')) {
      target = target.parentNode as Element;
    }
    // console.log(target);
    const idCar = +(target.getAttribute('data-id') as string);
    this.carForUpdate = this.currentCar[idCar - 1];
    const carUpdName = document.querySelector('.car-update') as HTMLInputElement;
    const carUpdColor = document.querySelector('.car-update-color') as HTMLInputElement;
    carUpdName.value = this.carForUpdate.name;
    carUpdColor.value = this.carForUpdate.color;

    this.inputNameUpd = carUpdName.value;
    this.inputColorUpd = carUpdColor.value;

    // this.updateCar(this.currentCar[idCar - 1], idCar);
  };

  drawCars = async (garageMain: Element) => {
    await this.getCars(this.pageNum, this.limit);
    const carsGarage = garageMain.querySelector('.cars-garage') as Element;
    carsGarage.innerHTML = '';
    for (let i = 0; i < this.currentCar.length; i += 1) {
      carsGarage.insertAdjacentHTML(
        'beforeend',
        `<div class="car-garage-item" data-id="${this.currentCar[i].id}">
          <p>${this.currentCar[i].name}</p>
          <div>${carImage(this.currentCar[i].color)}</div>
        </div>`,
      );
    }
    const carItems = document.querySelectorAll('.cars-garage');
    carItems.forEach((carItem) => {
      carItem.addEventListener('click', this.carItemClick);
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
      `<h3 class="totalcars-garage">Cars in Garage ${this.totalCars}</h3>
      <h4 class="page-num-garage">Page ${this.pageNum}</h4>
      <div class = "garage-header">
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
