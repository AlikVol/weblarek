import './scss/styles.scss';
import { Basket } from './components/models/basket';
import { Buyer } from './components/models/buyer';
import { Products } from './components/models/products';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/models/WebLarekApi';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const basket = new Basket();
const buyer = new Buyer();
const products = new Products();
const api = new Api(API_URL)
const webLarekApi = new WebLarekApi(api);


//Products
console.log('=== PRODUCTS ===');

products.setItems(apiProducts.items);
console.log('Список товаров:', products.getItems());

const first = products.getItems()[0];
console.log('Первый товар:', first);

if (first) {
  products.setSelectedItem(first);
}
console.log('Выбранный товар:', products.getSelectedItem());


//Basket
console.log('=== BASKET ===');
basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);

console.log('Товары, находящиеся в корзине:', basket.getItems());
console.log('Количество товаров в корзине:', basket.getCount());
console.log('Общая стоимость товаров в корзине:', basket.getTotal());

basket.removeItem(apiProducts.items[0].id);
console.log('Удален товар из корзины', basket.getItems());

basket.clear();
console.log('Корзина очищена', basket.getItems())


//Buyer
console.log('=== BUYER ===');

buyer.setData({ email: 'test@test.com'});
console.log('Данные покупателя:' , buyer.getData);
console.log('Проверка данных покупателя:' , buyer.validate);

buyer.setData({
    payment: 'online',
    phone: '+70123456789',
    address: 'Симферополь'
});
console.log('Проверка обновленных данных:' , buyer.validate());

buyer.clear();
console.log('Проверка после очистки:' , buyer.getData);

webLarekApi.getProducts()
  .then(data => {
    console.log('Данные API:', data);
    products.setItems(data.items);
    console.log('Продукт из модели:', products.getItems());
  })
  .catch(err => {
    console.error('Ошибка API:', err);
  });