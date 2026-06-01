import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IForm {
    valid: boolean;
    errors: string;
}

export abstract class BaseForm<T> extends Component<IForm & T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            this.events.emit('${(this.container as HTMLFormElement).name}:submit');
        });       
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }
}