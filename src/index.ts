import './style.scss';

import { Garage } from './garage/garage';
import { Winners } from './winners/winners';

const garage = new Garage();
const winners = new Winners();

const garageBtn = document.querySelector('.garage') as Element;
garageBtn.addEventListener('click', () => garage.renderCarage());

const winnersBtn = document.querySelector('.winners') as Element;
winnersBtn.addEventListener('click', () => winners.drawWinners());

garage.renderCarage();
