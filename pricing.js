let deleteMode = false;
let isAuthorized = false;
let priceChanged = false; 
const CURRENT_ADMIN = "Admin XYZ"; 
let activityCount = 0;



const ADMIN_PASSWORD = "12345";

function unlockPricing() {
    let pass = document.getElementById("adminPass").value;
    let msg = document.getElementById("lockMsg");

    if (pass === ADMIN_PASSWORD) {
        isAuthorized = true;
        document.getElementById("priceLock").style.display = "none";
        alert("Price Management Unlocked");
    } else {
        msg.innerText = "❌ Wrong Password";
        msg.style.color = "red";
    }
}


function changePrice(btn, value) {
    if (!isAuthorized) {
        alert("Access Denied! Unlock first.");
        return;
    }

    let priceSpan = btn.parentElement.querySelector("span");
    let price = parseInt(priceSpan.innerText);

    if (isNaN(price)) {
        alert("Invalid price value");
        return;
    }

    let newPrice = price + value;

    if (newPrice <= 0) {
        alert("Price must be greater than zero");
        return;
    }

    priceSpan.innerText = newPrice;
    priceChanged = true;
    logActivity("Changed product price");
}


function updateSerialNumbers() {
    let rows = document.querySelectorAll("#priceTable tbody tr");
    rows.forEach((row, index) => {
        row.cells[0].innerText = index + 1;
        row.cells[0].className = "serial";
    });
}

function addProduct() {
    if (!isAuthorized) {
        alert("Access Denied! Unlock first.");
        return;
    }

    let product = prompt("Enter product name:");
    let current = prompt("Enter current price:");
    let suggested = prompt("Enter suggested price:");

    if (!product || !current || !suggested) return;

    if (isNaN(current) || current <= 0 || isNaN(suggested) || suggested <= 0) {
        alert("Price must be a positive number");
        return;
    }

    let tbody = document.querySelector("#priceTable tbody");

    let row = document.createElement("tr");
    row.innerHTML = `
        <td class="serial"></td>
        <td>${product}</td>
        <td>${current}</td>
        <td>
            <button onclick="changePrice(this,-1)">−</button>
            <span class="suggested">${suggested}</span>
            <button onclick="changePrice(this,1)">+</button>
        </td>
    `;

    tbody.appendChild(row);
    updateSerialNumbers();
    priceChanged = true;
    logActivity("Added new product");
}


function deleteProducts() {
    if (!isAuthorized) {
        alert("Access Denied! Unlock first.");
        return;
    }

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
    logActivity("Deleted product");

}
window.addEventListener("pagehide", function () {
    if (priceChanged) {
        alert("✅ Changes saved successfully");
        priceChanged = false;
    }
});
function logActivity(actionText) {
    let tbody = document.querySelector("#activityTable tbody");
    activityCount++;

    let now = new Date().toLocaleString();

    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${activityCount}</td>
        <td>${CURRENT_ADMIN}</td>
        <td>${actionText}</td>
        <td>${now}</td>
    `;

    tbody.appendChild(row);
}


