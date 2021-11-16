import "../assets/styles/style.scss";
import "./form.scss";

const form = document.querySelector("form");
const errorElement = document.querySelector("#errors");
const page = document.querySelector(".content");
const btnCancel = document.querySelector(".btn-primary");
const snack = page.querySelector(".snack");

let errors = [];

btnCancel.addEventListener("click", (e) => {
  form.reset();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  //   on récupère les données du formulaire et on les transforme en un objets JSON pour les utiliser
  const formData = new FormData(form);
  const article = formData.entries();
  const reducedArticle = Array.from(article).reduce((accu, value) => {
    accu[value[0]] = value[1];
    return accu;
  }, {});
  if (formIsValid(reducedArticle)) {
    try {
      const jsonArticle = JSON.stringify(reducedArticle);
      const response = await fetch("https://restapi.fr/api/jetarticles", {
        method: "POST",
        body: jsonArticle,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status < 299) {
        snack.innerHTML = "Article publié !";
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
