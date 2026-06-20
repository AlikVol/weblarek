import { IBuyer, IBuyerErrors, TPayment } from "../../types";
import { IEvents } from '../base/Events';

export class Buyer {
    private payment: TPayment | null = null;
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    constructor(protected events: IEvents) {}

    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.events.emit('order:changed');
    }

    setAddress(address: string): void {
        this.address = address;
        this.events.emit('order:changed');
    }

    setEmail(email: string): void {
        this.email = email;
        this.events.emit('order:changed');
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit('order:changed');
    }

    getBuyerData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clear(): void {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
        this.events.emit('order:changed');
    }

    validate(): IBuyerErrors {
        const errors: IBuyerErrors = {};

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.address.trim()) {
            errors.address = 'Не указан адрес доставки';
        }
        if (!this.email.trim()) {
            errors.email = 'Не указан email';
        }
        if (!this.phone.trim()) {
            errors.phone = 'Не указан телефон';
        }

         return errors;
    }
}