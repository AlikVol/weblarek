import { BaseForm } from './BaseForm';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { TPayment } from '../../types';

interface IOrderForm {
  address: string;
  payment: TPayment | null;
}

export class OrderForm extends BaseForm<IOrderForm> {
  protected buttonCard: HTMLButtonElement;
  protected buttonCash: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);
    this.buttonCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.buttonCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container); 

    this.buttonCard.addEventListener('click', () => {
      this.events.emit('order.payment:change', { payment: 'card' });
    });

    this.buttonCash.addEventListener('click', () => {
      this.events.emit('order.payment:change', { payment: 'cash' });
    });

    this.addressInput.addEventListener('input', () => { 
      this.events.emit('order.address:change', {
        address: this.addressInput.value, 
      });
    });
  }

  set payment(value: TPayment | null) {
    this.buttonCard.classList.toggle('button_alt-active', value === 'card');
    this.buttonCash.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}