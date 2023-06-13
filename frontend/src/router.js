import {Auth} from "./services/auth.js";
import {Form} from "./components/form.js";
import {MainDashboard} from "./components/mainDashboard.js";
import {CustomHttp} from "./services/custom-http";
import config from "../config/config";
import {CategoryShow} from "./components/categoryShow.js";
import {CategoryEditor} from "./components/categoryEditor.js";
import {CategoryCreation} from "./components/categoryCreation.js";
import {TableIncomeExpenses} from "./components/tableIncomeExpenses.js";
import {CreationIncomeExpenses} from "./components/creationIncomeExpenses.js";
import {EditIncomeExpenses} from "./components/editIncomeExpenses.js";


export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.styleElement = document.getElementById('style');
        this.titleElement = document.getElementById('page-title');
        this.profileFullNameElement = document.getElementById('profile-fullname');
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
                    new CategoryCreation('income')
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
                    new CategoryCreation('expenses')
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
                    new TableIncomeExpenses()
                }
            },
            {
                route: '#/creation_income_expenses',
                title: 'Страница создания дохода/расхода',
                template: 'template/creation_income_expenses.html',
                styles: 'css/income_expenses_category.css',
                load: () => {
                    new CreationIncomeExpenses();
                }
            },
            {
                route: '#/editing_income_expenses',
                title: 'Страница редактирования дохода/расхода',
                template: 'template/editing_income_expenses.html',
                styles: 'css/income_expenses_category.css',
                load: () => {
                   new EditIncomeExpenses()
                }
            },

        ]
    }


    async openRoute() {
        document.getElementsByClassName('logout-link')[0].onclick = function () {
            window.location.href = '#/logout';
        }
        const urlRoute = window.location.hash
        if (urlRoute === '#/logout') {
            window.location.href = '#/';
            Auth.Logout();
            return;
        }
        this.newRoute = this.routes.find(item => {
            return item.route === window.location.hash.split('?')[0];
        });
        console.log(this.newRoute)
        if (!this.newRoute) {
            window.location.href = '#/';
            return
        }
        document.getElementById('side-bar').style.display = 'flex'
        if (this.newRoute.route === '#/' || this.newRoute.route === '#/signup') {
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
            await fetch(this.newRoute.template).then(response => response.text());
        this.styleElement.setAttribute('href', this.newRoute.styles);
        this.titleElement.innerText = this.newRoute.title;

        const userInfo = Auth.getUserInfo()
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && (accessToken !== 'undefined' && accessToken !== undefined && accessToken !== null) && (this.newRoute.route !== '#/' && this.newRoute.route !== '#/signup')) {
            this.profileFullNameElement.innerText = userInfo.name + ' ' + userInfo.lastName;
            try {
                await Router.getBalance();
            } catch  {
                console.log('jwt истек')
            }

        }
        this.newRoute.load();

    }

    static async getBalance() {
        const result = await CustomHttp.request(config.host + '/balance');
        document.getElementById('balance-amount').innerText = result.balance + ' $';
    }

    sideBarSettings() {
        if (this.newRoute.route !== '#/' && this.newRoute.route !== '#/signup') {
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
}