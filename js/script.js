const books = [];
const LOAD_BOOK = "render-book";

function makeId() {
  return +new Date();
}

function makeDataBook(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
}

function getBook(id) {
  for (const book of books) {
    if (book.id === id) {
      return book;
    }
  }
  return null;
}

function getIndex(id) {
  for (const bookIndex in books) {
    if (books[bookIndex].id === id) {
      return bookIndex;
    }
  }
  return -1;
}

function saveData() {
  const dataLocal = JSON.stringify(books);
  localStorage.setItem("STORAGE_BOOK", dataLocal);
}

function deleteBook(id) {
  const target = getIndex(id);
  books.splice(target, 1);
  document.dispatchEvent(new Event(LOAD_BOOK));
  saveData();
}

function addAlreadyReadBook(id) {
  const target = getBook(id);
  if (target == null) return;

  target.isComplete = true;
  document.dispatchEvent(new Event(LOAD_BOOK));
  saveData();
}

function undoBook(id) {
  const target = getBook(id);
  if (target == null) return;
  target.isComplete = false;
  document.dispatchEvent(new Event(LOAD_BOOK));
  saveData();
}

function makeListBook(itemBook) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = itemBook.title;

  const nameAuthor = document.createElement("p");
  nameAuthor.innerText = `Penulis : ${itemBook.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun : ${parseInt(itemBook.year)}`;

  const textContainer = document.createElement("div");
  textContainer.append(textTitle, nameAuthor, textYear);

  const containerListBook = document.createElement("div");
  containerListBook.classList.add("container-list-book");
  containerListBook.append(textContainer);
  containerListBook.setAttribute("id", `BOOK-${itemBook.id}`);

  if (itemBook.isComplete) {
    const buttonUndo = document.createElement("button");
    buttonUndo.classList.add("button-undo");
    buttonUndo.innerHTML = "Belum Selesai";

    buttonUndo.addEventListener("click", function () {
      undoBook(itemBook.id);
    });

    const buttonHapusInAlreadyReadBook = document.createElement("button");
    buttonHapusInAlreadyReadBook.classList.add("button-hapus-already-read");
    buttonHapusInAlreadyReadBook.innerHTML = "Hapus Buku";

    buttonHapusInAlreadyReadBook.addEventListener("click", function () {
      const confirmDeleteBook = confirm(
        "Apakah anda yakin menghapus data buku?"
      );
      if (confirmDeleteBook) {
        deleteBook(itemBook.id);
      } else {
        return;
      }
    });
    containerListBook.append(buttonUndo, buttonHapusInAlreadyReadBook);
  } else {
    const buttonSelesai = document.createElement("button");
    buttonSelesai.classList.add("button-selesai");
    buttonSelesai.innerHTML = "Selesai";

    buttonSelesai.addEventListener("click", function () {
      addAlreadyReadBook(itemBook.id);
    });

    const buttonHapusInUnreadBook = document.createElement("button");
    buttonHapusInUnreadBook.classList.add("button-hapus-unread");
    buttonHapusInUnreadBook.innerHTML = "Hapus Buku";

    buttonHapusInUnreadBook.addEventListener("click", function () {
      const confirmBatalBook = confirm(
        "Apakah anda yakin menghapus data buku?"
      );
      if (confirmBatalBook) {
        deleteBook(itemBook.id);
      } else {
        return;
      }
    });
    containerListBook.append(buttonSelesai, buttonHapusInUnreadBook);
  }
  return containerListBook;
}

document.addEventListener(LOAD_BOOK, function () {
  const unreadBook = document.getElementById("books");
  unreadBook.innerHTML = "";
  const alreadyreadBook = document.getElementById("alreadyread-books");
  alreadyreadBook.innerHTML = "";

  for (const itemBook of books) {
    const listBook = makeListBook(itemBook);
    if (!itemBook.isComplete) unreadBook.append(listBook);
    else alreadyreadBook.append(listBook);
  }
});

function addBooks() {
  const titleBook = document.getElementById("title").value;
  const authorBook = document.getElementById("author").value;
  const yearBook = document.getElementById("year").value;
  const checkbox = document.getElementById("check");

  const isComplete = checkbox.checked;
  const makeID = makeId();
  const dataBook = makeDataBook(
    makeID,
    titleBook,
    authorBook,
    yearBook,
    isComplete
  );
  books.push(dataBook);

  document.dispatchEvent(new Event(LOAD_BOOK));
  saveData();
}

function loadDataBookLocalStorage() {
  const allLocalDataBook = localStorage.getItem("STORAGE_BOOK");
  let data = JSON.parse(allLocalDataBook);

  if (data !== null) {
    for (const items of data) {
      books.push(items);
    }
  }
  document.dispatchEvent(new Event(LOAD_BOOK));
}

document.addEventListener("DOMContentLoaded", function () {
  const inputForm = document.getElementById("form");
  inputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBooks();
    location.reload();
  });
  loadDataBookLocalStorage();
});
