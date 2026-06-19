import './scss/styles.scss';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/models/WebLarekApi';
import { EventEmitter } from './components/base/Events';
import { Products } from './components/models/products';
import { Basket } from './components/models/basket';
import { Buyer } from './components/models/buyer';
import { API_URL } from './utils/constants';
import { IProduct, TPayment } from './types';


// Импорты компонентов интерфейса
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { BaseBasket } from './components/view/BaseBasket';
import { CardBasket } from './components/view/CardBasket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { cloneTemplate } from './utils/utils';

function getImageUrl(filename: string): string {
    if (!filename) return '';
    const relativePath = '../images/'; 
    return new URL(`${relativePath}${filename}`, import.meta.url).href;
}

const appEvents = new EventEmitter();
const httpClient = new Api(API_URL);
const marketplaceApi = new WebLarekApi(httpClient);
const productStore = new Products(appEvents);
const cartStore = new Basket(appEvents);
const orderStore = new Buyer(appEvents);

const headerEl = document.querySelector('.header') as HTMLElement;
const galleryEl = document.querySelector('.gallery') as HTMLElement;
const modalEl = document.querySelector('#modal-container') as HTMLElement;

const appHeader = new Header(appEvents, headerEl);
const productGallery = new Gallery(galleryEl);
const appModal = new Modal(appEvents, modalEl);

const catalogCardTpl = document.querySelector('#card-catalog') as HTMLTemplateElement;
const previewCardTpl = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketCardTpl = document.querySelector('#card-basket') as HTMLTemplateElement;
const cartTpl = document.querySelector('#basket') as HTMLTemplateElement;
const orderFormTpl = document.querySelector('#order') as HTMLTemplateElement;
const contactsFormTpl = document.querySelector('#contacts') as HTMLTemplateElement;
const successTpl = document.querySelector('#success') as HTMLTemplateElement;
const cartUI = new BaseBasket(appEvents, cloneTemplate(cartTpl));
const orderUI = new OrderForm(appEvents, cloneTemplate(orderFormTpl) as HTMLFormElement);
const contactUI = new ContactsForm(cloneTemplate(contactsFormTpl) as HTMLFormElement, appEvents);
const successUI = new Success(appEvents, cloneTemplate(successTpl));

const previewCard = new CardPreview(appEvents, cloneTemplate(previewCardTpl), {
    onButtonClick: () => {
        appEvents.emit('product:action:trigger');
    }
});

function updateOrderState() {
    const errors = orderStore.validate();
    orderUI.renderErrors(errors);
    contactUI.renderErrors(errors);
}


appEvents.on('delivery:address:changed', (data: { address: string }) => {
    orderStore.setAddress(data.address);
    updateOrderState();
});

appEvents.on('order.payment:change', (data: { payment: TPayment }) => {
    orderStore.setPayment(data.payment);
    orderUI.payment = data.payment;
    updateOrderState();
});

appEvents.on('basket:order', () => {
    if (cartStore.getCount() === 0) {
        alert('Корзина пуста!');
        return;
    }
    appModal.open(orderUI.render());
    updateOrderState();
});

appEvents.on('order:submit', () => {
    appModal.open(contactUI.render());
    updateOrderState();
});

appEvents.on('contact:email:updated', (data: { email: string }) => {
    orderStore.setEmail(data.email);
    updateOrderState();
});

appEvents.on('contact:phone:updated', (data: { phone: string }) => {
    orderStore.setPhone(data.phone);
    updateOrderState();
});

appEvents.on('contacts:submit', (formData: any) => {
    const orderData = {
        ...formData,
        ...orderStore.getBuyerData(),
        total: cartStore.getTotal(),
        items: cartStore.getItems().map(item => item.id)
    };
    console.log('Данные для отправки на сервер:', orderData);

    marketplaceApi.createOrder(orderData)
        .then(result => {
            console.log('Заказ успешно создан:', result);
            cartStore.clear();
            orderStore.clear();
            successUI.total = result.total;
            appModal.render({ content: successUI.render() });
        })
        .catch(error => {
            console.error('Ошибка оформления заказа:', error);
            contactUI.renderErrors({
                email: 'Произошла ошибка при оформлении заказа. Попробуйте позже.',
                phone: ''
            });
        });
});

