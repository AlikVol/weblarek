import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IModal {
  content: HTMLElement | null;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  private isOpen: boolean = false;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);

    this.closeButton.addEventListener('click', this.close.bind(this));
    this.contentElement.addEventListener('click', (event) => event.stopPropagation());
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  public isModalOpen(): boolean {
    return this.isOpen;
  }

  set content(value: HTMLElement | null) {
    if (value) {
      this.contentElement.replaceChildren(value);
    } else {
      this.contentElement.replaceChildren();
    }
  }

  close(): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.container.classList.remove('modal_active');
    this.content = null;
    this.events.emit('modal:close');
  }

  open(content: HTMLElement): void {
    this.isOpen = true;
    this.container.classList.add('modal_active');
    this.content = content;
    this.events.emit('modal:open');
  }

  render(data?: Partial<IModal>): HTMLElement {
    if (!data || !data.content) {
      return this.contentElement;
    }

    this.content = data.content;
    return this.contentElement;
  }
}