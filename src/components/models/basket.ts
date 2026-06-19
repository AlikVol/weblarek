import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Basket {
    private items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    private emitChange(): void {
        this.events.emit('basket:changed');
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this.items.push(item);
            this.emitChange();
        }
    }

    removeItem(id: string): void {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== id);
        if (initialLength !== this.items.length) {
            this.emitChange();
        }
    }

    clear(): void {
        if (this.items.length > 0) {
            this.items = [];
            this.emitChange();
        }
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => {
            return sum + (item.price ?? 0);
        }, 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}