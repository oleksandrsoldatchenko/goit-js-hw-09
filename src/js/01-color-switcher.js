// Створення змінних для подальшій роботи з кнопками
const btnStart = document.querySelector('[data-start]');
const btnStop = document.querySelector('[data-stop]');

// Відстеження подій кліку на кнопки
btnStart.addEventListener('click', changeBacgroundColorStart);
btnStop.addEventListener('click', changeBacgroundColorStop);

// Встановлення за замовчуванням btnStop - не активна
btnStop.setAttribute('disabled', true);

// Запис функції для генерування випадкового кольору
function getRandomHexColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

// Початкове значення змінної для таймеру
let timerId = null;

// Створення функції зміни backgroundColor відповідно до getRandomHexColor з блокуванням кнопки btnStart і розблокуванням btnStop
function changeBacgroundColorStart() {
    timerId = setInterval(() => {
        document.body.style.backgroundColor = getRandomHexColor();
    }, 1000);
    btnStart.setAttribute('disabled', true);
    btnStop.removeAttribute('disabled');
};

// Стіорення функції блокування кнопки btnStart в час відпрацювання changeBacgroundColorStart до кліка на кнопку btnStop
function changeBacgroundColorStop() {
    clearInterval(timerId);
    btnStop.setAttribute('disabled', true);
    btnStart.removeAttribute('disabled');
};