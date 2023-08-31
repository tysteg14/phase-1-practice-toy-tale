document.addEventListener("DOMContentLoaded", () => {
  let addToy = false;

  const addBtn = document.querySelector("#new-toy-btn");
  const toyForm = document.querySelector(".add-toy-form");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyUrl = "http://localhost:3000/toys"; // Replace with your actual API endpoint

  // Fetch and display existing toys
  fetchAndDisplayToys();

  // Add event listener for form submission
  toyForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = event.target.name.value;
    const image = event.target.image.value;

    const newToy = {
      name: name,
      image: image,
      likes: 0
    };

    fetch(toyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(data => {
        toyForm.reset();
        displayToy(data);
      });
  });

  function fetchAndDisplayToys() {
    fetch(toyUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        data.forEach(displayToy);
      });
  }

  function displayToy(toy) {
    const card = document.createElement("div");
    card.classList.add("card");

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.alt = toy.name;
    img.classList.add("toy-avatar");

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const button = document.createElement("button");
    button.classList.add("like-btn");
    button.id = toy.id;
    button.textContent = "Like ❤️";

    button.addEventListener("click", () => {
      updateLikeCount(toy.id, p);
    });

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(button);

    toyCollection.appendChild(card);
  }

  function updateLikeCount(toyId, likeElement) {
    const currentLikes = parseInt(likeElement.textContent);
    const newLikes = currentLikes + 1;

    const updatedToyData = {
      likes: newLikes
    };

    fetch(`${toyUrl}/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(updatedToyData)
    })
      .then(response => response.json())
      .then(updatedToy => {
        likeElement.textContent = `${updatedToy.likes} Likes`;
      });
  }
});