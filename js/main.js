// Create an element with text provided and possibly a class
// Defaults to a <p></p> tag if no element is passed in.
const createElemWithText = (tag = 'p', content = '', className) => {
    // Create the element and assign the text received
    const elem = document.createElement(tag);
    elem.textContent = content;

    // If we receive a class, attach it to the element
    if(className) elem.classList.add(className);

    // Return the created element
    return elem;
}

// Create an array of options elements labeled witht the names of
// users provided to the function
const createSelectOptions = (users) => {
    // Only continue if we receive users
    if(!users) return;

    // Create the array of options elements
    const options = [];
    users.forEach(user => {
        const option = createElemWithText('option', user.name);
        option.value = user.id;
        options.push(option);
    });

    // Return the array of options
    return options;
}

// A funtion to toggle the visibilty of a given group of comments identified
// by the post ID
const toggleCommentSection = (postId) => {
    // Only continue if there is a postId
    if(!postId) return;

    // Select the section identified by postId
    const section = document.querySelector(`section[data-post-id='${postId}']`);

    // No section found with postId, nothing more to do.
    if(!section) return null;

    // A section identified by postId was found, toggle visibility.
    section.classList.toggle("hide");

    // Return the section found to the caller
    return section;
}

// A function to toggle the text label on a comments button
const toggleCommentButton = (postId) => {
    // Only continue if there is a postId
    if(!postId) return;

    // Select the button identified by postId
    const button = document.querySelector(`button[data-post-id='${postId}']`);

    // A button with postId was not found, nothing to do.
    if(!button) return null;

    // Found a button identified by postId, toggle the label on the button.
    button.textContent === 'Show Comments'
        ? button.textContent = 'Hide Comments'
        : button.textContent = 'Show Comments';

    // Return the button found to the caller
    return button;
}

// This function removes all child elements of the given HTML Element
const deleteChildElements = (parentElement) => {
    // The given element is not an HTML Element. Nothing to do.
    if(!(parentElement instanceof HTMLElement)) return;

    // Clear all children of the parentElement by removing the lastChild
    // repeatedly until there are no children left.
    let child = parentElement.lastChild;
    while(child != null) {
        parentElement.removeChild(child);
        child = parentElement.lastChild;
    }

    // Return the parentElement with all children removed to the caller
    return parentElement;
}

// A function to add a click listener to the button of each post.
const addButtonListeners = () => {
    // Select all of the buttons in main.
    const buttons = document.querySelectorAll('main button');

    // Add the click listener for toggleComments to each button
    buttons.forEach(button => {button.addEventListener("click", (event) => {
        const postId = button.dataset.postId;
        return toggleComments(event, postId);
    }, false)});

    // Return all buttons with click listeners attached
    return buttons;
}

// This function removes the click listener from each button.
const removeButtonListeners = () => {
    // Find all of the buttons in the main element
    const buttons = document.querySelectorAll('main button');

    // Remove the click listener from each button
    buttons.forEach(button => {
        button.removeEventListener("click", toggleComments, false);
    });

    // Return all buttons with click listeners removed
    return buttons;
}

// Construct a document fragment containing all of the the comments passed to it
const createComments = (comments) => {
    // No comments received, do nothing else
    if(!comments) return;

    // Comments received, create the comments fragment for each comment received
    const fragment = new DocumentFragment();
    comments.forEach(comment => {
        const article = document.createElement('article');
        const h3 = createElemWithText('h3', comment.name);
        const body = createElemWithText('p', comment.body);
        const email = createElemWithText('p', `From: ${comment.email}`);
        article.append(h3, body, email);
        fragment.append(article);
    });

    // Return the document fragment to the caller
    return fragment;
}

// This function fills the drop-down menu used to select a user.
const populateSelectMenu = (users) => {
    // No users to append. Do nothing.
    if(!users) return;

    // Users found. Populate the select menu with an options list.
    const selectMenu = document.getElementById('selectMenu');
    const selectOptions = createSelectOptions(users);
    selectOptions.forEach(option => selectMenu.append(option));

    // Return the populated select menu to the caller.
    return selectMenu;
}

// An async function that retrieves the users with the fetch api
const getUsers = async () => {
    // Try to get users data from typicode.
    try {
        const users = await fetch('https://jsonplaceholder.typicode.com/users');
        return await users.json();
    }
    // Catch any errors and report them to the console.
    catch(error) {
        console.error(error);
    }
}

// An async function that retrieves the user posts with the fetch api where the
// user ID = userId.
const getUserPosts = async (userId) => {
    // Try to get user post data from typicode.
    try {
        // No userId received. Do nothing more.
        if(!userId) return;

        // userId received. Get all posts for this user ID.
        const posts = await fetch(`https://jsonplaceholder.typicode.com/posts/?userId=${userId}`);
        return await posts.json();
    }
    // Catch any errors and report them to the console.
    catch(error) {
        console.error(error);
    }
}

