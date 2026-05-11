export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}


//способ оплаты 
export type TPayment = `online` | `cash`;

//товар
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

//покупатель
export interface IBuyer {
    payment: TPayment | null;    
    email: string;
    phone: string;
    address: string;
}


//ошибки валидации
export type IBuyerErrors = Partial<Record<keyof IBuyer, string>>;

//ответы сервера
export interface IProductResponse {
    total: number;
    items: IProduct[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}

// данные для отправки 
export interface IOrderRequest extends IBuyer {
    items: string[];
    total: number;
}
