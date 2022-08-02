import { CarsWinner } from '../cars/carInterface';
import { BASE_URL, ADD_PATH } from '../consts';
import { clearMainSection } from '../utils';

export class Winners {
  carsWinners: CarsWinner[];

  pageNum: number;

  limit: number;

  totalCars: string;

  constructor() {
    this.carsWinners = [];
    this.pageNum = 1;
    this.limit = 10;
    this.totalCars = '';
  }

  getCarsWinners = async (page: number, limit: number) => {
    try {
      const response: Response = await fetch(`${BASE_URL}${ADD_PATH.winners}?_page=${page}&_limit=${limit}`);
      console.log(response.status);
      this.totalCars = response.headers.get('X-Total-Count') as string;
      this.carsWinners = await response.json();
      // return data;
    } catch (err) {
      // перехватит любую ошибку в блоке try: и в fetch, и в response.json
      console.log((err as Error).message);
      // return {};
    }
  };

  drawCarsWinners = async () => {
    await this.getCarsWinners(this.pageNum, this.limit);
    console.log(this.totalCars);
    console.log(this.carsWinners);
  };

  drawWinners() {
    clearMainSection();
    this.drawCarsWinners();
  }
}

export default Winners;
