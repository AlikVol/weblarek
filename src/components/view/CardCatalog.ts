import { BaseCard, ICard } from './BaseCard';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';

interface ICardCatalog {
    onClick?: () => void;
}

export class CardCatalog extends BaseCard<ICard> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    
    constructor(events: IEvents, container: HTMLElement, actions?: ICardCatalog) {
        super(events, container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set category(value: keyof typeof categoryMap) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = 'card__category';
        const categoryModifier = categoryMap[value];
        if (categoryModifier) {
            this.categoryElement.classList.add(categoryModifier);
        }
    }
    
    set image(value: string) {
        this.setImage(this.imageElement!, `${CDN_URL}${value}`); 
    }
}   