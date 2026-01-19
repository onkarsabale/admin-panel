const farmers = [
  { name: "Ramesh Patil", location: "Pune", crop: "Wheat", status: "Pending" },
  { name: "Suresh Kale", location: "Nashik", crop: "Onion", status: "Active" },
  { name: "Mahesh Deshmukh", location: "Kolhapur", crop: "Sugarcane", status: "Blocked" }
];

const table = document.getElementById("farmerTable");

function loadFarmers() {
  table.innerHTML = "";

  farmers.forEach((farmer, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${farmer.name}</td>
      <td>${farmer.location}</td>
      <td>${farmer.crop}</td>
      <td>
        <span class="status ${farmer.status.toLowerCase()}">
          ${farmer.status}
        </span>
      </td>
      <td>
        <button class="view" onclick="viewFarmer(${index})">View</button>
        <button class="approve" onclick="approveFarmer(${index})">Approve</button>
        <button class="block" onclick="blockFarmer(${index})">Block</button>
      </td>
    `;

    table.appendChild(row);
  });
}

function viewFarmer(index) {
  alert(JSON.stringify(farmers[index], null, 2));
}

function approveFarmer(index) {
  farmers[index].status = "Active";
  loadFarmers();
}

function blockFarmer(index) {
  farmers[index].status = "Blocked";
  loadFarmers();
}

loadFarmers();
