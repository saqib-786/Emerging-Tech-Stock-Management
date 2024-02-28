// Showing Time & day
function timeDate() {
  let dayContainer = document.getElementById("day-container");
  let dateContainer = document.getElementById("date-container");
  let monthContainer = document.getElementById("month-container");
  let yearContainer = document.getElementById("year-container");
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let monthOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let date = new Date();
  let day = date.getDay();
  let tdoay = daysOfWeek[day];
  dayContainer.innerText = tdoay;
  let todayDate = date.getDate();
  dateContainer.innerText = todayDate;
  let month = date.getMonth();
  let thisMonth = monthOfYear[month];
  monthContainer.innerText = thisMonth;
  let year = date.getFullYear();
  yearContainer.innerText = year;
}

timeDate();

function userLogin(event) {
  let userEmail = document.getElementById("user-email");
  let userPassword = document.getElementById("user-password");
  let loginContainer = document.getElementById("login-container");
  let passwordIcon = document.getElementById("password-icon");
  let backdrop = document.getElementById("backdrop");
  if (userEmail.value === "") {
    alert("Please enter your email first!");
  } else if (userPassword.value === "") {
    alert("Please enter your password first!");
  } else {
    let promise = new Promise(function (resolve, reject) {
      firebase
        .database()
        .ref("Users")
        .once("value", function (snapshot) {
          let data = snapshot.val();

          if (data !== "") {
            resolve(data);
          } else {
            reject(snapshot.get());
          }
          // resolve(snapshot.val());
          // reject('Something went wrong')
        });
    });

    promise.then((data) => {
      let matchFound = false;
      data.forEach((val) => {
        if (
          userEmail.value === val.userEmail &&
          userPassword.value === val.userPassword
        ) {
            matchFound = true;
          loginContainer.style.filter = "blur(8px)";
          backdrop.style.display = "flex";
          setTimeout(() => {
            sessionStorage.setItem(
              "loginStatus",
              JSON.stringify({
                userName: val.userName,
                status: val.status,
                loginStatus: true,
              })
            );
            // localStorage.setItem("name&status",JSON.stringify({'userName':val.userName,"status":val.status}));
            window.location.replace("available_stock.html");
            // logoutUserBtn.style.display = 'block';
            // sessionStorage.setItem('loginStatus', true);
          }, 3000);
          userEmail.value = "";
          userPassword.value = "";
        }
      });
      if (matchFound === false) {
        alert("Sorry incorrect email or password");
        userEmail.value = "";
        userPassword.value = "";
        passwordIcon.style.display = "none";
      }
    });

    promise.catch((error) => {
      console.error(error);
    });
  }
}

window.addEventListener("load", function () {
  let loginStatus = JSON.parse(this.sessionStorage.getItem("loginStatus"));
  let logoutBtn = this.document.getElementById("logout-user");
  if (loginStatus) {
    logoutBtn.style.display = "block";
  } else {
    logoutBtn.style.display = "none";
  }
});

// admin login funcationaltiy goes here

function adminLogin() {
  let adminEmail = document.getElementById("admin-email");
  let adminPassword = document.getElementById("admin-password");
  firebase
    .database()
    .ref("Admin")
    .once("value", async function (snapshot) {
      let data = await snapshot.val();
      if (data !== "") {
        data.forEach((val) => {
          console.log(val.name, val.email, val.password);
        });
      } else {
        alert("Something Went Wrong");
      }
    });
}

// dark mode function goes here

function darkMode() {
  document.getElementById("body").classList.toggle("dark-mod");
  document.getElementById("nav").classList.toggle("nav-dark");
  document.getElementById("nav-container").classList.toggle("nav-dark");
  // console.log('working...');
}

function userActivation() {
  window.location.href = "user_activation.html";
}

function showPassword() {
  let userPassword = document.getElementById("user-password");
  let passwordIcon = document.getElementById("password-icon");
  let adminPassword = document.getElementById("admin-password");
  if (userPassword.type === "password") {
    userPassword.type = "text";
    passwordIcon.src = "./Images/hidden.png";
  } else {
    userPassword.type = "password";
    passwordIcon.src = "./Images/eye.png";
  }
}

function showAdminPassword() {
  let adminPassword = document.getElementById("admin-password");
  let passwordIcon = document.getElementById("password-icon");
  if (adminPassword.type === "password") {
    adminPassword.type = "text";
    passwordIcon.src = "./Images/hidden.png";
  } else {
    adminPassword.type = "password";
    passwordIcon.src = "./Images/eye.png";
  }
}

