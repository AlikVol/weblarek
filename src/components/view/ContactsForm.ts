import { BaseForm } from './BaseForm';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IBuyerErrors } from '../../types';

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

  
    try {
      this.errorContainer = ensureElement<HTMLElement>('.form__errors', this.container);
    } catch (error) {
      console.warn('Контейнер для ошибок (.form__errors) не найден в форме контактов.');
    }

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

  
  renderErrors(errors: IBuyerErrors): void {
    
    this.clearErrors();

    
    const errorMessages: string[] = [];

    if (errors.email) {
      errorMessages.push(errors.email);
    }
    if (errors.phone) {
      errorMessages.push(errors.phone);
    }

    
    if (errorMessages.length > 0 && this.errorContainer) {
      (this.errorContainer as HTMLElement).textContent = errorMessages.join(' | ');
      (this.errorContainer as HTMLElement).style.display = 'block';
    }

    
    const hasErrors = errorMessages.length > 0;
    this.valid = !hasErrors;
  }

  
  clearErrors(): void {
    if (this.errorContainer) {
      (this.errorContainer as HTMLElement).textContent = '';
      (this.errorContainer as HTMLElement).style.display = 'none';
    }
  }

  clear(): void {
    this.emailInput.value = '';
    this.phoneInput.value = '';
    this.clearErrors(); 
  }
}