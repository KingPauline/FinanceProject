import {CustomHttp} from "../services/custom-http";
import config from "../../config/config.js";
import {Router} from "../router";

export class TableIncomeExpenses {
    constructor() {
        const textInputStart = document.querySelector('.text-input-1');
        const dateInputStart = document.querySelector('.datepicker-input-1');
        const textInputEnd = document.querySelector('.text-input-2');
        const dateInputEnd = document.querySelector('.datepicker-input-2');
        dateInputStart.addEventListener('change', event => {
            textInputStart.value = event.target.value;
            this.intervalStart = document.querySelector('.interval-start')
            this.intervalStart.innerText = '';
            textInputStart.style.opacity = '1'
            event.target.value = '';
        });
        dateInputEnd.addEventListener('change', event => {
            textInputEnd.value = event.target.value;
            this.intervalEnd = document.querySelector('.interval-end')
            this.intervalEnd.innerText = '';
            textInputEnd.style.opacity = '1'
            event.target.value = '';
        });

         const buttons = document.getElementsByClassName('btn-outline-secondary');
         buttons[0].classList.add('active');

        TableIncomeExpenses.buttonsSettings();
        if (buttons[0].classList.contains('active')) {
            this.createTable('today');
        }
        const filter = TableIncomeExpenses.filterButtonsFocus;
        const table = this.createTable;
        const clearTable = this.clearTable;
        buttons[0].onclick = function () {
            clearTable();
            filter(buttons)
            buttons[0].classList.add('active');
            table('today');
        }
        buttons[1].onclick = function () {
            clearTable();
            filter(buttons)
            buttons[1].classList.add('active');
            table('week')
        }
        buttons[2].onclick = function () {
            clearTable();
            filter(buttons)
            buttons[2].classList.add('active');
            table('month')
        }
        buttons[3].onclick = function () {
            clearTable();
            filter(buttons)
            buttons[3].classList.add('active');
            table('year')
        }
        buttons[4].onclick = function () {
            clearTable();
            filter(buttons)
            buttons[4].classList.add('active');
            table('all')
        }
        buttons[5].onclick = function () {
            clearTable();
            filter(buttons);
           if (textInputStart.value  && textInputEnd.value ) {
               buttons[5].classList.add('active')
               const interval = {
                   name: 'interval',
                   dateFrom: textInputStart.value,
                   dateTo: textInputEnd.value,
               }
               table(interval)
           }
        }

    }

    static buttonsSettings() {
        document.getElementsByClassName('btn-create-income')[0].onclick = function () {
            window.location.href = '#/creation_income_expenses' + '?type=income';
        }
        document.getElementsByClassName('btn-create-expense')[0].onclick = function () {
            window.location.href = '#/creation_income_expenses' + '?type=expense';
        }
    }

    async createTable(period) {
        let result = null;
        if (period.name === 'interval') {
            result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom='+ period.dateFrom + '&dateTo=' + period.dateTo);
        } else {
            result = await CustomHttp.request(config.host + '/operations?period=' + period);
        }
        for (let i = 0; i < result.length; i++) {
            // if (result[i].category === undefined) {
            //     continue;
            // }
            const row = document.createElement('tr');
            const rowNumber = document.createElement('th');
            rowNumber.innerText = i+1;
            rowNumber.setAttribute('scope', 'row');
            const categoryCol = document.createElement('td');
            if (result[i].type === 'income') {
                categoryCol.innerText = 'доход';
                categoryCol.style.color = '#198754';
            }
            else {
                categoryCol.innerText = 'расход';
                categoryCol.style.color = '#DC3545';
            }
            const operationCol = document.createElement('td');
            if (result[i].category === undefined) {
                operationCol.innerText = 'категория не выбрана';
            } else {
                operationCol.innerText = result[i].category;
            }
            const amountCol = document.createElement('td');
            amountCol.innerText = result[i].amount;
            const dateCol = document.createElement('td');
            dateCol.innerText = result[i].date;
            const commentCol = document.createElement('td');
            commentCol.classList.add('table-comment');
            commentCol.innerText = result[i].comment;
            const icons = document.createElement('div');
            icons.classList.add('table-icons');
            const deleteIcon = document.createElement('a');
            deleteIcon.innerHTML = "<img src=\"../images/trash%20icon.svg\" alt=\"\">"
            const editIcon = document.createElement('a');
            editIcon.innerHTML = "<img src=\"../images/pen%20icon.svg\" alt=\"\">";
            const tBody = document.getElementsByTagName('tbody')[0];
            tBody.appendChild(row);
            row.appendChild(rowNumber);
            row.appendChild(categoryCol);
            row.appendChild(operationCol);
            row.appendChild(amountCol);
            row.appendChild(dateCol);
            commentCol.appendChild(icons);
            icons.appendChild(deleteIcon);
            icons.appendChild(editIcon);
            row.appendChild(commentCol);
            deleteIcon.onclick = function () {
                document.getElementsByClassName('popap')[0].style.display = 'flex';
                const btnDeleteConfirm = document.getElementsByClassName('btn-delete-confirm')[0];
                btnDeleteConfirm.onclick = async function () {
                    await CustomHttp.request(config.host + '/operations/' + result[i].id, 'DELETE')
                    document.getElementsByClassName('popap')[0].style.display = 'none';
                    Router.getBalance();
                    row.remove();
                }
                const btnNoDelete = document.getElementsByClassName('btn-not-delete')[0];
                btnNoDelete.onclick = function () {
                    document.getElementsByClassName('popap')[0].style.display = 'none';
                }
            }
            editIcon.onclick = function () {
                window.location.href = '#/editing_income_expenses?id=' + result[i].id;
            }

        }

    }
    static filterButtonsFocus(buttons) {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active')
        }
    }
    clearTable() {
        const tableBody = document.getElementsByTagName('tbody')[0];
        const tableRows  = document.getElementsByTagName('tr');
        for (let i = tableRows.length-1; i >=1; --i) {
            tableRows[i].remove();
        }
    }
}