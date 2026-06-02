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

    set category(value: string) {
        this.categoryElement.textContent = value;
        Object.values(categoryMap).forEach(className => {   
            this.categoryElement.classList.remove(className);
        });
        const categoryClass = categoryMap[value as keyof typeof categoryMap];
        if (categoryClass) {
            this.categoryElement.classList.add(categoryClass);
        }
    }
    
    set image(value: string) {
        this.setImage(this.imageElement!, `${CDN_URL}${value}`); 
    }
}   