import { BaseCard, ICard } from './BaseCard';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface ICardPreview extends ICard {
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
    private categoryElement: HTMLElement;
    private textElement: HTMLElement;
    private buttonElement: HTMLButtonElement;
    private imageElement: HTMLImageElement;

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

    getContainer(): HTMLElement {
        return this.container;
    }

    render(data: ICardPreview): HTMLElement {
        this.title = data.title;
        this.price = data.price;
        this.categoryElement.textContent = data.category || 'Категория не указана';
        this.textElement.textContent = data.description || 'Описание отсутствует';
        this.imageElement.src = data.image || '';
        this.imageElement.alt = data.title || 'Товар';
        this.buttonElement.textContent = data.buttonText;
        this.buttonElement.disabled = data.buttonLocked;

        return this.container;
    }
}