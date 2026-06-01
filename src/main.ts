import './scss/styles.scss';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/models/WebLarekApi';
import { EventEmitter } from './components/base/Events';
import { Products } from './components/models/products';
import { Basket } from './components/models/basket';
import { Buyer } from './components/models/buyer';
import { API_URL } from './utils/constants';
import { IProduct } from './types';

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


const appEvents = new EventEmitter();
const httpClient = new Api(API_URL);
const marketplaceApi = new WebLarekApi(httpClient);
const productStore = new Products();
const cartStore = new Basket();
const orderStore = new Buyer();
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
cartUI.items = [];
const orderUI = new OrderForm(appEvents, cloneTemplate(orderFormTpl) as HTMLFormElement);
const contactUI = new ContactsForm(cloneTemplate(contactsFormTpl) as HTMLFormElement, appEvents);
const successUI = new Success(appEvents, cloneTemplate(successTpl));
const previewCard = new CardPreview(appEvents, cloneTemplate(previewCardTpl), {
    onButtonClick: () => {
      appEvents.emit('product:action:trigger');
    }
});

// Загрузка данных о товарах
marketplaceApi.getProducts()
  .then(data => {
    productStore.setItems(data.items);
  })

  .catch(error => {
    console.error('Ошибка загрузки каталога:', error);
  });

// Вспомогательная функция: обновление интерфейса корзины
function refreshCartDisplay() {
  const items = cartStore.getItems();
  const cards = items.map((product, index) => {
    const card = new CardBasket(appEvents, cloneTemplate(basketCardTpl), {
      onDelete: () => cartStore.removeItem(product.id)
    });
    card.index = index + 1;
    card.name = product.title;
    card.cost = product.price;
    return card.render();
  });
  cartUI.items = cards;
  cartUI.total = cartStore.getTotal();
}

// Вспомогательная функция: обновление форм заказа
function refreshOrderForms() {
  const buyerData = orderStore.getBuyerData();
  const errors = orderStore.validate();

  orderUI.render({
    payment: buyerData.payment,
    address: buyerData.address,
    valid: !errors.payment && !errors.address,
  });

  contactUI.render({
    email: buyerData.email,
    phone: buyerData.phone,
    valid: !errors.email && !errors.phone,
  });
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
});

appEvents.on('product:selected', (selectedProduct: IProduct) => {
  productStore.setSelectedItem(selectedProduct);
});

appEvents.on('products:selected', () => {
  const selected = productStore.getSelectedItem();
  if (!selected) return;
  previewCard.render({
    title: selected.title,
    price: selected.price,
    description: selected.description,
    category: selected.category,
    image: selected.image,
    buttonText: 'В корзину',
    buttonLocked: false
  });
  appModal.render({ content: previewCard.render() });
});

appEvents.on('cart:updated', () => {
  appHeader.counter = cartStore.getCount();
  refreshCartDisplay();
});

appEvents.on('cart:open', () => {
  appModal.render({ content: cartUI.render() });
});

appEvents.on('order:updated', refreshOrderForms);

appEvents.on('checkout:initiate', () => {
  orderStore.clear();
  appModal.render({ content: orderUI.render() });
});

appEvents.on('product:action:trigger', () => {
  const selected = productStore.getSelectedItem();
  if (!selected) return;

  if (cartStore.hasItem(selected.id)) {
    cartStore.removeItem(selected.id);
  } else {
    cartStore.addItem(selected);
  }
  appModal.close();
});

appEvents.on('payment:method:selected', (data: { method: 'card' | 'cash' }) => {
  orderStore.setPayment(data.method);
});

appEvents.on('delivery:address:changed', (data: { address: string }) => {
  orderStore.setAddress(data.address);
});

appEvents.on('contact:email:updated', (data: { email: string }) => {
  orderStore.setEmail(data.email);
});

appEvents.on('contact:phone:updated', (data: { phone: string }) => {
  orderStore.setPhone(data.phone);
});

appEvents.on('contact:submit', () => {
  const orderData = {
    ...orderStore.getBuyerData(),
    total: cartStore.getTotal(),
    items: cartStore.getItems().map(item => item.id)
  };

  marketplaceApi.createOrder(orderData)
    .then(result => {
      cartStore.clear();
      orderStore.clear();
      successUI.total = result.total;
      appModal.render({ content: successUI.render() });
    })
    .catch(error => {
      console.error('Ошибка оформления заказа:', error);
      contactUI.errorMessages = ['Ошибка оформления заказа. Попробуйте позже.'];
    });
  refreshOrderForms();
});

const closeModal = () => appModal.close();
appEvents.on('success:close', closeModal);
appEvents.on('modal:close', closeModal);