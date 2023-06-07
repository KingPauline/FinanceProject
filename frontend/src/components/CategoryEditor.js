import {log10} from "chart.js/helpers";
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
        console.log(result.title)
        document.getElementsByClassName('form-control')[0].value = result.title
    }
}