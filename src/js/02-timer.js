// Імпорт flatpickr і notiflix
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from 'notiflix';

// Запис констант на елемент введеня дати, кнопку Start, на лічильники день, година, хвилина і секунда
const rest = {
    inputEl: document.querySelector('#datetime-picker'),
    btnStart: document.querySelector('[data-start]'),
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
};

// Запис змінних для лічильника часу і зчитування дати з елементу введеня дати і порівнянням з поточною
let timerId = null;
let timeData = null;

// Аргумент функції dataInput, що визначає основні характеристики чисел часу: формат часу 24 години, запис поточного часу у new Date(), крок хвилинного введеня
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,

    // Налаштування flatpickr, яке при розгортанні календаря зупиняє таймер та скидає його
    onOpen() {
        clearInterval(timerId)
        rest.days.textContent = '00';
        rest.hours.textContent = '00';
        rest.minutes.textContent = '00';
        rest.seconds.textContent = '00';
    },
    
    // Налаштування flatpickr, яке дозволяє запустити таймер кнопкою btnStart після згортання календаря при даті в майбутньому, або інформуванні о не коретній даті з минулого
    onClose(selectedDates) {
        timeData = selectedDates[0].getTime();

        //  Розголуження перевірки дати відносно поточної
        if (timeData < new Date()) {
            Notiflix.Notify.failure('Please choose a date in the future');
            rest.btnStart.setAttribute('disabled', true);
            return;
        };
        
        // Зняття блокування кнопки при валідному значенні часу для роботи таймеру
        rest.btnStart.removeAttribute('disabled');
    },
};

// Функція, що за допомоги бази flatpickr створює інтерфейс календаря для вибору дати
const dataInput = flatpickr(rest.inputEl, options);

// Слухач кнопки btnStart, який до вибору дати в маймутньому робить кнопку не активною
rest.btnStart.addEventListener('click', startButton);
rest.btnStart.setAttribute('disabled', true);

// Функція розрахунку часу для таймате, як віднімання від валідної дати календаря - поточної
function startButton() {
    timerId = setInterval(() => {
        const deltaTime = timeData - new Date().getTime();

        // При не валідному значенні результату відніманні - зупиняє функцію
        if (deltaTime <= 0) {
            clearInterval(timerId);
            return;
        };

        // Перетворення розрахованого часу до синаксису, що створює функція convertMs
        const time = convertMs(deltaTime);
        updateClockInfo(time);
    }, 1000);

    // Блокування кнопки при роботі таймеру
    rest.btnStart.setAttribute('disabled', true);
};

// Функція, що замінює значення таймена з HTML коду на фактичні розраховані
function updateClockInfo({ days, hours, minutes, seconds }) {
    rest.days.textContent = `${days}`;
    rest.hours.textContent = `${hours}`;
    rest.minutes.textContent = `${minutes}`;
    rest.seconds.textContent = `${seconds}`;
};

// Функція для підрахунку значень, де ms - різниця між кінцевою і поточною датою в мілісекундах.
function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = addLeadingZero(Math.floor(ms / day));
    const hours = addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
    const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));
    return { days, hours, minutes, seconds };
};

// Функція, що додає 0, якщо в числі менше двох символів
function addLeadingZero(value) {
    return String(value).padStart(2, '0');
};