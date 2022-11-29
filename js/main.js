const createElemWithText = (tag = 'p', content = '', className) => {
    const elem = document.createElement(tag);
    elem.textContent = content;

    if(className) elem.classList.add(className);

    return elem;
}

const createSelectOptions = (users) => {
    if(!users) return;

    const options = [];
    users.forEach(user => {
        const option = createElemWithText('option', user.name);
        option.value = user.id;
        options.push(option);
    });
    return options;
}

const toggleCommentSection = (postId) => {
    if(!postId) return;
    const section = document.querySelector(`section[data-post-id='${postId}']`);
    if(!section) return null;
    section.classList.toggle("hide");
    return section;
}

const toggleCommentButton = (postId) => {
    if(!postId) return;
    const button = document.querySelector(`button[data-post-id='${postId}']`);
    if(!button) return null;
    button.textContent === 'Show Comments'
        ? button.textContent = 'Hide Comments'
        : button.textContent = 'Show Comments';
    return button;
}

const deleteChildElements = (parentElement) => {
    if(!(parentElement instanceof HTMLElement)) return;
    let child = parentElement.lastChild;
    while(child != null) {
        parentElement.removeChild(child);
        child = parentElement.lastChild;
    }
    return parentElement;
}

const addButtonListeners = () => {
    const buttons = document.querySelectorAll('main button');
    buttons.forEach(button => {button.addEventListener("click", (event) => {
        const postId = button.dataset.postId;
        return toggleComments(event, postId);
    }, false)});
    return buttons;
}

const removeButtonListeners = () => {
    const main = document.querySelector('main');
    const buttons = document.querySelectorAll('main button');
    for(let i = 0; i < buttons.length; ++i) {
        buttons[i].removeEventListener("click", toggleComments, false);
    }
    return buttons;
}

const createComments = (comments) => {
    if(!comments) return;
    const fragment = new DocumentFragment();
    comments.forEach(comment => {
        const article = document.createElement('article');
        const h3 = createElemWithText('h3', comment.name);
        const body = createElemWithText('p', comment.body);
        const email = createElemWithText('p', `From: ${comment.email}`);
        article.append(h3, body, email);
        fragment.append(article);
    });
    return fragment;
}

const populateSelectMenu = (comments) => {
    if(!comments) return;
    const selectMenu = document.getElementById('selectMenu');
    const selectOptions = createSelectOptions(comments);
    selectOptions.forEach(option => selectMenu.append(option));
    return selectMenu;
}

const getUsers = async () => {
    try {
        const users = await fetch('https://jsonplaceholder.typicode.com/users');
        return await users.json();
    }
    catch(error) {
        console.error(error);
    }
}

const getUserPosts = async (userId) => {
    try {
        if(!userId) return;
        const posts = await fetch(`https://jsonplaceholder.typicode.com/posts/?userId=${userId}`);
        return await posts.json();
    }
    catch(error) {
        console.error(error);
    }
}

const getUser = async (userId) => {
    try {
        if(!userId) return;
        const user = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        return await user.json();
    }
    catch(error) {
        console.error(error);
    }
}

const getPostComments = async (postId) => {
    try {
        if(!postId) return;
        const comments = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        return await comments.json();
    }
    catch(error) {
        console.error(error);
    }
}

const displayComments = async (postId) => {
    try {
        if(!postId) return;
        const section = document.createElement('section');
        section.dataset.postId = postId;
        section.classList.add('comments');
        section.classList.add('hide');
        const comments = await getPostComments(postId);
        const fragment = createComments(comments);
        section.append(fragment);
        return section;
    }
    catch(error) {
        console.error(error);
    }
}

const createPosts = async (posts) => {
    try {
        if(!posts) return;
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
    catch(error) {
        console.error(error);
    }
}

const displayPosts = async (posts) => {
    const main = document.querySelector('main');
    let element;
    if (!posts) {
        element = main.querySelector('.default-text');
    }
    else {
        element = await createPosts(posts);
    }
    main.append(element);
    return element;
}

const toggleComments = (e, postId) => {
    if(!postId) return;
    comment = [toggleCommentSection(postId), toggleCommentButton(postId)];
    return comment;
}

const refreshPosts = async (posts) => {
    if(!posts) return;
    let main = document.querySelector('main');
    const fragment = document.createDocumentFragment();
    return [removeButtonListeners(),
        deleteChildElements(main),
        fragment.append = await displayPosts(posts),
        addButtonListeners()];
}

const selectMenuChangeEventHandler = async (e) => {
    if(!e) return;
    selectMenu.disabled = true;
    const userId = e?.target?.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    selectMenu.disabled = false;
    return [userId, posts, refreshPostsArray];
}

const initPage = async () => {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

const initApp = () => {
    initPage();
    const selectMenu = document.getElementById('selectMenu');
    selectMenu.addEventListener('change', selectMenuChangeEventHandler, false);
}

document.addEventListener('DOMContentLoaded', initApp, false);