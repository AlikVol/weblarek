import { BaseCard, ICard } from './BaseCard';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface ICardBasket extends ICard {
    index: number;
    name: string;
    cost: number | null;
}

interface ICardBasketActions {
    onDelete?: () => void;
}

export class CardBasket extends BaseCard<ICardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;
    protected nameElement: HTMLElement;
    protected costElement: HTMLElement;

    constructor(events: IEvents, container: HTMLElement, actions?: ICardBasketActions) {
        super(events, container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        this.nameElement = ensureElement<HTMLElement>('.basket__item-name', this.container);
        this.costElement = ensureElement<HTMLElement>('.basket__item-cost', this.container);
        if (actions?.onDelete) {
            this.deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                actions.onDelete!();
            });
        }
    }
    
    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    set name(value: string) {
    this.nameElement.textContent = value;
    }

    set cost(value: number | null) {
    if (value === null) {
      this.costElement.textContent = '—';
    } else {
      this.costElement.textContent = `${value} ₽`;
    }
  }
}
