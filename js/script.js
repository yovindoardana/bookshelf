const storageKey = 'BOOK_LIST'
const books = JSON.parse(localStorage.getItem(storageKey)) || []
const RENDER_EVENT = 'render-book'
const btnmodalEdit = document.getElementById('btn-editModal')
const editModalAgree = document.getElementById('editModalAgree')
const submitEdit = document.getElementById('formEdit')

function checkForStorage() {
  return typeof Storage !== 'undefined'
}

function generateId() {
  return +new Date()
}

function getBookList() {
  if (checkForStorage()) {
    return JSON.parse(localStorage.getItem(storageKey)) || []
  } else {
    return []
  }
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem
    }
  }
  return null
}

function findBookIndex(bookId) {
  for (index in books) {
    if (books[index].id === bookId) {
      return index
    }
  }
  return -1
}

function makeBook(bookObject) {
  const { id, title, author, year, isComplete } = bookObject

  const bookTitle = document.createElement('h2')
  const bookYear = document.createElement('p')
  const bookAuthor = document.createElement('p')
  const textContainer = document.createElement('div')
  const bookContainer = document.createElement('div')
  const modifyContainer = document.createElement('div')
  const trashIcon = document.createElement('span')
  const trashButton = document.createElement('button')
  const editIcon = document.createElement('span')
  const editButton = document.createElement('button')
  const container = document.createElement('div')
  const undoIcon = document.createElement('span')
  const undoButton = document.createElement('button')
  const checkIcon = document.createElement('span')
  const checkButton = document.createElement('button')

  bookTitle.classList.add('text-xl')
  bookYear.classList.add('font-thin', 'text-sm')
  bookAuthor.classList.add('font-thin', 'text-sm')
  modifyContainer.classList.add('flex')
  trashButton.classList.add('material-symbols-outlined')
  editButton.classList.add('material-symbols-outlined')
  container.classList.add('flex', 'py-4', 'px-2', 'justify-between', 'border-b-2')
  undoButton.classList.add('material-symbols-outlined')
  checkButton.classList.add('material-symbols-outlined')
  editButton.setAttribute('data-modal-toggle', 'modal-edit')
  container.setAttribute('id', `book-${id}`)

  bookTitle.innerText = title
  bookAuthor.innerText = 'Penulis : ' + author
  bookYear.innerText = 'Tahun : ' + year
  trashIcon.innerText = 'delete'
  editIcon.innerText = 'edit'
  undoIcon.innerText = 'undo'
  checkIcon.innerText = 'check'

  bookContainer.append(bookTitle, bookAuthor, bookYear)
  trashButton.append(trashIcon)
  editButton.append(editIcon)
  container.append(bookContainer, modifyContainer)

  trashButton.addEventListener('click', function () {
    const btnConfirmDelete = document.getElementById('btnConfirmDelete')
    btnConfirmDelete.click()
    const btnDeleteAgree = document.getElementById('deleteModalAgree')
    btnDeleteAgree.addEventListener('click', function () {
      removeBook(id)
    })
  })

  editButton.addEventListener('click', function () {
    showEditModal(id)
  })

  modifyContainer.append(editButton)

  if (isComplete == true) {
    undoButton.append(undoIcon)
    undoButton.addEventListener('click', function () {
      showConfirmModal(id)
    })
    modifyContainer.append(undoButton)
  } else {
    checkButton.append(checkIcon)
    checkButton.addEventListener('click', function () {
      showConfirmModal(id)
    })
    modifyContainer.append(checkButton)
  }
  modifyContainer.append(trashButton)
  return container
}

function showConfirmModal(bookId) {
  const bookTarget = findBook(bookId)
  document.getElementById('btnConfirm').click()
  document.getElementById('editBookIdConfirm').value = bookTarget.id
}

function addBook() {
  const bookTitle = document.getElementById('fJudul').value
  const bookAuthor = document.getElementById('fPenulis').value
  const bookYear = document.getElementById('fTahun').value
  let checkbox = document.getElementById('isComplete')
  let isComplete

  if (checkbox.checked) {
    isComplete = true
  } else {
    isComplete = false
  }

  const generatedID = generateId()
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isComplete)
  books.push(bookObject)

  localStorage.setItem(storageKey, JSON.stringify(books))
  document.dispatchEvent(new Event(RENDER_EVENT))
}

function addBookToReaded(bookId) {
  const bookTarget = findBook(bookId)
  if (bookTarget == null) return

  bookTarget.isComplete = true
  document.dispatchEvent(new Event(RENDER_EVENT))
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId)
  if (bookTarget === -1) return
  books.splice(bookTarget, 1)

  document.dispatchEvent(new Event(RENDER_EVENT))
}

