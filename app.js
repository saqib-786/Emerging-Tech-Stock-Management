async function laodData() {
  let ref = JSON.parse(localStorage.getItem("ref"));
  firebase
    .database()
    .ref(ref)
    .on("value", function (snapshot) {
      let data = snapshot.val();
      let tbody = document.getElementById("table-body");
      tbody.innerHTML = "";
      data.forEach((item, index) => {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");
        let td5 = document.createElement("td");
        td4.innerHTML = index + 1;
        td.innerHTML = item.itemName;
        td1.innerHTML = item.size;
        td2.innerHTML = item.quantity;
        td3.innerHTML = item.hasOwnProperty("shedule")
          ? item.shedule
          : item.UMO;
       if(ref === 'PVCStock'){
        td5.innerHTML =
  
        `<div>
        <input  class="input" id='input${index}' placeholder="0" />
        <button onclick="PVCISSUE(this,${index})" class="add-btn">ISSUE</button>
        </div>`
       }else if(ref === 'ROStock'){
        td5.innerHTML =
        `<div>
        <input  class="input" id='input${index}' placeholder="0" />
        <button onclick="ROISSUE(this,${index})" class="add-btn">ISSUE</button>
        </div>`
       }else if(ref === 'ElectricalStock'){
        td5.innerHTML =
        `<div>
        <input  class="input" id='input${index}' placeholder="0" />
        <button onclick="ElectricalIssue(this,${index})" class="add-btn">ISSUE</button>
        </div>`
       }
        tr.appendChild(td4);
        tr.appendChild(td);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td5);
        tbody.appendChild(tr);
      });
    });
}
// window.addEventListener("load", laodData());

function issuedStock(item, size, shedule, quantity) {
  let data = JSON.parse(localStorage.getItem("key"));
  let { key, id } = data;
  let obj = {
    id: id,
    itemName: item,
    size: size,
    shedule: shedule,
    quantity: quantity,
  };

  firebase
    .database()
    .ref("IssuedItems/" + id)
    .push(obj);
}
function ROISSUE(btn,index){
  let ref = JSON.parse(localStorage.getItem('ref'));
  let userValue = document.getElementById(`input${index}`);
  let tbody = document.getElementById("table-body");
  if (userValue.value === "") {
    toastify("Please enter the quantity first!");
  } else {
    firebase
      .database()
      .ref(ref)
      .once("value", function (snapshot) {
        let data = snapshot.val();
        let result = data.filter((item, i) => i === index);
        if (Number(userValue.value) < 0) {
          toastify("Quaintiy should be more than 0")
        } else {
          result.forEach((item) => {
            // tbody.innerHTML = "";
            if(item.quantity <= 0){
              toastify(`Sorry ${item.itemName} is not available in stock`)
            }else{
              firebase
              .database()
              .ref(`${ref}/` + index)
              .set({
                id: item.id,
                itemName: item.itemName,
                size: item.size,
                UMO: item.UMO,
                quantity: item.quantity - Number(userValue.value),
              });
            }
            
              laodData();
            issuedStock(item.itemName, item.size, item.UMO, Number(userValue.value));
          });
        }
      });

  
}
}
async function PVCISSUE(btn, index) {
  let ref = JSON.parse(localStorage.getItem("ref"));
  let userValue = document.getElementById(`input${index}`);
  let tbody = document.getElementById("table-body");
  if (userValue.value === "") {
    toastify("Please enter the quantity first!")
  } else {
    firebase
      .database()
      .ref(ref)
      .once("value", function (snapshot) {
        let data = snapshot.val();
        let result = data.filter((item, i) => i === index);

        if (Number(userValue.value) < 0) {
          toastify("Quaintiy should be more than 0");
        } else {
          result.forEach((item) => {
            // tbody.innerHTML = "";
            if(item.quantity <= 0){
              toastify(`Sorry ${item.itemName} is not available in stock`)
            }else{
              firebase
              .database()
              .ref(`${ref}/` + index)
              .set({
                id: item.id,
                itemName: item.itemName,
                size: item.size,
                shedule: item.shedule,
                quantity: item.quantity - Number(userValue.value),
              });
            }
            
              laodData()
            issuedStock(item.itemName, item.size, item.shedule, Number(userValue.value));
          });
        }
      });
  }

  async function removeValue(btn) {
    let input = btn.previousSibling.previousSibling;
    input.value--;
  }
}

