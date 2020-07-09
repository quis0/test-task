const cartButton = document.querySelector('.header__cart');
const closeButton = document.querySelector('.cart__back');
const deleteItemButtons = document.querySelectorAll('.cart__delete-item');
const deleteAllButton = document.querySelector('.cart__delete-all');
const buyButtons = document.querySelectorAll('.card__button');
const cartContainer = document.querySelector('.cart__items')
const headerCartTotal = document.querySelector('.header__cart-total');
const cartTotalPrice = document.querySelector('.cart__total-price');
const cardTimers = document.querySelectorAll('.card__timer');
const closePopupButton = document.querySelector('.popup__close');

function openCart() {
  const cart = document.querySelector('.cart');
  const layer = document.querySelector('.layer');
  cart.classList.remove('cart_state_disabled');
  cart.classList.add('cart_state_active');
  layer.classList.remove('layer_state_off');
}

function closeCart() {
  const cart = document.querySelector('.cart');
  const layer = document.querySelector('.layer');
  cart.classList.add('cart_state_disabled');
  cart.classList.remove('cart_state_active');
  layer.classList.add('layer_state_off');
}

function closePopup(event) {
  event.target.parentNode.classList.remove('popup_is-opened');
}

cartButton.addEventListener('click', openCart);
closeButton.addEventListener('click', closeCart);
closePopupButton.addEventListener('click', closePopup);

function removeCartItem(event) {
  const price = event.target.parentNode.querySelector('.cart__item-price').textContent.match(/\d+/g).join('');
  const currentCartPrice = cartTotalPrice.textContent.match(/\d+(\.)?\d/g);

  cartTotalPrice.textContent = currentCartPrice ? (+currentCartPrice.join('.')) - price + ' руб.' : '0 руб.';

  headerCartTotal.textContent = cartTotalPrice.textContent;
  event.target.closest('.cart__item').remove();
}

for (let i = 0, len = deleteItemButtons.length; i < len; i++) {
  deleteItemButtons[i].addEventListener('click', removeCartItem);
}

deleteAllButton.addEventListener('click', function () {
  const cartItems = document.querySelectorAll('.cart__item');
  for (let i = 0, len = cartItems.length; i < len; i++) {
    cartItems[i].remove();
  }
  window.localStorage.removeItem('1');
  window.localStorage.removeItem('2');
  document.querySelector('.cart__total-price').textContent = '0 руб.';
  document.querySelector('.header__cart-total').textContent = '0 руб.';

})

function addToLocalStorage() {
  const card = event.target.parentNode.parentNode;
  let amount = window.localStorage.getItem(card.dataset.id);

  if (!amount) {
    window.localStorage.setItem(card.dataset.id, '1');
  } else {
    amount = +amount + 1;
    window.localStorage.setItem(card.dataset.id, amount);
  }
}

function removeFromLocalStorage() {
  const card = event.target.parentNode;
  let amount = window.localStorage.getItem(card.dataset.id);

  if (amount === '1') {
    window.localStorage.removeItem(card.dataset.id);
  } else {
    amount = +amount - 1;
    window.localStorage.setItem(card.dataset.id, amount);
  }
}

function addToCart(event, parent) {

  const card = event ? event.target.parentNode.parentNode : parent;
  const oldPrice = card.querySelector('.card__old-price');

  const container = document.createElement('div');
  const image = document.createElement('img');
  const block = document.createElement('div');
  const itemText = document.createElement('p');
  const itemPrice = document.createElement('p');
  const deleteButton = document.createElement('button');

  container.dataset.id = card.dataset.id;

  container.classList.add('cart__item');
  block.classList.add('cart__block');

  image.classList.add('cart__image');
  image.src = card.dataset.imageSrc;

  itemText.classList.add('cart__item-text');
  itemText.textContent = card.querySelector('.card__title').textContent;

  itemPrice.classList.add('cart__item-price');
  itemPrice.textContent = card.querySelector('.card__price').textContent;
  if (oldPrice) itemPrice.dataset.oldPrice = oldPrice.textContent;
  const price = +itemPrice.textContent.match(/\d+/g).join('');

  deleteButton.classList.add('cart__delete-item');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', removeCartItem);
  deleteButton.addEventListener('click', removeFromLocalStorage);

  block.appendChild(itemText);
  block.appendChild(itemPrice);
  block.appendChild(deleteButton);


  container.appendChild(image);
  container.appendChild(block);


  const currentCartPrice = cartTotalPrice.textContent.match(/\d+(\.)?\d/g);

  cartTotalPrice.textContent = currentCartPrice ? (+currentCartPrice.join('.')) + price + ' руб.' : price + ' руб.';

  headerCartTotal.textContent = cartTotalPrice.textContent;

  cartContainer.appendChild(container);
}

