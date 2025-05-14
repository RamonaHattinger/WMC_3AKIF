

document.addEventListener("DOMContentLoaded", async function () {
  const searchInput = document.getElementById("searchInput");
  const resetButton = document.getElementById("resetButton");
  const dropdown = document.getElementById("dropdownResults");
  const wishlist = document.getElementById("wishlist");

  let tempBook = {};
  let tempLi = null;

  // Wunschliste laden
  const stored = await fetch("/api/wishlist").then(res => res.json());
  stored.forEach(book => createWishlistItem(book));

  // 🔍 Live-Suche OpenLibrary
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    resetButton.style.display = query ? "block" : "none";

    if (query.length < 2) {
      dropdown.style.display = "none";
      return;
    }

    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        dropdown.innerHTML = "";
        if (!data.docs.length) {
          dropdown.style.display = "none";
          return;
        }

        data.docs.slice(0, 5).forEach(book => {
          const title = book.title || "No title";
          const author = book.author_name ? book.author_name.join(", ") : "Unknown author";

          const item = document.createElement("div");
          item.classList.add("dropdown-item");
          item.textContent = `${title} by ${author}`;

          item.addEventListener("click", () => {
            addToWishlist(title, author);
            searchInput.value = "";
            dropdown.style.display = "none";
            resetButton.style.display = "none";
          });

          dropdown.appendChild(item);
        });
        dropdown.style.display = "block";
      })
      .catch(() => dropdown.style.display = "none");
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") dropdown.style.display = "none";
  });

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    dropdown.style.display = "none";
    resetButton.style.display = "none";
  });

  // Hinzufügen
  async function addToWishlist(title, author) {
    const book = { title, author };
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book)
    });
    createWishlistItem(book);
  }

  function createWishlistItem({ title, author }) {
    const li = document.createElement("li");
    const textSpan = document.createElement("span");
    textSpan.textContent = `${title} by ${author}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "✖";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => {
      li.remove();
      removeFromStorage(title, author);
    });

    const addButton = document.createElement("button");
    addButton.textContent = "❤";
    addButton.classList.add("add-button");
    addButton.addEventListener("click", () => {
      openRatingModal(title, author, li);
    });

    const buttonGroup = document.createElement("div");
    buttonGroup.style.display = "flex";
    buttonGroup.appendChild(addButton);
    buttonGroup.appendChild(deleteButton);

    li.appendChild(textSpan);
    li.appendChild(buttonGroup);
    wishlist.appendChild(li);
  }

  async function removeFromStorage(title, author) {
    const list = await fetch("/api/wishlist").then(res => res.json());
    const index = list.findIndex(b => b.title === title && b.author === author);
    if (index !== -1) {
      await fetch(`/api/wishlist/${index}`, { method: "DELETE" });
    }
  }

  function openRatingModal(title, author, li) {
    tempBook = { title, author, rating: 0, note: "" };
    tempLi = li;
    document.getElementById("ratingModal").style.display = "flex";
    document.getElementById("noteInput").value = "";
    renderStars(0);
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

  document.getElementById("saveRating").addEventListener("click", async () => {
    tempBook.note = document.getElementById("noteInput").value;

    // Buch über API in die Bibliothek speichern
    await fetch("/api/library", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tempBook)
    });

    // Buch aus der Wishlist entfernen
    if (tempLi) {
      tempLi.remove();
      removeFromStorage(tempBook.title, tempBook.author);
      tempLi = null;
    }

    closeRatingModal();
  });

  document.getElementById("resetWishlist").addEventListener("click", async () => {
    if (confirm("Are you sure you want to reset your wishlist?")) {
      await fetch("/api/wishlist-reset", { method: "POST" });
      location.reload();
    }
  });
});

document.getElementById("hypno").addEventListener("click", () => {
  globalThis.location.href = "hypno.html";
});

// Aktiviert NavBar
document.querySelectorAll("nav a").forEach(link => {
  if (link.href.includes(location.pathname)) {
    link.classList.add("active");
  }
});
