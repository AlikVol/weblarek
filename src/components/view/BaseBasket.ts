import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IBasket {
    items: HTMLElement[];
    total: number;
}

export class BaseBasket extends Component<IBasket> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.submitButton.addEventListener('click', () => {
            this.events.emit('basket:submit');
        });
    }

    set items(items: HTMLElement[]) {
        this.listElement.replaceChildren(...items);
        this.submitButton.disabled = items.length === 0;
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }
}    
