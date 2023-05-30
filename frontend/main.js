const textInputStart = document.querySelector('.text-input-1');
const dateInputStart = document.querySelector('.datepicker-input-1');
const textInputEnd = document.querySelector('.text-input-2');
const dateInputEnd = document.querySelector('.datepicker-input-2');


dateInputStart.addEventListener('change', event => {
    textInputStart.value = event.target.value;
    document.querySelector('.interval-start').innerText = '';
    textInputStart.style.opacity = '1'
    event.target.value = '';
});
dateInputEnd.addEventListener('change', event => {
    textInputEnd.value = event.target.value;
    document.querySelector('.interval-end').innerText = '';
    textInputEnd.style.opacity = '1'
    event.target.value = '';
});