
let deleteMode = false;

function changePrice(btn, value) {
    let priceSpan = btn.parentElement.querySelector("span");
    let price = parseInt(priceSpan.innerText);

    price = Math.max(0, price + value);
    priceSpan.innerText = price;
}

function updateSerialNumbers() {
    let rows = document.querySelectorAll("#priceTable tbody tr");
    rows.forEach((row, index) => {
        row.cells[0].innerText = index + 1;
        row.cells[0].className = "serial";
    });
}

function addProduct() {
    let product = prompt("Enter product name:");
    let current = prompt("Enter current price:");
    let suggested = prompt("Enter suggested price:");

    if (!product || !current || !suggested) return;

    let tbody = document.querySelector("#priceTable tbody");

    let row = document.createElement("tr");
    row.innerHTML = `
        <td class="serial"></td>
        <td>${product}</td>
        <td>${current}</td>
        <td>
            <button onclick="changePrice(this, -1)">−</button>
            <span class="suggested">${suggested}</span>
            <button onclick="changePrice(this, 1)">+</button>
        </td>
    `;

    tbody.appendChild(row);
    updateSerialNumbers();
}

function deleteProducts() {
    let rows = document.querySelectorAll("#priceTable tbody tr");
    let header = document.getElementById("selectHeader");

    if (!deleteMode) {
        header.innerText = "Select";

        rows.forEach(row => {
            row.cells[0].innerHTML = `<input type="checkbox">`;
            row.cells[0].className = "";
        });

        deleteMode = true;
        return;
    }

    let deleted = false;

    rows.forEach(row => {
        let checkbox = row.cells[0].querySelector("input");
        if (checkbox && checkbox.checked) {
            row.remove();
            deleted = true;
        }
    });

    if (!deleted) {
        alert("Select at least one item to delete");
        return;
    }

    header.innerText = "S.No";
    deleteMode = false;
    updateSerialNumbers();
}
