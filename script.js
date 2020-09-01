const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkFrom = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const webstieUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

function showModal() {
  modal.classList.add('show-modal');
  websiteNameEl.focus();
}

function hideModal() {
  modal.classList.remove('show-modal');
}

function hideModalEvent(e) {
  if (e.target === modal) {
    modal.classList.remove('show-modal');
  }
}

function validate(nameValue, urlValue) {
  const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields.');
  }
  if (!urlValue.match(expression)) {
    alert('Please provie a valid web adress');
    return false;
  }
  return true;
}

function storeBookmark(e) {
  e.preventDefault();

  const nameValue = websiteNameEl.value;
  let urlValue = webstieUrlEl.value;
  if (!urlValue.includes('https://', 'http://')) {
    urlValue = `https://${urlValue}`;
  }

  if (!validate(nameValue, urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookMarks();
  bookmarkFrom.reset();
  webstieUrlEl.focus();
}

function buildBookmarks() {
  bookmarks.forEach((bookmark) => {
    createItem(bookmark);
  });
}

function createItem(bookmark) {
  const { name, url } = bookmark;
  const item = document.createElement('div');
  item.classList.add('item');

  const closeIcon = createCloseIcon(url);
  const linkInfo = createLinkInfo(url, name);
  item.append(closeIcon, linkInfo);

  bookmarksContainer.appendChild(item);
}

function createLinkInfo(url, name) {
  const linkInfo = document.createElement('div');
  linkInfo.classList.add('name');

  const favicon = createFavicon(url);
  const link = createLink(url, name);

  linkInfo.append(favicon, link);
  return linkInfo;
}

function createCloseIcon(url) {
  const closeIcon = document.createElement('i');
  closeIcon.classList.add('fas', 'fa-trash-alt');
  closeIcon.setAttribute('title', 'Delete Bookmark');
  closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
  return closeIcon;
}

function createLink(url, name) {
  const link = document.createElement('a');
  link.setAttribute('href', `${url}`);
  link.setAttribute('target', '_blank');
  link.textContent = name;
  return link;
}

function createFavicon(url) {
  const favicon = document.createElement('img');
  favicon.setAttribute(
    'src',
    `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
  );
  favicon.setAttribute('alt', 'Favicon');
  return favicon;
}

function fetchBookMarks() {
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    bookmarks = [
      {
        name: 'stackoverflow',
        url: 'https://stackoverflow.com/',
      },
    ];

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

bookmarkFrom.addEventListener('submit', storeBookmark);
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', hideModal);
window.addEventListener('click', hideModalEvent);
fetchBookMarks();