function undoBookFromReaded(bookId) {
  const bookTarget = findBook(bookId)
  if (bookTarget == null) return

  bookTarget.isComplete = false
  document.dispatchEvent(new Event(RENDER_EVENT))
}

function showEditModal(bookId) {
  const bookTarget = findBook(bookId)
  btnmodalEdit.click()

  var formJudul = document.getElementById('fEditJudul')
  var formPenulis = document.getElementById('fEditPenulis')
  var formTahun = document.getElementById('fEditTahun')
  let checkbox = document.getElementById('isEditComplete')
  document.getElementById('editBookId').value = bookId

  if (bookTarget.isComplete) {
    checkbox.checked = true
  } else {
    checkbox.checked = false
  }

  formJudul.value = bookTarget.title
  formPenulis.value = bookTarget.author
  formTahun.value = bookTarget.year
}
function editBook(bookId) {
  const bookTarget = findBook(bookId)
  bookTarget.title = document.getElementById('fEditJudul').value
  bookTarget.author = document.getElementById('fEditPenulis').value
  bookTarget.year = document.getElementById('fEditTahun').value
  let checkbox = document.getElementById('isEditComplete')

  if (checkbox.checked) {
    bookTarget.isComplete = true
  } else {
    bookTarget.isComplete = false
  }
}
function search() {
  if (document.getElementById('search').value == '') {
    document.dispatchEvent(new Event(RENDER_EVENT))
  } else {
  }

  let containTitle = books.filter(function (book) {
    searchForm = document.getElementById('search').value
    return book.title.toLowerCase().includes(searchForm)
  })
  let containAuthor = books.filter(function (book) {
    searchForm = document.getElementById('search').value
    return book.author.toLowerCase().includes(searchForm)
  })
  let containYear = books.filter(function (book) {
    searchForm = document.getElementById('search').value
    return book.year.includes(searchForm)
  })

  const readedBOOKList = document.getElementById('readed-books')
  const unreadedBOOKList = document.getElementById('unreaded-books')

  readedBOOKList.innerHTML = ''
  unreadedBOOKList.innerHTML = ''

  for (bookItem of containTitle) {
    const bookElement = makeBook(bookItem)
    if (bookItem.isComplete === true) {
      readedBOOKList.append(bookElement)
    } else {
      unreadedBOOKList.append(bookElement)
    }
  }
  for (bookItem of containAuthor) {
    const bookElement = makeBook(bookItem)
    if (bookItem.isComplete === true) {
      readedBOOKList.append(bookElement)
    } else {
      unreadedBOOKList.append(bookElement)
    }
  }
  for (bookItem of containYear) {
    const bookElement = makeBook(bookItem)
    if (bookItem.isComplete === true) {
      readedBOOKList.append(bookElement)
    } else {
      unreadedBOOKList.append(bookElement)
    }
  }
}

function reset() {
  document.dispatchEvent(new Event(RENDER_EVENT))
}

submitEdit.addEventListener('submit', function (event) {
  event.preventDefault()
  const bookId = document.getElementById('editBookId').value
  editBook(bookId)
  btnmodalEdit.click()
  document.dispatchEvent(new Event(RENDER_EVENT))
})

editModalAgree.addEventListener('click', function (event) {
  event.preventDefault()
  const bookId = document.getElementById('editBookIdConfirm').value
  const bookTarget = findBook(bookId)
  console.log(bookTarget)
  if (bookTarget.isComplete == true) {
    undoBookFromReaded(bookTarget.id)
  } else {
    addBookToReaded(bookTarget.id)
  }
  document.dispatchEvent(new Event(RENDER_EVENT))
})

window.addEventListener('load', function () {
  if (checkForStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      document.dispatchEvent(new Event(RENDER_EVENT))
    }
  } else {
    alert('Browser yang Anda gunakan tidak mendukung Web Storage')
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form')

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault()
    addBook()
  })
})

document.addEventListener(RENDER_EVENT, function () {
  const readedBOOKList = document.getElementById('readed-books')
  const unreadedBOOKList = document.getElementById('unreaded-books')

  readedBOOKList.innerHTML = ''
  unreadedBOOKList.innerHTML = ''

  for (bookItem of books) {
    const bookElement = makeBook(bookItem)
    if (bookItem.isComplete === true) {
      readedBOOKList.append(bookElement)
    } else {
      unreadedBOOKList.append(bookElement)
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(books))
})
