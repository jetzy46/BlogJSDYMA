import "../assets/styles/style.scss";
import "./form.scss";
import { openModal } from "../assets/javascripts/modal";

const form = document.querySelector("form");
const errorElement = document.querySelector("#errors");
const page = document.querySelector(".content");
const btnCancel = document.querySelector(".btn-primary");
const snack = page.querySelector(".snack");

let articleID;
let errors = [];

// Action du bouton annuler
btnCancel.addEventListener("click", async (e) => {
  const result = await openModal("Etes vous sûr de vouloir annuler ?");
  if (result) {
    form.reset();
    location.assign("/index.html");
  }
});

// Formulaire
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  //   on récupère les données du formulaire et on les transforme en un objets JSON pour les utiliser
  const formData = new FormData(form);
  const article = formData.entries();
  const reducedArticle = Array.from(article).reduce((accu, value) => {
    accu[value[0]] = value[1];
    return accu;
  }, {});
  // Soumission du formulaire
  if (formIsValid(reducedArticle)) {
    try {
      const jsonArticle = JSON.stringify(reducedArticle);
      let response;
      if (articleID) {
        response = await fetch(
          `https://restapi.fr/api/jetarticles/${articleID}`,
          {
            method: "PATCH",
            body: jsonArticle,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await fetch("https://restapi.fr/api/jetarticles", {
          method: "POST",
          body: jsonArticle,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      // Action si l'article est bien POST
      if (response.status < 299) {
        if (articleID) {
          snack.innerHTML = "Article modifié !";
        } else {
          snack.innerHTML = "Article publié !";
        }
        snack.classList.add("snack-send");
        setTimeout(() => {
          snack.className = snack.className.replace("snack-send", "");
        }, 4000);
        setTimeout(() => {
          location.assign("/index.html");
        }, 7000);
        form.reset();
      }
    } catch (error) {
      console.log("error : " + error);
      snack.innerHTML = "Erreur lors de la publication de l'article";
      snack.classList.add("snack-error");
      setTimeout(() => {
        snack.className = snack.className.replace("snack-error", "");
      }, 5000);
    }
  }
});

// Affichage des erreurs du formulaire avant de publier
const formIsValid = (a) => {
  errors = [];
  if (!a.author || !a.category || !a.content || !a.img || !a.title) {
    errors.push("Vous devez renseigner tous les champs");
  }
  if (a.content.length < 10) {
    errors.push("Le contenu de votre article est trop court !");
  }
  if (errors.length) {
    let errorHTML = "";
    errors.forEach((e) => {
      errorHTML += `<li>${e}</li>`;
    });
    errorElement.innerHTML = errorHTML;
    return false;
  } else {
    errorElement.innerHTML = "";
    return true;
  }
};

// Modification d'un article

const fillForm = (article) => {
  const author = document.querySelector('input[name="author"]');
  const imgAuthor = document.querySelector('input[name="img"]');
  const articleTitle = document.querySelector('input[name="title"]');
  const articleContent = document.querySelector("textarea");
  const category = document.querySelector("select");

  author.value = article.author || "";
  imgAuthor.value = article.img || "";
  articleTitle.value = article.title || "";
  articleContent.value = article.content || "";
  category.value = article.category || "Divers";
};

const initForm = async () => {
  // Récuparation de l'ID d'un article pour modification
  const params = new URL(location.href);
  articleID = params.searchParams.get("id");

  if (articleID) {
    const response = await fetch(
      `https://restapi.fr/api/jetarticles/${articleID}`
    );
    if (response.status < 300) {
      const article = await response.json();
      fillForm(article);
    }
  }
};

initForm();
