import { IApi, IProductResponse, IOrderRequest, IOrderResponse } from "../../types/index";

export class WebLarekApi {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }
    
    getProducts(): Promise<IProductResponse> {
        return this.api.get<IProductResponse>('/product/');
    }
    
    createOrder(data: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', data);
}
}