function ElectricalIssue(btn,index){
  let ref = JSON.parse(localStorage.getItem("ref"));
  let userValue = document.getElementById(`input${index}`);
  let tbody = document.getElementById("table-body");
  if (userValue.value === "") {
    toastify("Please enter the quantity first!");
  } else {
    firebase
      .database()
      .ref(ref)
      .once("value", function (snapshot) {
        let data = snapshot.val();
        let result = data.filter((item, i) => i === index);

        if (Number(userValue.value) < 0) {
          toastify("Quaintiy should be more than 0")
        } else {
          result.forEach((item) => {
            // tbody.innerHTML = "";
            if(item.quantity <= 0){
              toastify(`Sorry ${item.itemName} is not available in stock`)
            }else{
              firebase
              .database()
              .ref(`${ref}/` + index)
              .set({
                id: item.id,
                itemName: item.itemName,
                size: item.size,
                UMO: item.UMO,
                quantity: item.quantity - Number(userValue.value),
              });
            }
           
              laodData()
            issuedStock(item.itemName, item.size, item.UMO, Number(userValue.value));
          });
        }
      });
  }
  
}
function issueItem() {
  let itemName = document.getElementById("item-name").value;
  let shedule = document.getElementById("shadule").value;
  let size = document.getElementById("size").value;
  let quantity = document.getElementById("quantity").value;
  let item = {
    itemName: itemName,
    shedule: shedule,
    size: size.value,
    quantity: quantity,
  };
  firebase
    .database()
    .ref("Stock")
    .on("value", function (snapshot) {
      if (snapshot.val() === null) {
        let key = 0;
        // firebase.database().ref('Stock').child('PVC/'+ key++).set(JSON.stringify(item));
      } else {
        // let key = firebase.database().ref('Stock').child('PVC').key;
      }
    });
}

function PVCStock() {
  let loadingContainer = document.getElementById("loading-container");
  let backdrop = document.getElementById("backdrop");
  if (navigator.onLine) {
    backdrop.style.display = "flex";
    document.getElementById("scroll-btn").style.display = "block";
    loadingContainer.innerHTML = `
  <table id="available_stock_table">
      <thead id="table-head"></thead>
      <tbody id="table-body"></tbody>
  </table>`;
    let tableHead = document.getElementById("table-head");
    let tableBody = document.getElementById("table-body");
    let headerArray = ["S NO", "ITEM NAME", "SIZE", "SHEDULE", "QUANTITY"];
    let tr = document.createElement("tr");
    headerArray.forEach((item) => {
      let th = document.createElement("th");
      th.innerText = item;
      tr.appendChild(th);
    });
    tableHead.appendChild(tr);

    try{
      firebase
      .database()
      .ref("PVCStock")
      .on("value", async function (snapshot) {
        let data = await snapshot.val();
        // let tr = document.createElement("tr");
        let tableBody = document.getElementById("table-body");
        tableBody.innerHTML = "";
        data.sort().forEach((item, index) => {
          tableBody.innerHTML += `
          <tr>
          <td>${index + 1}</td>
          <td>${item.itemName}</td>
          <td>${item.size}</td>
          <td>${item.hasOwnProperty("shedule") ? item.shedule : item.UMO}</td>
          <td>${item.quantity}</td>
          </tr>
          `
         backdrop.style.display = "none";


        });
      });
    }
    catch(err){
      console.log(`=>=> error ${err}`)
    }

    $("#nav-container").hide("slow");
  } else {
    loadingContainer.innerHTML = `<h3>No Internet Access Check Your Internet Connection.</h3>`;
  }
}

function ROStock() {
  if(navigator.onLine){
    let loadingContainer = document.getElementById("loading-container");
  let backdrop = document.getElementById("backdrop");
  backdrop.style.display = "flex";
  document.getElementById("scroll-btn").style.display = "block";
  loadingContainer.innerHTML = `
  <table id="available_stock_table">
      <thead id="table-head"></thead>
      <tbody id="table-body"></tbody>
  </table>`;
  let tableHead = document.getElementById("table-head");
  let tableBody = document.getElementById("table-body");
  let headerArray = ["S NO", "ITEM NAME", "SIZE", "UMO", "QUANTITY"];
  let tr = document.createElement("tr");
  headerArray.forEach((item) => {
    let th = document.createElement("th");
    th.innerText = item;
    tr.appendChild(th);
  });
  tableHead.appendChild(tr);

    firebase
    .database()
    .ref("ROStock")
    .on("value", async function (snapshot) {
      let data = await snapshot.val();
      let tr = document.createElement("tr");
      let tableBody = document.getElementById("table-body");
      tableBody.innerHTML = "";
      data.sort().forEach((item, index) => {
        tableBody.innerHTML += `
        
          <tr>
          <td>${index + 1}</td>
          <td>${item.itemName}</td>
          <td>${item.size}</td>
          <td>${item.hasOwnProperty("shedule") ? item.shedule : item.UMO}</td>
          <td>${item.quantity}</td>
          </tr>
          `
        backdrop.style.display = "none";

      });
    });

  $("#nav-container").hide("slow");
  }else{
    console.log('No Internet Connection')
  }
}

