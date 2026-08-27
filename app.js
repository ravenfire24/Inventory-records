const STORAGE_KEY = "inventory-records-products";
const LOW_STOCK_LIMIT = 10;

const demoProducts = [
  { id: 101, name: "Receipt Paper", quantity: 42, price: 3.95, category: "Supplies" },
  { id: 204, name: "Work Gloves", quantity: 8, price: 12.5, category: "Hardware" },
  { id: 315, name: "Canvas Tote", quantity: 23, price: 9.99, category: "Apparel" },
  { id: 428, name: "Coffee Beans", quantity: 14, price: 18.75, category: "Food" }
];

const form = document.querySelector("#productForm");
const searchInput = document.querySelector("#searchInput");
const productRows = document.querySelector("#productRows");
const emptyState = document.querySelector("#emptyState");
const totalProducts = document.querySelector("#totalProducts");
const totalUnits = document.querySelector("#totalUnits");
const inventoryValue = document.querySelector("#inventoryValue");
const lowStockCount = document.querySelector("#lowStockCount");
const formNote = document.querySelector("#formNote");
const clearButton = document.querySelector("#clearButton");
const resetButton = document.querySelector("#resetButton");
const exportButton = document.querySelector("#exportButton");

let products = loadProducts();

function loadProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [...demoProducts];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [...demoProducts];
  } catch {
    return [...demoProducts];
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products
    .filter((product) => {
      const idMatch = String(product.id).includes(query);
      const nameMatch = product.name.toLowerCase().includes(query);
      return !query || idMatch || nameMatch;
    })
    .sort((a, b) => a.id - b.id);

  totalProducts.textContent = products.length;
  totalUnits.textContent = products.reduce((sum, product) => sum + product.quantity, 0);
  inventoryValue.textContent = money(products.reduce((sum, product) => sum + product.quantity * product.price, 0));
  lowStockCount.textContent = products.filter((product) => product.quantity <= LOW_STOCK_LIMIT).length;

  productRows.innerHTML = filtered
    .map((product) => {
      const value = product.quantity * product.price;
      const lowStock = product.quantity <= LOW_STOCK_LIMIT;
      return `
        <tr>
          <td>${product.id}</td>
          <td>
            <span class="product-name">${escapeHtml(product.name)}</span>
            <span class="category">${escapeHtml(product.category || "General")}</span>
          </td>
          <td>${product.quantity}</td>
          <td>${money(product.price)}</td>
          <td>${money(value)}</td>
          <td><span class="status ${lowStock ? "low" : ""}">${lowStock ? "Low stock" : "In stock"}</span></td>
          <td>
            <div class="row-actions">
              <button type="button" title="Edit ${escapeHtml(product.name)}" aria-label="Edit ${escapeHtml(product.name)}" data-action="edit" data-id="${product.id}">
                <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </button>
              <button type="button" title="Delete ${escapeHtml(product.name)}" aria-label="Delete ${escapeHtml(product.name)}" data-action="delete" data-id="${product.id}">
                <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2m-6 5v6m4-6v6M6 6l1 15h10l1-15"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  emptyState.hidden = filtered.length > 0;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[character];
  });
}

function readFormProduct() {
  return {
    id: Number(document.querySelector("#productId").value),
    name: document.querySelector("#productName").value.trim(),
    quantity: Number(document.querySelector("#productQuantity").value),
    price: Number(document.querySelector("#productPrice").value),
    category: document.querySelector("#productCategory").value
  };
}

function fillForm(product) {
  document.querySelector("#productId").value = product.id;
  document.querySelector("#productName").value = product.name;
  document.querySelector("#productQuantity").value = product.quantity;
  document.querySelector("#productPrice").value = product.price;
  document.querySelector("#productCategory").value = product.category || "General";
  formNote.textContent = `Editing product ${product.id}.`;
  document.querySelector("#productName").focus();
}

function clearForm(message = "Ready to manage inventory records.") {
  form.reset();
  formNote.textContent = message;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const product = readFormProduct();

  if (!product.id || product.id < 1 || !product.name) {
    formNote.textContent = "Enter a valid product ID and name.";
    return;
  }

  const existingIndex = products.findIndex((item) => item.id === product.id);

  if (existingIndex >= 0) {
    products[existingIndex] = product;
    saveProducts();
    render();
    clearForm(`Product ${product.id} updated.`);
    return;
  } else {
    products.push(product);
  }

  saveProducts();
  render();
  clearForm(`Product ${product.id} added.`);
});

productRows.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const product = products.find((item) => item.id === id);
  if (!product) return;

  if (button.dataset.action === "edit") {
    fillForm(product);
    return;
  }

  products = products.filter((item) => item.id !== id);
  saveProducts();
  formNote.textContent = `Product ${id} deleted.`;
  render();
});

searchInput.addEventListener("input", render);
clearButton.addEventListener("click", clearForm);

resetButton.addEventListener("click", () => {
  products = [...demoProducts];
  saveProducts();
  clearForm();
  searchInput.value = "";
  formNote.textContent = "Demo inventory restored.";
  render();
});

exportButton.addEventListener("click", () => {
  const rows = [
    ["ID", "Name", "Quantity", "Price", "Category"],
    ...products.map((product) => [product.id, product.name, product.quantity, product.price, product.category || "General"])
  ];

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "inventory-records.csv";
  link.click();
  URL.revokeObjectURL(url);
  formNote.textContent = "Inventory exported.";
});

function csvCell(value) {
  const cell = String(value);
  return /[",\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
}

render();
