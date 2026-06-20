import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IForm {
    valid: boolean;
    errors: string[];
}

export abstract class BaseForm<T> extends Component<IForm & T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    
    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.valid = false;

        this.container.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(this.container as HTMLFormElement);
        const data = Object.fromEntries(formData.entries()) as T & IForm;
        this.events.emit(`${(this.container as HTMLFormElement).name}:submit`, data);
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string[]) {
        this.errorsElement.textContent = value.filter(Boolean).join(', ');
        this.valid = value.length === 0;
    }
}