function electricalStock() {
 if(navigator.onLine){
  let backdrop = document.getElementById("backdrop");
  let loadingContainer = document.getElementById("loading-container");
  backdrop.style.display = "flex";
  
  document.getElementById("scroll-btn").style.display = "block";
  loadingContainer.innerHTML = `
  <table id="available_stock_table">
      <thead id="table-head"></thead>
      <tbody id="table-body"></tbody>
  </table>`;
  let tableHead = document.getElementById("table-head");
  let headerArray = ["S NO", "ITEM NAME", "SIZE", "UMO", "QUANTITY"];
  let tr = document.createElement("tr");
  headerArray.forEach((item) => {
    let th = document.createElement("th");
    th.innerText = item;
    tr.appendChild(th);
  });
  tableHead.appendChild(tr);

  firebase
    .database()
    .ref("ElectricalStock")
    .on("value", async function (snapshot) {
      let data = await snapshot.val();
      let tableBody = document.getElementById("table-body");
      tableBody.innerHTML = "";
      data.sort().forEach((item, index) => {
        tableBody.innerHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.itemName}</td>
          <td>${item.size}</td>
          <td>${item.hasOwnProperty("shedule") ? item.shedule : item.UMO}</td>
          <td>${item.quantity}</td>
          </tr>
          `
        backdrop.style.display = "none";

      });     
    });

  $("#nav-container").hide("slow");
 }else{
  let loadingContainer = document.getElementById("loading-container");
   loadingContainer.innerHTML = `<h2>No Internet Access Please Check Your Internet Connection</h2>`
 }
}

function issuedItems() {
  window.location.href = "issued_items_details.html";
  document.getElementById("scroll-btn").style.display = "block";
}
function unableButtons() {
  let issueItemBtn = document.getElementById("issue-items");
  let addNewItemsBtn = document.getElementById("add-new-items");
  let addNewUserBtn = document.getElementById("add-new-user");
  let user_name = document.getElementById("user-name");
  let retrunedItems = document.getElementById("returned-items");
  let backToStore = document.getElementById('back-to-store');
  let data = JSON.parse(sessionStorage.getItem("loginStatus"));
  let { userName } = data;
  let { status } = data;
  user_name.innerText = userName;
  if (status === "Admin") {
    issueItemBtn.removeAttribute("disabled");
    addNewItemsBtn.removeAttribute("disabled");
    addNewUserBtn.removeAttribute("disabled");
    retrunedItems.removeAttribute("disabled");
    backToStore.removeAttribute('disabled')
  } else {
    issueItemBtn.setAttribute("disabled", "disabled");
    addNewItemsBtn.setAttribute("disbaled", "disabled");
    addNewUserBtn.setAttribute("disabled", "disabled");
    retrunedItems.setAttribute("disabled", "disabled");
    backToStore.setAttribute('disabled','disabled')
  }
}

window.addEventListener("load", unableButtons());

function addNewUser() {
  let userID = document.getElementById("userID");
  let userName = document.getElementById("userName");
  let userEmail = document.getElementById("userEmail");
  let userType = document.getElementById("userType");
  firebase
    .database()
    .ref("Users")
    .once("value", function (snapshot) {
      let response = snapshot.val();
      let matchFound = false;
      response.forEach((item) => {
        if (item.userEmail === userEmail.value) {
          matchFound = true;
          toastify("Sorry this email already exists!")
          userEmail.focus();
          userEmail.value = "";
        }
      });
      if (matchFound === false) {
        if (userName.value === "") {
          toastify("Please enter user name first!");
        } else if (userEmail.value === "") {
          toastify("Please enter user email first!");
        } else if (userType.value === "") {
          toastify("Please select user type first!");
        } else {
          let obj = {
            id: snapshot.val().length + 1,
            status: userType.value,
            userEmail: userEmail.value,
            userName: userName.value,
            userPassword: "",
          };
          let key = snapshot.val().length;
          firebase
            .database()
            .ref("Users/" + key)
            .set(obj);
          toastify("User has been added successfully!");
          userEmail.value = "";
          userName.value = "";
          userType.value = "";
        }
      }
    });
  
}

function addUserPage() {
  window.location.href = "add_new_user.html";
}

function returnedStock() {
  window.location.href = "returend_stock.html";
}

function addNewItems() {
  window.location.href = "add_new_item.html";
}

function userSearch() {
  let userValue = document.getElementById("search-bar").value.toLowerCase();
  if (userValue === "") {
    toastify("Please write item name first!");
  
  } else {
    firebase
      .database()
      .ref("PVCStock")
      .once("value", (snapshot) => {
        let pvcArray = snapshot.val();

        firebase
          .database()
          .ref("ROStock")
          .once("value", (snapshot) => {
            let roArray = snapshot.val();

            firebase
              .database()
              .ref("ElectricalStock")
              .once("value", (snapshot) => {
                let electricalArray = snapshot.val();
                let searchArray = [...pvcArray, ...roArray, ...electricalArray];
                let matchFound = false;
                let result = searchArray.filter((value) => {
                  return value.itemName.toLowerCase().includes(userValue);
                  // let data = value.itemName.includes(userValue.value);
                });

                searchResults(result, userValue);
              });
          });
      });
  }
}

function searchResults(result, userValue) {
  let loadingContainer = document.getElementById("loading-container");
  let inputValue = document.getElementById('search-bar');
  inputValue.value = '';
  loadingContainer.innerHTML = `
 <table id="available_stock_table">
      <thead id="table-head"></thead>
      <tbody id="table-body"></tbody>
  </table>
 
 `;
  if (result.length > 0) {
    let tableBody = document.getElementById("table-body");
    let tableHead = document.getElementById("table-head");
    result.forEach((item, index) => {
      if (item.hasOwnProperty("shedule")) {
        tableHead.innerHTML = `<tr>
    <th>S NO</th>
    <th>ITEM NAME</th>
    <th>SIZE</th>
    <th>SHEDULE</th>
    <th>QUANTITY</th>
    </tr>`;
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerText = index + 1;
        let td1 = document.createElement("td");
        td1.innerText = item.itemName;
        let td2 = document.createElement("td");
        td2.innerText = item.size;
        let td3 = document.createElement("td");
        td3.innerText = item.shedule;
        let td4 = document.createElement("td");
        td4.innerText = item.quantity;
        tr.appendChild(td);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tableBody.appendChild(tr);
      } else {
        let tableHead = document.getElementById("table-head");
        tableHead.innerHTML = `<tr>
   <th>S NO</th>
   <th>ITEM NAME</th>
   <th>SIZE</th>
   <th>UMO</th>
   <th>QUANTITY</th>
   </tr>`;
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerText = index + 1;
        let td1 = document.createElement("td");
        td1.innerText = item.itemName;
        let td2 = document.createElement("td");
        td2.innerText = item.size;
        let td3 = document.createElement("td");
        td3.innerText = item.UMO;
        let td4 = document.createElement("td");
        td4.innerText = item.quantity;
        tr.appendChild(td);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tableBody.appendChild(tr);
      }
    });
  } else {
    toastify(`Sorry ${userValue} was not found please try some other words`);
  }
}

function retrunedItemsStore (){
  // let key = JSON.parse(localStorage.getItem('returnKey'));
  // console.log(key)
  window.location.href = 'returend_details.html';
}

function toastify(val){
  Toastify({
    text: val,
    duration: 3000,
     destination: "",
     close: true,
     gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
    background: "linear-gradient(to right, #00b09b, #96c93d)",
    
     },
    onClick: function(){} // Callback after click
    }).showToast();
}

// Media query code is going here
$(document).ready(function () {
  $("#filter-btn").click(function () {
    $("#filter-container").slideToggle("slow");
  });
  $("#menu-btn").click(function () {
    $("#nav-container").show("slow");
  });

  $("#close-btn").click(function () {
    $("#nav-container").hide("slow");
  });
});

// $('#menu-btn').click(function(){
//   $('#nav-container').show('slow');

//   $('#close-btn').click(function(){
//     $('#nav-container').hide('slow')
//   })
