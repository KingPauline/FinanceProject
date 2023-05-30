const Utils = ChartUtils.init();
const DATA_COUNT = 5;
const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

const data1 = {
    labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],

    datasets: [
        {
            label: 'Доходы',
            backgroundColor: ["#DC3545", "#FD7E14", "#FFC107", "#20C997", "#0D6EFD", "#B10DC9"],
            data: Utils.numbers(NUMBER_CFG),
            // backgroundColor: Object.values(Utils.CHART_COLORS),
        }
    ]
};
const data2 = {
    labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],

    datasets: [
        {
            label: 'Расходы',
            backgroundColor: ["#DC3545", "#FD7E14", "#FFC107", "#20C997", "#0D6EFD", "#B10DC9"],
            data: Utils.numbers(NUMBER_CFG),
            // backgroundColor: Object.values(Utils.CHART_COLORS),
        }
    ]
};
//
const legendMargin = {
    id: 'legendMargin',
    beforeInit(chart, legend, options) {
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
    }
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
    }
};


const incomeChart = new Chart(
    document.getElementById('incomeChart'),
    config1,
);
const outcomeChart = new Chart(
    document.getElementById('outcomeChart'),
    config2,
);
let timeButton = document.getElementsByClassName('btn-outline-secondary');
for (let i = 0; i < timeButton.length; i++) {
    timeButton[i].onclick = function(event) {
        const data1 = incomeChart.data;
        const data2 = outcomeChart.data;
        incomeChart.data.datasets.pop();
        incomeChart.update();
        outcomeChart.data.datasets.pop();
        outcomeChart.update();
        const newDataset1 = {
            label: 'Dataset ' + (data1.datasets.length + 1),
            backgroundColor: [],
            data: [],
        };
        const newDataset2 = {
            label: 'Dataset ' + (data2.datasets.length + 1),
            backgroundColor: [],
            data: [],
        };
        for (let i = 0; i < data1.labels.length; i++) {
            newDataset1.data.push(Utils.numbers({count: 1, min: 0, max: 100}));

            const colorIndex = i % Object.keys(Utils.CHART_COLORS).length;
            newDataset1.backgroundColor.push("#DC3545", "#FD7E14", "#FFC107", "#20C997", "#0D6EFD", "#B10DC9");
        }
        incomeChart.data.datasets.push(newDataset1);
        incomeChart.update();
        for (let i = 0; i < data2.labels.length; i++) {
            newDataset2.data.push(Utils.numbers({count: 1, min: 0, max: 100}));

            const colorIndex = i % Object.keys(Utils.CHART_COLORS).length;
            newDataset2.backgroundColor.push("#DC3545", "#FD7E14", "#FFC107", "#20C997", "#0D6EFD", "#B10DC9");
        }
        outcomeChart.data.datasets.push(newDataset1);
        outcomeChart.update();
    }
}
