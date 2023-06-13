import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class CategoryCreation {
    constructor(type) {
        this.pageTitle = document.getElementsByClassName('title')[0];
        let reqUrl = null;
        if (type==='income') {
            reqUrl = '/categories/income'
            this.pageTitle.innerText = 'Создание категории доходов'
        } else {
            reqUrl = '/categories/expense'
            this.pageTitle.innerText = 'Создание категории расходов'
        }

        this.CreateCategory(type, reqUrl);
    }
    CreateCategory(type, reqUrl) {
        const inputCreation = document.getElementsByClassName('form-control')[0];
        document.getElementsByClassName('btn-save')[0].onclick = async function () {
            if (inputCreation.value !== '' || !inputCreation.value !== null) {
                document.getElementsByClassName('warning')[0].style.display = 'none'
                await CustomHttp.request(config.host + reqUrl, 'POST', {
                    title: inputCreation.value
                })
                if (type === 'income') {
                    window.location.href = '#/category_income';
                } else {
                    window.location.href = '#/category_expenses';
                }
            } else {
                document.getElementsByClassName('warning')[0].style.display = 'block'
            }
        }
        document.getElementsByClassName('btn-cancel')[0].onclick = function () {
            if (type === 'income') {
                window.location.href = '#/category_income';
            } else {
                window.location.href = '#/category_expenses';
            }
        }
    }
}