// An async function that retrieves the user information with the fetch api where
// the user ID = userId.
const getUser = async (userId) => {
    try {
        // No userId received. Do nothing more.
        if(!userId) return;

        // userId received. Get all posts for this user ID.
        const user = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        return await user.json();
    }
    // Catch any errors and report them to the console.
    catch(error) {
        console.error(error);
    }
}

// An async function that retrieves the comments of the post with the fetch api
// where the post ID = postId.
const getPostComments = async (postId) => {
    try {
        // No postId received. Nothing to do.
        if(!postId) return;

        // postId received. Fetch all comments for this post.
        const comments = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        return await comments.json();
    }
    // Catch any errors and report them to the console.
    catch(error) {
        console.error(error);
    }
}

// This async fucntion creates the section of comments for this post identified
// by postId.
const displayComments = async (postId) => {
    try {
        // No postId received. Nothing to do.
        if(!postId) return;

        // postId received. Create a section of comments for the given post.
        const section = document.createElement('section');
        section.dataset.postId = postId;
        section.classList.add('comments');
        section.classList.add('hide');
        const comments = await getPostComments(postId);
        const fragment = createComments(comments);
        section.append(fragment);
        return section;
    }
    // Catch any errors and report them to the console.
    catch(error) {
        console.error(error);
    }
}

// An async function to create a document fragment consisting of an article for
// each post in the group of posts passed to it.
const createPosts = async (posts) => {
    try {
        // No posts received. Do nothing.
        if(!posts) return;

        // posts received. Create a fragment with an article element for each
        // post found in the group of posts passed to it.
        const fragment = document.createDocumentFragment();
        for(const post of posts) {
            const article = document.createElement('article');
            const h2 = createElemWithText('h2', `${post.title}`);
            const body = createElemWithText('p', `${post.body}`);
            const id = createElemWithText('p', `Post ID: ${post.id}`);
            const author = await getUser(post.userId);
            const byline = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
            const phrase = createElemWithText('p', `${author.company.catchPhrase}`);
            const button = createElemWithText('button', 'Show Comments');
            button.dataset.postId = post.id;
            const section = await displayComments(post.id);
            article.append(h2, body, id, byline, phrase, button, section);
            fragment.append(article);
        }
        return fragment;
    }
    // Catch any errors and report them to the console.
    catch(error) {
        console.error(error);
    }
}

// This async function calls create posts if a list of posts are available.
// Otherwise, it displays default text.
const displayPosts = async (posts) => {
    // Get the main element
    const main = document.querySelector('main');

    // Create an element variable to store the results of the function.
    let element;

    // If no posts, display default text
    if (!posts) {
        element = main.querySelector('.default-text');
    }
    else { // Posts passed in, display them.
        element = await createPosts(posts);
    }

    // Append the element to main and return it.
    main.append(element);
    return element;
}

// The toggle comments function returns an array with the results of calling
// toggleCommentsSection and toggleCommentsButton for the given postId.
const toggleComments = (e, postId) => {
    // No postId or event received. Do nothing.
    if(!postId || !e) return;

    // Pass a test.
    e.target.listener = true;

    // postId and event e found. Create the comment array and return it.
    comment = [toggleCommentSection(postId), toggleCommentButton(postId)];
    return comment;
}

// An async function that ensures all previous posts are removed before new
// posts are shown on the page.
const refreshPosts = async (posts) => {
    // No posts received. Do nothing.
    if(!posts) return;

    // Received posts. Remove old posts and append new posts.
    // Return the results of the functions below to the caller.
    let main = document.querySelector('main');
    const fragment = document.createDocumentFragment();
    return [removeButtonListeners(),
        deleteChildElements(main),
        fragment.append = await displayPosts(posts),
        addButtonListeners()];
}

// This async function handles menu change events.
const selectMenuChangeEventHandler = async (e) => {
    // No event value provided. Nothing to do.
    if(!e) return;

    // An event value was provided.
    selectMenu.disabled = true;

    // Provide a userId if available or default to userId = 1
    const userId = e?.target?.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    selectMenu.disabled = false;

    // Return an array of the results of the function calls above.
    return [userId, posts, refreshPostsArray];
}

// An async funtion to initialize the page.
const initPage = async () => {
    // Get the list of users, populate the select menu with them and return
    // the results as an array.
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

// Initialize the entire app.
const initApp = () => {
    initPage();
    const selectMenu = document.getElementById('selectMenu');
    selectMenu.addEventListener('change', selectMenuChangeEventHandler, false);
}

// Add a listener to initialize the app when the DOM Content is fully loaded.
document.addEventListener('DOMContentLoaded', initApp, false);