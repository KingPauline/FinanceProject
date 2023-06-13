import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class EditIncomeExpenses {
    constructor() {
        const url = window.location.hash;
        this.id = url.split('=')[1];
        this.inputs = document.getElementsByClassName('form-control');
        this.getUpdateOperation(this.id)
    }

    async getUpdateOperation(id) {
        const typeInput = document.getElementsByClassName('form-select');
        const result = await CustomHttp.request(config.host + '/operations/' + id);
        typeInput[0].value = result.type;
        const categories = await CustomHttp.request(config.host + '/categories/' + result.type);
        for (let i = 0; i < categories.length; i++) {
            const optionCategory = document.createElement('option');
            optionCategory.value = categories[i].id;
            optionCategory.innerHTML = categories[i].title;
            typeInput[1].appendChild(optionCategory);
        }

        this.inputs[0].value = result.amount;
        this.inputs[1].value = result.date;
        this.inputs[2].value = result.comment;
        const input = document.getElementsByClassName('input');
        document.getElementsByClassName('btn-save')[0].onclick = async function () {

            const result = await CustomHttp.request(config.host + '/operations/' + id, 'PUT', {
                type: input[0].value,
                amount: input[2].value,
                date: input[3].value,
                comment: input[4].value,
                category_id: +input[1].value,
            });
            if (result) {
                window.location.href = '#/summary_table'
            }
        }
        document.getElementsByClassName('btn-cancel')[0].onclick = function () {
            window.location.href = '#/summary_table'
        }
    }
}