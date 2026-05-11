import { IBuyer, IBuyerErrors, TPayment } from "../../types";

export class Buyer {
    private payment: TPayment | null = null;
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
    }

    getData(): IBuyer {
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