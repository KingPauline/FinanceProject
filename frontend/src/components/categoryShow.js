import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";


export class CategoryShow {
    constructor(type) {
        this.type = type;
        this.showCategories(type);
    }

    async showCategories(type) {
        let reqUrl = null;
        const pageTitle = document.getElementsByTagName('h1')[0];
        if (type === 'income') {
            reqUrl = '/categories/income'
            pageTitle.innerText = 'Доходы'
        } else {
            reqUrl = '/categories/expense'
            pageTitle.innerText = 'Расходы'
        }
        try {
            const result = await CustomHttp.request(config.host + reqUrl);
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    const cardCol = document.createElement('div');
                    cardCol.className = 'col';
                    const cardRow = document.getElementsByClassName('row')[0];
                    const card = document.createElement('div');
                    card.className = 'card';
                    const cardBody = document.createElement('div');
                    cardBody.className = 'card-body';
                    const cardTitle = document.createElement('h5');
                    cardTitle.className = 'card-title';
                    cardTitle.innerText = result[i].title;
                    this.btnEdit = document.createElement('a');
                    this.btnEdit.className = 'btn';
                    this.btnEdit.classList.add('btn-primary');
                    this.btnEdit.innerText = 'Редактировать'
                    this.btnDelete = document.createElement('a');
                    this.btnDelete.className = 'btn';
                    this.btnDelete.classList.add('btn-danger');
                    this.btnDelete.innerText = 'Удалить';
                    cardRow.appendChild(cardCol)
                    cardCol.appendChild(card);
                    card.appendChild(cardBody);
                    cardBody.appendChild(cardTitle);
                    cardBody.appendChild(this.btnEdit);
                    cardBody.appendChild(this.btnDelete);
                    this.btnEdit.onclick = function () {
                        if (type === 'income') {
                            window.location.href = '#/editing_category_income' + '?id=' + result[i].id;
                        } else {
                            window.location.href = '#/editing_category_expenses' + '?id=' + result[i].id;
                        }
                    }
                    this.btnDelete.onclick = function () {
                        document.getElementsByClassName('popap')[0].style.display = 'flex';
                        const btnDeleteConfirm = document.getElementsByClassName('btn-delete-confirm')[0];
                        btnDeleteConfirm.onclick = async function () {
                            try {
                                await CustomHttp.request(config.host + reqUrl + '/' + result[i].id, 'DELETE')
                            } catch (e) {
                                console.log(e)
                            }
                            const operations = await CustomHttp.request(config.host + '/operations?period=all');
                            operations.forEach(item => {
                                 if (item.category === result[i].title) {
                                 CustomHttp.request(config.host + '/operations/' + item.id, 'DELETE')
                             }
                            })
                            document.getElementsByClassName('popap')[0].style.display = 'none';
                            cardCol.style.display  = 'none';
                        }
                        const btnNoDelete = document.getElementsByClassName('btn-not-delete')[0];
                        btnNoDelete.onclick = function () {
                            document.getElementsByClassName('popap')[0].style.display = 'none';
                        }
                    }
                }
                document.getElementsByClassName('category-add')[0].onclick = function (){
                    if (type === 'income') {
                        window.location.href = '#/creation_category_income';
                    } else {
                        window.location.href = '#/creation_category_expenses';
                    }
                }
            }
        } catch(e) {
            console.log(e)
        }

    }
}