for (let i = 0, len = buyButtons.length; i < len; i++) {
  buyButtons[i].addEventListener('click', addToCart);
  buyButtons[i].addEventListener('click', addToLocalStorage);
}

headerCartTotal.textContent = cartTotalPrice.textContent;

function changePrices() {
  const cardOldPrices = document.querySelectorAll('.card__old-price');
  const currentPrices = document.querySelectorAll('.card__price');
  const cartItems = document.querySelectorAll('.cart__item');

  for (let i = 0, len = cardOldPrices.length; i < len; i++) {
    const span = document.createElement('span');
    span.classList.add('card__span');
    span.textContent = ' руб.';

    currentPrices[i].textContent = cardOldPrices[i].textContent.match(/\d+/g).join('');
    currentPrices[i].appendChild(span);
    cardOldPrices[i].remove();
  }

  cartTotalPrice.textContent = '';

  for (let i = 0, len = cartItems.length; i < len; i++) {
    const price = cartItems[i].querySelector('.cart__item-price')
    price.textContent = price.dataset.oldPrice + ' ';
    cartTotalPrice.textContent = +cartTotalPrice.textContent + parseInt(price.dataset.oldPrice.match(/\d+/g).join(''));
  }

  if (cartItems.length > 0) {
    cartTotalPrice.textContent += ' руб.';
    headerCartTotal.textContent = cartTotalPrice.textContent;
  } else {
    headerCartTotal.textContent = '0 руб.';
  }

}

function startTimer(finishDate) {
  const popup = document.querySelector('.popup');
  let localStorage = window.localStorage;
  let currentDate = new Date();

  let seconds = Math.round((finishDate - currentDate) / 1000);
  if (seconds <= 0) {
    for (let i = 0, len = cardTimers.length; i < len; i++) {
      cardTimers[i].textContent = 'Offer is no longer available';
    }
    changePrices();
    return;
  }

  localStorage.setItem('timerEnd', finishDate);

  let timerId = setInterval(function () {
    let seconds = Math.round((finishDate - new Date()) / 1000);
    let minutes = Math.floor(seconds / 60);
    for (let i = 0, len = cardTimers.length; i < len; i++) {
      if (seconds % 60 < 10) {
        cardTimers[i].textContent = 'Offer valid: ' + minutes + ":0" + (seconds % 60);
      } else {
        cardTimers[i].textContent = 'Offer valid: ' + minutes + ":" + (seconds % 60);
      }
    }

    if (seconds <= 0) {
      for (let i = 0, len = cardTimers.length; i < len; i++) {
        cardTimers[i].textContent = 'Offer is no longer available';
      }
      popup.classList.add('popup_is-opened');
      clearInterval(timerId);
      changePrices();
    }
  }, 1000);
}

document.addEventListener('DOMContentLoaded', function () {
  let savedTime = parseInt(window.localStorage.getItem('timerEnd'));

  if (savedTime) {
    startTimer(savedTime);
  } else {
    let currentTime = new Date();
    let timerEnd = currentTime.setMinutes(currentTime.getMinutes() + 15);
    window.localStorage.setItem('timerEnd', timerEnd);
    startTimer(timerEnd);
  }
});

function renderCart() {
  const amountOfFirstCard = +window.localStorage.getItem('1');
  const amountOfSecondCard = +window.localStorage.getItem('2');
  const cards = document.querySelectorAll('.card');

  for (let i = 0; i < amountOfFirstCard; i++) {
    addToCart(null, cards[0]);
  }

  for (let i = 0; i < amountOfSecondCard; i++) {
    addToCart(null, cards[1]);
  }

}

renderCart();
