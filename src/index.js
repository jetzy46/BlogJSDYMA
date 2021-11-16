import "./assets/styles/style.scss";
import "./index.scss";

const articlesContainer = document.querySelector(".articles-container");

const createArticles = (arti) => {
  const articlesSet = arti.map((art) => {
    const article = document.createElement("div");
    article.classList.add("article");
    article.innerHTML = `
    <div class="article-title-container"><h2>${art.title}</h2><p>${art.category}</p></div>
      <div class="article-author-container">
        <img src="${art.img}" alt="${art.author}" />
        <h4 class="article-author">${art.author}</h4>
      </div>
      <p class="article-content">${art.content}</p>
      <div class="article-actions">
        <button class="btn btn-error" data-id=${art._id}>Supprimer</button>
      </div>
        `;
    return article;
  });
  articlesContainer.innerHTML = "";
  articlesContainer.append(...articlesSet);

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
};

const fetchArticles = async () => {
  try {
    const response = await fetch("https://restapi.fr/api/jetarticles");
    const fetchedArticles = await response.json();
    createArticles(fetchedArticles);
  } catch (error) {
    console.log("error : ", error);
  }
};

fetchArticles();
