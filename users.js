const users = [
    {name:"Rahul Patil", role:"Farmer", status:"Active"},
    {name:"Neha Sharma", role:"Buyer", status:"Inactive"},
    {name:"Amit Kulkarni", role:"Admin", status:"Active"},
    {name:"Priya Deshmukh", role:"Buyer", status:"Active"},
    {name:"Siddharth Rao", role:"Farmer", status:"Inactive"}
];

const table = document.getElementById("userTable");
const search = document.getElementById("search");
const statusFilter = document.getElementById("statusFilter");


function loadUsers(){
    table.innerHTML = "";

    users.filter(u => 
        (statusFilter.value === "All" || u.status === statusFilter.value) &&
        u.name.toLowerCase().includes(search.value.toLowerCase())
    ).forEach((user, index)=>{
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.role}</td>
            <td><span class="status ${user.status.toLowerCase()}">${user.status}</span></td>
            <td>
                <button class="btn edit" onclick="editUser(${index})">Edit</button>
                ${user.status === "Active" 
                    ? `<button class="btn block" onclick="setStatus(${index}, 'Inactive')">Block</button>`
                    : `<button class="btn activate" onclick="setStatus(${index}, 'Active')">Activate</button>`
                }
            </td>
        `;
        table.appendChild(row);
    });
}


function editUser(index){
    alert("Edit User:\n" + JSON.stringify(users[index], null, 2));
}


function setStatus(index, status){
    users[index].status = status;
    loadUsers();
}


search.addEventListener("input", loadUsers);
statusFilter.addEventListener("change", loadUsers);


function logout(){
    alert("You have been logged out!");
    window.location.href = "admin.html";
}


loadUsers();