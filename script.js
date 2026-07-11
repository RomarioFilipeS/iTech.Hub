const stores = [
  { id: 1, icon: "🛠️", name: "Assistência Central", location: "Asa Norte, Brasília", rating: "4,9", reviews: 312, price: 80, services: ["celular", "tela", "bateria", "notebook"] },
  { id: 2, icon: "📱", name: "Conserta Rápido", location: "Taguatinga, DF", rating: "4,7", reviews: 187, price: 60, services: ["celular", "tela", "conector", "tablet"] },
  { id: 3, icon: "💻", name: "Tech Notebook", location: "Águas Claras, DF", rating: "4,8", reviews: 248, price: 120, services: ["notebook", "teclado", "bateria", "ssd"] },
  { id: 4, icon: "📺", name: "Smart TV Express", location: "Sudoeste, Brasília", rating: "4,6", reviews: 98, price: 95, services: ["tv", "tela", "som", "imagem"] },
  { id: 5, icon: "⌨️", name: "Tablet & Cia", location: "Asa Sul, Brasília", rating: "4,8", reviews: 154, price: 75, services: ["tablet", "tela", "bateria", "celular"] },
  { id: 6, icon: "🔧", name: "Reparo Digital", location: "Lago Norte, Brasília", rating: "4,5", reviews: 201, price: 90, services: ["celular", "notebook", "conector", "bateria"] }
];

const servicesByDevice = {
  Celular: ["Todos", "Tela quebrada", "Bateria", "Conector de carga", "Câmera"],
  Notebook: ["Todos", "Tela danificada", "Bateria", "Teclado", "HD ou SSD"],
  Tablet: ["Todos", "Tela quebrada", "Bateria", "Conector de carga", "Lentidão"],
  TV: ["Todos", "Tela com manchas", "Sem imagem", "Sem som", "Smart TV"]
};

let selectedDevice = "Celular";
let selectedService = "Todos";
let selectedStore = null;

const normalize = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function renderServiceChips() {
  const container = document.querySelector("#serviceChips");
  container.innerHTML = "";
  servicesByDevice[selectedDevice].forEach((service) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = service;
    button.classList.toggle("is-active", service === selectedService);
    button.addEventListener("click", () => {
      selectedService = service;
      renderServiceChips();
      renderStores();
    });
    container.append(button);
  });
}

function matchesStore(store, query) {
  const terms = normalize([store.name, store.location, ...store.services].join(" "));
  const device = normalize(selectedDevice);
  const service = normalize(selectedService);
  const serviceWords = service.split(" ").filter((word) => word.length > 2);
  const serviceMatches = selectedService === "Todos" || serviceWords.some((word) => terms.includes(word));
  return terms.includes(device) && serviceMatches && terms.includes(query);
}

function renderStores() {
  const query = normalize(document.querySelector("#searchInput").value.trim());
  const visibleStores = stores.filter((store) => matchesStore(store, query));
  const grid = document.querySelector("#storeGrid");
  const emptyState = document.querySelector("#emptyState");
  const resultCount = document.querySelector("#resultCount");

  grid.innerHTML = "";
  visibleStores.forEach((store) => {
    const card = document.createElement("article");
    card.className = "store-card";
    card.innerHTML = `
      <div class="store-card__top">
        <span class="store-card__icon">${store.icon}</span>
        <span class="store-card__status">● Aberto agora</span>
      </div>
      <h3>${store.name}</h3>
      <p class="store-card__location">📍 ${store.location}</p>
      <div class="store-card__meta"><strong>★ ${store.rating}</strong><span>(${store.reviews} avaliações)</span></div>
      <div class="store-card__footer">
        <span class="store-card__price">A partir de <b>R$ ${store.price}</b></span>
        <button class="button button--primary" type="button">Pedir orçamento</button>
      </div>`;
    card.querySelector("button").addEventListener("click", () => openQuoteDialog(store));
    grid.append(card);
  });

  resultCount.textContent = `${visibleStores.length} ${visibleStores.length === 1 ? "loja encontrada" : "lojas encontradas"}`;
  emptyState.hidden = visibleStores.length !== 0;
}

function openQuoteDialog(store) {
  selectedStore = store;
  document.querySelector("#dialogStore").textContent = `${store.icon} ${store.name} · ${store.location}`;
  document.querySelector("#detailInput").value = `${selectedDevice}: ${selectedService === "Todos" ? "preciso de avaliação" : selectedService}`;
  document.querySelector("#formMessage").textContent = "";
  document.querySelector("#quoteDialog").showModal();
}

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".search-card");
  const searchInput = document.querySelector("#searchInput");
  const feedback = document.querySelector("#searchFeedback");
  const quoteDialog = document.querySelector("#quoteDialog");

  document.querySelectorAll("[data-device]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDevice = button.dataset.device;
      selectedService = "Todos";
      document.querySelectorAll("[data-device]").forEach((item) => item.classList.toggle("is-active", item === button));
      feedback.textContent = `Mostrando serviços para ${selectedDevice.toLowerCase()}.`;
      renderServiceChips();
      renderStores();
    });
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderStores();
    feedback.textContent = searchInput.value.trim() ? `Resultados para “${searchInput.value.trim()}”.` : "Mostrando todas as lojas disponíveis.";
    document.querySelector("#assistencias").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.querySelector("[data-scroll-to]").addEventListener("click", () => searchInput.focus());
  document.querySelector("#closeDialog").addEventListener("click", () => quoteDialog.close());
  quoteDialog.addEventListener("click", (event) => { if (event.target === quoteDialog) quoteDialog.close(); });

  document.querySelector("#quoteForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.querySelector("#nameInput").value.trim();
    const phone = document.querySelector("#phoneInput").value.trim();
    if (!name || !phone) return;
    document.querySelector("#formMessage").textContent = `Solicitação enviada para ${selectedStore.name}. Em breve você receberá uma resposta no WhatsApp.`;
    event.currentTarget.reset();
  });

  renderServiceChips();
  renderStores();
});
