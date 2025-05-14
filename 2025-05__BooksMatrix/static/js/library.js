document.addEventListener("DOMContentLoaded", async function () {
  console.log("Library JS active"); //Debugger

  const list = document.getElementById("libraryList");
  const sortSelect = document.getElementById("sortSelect");
  let books = await fetch("/api/library").then(res => res.json());
  let currentEditIndex = null;
  let tempBook = {};

  function renderLibrary(sortedBooks) {
    list.innerHTML = "";

    sortedBooks.forEach((book, index) => {
      const li = document.createElement("li");

      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.justifyContent = "space-between";

      const content = document.createElement("div");
      content.style.display = "flex";
      content.style.alignItems = "center";
      content.style.gap = "12px";

      const info = document.createElement("div");
      info.style.textAlign = "left";

      if (book.coverId) {
        const img = document.createElement("img");
        img.src = `https://covers.openlibrary.org/b/id/${book.coverId}-S.jpg`;
        img.alt = book.title;
        img.style.height = "60px";
        img.style.borderRadius = "4px";
        content.appendChild(img);
      }

      const title = document.createElement("div");
      title.className = "library-book-title";
      title.textContent = book.title;

      const meta = document.createElement("div");
      meta.className = "library-book-meta";
      meta.textContent = `by ${book.author} • Rating: ${"★".repeat(book.rating)}${"☆".repeat(5 - book.rating)}`;

      info.appendChild(title);
      info.appendChild(meta);

      if (book.note) {
        const note = document.createElement("div");
        note.className = "library-book-note";
        note.textContent = `"${book.note}"`;
        info.appendChild(note);
      }

      content.appendChild(info);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "✖";
      deleteButton.classList.add("delete-button");
      deleteButton.addEventListener("click", async () => {
        await fetch(`/api/library/${index}`, { method: "DELETE" });
        books = await fetch("/api/library").then(res => res.json());
        renderLibrary(books);
      });

      const editButton = document.createElement("button");
      editButton.textContent = "✏";
      editButton.classList.add("add-button");
      editButton.addEventListener("click", () => {
        openEditModal(book, index);
      });

      wrapper.appendChild(content);

      const buttonGroup = document.createElement("div");
      buttonGroup.style.display = "flex";
      buttonGroup.appendChild(editButton);
      buttonGroup.appendChild(deleteButton);

      wrapper.appendChild(buttonGroup);
      li.appendChild(wrapper);
      list.appendChild(li);

    });
  }

  function sortBooks(by) {
    const sorted = [...books];

    switch (by) {
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "author":
        sorted.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }

    renderLibrary(sorted);
  }

  function openEditModal(book, index) {
    tempBook = { ...book };
    currentEditIndex = index;
    document.getElementById("noteInput").value = book.note || "";
    renderStars(book.rating || 0);
    document.getElementById("ratingModal").style.display = "flex";
  }

  function closeRatingModal() {
    document.getElementById("ratingModal").style.display = "none";
  }

  function renderStars(selected) {
    const container = document.getElementById("starContainer");
    container.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.innerHTML = "★";
      star.classList.toggle("selected", i <= selected);
      star.addEventListener("click", () => {
        tempBook.rating = i;
        renderStars(i);
      });
      container.appendChild(star);
    }
  }

  document.getElementById("cancelRating").addEventListener("click", closeRatingModal);

  const originalSaveBtn = document.getElementById("saveRating");
  if (!originalSaveBtn) {
    console.error("saveRating button not found in DOM"); 
    return;
  }
  console.log("Save button found:", originalSaveBtn); //debugger

  const newSaveBtn = originalSaveBtn.cloneNode(true);
  originalSaveBtn.parentNode.replaceChild(newSaveBtn, originalSaveBtn);

  newSaveBtn.addEventListener("click", async () => {
    console.log("Save in library triggered");
    tempBook.note = document.getElementById("noteInput").value;

    if (currentEditIndex !== null && currentEditIndex >= 0) {
      await fetch(`/api/library/${currentEditIndex}`, { method: "DELETE" });
    }

    await fetch("/api/library", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tempBook)
    });

    books = await fetch("/api/library").then(res => res.json());
    renderLibrary(books);
    currentEditIndex = null;
    closeRatingModal();
  });

  sortSelect.addEventListener("change", () => {
    sortBooks(sortSelect.value);
  });

  sortBooks("title");
});

document.getElementById("resetLibrary").addEventListener("click", async () => {
  if (confirm("Are you sure you want to reset your entire library?")) {
    await fetch("/api/library-reset", { method: "POST" });
    location.reload();
  }
});



// Aktiviert NavBar

document.querySelectorAll("nav a").forEach(link => {
  if (link.href.includes(location.pathname)) {
    link.classList.add("active");
  }
});







document.getElementById("hypno").addEventListener("click", () => {
  globalThis.location.href = "hypno.html";
});
