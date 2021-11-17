import "./assets/styles/style.scss";
import "./index.scss";

const articlesContainer = document.querySelector(".articles-container");
const categoriesContainer = document.querySelector(".categories");

const createArticles = (arti) => {
  const articlesSet = arti.map((art) => {
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
      console.log("click");
      const target = e.target;
      const articleID = target.dataset.id;
      location.assign(`/form.html?id=${articleID}`);
    });
  });
};

// Création du menu avec les categorie des articles

const createMenuCategoris = (articles) => {
  const categories = articles.reduce((acc, article) => {
    if (acc[article.category]) {
      acc[article.category]++;
    } else {
      acc[article.category] = 1;
    }
    return acc;
  }, {});
  const categoriesArray = Object.keys(categories).map((category) => {
    return [category, categories[category]];
  });
  displayMenuCategories(categoriesArray);
};

const displayMenuCategories = (categoriesArray) => {
  const liElements = categoriesArray.map((categoryElement) => {
    const li = document.createElement("li");
    li.innerHTML = `<li>${categoryElement[0]} - <strong>${categoryElement[1]}</strong></li>`;
    return li;
  });
  console.log(liElements);
  categoriesContainer.innerHTML = "";
  categoriesContainer.append(...liElements);
};

// Récupération des articles

const fetchArticles = async () => {
  try {
    const response = await fetch("https://restapi.fr/api/jetarticles");
    const fetchedArticles = await response.json();
    createArticles(fetchedArticles);
    createMenuCategoris(fetchedArticles);
  } catch (error) {
    console.log("error : ", error);
  }
};

fetchArticles();
