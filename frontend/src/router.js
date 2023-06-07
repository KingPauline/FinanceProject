import {Auth} from "./services/auth.js";
import {Form} from "./components/form.js";
import {MainDashboard} from "./components/MainDashboard.js";
import {CustomHttp} from "./services/custom-http";
import config from "../config/config";
import {CategoryShow} from "./components/CategoryShow.js";
import {CategoryEditor} from "./components/CategoryEditor.js";




export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.styleElement = document.getElementById('style');
        this.titleElement = document.getElementById('page-title');
        this.profileFullNameElement = document.getElementById('profile-fullname');
        this.logoutElement = document.getElementById('user-info');
        document.getElementsByClassName('category')[0].classList.toggle('active');



        this.routes = [
            {
                route: '#/',
                title: 'Вход в систему',
                template: '/template/login.html',
                styles: 'css/login.css',
                load: () => {
                    new Form('login')
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'template/signup.html',
                styles: 'css/login.css',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/main',
                title: 'Главная',
                template: 'template/main.html',
                styles: 'css/income_expenses_category.css',
                load: () => {
                    new MainDashboard();
                }
            },
            {
                route: '#/category_income',
                title: 'Категории доходов',
                template: 'template/income_category.html',
                styles: 'css/income_expenses_category.css',
                load: () => {
                    new CategoryShow('income')
                }
            },
            {
                route: '#/creation_category_income',
                title: 'Создание категории доходов',
                template: 'template/creation_income_expenses_category.html',
                styles: 'css/income_expenses_category.css',
                load: () => {
                    // new CategoryCreation('income')
                }
            },
            {
                route: '#/editing_category_income',
                title: 'Редактирование категории доходов',
                template: 'template/editing_income_expenses_category.html',
                styles: 'css/income_expenses_category.css',
                load: () => {
                    new CategoryEditor('income')
                }
            },
            {
                route: '#/category_expenses',
                title: 'Категории расходов',
                template: 'template/income_category.html',
                styles: 'css/income_expenses_category.css',
                load: () => {
                    new CategoryShow('expenses')
                }
            },
            {
                route: '#/creation_category_expenses',
                title: 'Создание категории расходов',
                template: 'template/creation_income_expenses_category.html',
                styles: 'css/income_expenses_category.css',
                load: () => {
                    // new CategoryCreation('expenses')
                }
            },
            {
                route: '#/editing_category_expenses',
                title: 'Редактирование категории расходов',
                template: 'template/editing_income_expenses_category.html',
                styles: 'css/income_expenses_category.css',
                load: () => {
                    new CategoryEditor('expenses')
                }
            },
            {
                route: '#/summary_table',
                title: 'Страница доходов и расходов',
                template: 'template/income_expenses.html',
                styles: 'css/income_expenses_category.css',
                load: () => {
                    // new TableIncomeExpenses()
                }
            },
            {
                route: '#/creation_income_expenses',
                title: 'Страница создания дохода/расхода',
                template: 'template/creation_income_expenses',
                styles: 'css/income_expenses_category.css',
                load: () => {
                    // new CreationIncomeExpenses()
                }
            },
            {
                route: '#/editing_income_expenses',
                title: 'Страница редактирования дохода/расхода',
                template: 'template/editing_income_expenses',
                styles: 'css/income_expenses_category.css',
                load: () => {
                    // new EditIncomeExpenses()
                }
            },

        ]
    }


    async openRoute() {
        this.logoutElement.onclick = function () {
            document.getElementById('logout-popap').style.display = 'flex'
        }
        const urlRoute = window.location.hash
        if (urlRoute === '#/logout') {
            Auth.Logout();
            window.location.href = '#/';
            return;
        }
        const newRoute = this.routes.find(item => {
            return item.route === window.location.hash.split('?')[0];
        });
        console.log(newRoute)
        if (!newRoute) {
            window.location.href = '#/';
            return
        }
        document.getElementById('side-bar').style.display = 'flex'
        if (newRoute.route === '#/' || newRoute.route === '#/signup') {
            document.getElementById('side-bar').style.display = 'none';
        } else {
            this.toggleElements = document.getElementsByClassName('toggle-item');
            this.toggleElements[0].onclick = function () {
                window.location.href = '#/category_income';
            }
            this.toggleElements[1].onclick = function () {
                window.location.href = '#/category_expenses';
            }
        }

        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        this.styleElement.setAttribute('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title;

        const userInfo = Auth.getUserInfo()
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && (accessToken !== 'undefined' && accessToken !== undefined && accessToken !== null)) {
            this.profileFullNameElement.innerText = userInfo.name + ' ' + userInfo.lastName;
            document.getElementById('balance-amount').innerText = await this.getBalance() + ' $';
        }
        newRoute.load();

    }
    async getBalance() {
        const result = await CustomHttp.request(config.host + '/balance');
        return result.balance
    }

    sideBarSettings() {

        if (window.location.hash === '#/main') {
            document.getElementsByClassName('main-link')[0].classList.add('active');
        } else {
            document.getElementsByClassName('main-link')[0].classList.remove('active');
        }
        if (window.location.hash === '#/summary_table') {
            document.getElementsByClassName('summary-link')[0].classList.add('active');
        } else {
            document.getElementsByClassName('summary-link')[0].classList.remove('active');
        }
        if (window.location.hash === '#/category_income' || window.location.hash === '#/category_expenses') {

            if (window.location.hash === '#/category_income') {
                this.toggleElements[0].classList.add('active');
                this.toggleElements[1].classList.remove('active');
            } else {
                this.toggleElements[0].classList.remove('active');
                this.toggleElements[1].classList.add('active');
            }
        } else {
            this.toggleElements[0].classList.remove('active');
            this.toggleElements[1].classList.remove('active');
        }

    }
}