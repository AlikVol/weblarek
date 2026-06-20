import { BaseForm } from './BaseForm';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';


interface IContactsForm {
  email: string;
  phone: string;
}

export class ContactsForm extends BaseForm<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    // Подписываемся на ввод данных
    this.emailInput.addEventListener('input', () => {
      this.events.emit('contact:email:updated', { email: this.emailInput.value });
    });

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('contact:phone:updated', { phone: this.phoneInput.value });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  
  render(data?: { email?: string; phone?: string; errors?: string[] }): HTMLElement {
    if (data) {
      if (data.email !== undefined) this.email = data.email;
      if (data.phone !== undefined) this.phone = data.phone;
      if (data.errors !== undefined) {
        this.errors = data.errors; 
      }
    }
    return this.container;
  }

  clear(): void {
    this.emailInput.value = '';
    this.phoneInput.value = '';
    this.errors = []; 
  }
}