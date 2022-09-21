import CreateView from "../createView.js";
import {getHeaders} from "../auth.js";
import {getUser} from "../auth.js";

let posts;

export default function PostIndex(props) {
    const postsHTML = generatePostsHTML(props.posts);
    const catHTML = generateCategoriesHTML();
    // save this for loading edits later
    posts = props.posts;
    return `
        <header>
            <h1>Posts Page</h1>
        </header>
        <main>
              <h3>Lists of posts</h3>
            <div>
                ${postsHTML}   
            </div>
            <h3>Add a post</h3>
            <form>
                <label for="title">Title</label><br>
                <input id="title" name="title" type="text" placeholder="Enter title">
                <br>
                <label for="content">Content</label><br>
                <textarea id="content" name="content" rows="10" cols="50" placeholder="Enter content"></textarea>
                <br>
                <label for="categories">Categories:</label><br>
                <select name="categories" id="categories" multiple>
                    ${catHTML}
                </select>
                <button data-id="0" id="savePost" name="savePost" class="button btn-primary">Save Post</button>
            </form>
        </main>`
}

function generateCategoriesHTML() {
    const catList = ["Tech", "Testing", "Coding", "Nature", "Gaming"];
    const categories = document.getElementById('categories');
    console.log(catList.length);
    let cats;
    for (let i = 0; i < catList.length; i++) {
        cats += `<option value=${i + 1}>${catList[i]}</option>`
    }
    return cats
}

function generatePostsHTML(posts) {
    let postsHTML = `
        <table class="table">
        <thead>
        <tr>
            <th scope="col">Title</th>
            <th scope="col">Content</th>
            <th scope="col">Categories</th>
            <th scope="col">Author</th>
        </tr>
        </thead>
        <tbody>
    `;
    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        let categories = '';
        for (let j = 0; j < post.categories.length; j++) {
            categories += post.categories[j].name;
            if (j < post.categories.length - 1) {
                categories += ", "
            }
        }
        postsHTML += `<tr>
            <td>${post.title}</td>
            <td>${post.content}</td>
            <td>${categories}</td>
            <td>${post.author.userName}</td>
            `;
        let user = getUser();
        if (user.userName === post.author.userName || user.role === 'ADMIN') {
            postsHTML += `<td><button data-id=${post.id} class="button btn-primary editPost">Edit</button></td>
            <td><button data-id=${post.id} class="button btn-danger deletePost">Delete</button></td>
        </tr>`
        } else {
            postsHTML += `<td></td><td></td></tr>`
        }

    }
    postsHTML += `</tbody></table>`;
    return postsHTML;
}

export function postSetup() {
    setupSaveHandler();
    setupEditHandlers();
    setupDeleteHandlers();
}

function setupEditHandlers() {
    // target all delete buttons
    const editButtons = document.querySelectorAll(".editPost");
    // add click handler to all delete buttons
    for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener("click", function (event) {
            // get the post id of the delete button
            const postId = parseInt(this.getAttribute("data-id"));
            loadPostIntoForm(postId);
        });
    }
}

function loadPostIntoForm(postId) {
    // go find the post in the posts data that matches postId
    const post = fetchPostById(postId);
    if (!post) {
        console.log("did not find post for id " + postId);
        return;
    }
    // load the post data into the form
    const titleField = document.querySelector("#title");
    const contentField = document.querySelector("#content");
    // NEED TO PULL CATEGORIES FOR EDITING
    const categoriesField = document.getElementById('#categories');

    const saveButton = document.querySelector("#savePost");

    titleField.value = post.title;
    contentField.value = post.content;
    saveButton.setAttribute("data-id", postId);
}

function fetchPostById(postId) {
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === postId) {
            return posts[i];
        }
    }
    // didn't find it so return something falsy
    return false;
}

function setupDeleteHandlers() {
    // target all delete buttons
    const deleteButtons = document.querySelectorAll(".deletePost");
    // add click handler to all delete buttons
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", function (event) {
            // get the post id of the delete button
            const postId = this.getAttribute("data-id");
            deletePost(postId);
        });
    }
}

function deletePost(postId) {
    const request = {
        method: "DELETE",
        headers: getHeaders(),
    }
    const url = POST_API_BASE_URL + `/${postId}`;
    fetch(url, request)
        .then(function (response) {
            // TODO: check the response code
            CreateView("/posts");
        })
}


function setupSaveHandler() {
    // trying to push categories into new post but getting back [Object object] instead of the correct
    // value which I am able to log outside of the loop...
    // Making progress but js still wont read the objects properly
    //UPDATE: IT WORKS!
    const saveButton = document.querySelector("#savePost");
    saveButton.addEventListener("click", function (event) {
        const values = Array.prototype.slice.call(document.querySelectorAll('#categories option:checked'), 0).map(function (v, i, a) {
            return v.value;
        });
        for (let i = 0; i < values.length; i++) {
            console.log(`{id: ${values[i]}}`)
        }
        // TODO: refactor later to a separate function for hygiene
        // TODO: check the data-id for the save button
        const postId = parseInt(this.getAttribute("data-id"));
        // get the title and content for the new/updated post
        const titleField = document.querySelector("#title");
        const contentField = document.querySelector("#content");
        // if(titleField.value.trim().length - 1) {
        //
        // }
        let categoriesList = [];
        for (let i = 0; i < values.length; i++) {
            categoriesList.push({id: values[i]})
        }
        console.log(categoriesList);
        // make the new/updated post object
        const post = {
            title: titleField.value,
            content: contentField.value,
            categories: categoriesList
        }
        // make the request
        const request = {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(post)
        }
        let url = POST_API_BASE_URL;
        // if we are updating a post, change the request and the url
        if (postId > 0) {
            request.method = "PUT";
            url += `/${postId}`;
        }
        fetch(url, request)
            .then(function (response) {
                // TODO: check the status code
                CreateView("/posts");
            })
    });
}
