const buyers = [
  {
    name: "Amit Traders",
    purchases: 12,
    contact: "amit@traders.com",
    status: "Active"
  },
  {
    name: "Green Mart",
    purchases: 4,
    contact: "greenmart@gmail.com",
    status: "Pending"
  },
  {
    name: "Fresh Foods",
    purchases: 0,
    contact: "fresh@foods.in",
    status: "Blocked"
  }
];

const table = document.getElementById("buyerTable");
const search = document.getElementById("search");
const statusFilter = document.getElementById("statusFilter");

function loadBuyers() {
  table.innerHTML = "";

  buyers
    .filter(b =>
      (statusFilter.value === "All" || b.status === statusFilter.value) &&
      b.name.toLowerCase().includes(search.value.toLowerCase())
    )
    .forEach((buyer, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${buyer.name}</td>
        <td>${buyer.purchases}</td>
        <td>${buyer.contact}</td>
        <td>
          <span class="status ${buyer.status.toLowerCase()}">${buyer.status}</span>
        </td>
        <td>
          <button class="view" onclick="viewBuyer(${index})">View</button>
          <button class="activate" onclick="setStatus(${index}, 'Active')">Activate</button>
          <button class="block" onclick="setStatus(${index}, 'Blocked')">Block</button>
        </td>
      `;

      table.appendChild(row);
    });
}

function viewBuyer(index) {
  alert(JSON.stringify(buyers[index], null, 2));
}

function setStatus(index, status) {
  buyers[index].status = status;
  loadBuyers();
}

search.addEventListener("input", loadBuyers);
statusFilter.addEventListener("change", loadBuyers);

loadBuyers();
