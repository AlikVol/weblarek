import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Products {
    private items: IProduct[] = [];
    private selectedItem: IProduct | null = null;

    constructor(protected events: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('products:loaded');
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setSelectedItem(item: IProduct): void {
        this.selectedItem = item;
        this.events.emit('products:selected');
    }

    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }
}