import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface ICard {
    title: string;
    price: number | null;
}

export abstract class BaseCard<T> extends Component<ICard & T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? `Бесценно` : `${value} синапсов`;
    }
}


