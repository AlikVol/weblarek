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

        // Подписываемся на событие изменения корзины
        this.events.on('basket:changed', () => {
            this.updateButtonStateFromItems();
        });

        // Обработчик клика
        this.submitButton.addEventListener('click', () => {
            if (!this.submitButton.disabled) {
                this.events.emit('basket:order');
            }
        });

        // Инициализируем состояние кнопки на основе текущих данных
        this.updateButtonStateFromItems();
    }

    set items(items: HTMLElement[]) {
        this.listElement.replaceChildren(...items);
        // Обновляем состояние кнопки после обновления списка
        this.updateButtonStateFromItems();
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    // Метод для обновления состояния кнопки на основе количества элементов в списке
    private updateButtonStateFromItems() {
        const hasItems = this.listElement.children.length > 0;
        this.updateSubmitButtonState(hasItems);
    }

    // Публичный метод для обновления состояния кнопки
    updateSubmitButtonState(hasItems: boolean) {
        this.submitButton.disabled = !hasItems;
        if (hasItems) {
            this.submitButton.textContent = 'Оформить';
        } else {
            this.submitButton.textContent = 'Корзина пуста';
        }
    }
}