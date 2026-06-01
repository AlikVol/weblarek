import { BaseCard, ICard } from './BaseCard';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';

interface ICardPreview extends ICard {
    description: string;
    image: string;
    category: string;
    buttonText: string;
    buttonLocked: boolean;
}

interface ICardPreviewActions {
    onButtonClick?: () => void;
}

export class CardPreview extends BaseCard<ICardPreview> {
    protected categoryElement: HTMLElement;
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected imageElement: HTMLImageElement;

    constructor(events: IEvents, container: HTMLElement, actions?: ICardPreviewActions) {
        super(events, container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        if (actions?.onButtonClick) {
            this.buttonElement.addEventListener('click', actions.onButtonClick);
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

    set description(value: string) {
        this.textElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonLocked(value: boolean) {
        this.buttonElement.disabled = value;
    }

    set image(value: string) {
        this.setImage(this.imageElement!, `${CDN_URL}${value}`);
    }
}