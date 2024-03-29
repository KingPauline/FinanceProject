import {Router} from "./router.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';


class App {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this))
        window.addEventListener('popstate', this.handleRouteChanging.bind(this))
    }
    handleRouteChanging() {
        this.router.openRoute();
        this.router.sideBarSettings();
    }
}
(new App ());