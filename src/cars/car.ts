import { Car as CarInterface } from './carInterface';

class Car {
  car: CarInterface;
  constructor(car: CarInterface) {
    this.car = car;
  }
}