const body = document.querySelector("body");

let calc;
let modal;

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
  const cancelBtn = document.createElement("button");
  const confirmBtn = document.createElement("button");
  cancelBtn.innerText = "Annuler";
  confirmBtn.innerText = "Confirmer";
  cancelBtn.classList.add("btn", "btn-error");
  confirmBtn.classList.add("btn", "btn-secondary");
  modal.append(cancelBtn, confirmBtn);
};

export function openModal(question) {
  createCacl();
  createModal(question);
  calc.append(modal);
  body.append(calc);
}
