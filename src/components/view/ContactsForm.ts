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
  private errorContainer: HTMLElement | null = null; 

  constructor(container: HTMLFormElement, events: IEvents) {
    super(events, container);
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    this.errorContainer = document.createElement('div');
    this.errorContainer.className = 'form-errors';
    this.container.insertBefore(this.errorContainer, this.container.firstChild);

    this.emailInput.addEventListener('input', () => {
      this.events.emit('contacts.email:change', {
        email: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('contacts.phone:change', {
        phone: this.phoneInput.value,
      });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}