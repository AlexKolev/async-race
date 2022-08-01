export interface Car {
  name: string;
  color: string;
  id: number;
}

export interface CarsWinner extends Car {
  time: number;
}
