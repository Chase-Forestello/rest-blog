import CreateView from "../createView.js"

let me;
export default function prepareUserHTML(props) {
    me = props.me;
    console.log(me);
    // make the user's original pw available somewhere in here
    return `
        <h1>User Info</h1>
        <hr>
        <h5 id="username">Username: ${me.userName}</h5>
        <h5 id="email">Email: ${me.email}</h5>
        <hr>
        <form>
            <label for="oldpassword">Current password:</label>
            <input type="password" id="oldpassword" name="oldpassword">
            <br>
            <br>
            <label for="newpassword">New password:</label>
            <input type="password" id="newpassword" name="newpassword">
            <br>
            <br>
            <label for="confirmpassword">Confirm new password:</label>
            <input type="password" id="confirmpassword" name="confirmpassword">
            <br>
            <button id="toggleShowPassword" name="toggleShowPassword">Show Password?</button>
            <button id="updatePassword" name="updatePassword">Save New Password</button>
        </form>
        <hr>
        <p id="testp">test</p>
        <table class="table">
        <thead>
        <tr>
            <th scope="col">Title</th>
            <th scope="col">Content</th>
            <th scope="col">Categories</th>
            <th scope="col">Author</th>
        </tr>
        </thead>
        <tbody id="tbInsert">
        </tbody>
        </table>
    `;
}

export function prepareUserJS() {
    doTogglePasswordHandler();
    doSavePasswordHandler();
    showUserPosts();
}

function doSavePasswordHandler() {
    const button = document.querySelector("#updatePassword");
    button.addEventListener("click", function (event) {
        // grab the 3 password field values
        const oldPasswordField = document.querySelector('#oldpassword');
        const newPasswordField = document.querySelector('#newpassword');
        const oldPassword = oldPasswordField.value;
        const newPassword = newPasswordField.value;
        const request = {
            method: "PUT",
        }
        const url = `${USER_API_BASE_URL}/${me.id}/updatePassword?oldPassword=${oldPassword}&newPassword=${newPassword}`
        fetch(url, request)
            .then(function (response) {
                CreateView("/");
            });
    });
}

function doTogglePasswordHandler() {
    const button = document.querySelector("#toggleShowPassword");
    button.addEventListener("click", function (event) {
        // grab a reference to confirmpassword
        const oldPassword = document.querySelector("#oldpassword");
        const newPassword = document.querySelector("#newpassword");
        const confirmPassword = document.querySelector("#confirmpassword");
        if (confirmPassword.getAttribute("type") === "password") {
            confirmPassword.setAttribute("type", "text");
            oldPassword.setAttribute("type", "text");
            newPassword.setAttribute("type", "text");
        } else {
            confirmPassword.setAttribute("type", "password");
            oldPassword.setAttribute("type", "password");
            newPassword.setAttribute("type", "password");
        }
    });
}

function showUserPosts() {
    let tbInsert = document.getElementById('tbInsert');
    for (let i = 0; i < me.posts.length; i++) {
        tbInsert.innerHTML += `
        <tr>
        <td id="title">${me.posts[i].title}</td>
        <td id="content">${me.posts[i].content}</td>
        <td id="author">${me.userName}</td>
        <td class="categories"></td>
            </tr>`
    }
    let tdInsert = document.getElementsByClassName('categories');
    for (let j = 0; j < me.posts.length; j++) {
        console.log(me.posts[j].categories.length);
        console.log(me.posts[j].categories);
        for (let i = 0; i < me.posts[j].categories.length; i++) {
            console.log(me.posts[j].categories[i].name)
            tdInsert[j].innerHTML += me.posts[j].categories[i].name;
            if (i < me.posts[j].categories.length - 1) {
                tdInsert[j].innerHTML += ", ";
            }
        }
    }
}