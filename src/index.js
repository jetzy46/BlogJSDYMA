import "./assets/styles/style.scss";
import "./index.scss";

const articlesContainer = document.querySelector(".articles-container");
const categoriesContainer = document.querySelector(".categories");
const selectElement = document.querySelector("select");
let articles;
let filter;
let sortBy = "desc";

const createArticles = () => {
  const articlesSet = articles
    .filter((article) => {
      if (filter) {
        return article.category === filter;
      } else {
        return true;
      }
    })
    .map((art) => {
      const article = document.createElement("div");
      article.classList.add("article");
      article.innerHTML = `
    <div class="article-title-container">
      <h2>${art.title}</h2>
      <p>Publié le ${new Date(art.createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })}</p>
      </div>
      <div class="article-author-container">
        <img src="${art.img}" alt="${art.author}" />
        <h4 class="article-author">${art.author}</h4>
      </div>
      <p class="article-content">${art.content}</p>
      <div class="article-actions">
        <button class="btn btn-error" data-id=${art._id}>Supprimer</button>
        <button class="btn btn-primary" data-id=${art._id}>Modifier</button>
      </div>
        `;
      return article;
    });
  articlesContainer.innerHTML = "";
  articlesContainer.append(...articlesSet);

  // Bouton supprimer sur chaque article

  const deleteButtons = articlesContainer.querySelectorAll(".btn-error");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (e) => {
      try {
        const target = e.target;
        const articleID = target.dataset.id;
        const response = await fetch(
          `https://restapi.fr/api/jetarticles/${articleID}`,
          {
            method: "DELETE",
          }
        );
        const body = await response.json();
        fetchArticles();
      } catch (error) {}
    });
  });

  // Boutton modifier sur chaque article

  const editButtons = articlesContainer.querySelectorAll(".btn-primary");
  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.target;
      const articleID = target.dataset.id;
      location.assign(`/form.html?id=${articleID}`);
    });
  });
};

// Création du menu avec les categorie des articles

const createMenuCategoris = () => {
  const categories = articles.reduce((acc, article) => {
    if (acc[article.category]) {
      acc[article.category]++;
    } else {
      acc[article.category] = 1;
    }
    return acc;
  }, {});
  const categoriesArray = Object.keys(categories)
    .map((category) => {
      return [category, categories[category]];
    })
    .sort((c1, c2) => c1[0].localeCompare(c2[0]));
  displayMenuCategories(categoriesArray);
};

const displayMenuCategories = (categoriesArray) => {
  const liElements = categoriesArray.map((categoryElement) => {
    const li = document.createElement("li");
    li.innerHTML = `${categoryElement[0]} - <strong>${categoryElement[1]}</strong>`;
    if (categoryElement[0] === filter) {
      li.classList.add("active");
    }
    li.addEventListener("click", () => {
      if (filter === categoryElement[0]) {
        filter = null;
        li.classList.remove("active");
        createArticles();
      } else {
        filter = categoryElement[0];
        liElements.forEach((li) => {
          li.classList.remove("active");
        });
        li.classList.add("active");
        createArticles();
      }
    });
    return li;
  });
  categoriesContainer.innerHTML = "";
  categoriesContainer.append(...liElements);
};

// Tri des articles

selectElement.addEventListener("change", () => {
  sortBy = selectElement.value;
  fetchArticles();
});

// Récupération des articles

const fetchArticles = async () => {
  try {
    const response = await fetch(
      `https://restapi.fr/api/jetarticles?sort=createdAt:${sortBy}`
    );
    articles = await response.json();
    createArticles();
    createMenuCategoris();
  } catch (error) {
    console.log("error : ", error);
  }
};

fetchArticles();