// firebase.database().ref('Users').once('value', async function(snapshot){
//     let userName = document.getElementById('userName');
//     let data = await snapshot.val();
//     data.forEach((val)=>{
//         userName.innerHTML = val.userName;
//     })
// })

function stockReport() {
  // let isLogin = sessionStorage.getItem(JSON.parse('loginStatus'));
  let isLogin = JSON.parse(sessionStorage.getItem("loginStatus"));
  if (isLogin) {
    window.location.href = "available_stock.html";
  } else {
    alert("Please login first");
    window.location.replace("index.html");
  }
}

function logoutUser() {
  if (confirm("Are you really want to logout?")) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("index.html");
  }
}

function issueStock() {
  window.location.href = "issue_stock.html";
}

function userEmailConfirmation() {
  let userEmail = document.getElementById("userEmail");
  let activationContainer = document.getElementById("activation-container");
  if (userEmail.value === "") {
    alert("Please enter your email first!");
  } else {
    firebase
      .database()
      .ref("Users")
      .once("value", async function (snapshot) {
        let response = await snapshot.val();
        let matchFound = false;
        let backdrop = document.getElementById("backdrop");
        response.forEach((item) => {
          if (
            userEmail.value === item.userEmail &&
            item.userPassword.length > 0
          ) {
            matchFound = true;
            alert("Sorry this email have already an account!");
            userEmail.value = "";
          } else if (userEmail.value === item.userEmail) {
            matchFound = true;
            let ID = item.id;
            getKey(ID);
            backdrop.style.display = "flex";
            setTimeout(() => {
              backdrop.style.display = "none";
            }, 3000);
            activationContainer.innerHTML = `
                <form onsubmit="event.preventDefault()">
                <h3>User Activation</h3>
                <table>
                <tr>
                <td>Password</td>
                <td>
                <input id="password" class="activation-input new-pvc" required type="password" placeholder="Password">
                <img src="./Images/eye.png" />
                </td>
                <tr>
                <tr>
                <td>Confirm <br> Password</td>
                <td>
                <input id="confirmPassword" class="activation-input new-pvc" required type="password" placeholder=" Confirm Password">
                <img src="./Images/eye.png" />
                </td>
                </tr>
                <table>
                <input onclick="userPasswordConfirmation()" class="new-item-btn" type="submit">
                <form>
                `;
          }
        });
        if (matchFound === false) {
          alert("Sorry this email not found");
          userEmail.value = "";
        }
      });
  }
}

var ID = null;
function getKey(id) {
  ID = id;
}

function userPasswordConfirmation() {
  let password = document.getElementById("password");
  let confirmPassword = document.getElementById("confirmPassword");
  if (password.value !== confirmPassword.value) {
    alert("Password did not match check your password");
    confirmPassword.focus();
  } else {
    firebase
      .database()
      .ref("Users")
      .once("value", async function (snapshot) {
        let response = await snapshot.val();
        let key = ID - 1;
        response.forEach((item) => {
          if (item.id === ID) {
            firebase
              .database()
              .ref("Users/" + key)
              .set({
                id: item.id,
                status: item.status,
                userEmail: item.userEmail,
                userName: item.userName,
                userPassword: password.value,
              });
          }
        });
      });
    alert("Password has been set");
    window.location.replace("index.html");
  }
}

function itemsDetails(id){
  
  localStorage.setItem('itemsId',JSON.stringify(id))
  window.location.href = 'issued_items.html';


}

// jquery code goes here

$(document).ready(function () {
  // $('#filter-btn').click(function(){
  //     $('#filter-container').slideToggle('slow');
  // });

  $("#admin-user").click(function () {
    // console.log('working...')
    $("#first-container").hide("slow");
    // $('#user-login').show('fast').css('transition','none');
    $("#user-login").toggle("fast").css("transition", "");
    $("#second-container").show("slow");
    // $('#admin-user').hide('fast').css('transition','none');
    $("#admin-user").toggle("fast").css("transition", "");
    document.getElementById("admin-email").value = "";
    document.getElementById("admin-password").value = "";
  });

  $("#user-login").click(function () {
    $("#first-container").show("slow");
    $("#second-container").hide("slow");
    // $('#user-login').hide('fast').css('transition','none');
    $("#user-login").toggle("fast").css("transition", "");
    // $('#admin-user').show('fast').css('transition','none');
    $("#admin-user").toggle("fast").css("transition", "");
  });

  // $('#close-btn').click(function(){
  //     $('#nav-container').hide('slow');
  //     // console.log('working....')
  // })
});
