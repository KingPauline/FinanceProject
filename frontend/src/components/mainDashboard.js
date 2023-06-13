import Chart from "../utils/chart.min.js";
import Utils from "../utils/chart-utils.min.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {TableIncomeExpenses} from "./tableIncomeExpenses.js";
import 'chart.js/auto';

export class MainDashboard {
    constructor() {

            MainDashboard.getData('today')
                .then(data => MainDashboard.MakeDashboard(data))
    }
    static MakeDashboard(data) {
        const DATA_COUNT_income = data.dataIncome.length;
        const DATA_COUNT_expenses = data.dataExpenses.length;
        const Utils = ChartUtils.init();
        const NUMBER_INCOME = {count: DATA_COUNT_income};
        const NUMBER_EXPENSES = {count: DATA_COUNT_expenses};
        let categoryIncome =[];

        data.dataIncome.forEach(item => {
           item.forEach(itemIn =>
           categoryIncome.push(itemIn.title))
        })
        const amountsIncome  = data.dataIncome.map(item=>item.length);
        let categoryExpense = [];
        data.dataExpenses.forEach(item => {
            item.forEach(itemIn =>
                categoryExpense.push(itemIn.title))
        })
        const amountsExpense  = data.dataExpenses.map(item=>item.length);
        const data1 = {
            labels: categoryIncome,
            datasets: [
                {
                    label: 'Доходы',
                    backgroundColor: ["#DC3545", "#FD7E14", "#FFC107", "#20C997", "#0D6EFD", "#B10DC9"],
                    data: amountsIncome,

                }
            ]
        };
        const data2 = {
            labels: categoryExpense,

            datasets: [
                {
                    label: 'Расходы',
                    backgroundColor: ["#DC3545", "#FD7E14", "#FFC107", "#20C997", "#0D6EFD", "#B10DC9"],
                    data: amountsExpense,
                }
            ]
        };
//
        const legendMargin = {
            id: 'legendMargin',
            beforeInit(chart) {
                const fitValue = chart.legend.fit;
                chart.legend.fit = function fit() {
                    fitValue.bind(chart.legend)();
                    return this.height+= 70;
                }
            }
        };

        const config1 = {
            type: 'pie',
            data: data1,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 25,
                            boxHeight: 10,
                            padding: 15,
                            color: '#290661',
                            bottom: 20,
                            font: {
                                size: 12,
                                family: 'Roboto',
                                weight: 500,
                            },
                        },
                    },
                    title: {
                        align: 'center',
                        position: 'top',
                        fullSize: 'false',
                        display: true,
                        text: 'Доходы',
                        color: '#290661',
                        font: {
                            size: 28,
                            family: 'Roboto',
                            weight: 500,

                        }
                    },

                },
            },
            plugins: [legendMargin],
        };
        const config2 = {
            type: 'pie',
            data: data2,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 25,
                            boxHeight: 10,
                            padding: 15,
                            color: '#290661',
                            bottom: 20,
                            font: {
                                size: 12,
                                family: 'Roboto',
                                weight: 500,
                            },
                        },
                    },
                    title: {
                        display: true,
                        text: 'Расходы',
                        color: '#290661',
                        font: {
                            size: 28,
                            family: 'Roboto',
                            weight: 500,

                        }
                    },
                },
            },
            plugins: [legendMargin],
        };
        let incomeChart = null;
        let outcomeChart = null;
        if (window.location.hash === '#/main') {
            incomeChart = new Chart(
                document.getElementById('incomeChart'),
                config1,
            );
            outcomeChart = new Chart(
                document.getElementById('outcomeChart'),
                config2,
            );
        }
        const buttons = document.getElementsByClassName('btn-outline-secondary');
        (async () => {
            if (buttons.length !== 0) {
                buttons[0].onclick = async function () {
                    incomeChart.destroy();
                    outcomeChart.destroy();
                    TableIncomeExpenses.filterButtonsFocus(buttons);
                    buttons[0].classList.add('active');
                    let dataToday = await MainDashboard.getData('today');
                }
                buttons[1].onclick = async function () {
                    incomeChart.destroy();
                    outcomeChart.destroy();
                    TableIncomeExpenses.filterButtonsFocus(buttons);
                    buttons[1].classList.add('active');
                    const dataWeek = await MainDashboard.getData('week');
                    MainDashboard.MakeDashboard(dataWeek);

                }
                buttons[2].onclick = async function () {
                    incomeChart.destroy();
                    outcomeChart.destroy();
                    TableIncomeExpenses.filterButtonsFocus(buttons);
                    buttons[2].classList.add('active');
                    const dataMonth = await MainDashboard.getData('month');
                    MainDashboard.MakeDashboard(dataMonth);

                }
                buttons[3].onclick = async function () {
                    incomeChart.destroy();
                    outcomeChart.destroy();
                    TableIncomeExpenses.filterButtonsFocus(buttons);
                    buttons[3].classList.add('active');
                    const dataYear = await MainDashboard.getData('year');
                    MainDashboard.MakeDashboard(dataYear);

                }
                buttons[4].onclick = async function () {
                    incomeChart.destroy();
                    outcomeChart.destroy();
                    TableIncomeExpenses.filterButtonsFocus(buttons);
                    buttons[4].classList.add('active');
                    const dataAll = await MainDashboard.getData('all');
                    MainDashboard.MakeDashboard(dataAll);

                }
                const textInputStart = document.querySelector('.text-input-1');
                const dateInputStart = document.querySelector('.datepicker-input-1');
                const textInputEnd = document.querySelector('.text-input-2');
                const dateInputEnd = document.querySelector('.datepicker-input-2');
                dateInputStart.addEventListener('change', event => {
                    textInputStart.value = event.target.value;
                    document.querySelector('.interval-start').innerText = '';
                    textInputStart.style.opacity = '1'
                    event.target.value = '';
                });
                dateInputEnd.addEventListener('change', event => {
                    textInputEnd.value = event.target.value;
                    document.querySelector('.interval-end').innerText = '';
                    textInputEnd.style.opacity = '1'
                    event.target.value = '';
                });
                buttons[5].onclick = async function () {
                    incomeChart.destroy();
                    outcomeChart.destroy();
                    TableIncomeExpenses.filterButtonsFocus(buttons);
                    buttons[5].classList.add('active')
                    if (textInputStart.value && textInputEnd.value) {
                        const interval = {
                            name: 'interval',
                            dateFrom: textInputStart.value,
                            dateTo: textInputEnd.value,
                        }
                        const dataInterval = await MainDashboard.getData(interval);
                        MainDashboard.MakeDashboard(dataInterval);
                    }
                }
            }
        }) ();

    }

    static async getData (period) {
        let allOperations = null;
        if (period.name === 'interval')
            allOperations =  await CustomHttp.request(config.host + '/operations?period=interval&dateFrom='+ period.dateFrom + '&dateTo=' + period.dateTo);
        else {
            allOperations = await CustomHttp.request(config.host + '/operations?period=' + period);
        }
        const incomeOperations = allOperations ? allOperations.filter(operation => operation.type === 'income') : [];
        const expenseOperations = allOperations ? allOperations.filter(operation => operation.type === 'expense') : [];
        const allCategoriesIncome = await CustomHttp.request(config.host + '/categories/income');
        const allCategoriesExpense = await CustomHttp.request(config.host + '/categories/expense');
        const categorySumExpenseArray = [];
        const categorySumIncomeArray = [];
        if (allCategoriesExpense) {
            for (let i = 0; i < allCategoriesExpense.length; i++) {
                let categorySumExpense = expenseOperations.filter(opr => opr.category === allCategoriesExpense[i].title);
                categorySumExpenseArray.push(categorySumExpense)
            }
        }
        if (allCategoriesIncome) {
            for (let i = 0; i < allCategoriesIncome.length; i++) {
                let categorySumIncome = incomeOperations.filter(opr => opr.category === allCategoriesIncome[i].title);
                categorySumIncomeArray.push(categorySumIncome)
            }
        }
        let dataExpenses = [];
        if (categorySumExpenseArray) {
            for (let i = 0; i < categorySumExpenseArray.length; i++) {
                if (categorySumExpenseArray[i].length > 0) {
                    dataExpenses.push( [{
                        title: categorySumExpenseArray[i][0].category,
                        length: categorySumExpenseArray[i].length
                    }])
                }
            }
        }
        let dataIncome = [];
        if (categorySumIncomeArray) {
            for (let i = 0; i < categorySumIncomeArray.length; i++) {
                if (categorySumIncomeArray[i].length > 0) {
                    dataIncome.push( [{
                        title: categorySumIncomeArray[i][0].category,
                        length: categorySumIncomeArray[i].length
                    }])
                }
            }
        }

        let data = {
            dataIncome : dataIncome,
            dataExpenses: dataExpenses,
        }
        return  data;
    }


}
