
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class CategoryEditor {
    constructor(type) {
        const url = window.location.hash;
        this.id = url.split('=')[1];
        this.getCategoryName(type);
    }
    async getCategoryName(type) {
        let reqUrl = null;
        const pageTitle = document.getElementsByTagName('h1')[0]
        if (type === 'income') {
            reqUrl = '/categories/income/' + this.id;
            pageTitle.innerText = 'Редактирование категории доходов'
        } else {
            reqUrl = '/categories/expense/' + this.id;
            pageTitle.innerText = 'Редактирование категории расходов'
        }
        const result = await CustomHttp.request(config.host + reqUrl);
        console.log(result.title);
        const editInput = document.getElementsByClassName('form-control')[0];
        editInput.value = result.title;
        document.getElementsByClassName('btn-save')[0].onclick = async function () {
            await CustomHttp.request(config.host + reqUrl, 'PUT', {
                title: editInput.value,
            });
            if (type === 'income') {
                window.location.href = '#/category_income';
            } else {
                window.location.href = '#/category_expenses';
            }
        }
        document.getElementsByClassName('btn-cancel')[0].onclick  = function () {
            if (type === 'income') {
                window.location.href = '#/category_income';
            } else {
                window.location.href = '#/category_expenses';
            }
        }
    }
}