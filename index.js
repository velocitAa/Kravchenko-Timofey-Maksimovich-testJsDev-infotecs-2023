const requestURL='https://dummyjson.com/products'
const section = document.querySelector('section');
let ul = document.createElement('ul');
ul.classList.add("products__list");
section.appendChild(ul);
let n=10;
let a;
let tooltipElem;
let request= new XMLHttpRequest();

// Создание всплывающих окон при наведение на title элементов списка

document.onmouseover = function(event) {
    let target = event.target;

    // если у нас есть подсказка...
    let tooltipHtml = target.dataset.tooltip;
    if (!tooltipHtml) return;

    // ...создадим элемент для подсказки

    tooltipElem = document.createElement('div');
    tooltipElem.className = 'tooltip';
    tooltipElem.innerHTML = tooltipHtml;
    document.body.append(tooltipElem);

    let coords = target.getBoundingClientRect();

    let left = coords.left + target.offsetWidth;
    if (left < 0) left = 0; // не заезжать за левый край окна

    let top = coords.top;

    tooltipElem.style.left = left + 'px';
    tooltipElem.style.top = top + 'px';
};

document.onmouseout = function(e) {

    if (tooltipElem) {
        tooltipElem.remove();
        tooltipElem = null;
    }

};

// Создание функции обработки данных с json в элементы списка с соответствующими значениями

function showProducts(jsonObj) {
    let array = jsonObj['products'];
    for (let i = 0; i < n; i++) {
        let li = document.createElement('li');
        li.classList.add("products__item");
        li.innerHTML=`<div data-tooltip=\  "  Название: ${array[i].title} <br> Бренд: ${array[i].brand} <br> Тип товара: ${array[i].category} <br> Описание: ${array[i].description} <br> Скидка на товар (в процентах): ${array[i].discountPercentage} <br> Цена ($): ${array[i].price} <br> Рейтинг (максимум 5): ${array[i].rating} <br> Количество товара: ${array[i].stock}\"> ${array[i].title}</div> `
        ul.appendChild(li);
    }

    // Добавление для продуктов возможности перетаскивания по списку

    let productsListElement = document.querySelector(`.products__list`);
    let productElements = productsListElement.querySelectorAll(`.products__item`);

    //...присваем всем элементам .products__item свойство draggable=true, то есть теперь мы можем перетаскивать их

    for (const task of productElements) {
        task.draggable = true;
    }

 //...при перетаскивании элемента присваиваем его классу дополнительное значение 'selected' и убираем при завершении перетаскивания

    productsListElement.addEventListener(`dragstart`, (evt) => {
        evt.target.classList.add(`selected`);
    });

    productsListElement.addEventListener(`dragend`, (evt) => {
        evt.target.classList.remove(`selected`);
    });

//...осуществляем логику перестановки элементов в зависимости от расположения курсора и перемещения активного элемента

    const getNextElement = (cursorPosition, currentElement) => {
        const currentElementCoord = currentElement.getBoundingClientRect();
        const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

        const nextElement = (cursorPosition < currentElementCenter) ?
            currentElement :
            currentElement.nextElementSibling;

        return nextElement;
    };

    productsListElement.addEventListener(`dragover`, (evt) => {
        evt.preventDefault();

        const activeElement = productsListElement.querySelector(`.selected`);
        const currentElement = evt.target;
        const isMoveable = activeElement !== currentElement &&
            currentElement.classList.contains(`products__item`);

        if (!isMoveable) {
            return;
        }

        const nextElement = getNextElement(evt.clientY, currentElement);

        if (
            nextElement &&
            activeElement === nextElement.previousElementSibling ||
            activeElement === nextElement
        ) {
            return;
        }

        productsListElement.insertBefore(activeElement, nextElement);
    });

}

//Получение данных с сервера и вызов функции showProducts() для обработки json-элементов

    request.open('GET', requestURL)
         request.onload = function () {
             if (request.status >= 400) {
                 console.error(request.response);
             } else {
                 let products = JSON.parse(request.response);
                 a=products;
                 console.log(products);
                 showProducts(products);
             }
         }

// Создание логики для выведения определенного количества n продуктов