const closeModal = () => {
    if (!appModal.isModalOpen()) {
        return;
    }

   
    orderUI.clearErrors();
    contactUI.clearErrors();

    appEvents.off('success:close', closeModal);
    appEvents.off('modal:close', closeModal);

    appModal.close();
};

// Подписываемся на события закрытия
appEvents.on('success:close', closeModal);
appEvents.on('modal:close', closeModal);

// Переподписываемся на события при открытии модального окна
appEvents.on('modal:open', () => {
    appEvents.on('success:close', closeModal);
    appEvents.on('modal:close', closeModal);
    console.log('Подписались на события закрытия модального окна');
});

function refreshCartDisplay() {
    const items = cartStore.getItems();
    const cards = items.map((product, index) => {
        const card = new CardBasket(appEvents, cloneTemplate(basketCardTpl), {
            onDelete: () => cartStore.removeItem(product.id)
        });
        card.index = index + 1;
        card.name = product.title;
        card.price = product.price;
        return card.render();
    });

    cartUI.items = cards;
    cartUI.total = cartStore.getTotal();
    cartUI.updateSubmitButtonState(items.length > 0);
}

// Обработчики событий от моделей
appEvents.on('products:loaded', () => {
    const products = productStore.getItems();
    const productCards = products.map(product => {
        const card = new CardCatalog(appEvents, cloneTemplate(catalogCardTpl), {
            onClick: () => appEvents.emit('product:selected', product)
        });
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = product.image;
        return card.render();
    });
    productGallery.catalog = productCards;

    refreshCartDisplay();
    appHeader.counter = cartStore.getCount();
});

appEvents.on('product:selected', (selectedProduct: IProduct) => {
    productStore.setSelectedItem(selectedProduct);

    const isInCart = cartStore.hasItem(selectedProduct.id);
    const buttonText = isInCart ? 'Удалить из корзины' : 'В корзину';

     previewCard.render({
        title: selectedProduct.title,
        price: selectedProduct.price,
        description: selectedProduct.description || 'Описание отсутствует',
        category: selectedProduct.category || 'Категория не указана',
        image: getImageUrl(selectedProduct.image),
        buttonText: buttonText,
        buttonLocked: false
    });

    appModal.open(previewCard.getContainer());
});

appEvents.on('product:action:trigger', () => {
    const selected = productStore.getSelectedItem();
    if (!selected) return;

    if (cartStore.hasItem(selected.id)) {
        cartStore.removeItem(selected.id);
    } else {
        cartStore.addItem(selected);
    }

    appHeader.counter = cartStore.getCount();
    refreshCartDisplay();

    const isNowInCart = cartStore.hasItem(selected.id);
    const newButtonText = isNowInCart ? 'Удалить из корзины' : 'В корзину';

    previewCard.render({
        title: selected.title,
        price: selected.price,
        description: selected.description || 'Описание отсутствует',
        category: selected.category || 'Категория не указана',
        image: getImageUrl(selected.image),
        buttonText: newButtonText,
        buttonLocked: false
    });
});

// Обработчик изменения корзины
appEvents.on('basket:changed', () => {
    appHeader.counter = cartStore.getCount();
    refreshCartDisplay(); 
});

appEvents.on('cart:open', () => {
    appModal.open(cartUI.render());
});

appEvents.on('checkout:initiate', () => {
    orderStore.clear();
    appModal.open(orderUI.render());
    updateOrderState(); 
});

// Загрузка данных о товарах
marketplaceApi.getProducts()
    .then(data => {
        console.log('>>> ОТВЕТ ОТ СЕРВЕРА:', data);
        productStore.setItems(data.items);
        appEvents.emit('products:loaded');
    })
    .catch(error => {
        console.error('Ошибка загрузки каталога:', error);
    });

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('Приложение инициализировано');
});

// Дополнительная обработка ошибок API
appEvents.on('api:error', (error: Error) => {
    console.error('Критическая ошибка API:', error);
    alert('Произошла ошибка при взаимодействии с сервером. Попробуйте позже.');
});

// Обработка сетевых ошибок
appEvents.on('network:error', () => {
    alert('Нет соединения с интернетом. Проверьте подключение и попробуйте снова.');
});

// Очистка ресурсов при закрытии страницы
window.addEventListener('beforeunload', () => {
    appEvents.offAll();
    console.log('Ресурсы приложения очищены');
});

