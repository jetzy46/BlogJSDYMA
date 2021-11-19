const body = document.querySelector("body");

let calc;
let modal;
let cancelBtn;
let confirmBtn;

const createCacl = () => {
  calc = document.createElement("div");
  calc.classList.add("calc");
  calc.addEventListener("click", () => {
    calc.remove();
  });
};

const createModal = (question) => {
  modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `<div class="modal-question" >${question}</div>`;
  cancelBtn = document.createElement("button");
  confirmBtn = document.createElement("button");
  cancelBtn.innerText = "Annuler";
  confirmBtn.innerText = "Confirmer";
  cancelBtn.classList.add("btn", "btn-error");
  confirmBtn.classList.add("btn", "btn-secondary");
  modal.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  modal.append(cancelBtn, confirmBtn);
};

export function openModal(question) {
  createCacl();
  createModal(question);
  calc.append(modal);
  body.append(calc);

  return new Promise((resolve, reject) => {
    calc.addEventListener("click", () => {
      resolve(false);
      calc.remove();
    });
    cancelBtn.addEventListener("click", () => {
      resolve(false);
      calc.remove();
    });
    confirmBtn.addEventListener("click", () => {
      resolve(true);
      calc.remove();
    });
  });
}
