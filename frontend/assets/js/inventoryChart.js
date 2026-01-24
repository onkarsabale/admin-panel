const table = document.querySelector("table");
const ctx = document.getElementById("inventoryPieChart").getContext("2d");

function extractInventoryData() {
    const rows = table.querySelectorAll("tbody tr");
    const labels = [];
    const values = [];

    rows.forEach(row => {
        const productName = row.cells[0].innerText;
        const quantityText = row.cells[2].innerText;

        const quantity = parseInt(quantityText);

        if (quantity > 0) {
            labels.push(productName);
            values.push(quantity);
        }
    });

    return { labels, values };
}

let inventoryChart;

function renderInventoryChart() {
    const data = extractInventoryData();

    if (inventoryChart) inventoryChart.destroy();

    inventoryChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    "#1abc9c",
                    "#3498db",
                    "#f1c40f",
                    "#9b59b6",
                    "#e67e22"
                ]
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Available Products Stock"
                },
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}
function updateInventoryStatus() {
    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tbody tr");

    rows.forEach(row => {
        const quantityCell = row.cells[2];
        const statusCell = row.cells[4];   

        const quantity = parseInt(quantityCell.innerText);

        if (quantity > 0) {
            statusCell.innerText = "Available";
            statusCell.classList.remove("status-out");
            statusCell.classList.add("status-available");
        } else {
            statusCell.innerText = "Out of Stock";
            statusCell.classList.remove("status-available");
            statusCell.classList.add("status-out");
        }
    });
}

updateInventoryStatus();

renderInventoryChart();
