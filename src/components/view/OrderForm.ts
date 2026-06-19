import { BaseForm } from './BaseForm';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { TPayment, IBuyerErrors } from '../../types';

interface IOrderForm {
  address: string;
  payment: TPayment | null;
}

export class OrderForm extends BaseForm<IOrderForm> {
  protected buttonCard: HTMLButtonElement;
  protected buttonCash: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  protected nextButton: HTMLButtonElement | null = null;
  protected errorContainer: HTMLElement | null = null;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);

    this.buttonCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.buttonCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    try {
      this.nextButton = ensureElement<HTMLButtonElement>('.order__button', this.container);
    } catch (error) {
      console.warn('Кнопка "Далее" не найдена в форме заказа.');
    }

    try {
      this.errorContainer = ensureElement<HTMLElement>('.form__errors', this.container);
    } catch (error) {
      console.warn('Контейнер для ошибок (.form__errors) не найден в форме заказа.');
    }

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit('order:submit');
    });

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

  set isValid(value: boolean) {
    if (!this.nextButton) return;
    const isCurrentlyDisabled = this.nextButton.disabled;
    const isNewStateInvalid = !value;

    if (isCurrentlyDisabled === isNewStateInvalid) {
      return; 
    }

    this.nextButton.disabled = !value;

    if (value) {
      this.nextButton.textContent = 'Далее';
      this.nextButton.classList.remove('btn-disabled');
    } else {
      this.updateButtonText(value);
      this.nextButton.classList.add('btn-disabled');
    }
  }

  get isValid(): boolean {
    return this.nextButton ? !this.nextButton.disabled : false;
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

  renderErrors(errors: IBuyerErrors): void {
    this.clearErrors();
    const errorMessages: string[] = [];

    if (errors.address) {
      errorMessages.push(errors.address);
    }
    if (errors.payment) {
      errorMessages.push(errors.payment);
    }
    if (errorMessages.length > 0 && this.errorContainer) {
      (this.errorContainer as HTMLElement).textContent = errorMessages.join(' | ');
      (this.errorContainer as HTMLElement).style.display = 'block';
    }

    const hasErrors = errorMessages.length > 0;
    this.isValid = !hasErrors;
  }

  clearErrors(): void {
    if (this.errorContainer) {
      (this.errorContainer as HTMLElement).textContent = '';
      (this.errorContainer as HTMLElement).style.display = 'none';
    }
  }

  private updateButtonText(isValid: boolean): void {
    if (!this.nextButton) return;

    if (isValid) {
      this.nextButton.textContent = 'Далее';
    } 
  }

  clear(): void {
    this.addressInput.value = '';
    this.payment = null;
    this.clearErrors(); 
  }
}