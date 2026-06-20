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
      this.payment = 'card';
    });

    this.buttonCash.addEventListener('click', () => {
      this.events.emit('order.payment:change', { payment: 'cash' });
      this.payment = 'cash';
    });

    this.addressInput.addEventListener('input', () => {
      this.events.emit('delivery:address:changed', {
        address: this.addressInput.value,
      });
    });
  }

  set payment(value: TPayment | null) {
    this.buttonCard.classList.remove('button_alt-active');
    this.buttonCash.classList.remove('button_alt-active');

    if (value === 'card') {
      this.buttonCard.classList.add('button_alt-active');
    } else if (value === 'cash') {
      this.buttonCash.classList.add('button_alt-active');
    }
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  
  render(data?: { address?: string; payment?: TPayment | null; errors?: string[] }): HTMLElement {
    if (data) {
      if (data.address !== undefined) this.address = data.address;
      if (data.payment !== undefined) this.payment = data.payment;
      
      
      if (data.errors !== undefined) {
        this.errors = data.errors;
      }
    }
    return this.container;
  }

  clear(): void {
    this.addressInput.value = '';
    this.payment = null;
    this.errors = []; 
  }
}