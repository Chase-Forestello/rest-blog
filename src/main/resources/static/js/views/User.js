import CreateView from "../createView.js"

let me;
export default function prepareUserHTML(props) {
    me = props.me;
    // make the user's original pw available somewhere in here
    return `
        <h1>User Info</h1>
        <hr>
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
    getUserPosts();
}

function doSavePasswordHandler() {
    const button = document.querySelector("#updatePassword");
    button.addEventListener("click", function (event) {
        // grab the 3 password field values
        const oldPasswordField = document.querySelector('#oldpassword');
        const newPasswordField = document.querySelector('#newpassword');
        const confirmPasswordField = document.querySelector('#confirmpassword');

        const oldPassword = oldPasswordField.value;
        const newPassword = newPasswordField.value;
        const confirmPassword = confirmPasswordField.value;

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

async function getUserPosts() {
    const requestOptions = {
        method: "GET",
    }
    const getUserPosts = await fetch(`http://localhost:8080/api/users/4`, requestOptions)
        .then(async function (response) {
            if (!response.ok) {
                console.log("Fetch post error: " + response.status);
            } else {
                console.log("Fetch post ok");
                return await response.json();
            }
        });

    let tbInsert = document.getElementById('tbInsert');
    let titleData = document.getElementById('title');
    let contentData = document.getElementById('content');
    let authorData = document.getElementById('author');
    for (let i = 0; i < getUserPosts.posts.length; i++) {
        tbInsert.innerHTML += `
        <tr>
        <td id="title">${getUserPosts.posts[i].title}</td>
        <td id="content">${getUserPosts.posts[i].content}</td>
        <td id="author">${getUserPosts.userName}</td>
        </tr>
`;
    }
}