let addNumber = document.getElementById('butt');
addNumber.addEventListener('click', getN);
function getN() {
    let getNum = document.getElementById('count_of_products').value;
    n=getNum;
   ul.innerHTML="";
   showProducts(a)
}

function byField(field) {
    return (a, b) => a[field] > b[field] ? 1 : -1;
}

function byField_down(field) {
    return (a, b) => a[field] < b[field] ? 1 : -1;
}

// Создание логики для кнопки сортировки по возрастанию цены

let sortByPrice_up = document.getElementById('product_price_up');
sortByPrice_up.addEventListener('click', sortUP);
function sortUP() {
    ul.innerHTML = ""
    let array = a['products'];
    array.sort(byField('price'));
    for (let i = 0; i < n; i++) {
        let li = document.createElement('li');
        li.classList.add("products__item")
        li.innerHTML = `<div data-tooltip=\  "  Название: ${array[i].title} <br> Бренд: ${array[i].brand} <br> Тип товара: ${array[i].category} <br> Описание: ${array[i].description} <br> Скидка на товар (в процентах): ${array[i].discountPercentage} <br> Цена ($): ${array[i].price} <br> Рейтинг (максимум 5): ${array[i].rating} <br> Количество товара: ${array[i].stock}\"> ${array[i].title}</div> `
        li.draggable = true;
        ul.appendChild(li);

    }
}

// Создание логики для кнопки сортировки по названию

let sortByName = document.getElementById('name_of_product');
sortByName.addEventListener('click', sortByName_);
function sortByName_() {
    ul.innerHTML = ""
    let array = a['products'];
    array.sort(byField('name'));
    for (let i = 0; i < n; i++) {
        let li = document.createElement('li');
        li.classList.add("products__item")
        li.innerHTML = `<div data-tooltip=\  "  Название: ${array[i].title} <br> Бренд: ${array[i].brand} <br> Тип товара: ${array[i].category} <br> Описание: ${array[i].description} <br> Скидка на товар (в процентах): ${array[i].discountPercentage} <br> Цена ($): ${array[i].price} <br> Рейтинг (максимум 5): ${array[i].rating} <br> Количество товара: ${array[i].stock}\"> ${array[i].title}</div> `
        li.draggable = true;
        ul.appendChild(li);

    }
}

// Создание логики для кнопки сортировки по убыванию цены

let sortByPrice_down = document.getElementById('product_price_down');
sortByPrice_down.addEventListener('click', sortDOWN);
function sortDOWN() {
    ul.innerHTML = ""
    let array = a['products'];
    array.sort(byField_down('price'));
    for (let i = 0; i < n; i++) {
        let li = document.createElement('li');
        li.classList.add("products__item")
        li.innerHTML = `<div data-tooltip=\  "  Название: ${array[i].title} <br> Бренд: ${array[i].brand} <br> Тип товара: ${array[i].category} <br> Описание: ${array[i].description} <br> Скидка на товар (в процентах): ${array[i].discountPercentage} <br> Цена ($): ${array[i].price} <br> Рейтинг (максимум 5): ${array[i].rating} <br> Количество товара: ${array[i].stock}\"> ${array[i].title}</div> `
        li.draggable = true;
        ul.appendChild(li);

    }
}

// Создание логики для кнопки сброса фильтров

let reloading = document.getElementById('reload');
reloading.addEventListener('click', reload_);
function reload_(){
    ul.innerHTML=""
    let array = a['products'];
    array.sort(byField('id'));
    for (let i = 0; i < n; i++) {
        let li = document.createElement('li');
        li.classList.add("products__item")
        li.innerHTML = `<div data-tooltip=\  "  Название: ${array[i].title} <br> Бренд: ${array[i].brand} <br> Тип товара: ${array[i].category} <br> Описание: ${array[i].description} <br> Скидка на товар (в процентах): ${array[i].discountPercentage} <br> Цена ($): ${array[i].price} <br> Рейтинг (максимум 5): ${array[i].rating} <br> Количество товара: ${array[i].stock}\"> ${array[i].title}</div> `
        li.draggable = true;
        ul.appendChild(li);

    }
}

// Проверка ошибки запроса обращения к http

    request.onerror = () => {
        console.log(request.response);
    }

    request.send();



