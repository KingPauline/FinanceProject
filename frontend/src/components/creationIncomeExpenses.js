import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Router} from "../router";

export class CreationIncomeExpenses {
    constructor() {
        const url = window.location.hash;
        this.type = url.split('=')[1];
        this.CreateValue(this.type)
    }
async CreateValue(type) {
        const typeInput = document.getElementsByClassName('form-select');
        typeInput[0].value = type;
        const result = await CustomHttp.request(config.host + '/categories/' + type);
        for (let i = 0; i < result.length; i++) {
            const optionCategory = document.createElement('option');
            optionCategory.value = result[i].id;
            optionCategory.innerHTML = result[i].title;
            typeInput[1].appendChild(optionCategory);
        }
        const inputs = document.getElementsByClassName('input');
        document.getElementsByClassName('btn-save')[0].onclick = function () {
            if (!inputs[4].value) {
                inputs[4].value = 'Комментарий не указан'
            }
            const result = CustomHttp.request(config.host + '/operations', 'POST', {
                type: inputs[0].value,
                amount: inputs[2].value,
                date: inputs[3].value,
                comment: inputs[4].value,
                category_id: +inputs[1].value,
            })
            if (result) {
                Router.getBalance();
                window.location.href = '#/summary_table'
            }
        }
        document.getElementsByClassName('btn-cancel')[0].onclick = function () {
            window.location.href = '#/summary_table'
        }
    }
}