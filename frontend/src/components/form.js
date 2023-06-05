import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";


export class Form {
    constructor(page) {
        this.processElement = null;
        this.page = page;
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken !== 'undefined' && accessToken !== undefined && accessToken !== null) {
            location.href = '#/main';
            return;
        }

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            }
        ];
        if (this.page === 'signup') {
            this.fields.unshift({
                    name: 'FIO',
                    id: 'name',
                    element: null,
                    regex: /^([А-Я][а-я]+\s*)+$/,
                    valid: false,
                },
                {
                    name: 'password_confirm',
                    id: 'password_confirm',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false,
                })
        }
        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this)
            }
        });
        if (this.page === 'login') {
            const rememberElement = document.getElementById('rememberMe');
            if (rememberElement.checked) {
                this.rememberMe = true;
            } else {
                this.rememberMe = false;
            }

        }

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = 'red';
            field.valid = false;
            if (this.page === 'signup') {
                element.parentNode.nextElementSibling.style.display = 'block';
            }


        } else {
            element.removeAttribute('style');
            field.valid = true;
            if (this.page === 'signup' && field.name !== 'password_confirm') {
                element.parentNode.nextElementSibling.style.display = 'none';
            }
        }
        this.validateForm()
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        let isValid = false;
        const password = this.fields.find(item => item.name === 'password').element.value;
        let passwordValid = true;
        if (this.page === 'signup') {
            const passwordConfirm  = this.fields.find(item => item.name === 'password_confirm').element.value;
            if (passwordConfirm !==password) {
                passwordValid = false;
            }
        }
        if (validForm && passwordValid) {
            isValid = true;
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'true');
        }
        return isValid;
    }

    async processForm() {
        if (this.validateForm()) {
            let fioArr = [];
            if (this.page === 'signup') {
                fioArr = this.fields.find(item => item.name === 'FIO').element.value.split(' ');
            }
            const email = this.fields.find(item => item.name === 'email').element.value;
            localStorage.setItem('email', email)
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'signup') {
                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: fioArr[1],
                        lastName: fioArr[0],
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item=> item.name === 'password_confirm').element.value
                    })
                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message)
                        }
                    }
                } catch (error) {
                    return console.log(error)
                }
            }
            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    rememberMe: this.rememberMe,
                })
                if (result) {
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.name || !result.user.lastName || !result.user.id) {
                        throw new Error(result.message)
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        name: result.user.name,
                        lastName: result.user.lastName,
                        userId: result.user.id
                    })
                    location.href = '#/main';
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}