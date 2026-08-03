const catalogEl = document.getElementById('catalog');
const cartListEl = document.getElementById('cartList');
const receiptEl = document.getElementById('receipt');
const floatingTotalEl = document.getElementById('floatingTotal');
const itemNameEl = document.getElementById('itemName');
const itemPriceEl = document.getElementById('itemPrice');
const itemCategoryEl = document.getElementById('itemCategory');
const newCategoryEl = document.getElementById('newCategory');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');

const CATEGORY_OPTIONS = [
  'DAIRY',
  'CANNED GOODS',
  'SNACKS & BREAD',
  'DRINKS',
  'PASTA',
  'CONDIMENTS',
  'HOUSEHOLD',
  'PERSONAL CARE',
  'OTHERS'
];
let catalog = [];
let cart = [];

function formatCurrency(value) {
  return `₱${value.toFixed(2)}`;
}

function createDefaultCatalog() {
  return [
    { name: 'egg 1 tray s', price: 106, category: 'DAIRY' },
    { name: 'eden 45g', price: 16.50, category: 'DAIRY' },
    { name: 'holiday spicy beef loaf', price: 24.25, category: 'CANNED GOODS' },
    { name: 'century tuna spicy', price: 38.05, category: 'CANNED GOODS' },
    { name: 'pure foods corned beef hot', price: 86.55, category: 'CANNED GOODS' },
    { name: 'holiday vienna sausage', price: 27, category: 'CANNED GOODS' },
    { name: 'choco mucho s/w', price: 72.90, category: 'SNACKS & BREAD' },
    { name: 'eggnog 1pack', price: 61.75, category: 'SNACKS & BREAD' },
    { name: 'bingo orange', price: 61.50, category: 'SNACKS & BREAD' },
    { name: 'butter coconut 24x12 19g', price: 39.70, category: 'SNACKS & BREAD' },
    { name: 'nuebake 560g', price: 82, category: 'SNACKS & BREAD' },
    { name: 'skyflakes 30x20 25g', price: 56.50, category: 'SNACKS & BREAD' },
    { name: 'alaska  300g', price: 88.75, category: 'DRINKS' },
    { name: 'tang pineapple 19g', price: 18.75, category: 'DRINKS' },
    { name: 'lucky me hot', price: 11.75, category: 'PASTA' },
    { name: 'chili mansi', price: 11.75, category: 'PASTA' },
    { name: 'spicy labuyo', price: 10.25, category: 'PASTA' },
    { name: 'baked mac', price: 24.95, category: 'PASTA' },
    { name: 'oats 200g', price: 40.90, category: 'PASTA' },
    { name: 'soy sauce 200ml', price: 10.55, category: 'CONDIMENTS' },
    { name: 'oyster sauce 30g', price: 6.05, category: 'CONDIMENTS' },
    { name: 'mafran 190g', price: 8.65, category: 'CONDIMENTS' },
    { name: 'mushroom 100g', price: 21.55, category: 'CONDIMENTS' },
    { name: 'pepper (green) 40g', price: 42.90, category: 'CONDIMENTS' },
    { name: 'all purp cream 250g', price: 69.75, category: 'CONDIMENTS' },
    { name: 'salt 250g', price: 9.45, category: 'CONDIMENTS' },
    { name: 'smart paste', price: 23.75, category: 'HOUSEHOLD' },
    { name: 'zonrox 100ml', price: 9.30, category: 'HOUSEHOLD' },
    { name: 'bioderm 60g', price: 15.90, category: 'PERSONAL CARE' },
    { name: 'skinwhite lotion 200ml', price: 147.10, category: 'PERSONAL CARE' },
    { name: 'dove bar pink 135g', price: 78.80, category: 'PERSONAL CARE' },
    { name: 'safeguard pw 60g', price: 21, category: 'PERSONAL CARE' },
    { name: 'gillette pink', price: 48.90, category: 'PERSONAL CARE' },
    { name: 'sulfur w/ moist. 135g', price: 20.95, category: 'PERSONAL CARE' },
    { name: 'safeguard camellia 55g', price: 20.95, category: 'PERSONAL CARE' }
  ];
}

function saveState() {
  localStorage.setItem('grocery-catalog', JSON.stringify(catalog));
  localStorage.setItem('grocery-cart', JSON.stringify(cart));
}

function loadState() {
  try {
    const savedCatalog = JSON.parse(localStorage.getItem('grocery-catalog'));
    const savedCart = JSON.parse(localStorage.getItem('grocery-cart'));
    catalog = Array.isArray(savedCatalog) && savedCatalog.length ? savedCatalog : createDefaultCatalog();
    cart = Array.isArray(savedCart) ? savedCart : [];
  } catch (error) {
    catalog = createDefaultCatalog();
    cart = [];
  }
}

function renderCatalog() {
  catalogEl.innerHTML = '';

  CATEGORY_OPTIONS.forEach((category) => {
    const items = catalog.filter((item) => item.category === category);
    const section = document.createElement('div');
    section.className = 'category-card';
    section.innerHTML = `
      <h3>${category}</h3>
      ${items.length ? items.map((item, index) => `
        <div class="item-row" data-index="${index}" data-category="${item.category}">
          <div>
            <strong>${item.name}</strong><br />
            <span class="muted">${formatCurrency(item.price)}</span>
          </div>
          <div class="item-actions">
            <input class="small-input" type="number" step="0.01" min="0" value="${item.price}" data-role="price-edit" data-index="${index}" data-category="${item.category}" />
            <button data-action="update-price" data-index="${index}" data-category="${item.category}">Edit</button>
            <button data-action="delete-item" data-index="${index}" data-category="${item.category}" class="secondary">Delete</button>
            <button data-action="add" data-name="${item.name}" data-price="${item.price}" data-category="${item.category}">Add to cart</button>
          </div>
        </div>
      `).join('') : '<p class="muted">No items in this category yet.</p>'}
    `;
    catalogEl.appendChild(section);
  });
}

function renderCart() {
  cartListEl.innerHTML = '';
  receiptEl.innerHTML = '';

  if (!cart.length) {
    cartListEl.innerHTML = '<p class="muted">Your cart is empty. Tap “Add to cart” from any category.</p>';
    receiptEl.innerHTML = '<div class="row"><span>Total</span><span>₱0.00</span></div>';
    return;
  }

  let subtotal = 0;

  cart.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

    const itemRow = document.createElement('div');
    itemRow.className = 'cart-item';
    itemRow.innerHTML = `
      <div>
        <strong>${item.name}</strong><br />
        <span class="muted">${item.category}</span>
      </div>
      <div class="qty">
        <button data-action="decrease" data-index="${index}">−</button>
        <span>${item.quantity}</span>
        <button data-action="increase" data-index="${index}">+</button>
        <button data-action="save-later" data-index="${index}" class="secondary">Save</button>
        <button data-action="remove" data-index="${index}" class="secondary">Remove</button>
        <strong>${formatCurrency(lineTotal)}</strong>
      </div>
    `;
    cartListEl.appendChild(itemRow);
  });

  const receiptRows = [
    { label: 'Items', value: cart.length },
    { label: 'Subtotal', value: formatCurrency(subtotal) },
    { label: 'Total', value: formatCurrency(subtotal) }
  ];

  receiptRows.forEach((row) => {
    const div = document.createElement('div');
    div.className = 'row';
    div.innerHTML = `<span>${row.label}</span><span>${row.value}</span>`;
    receiptEl.appendChild(div);
  });

  const divider = document.createElement('div');
  divider.className = 'divider';
  receiptEl.appendChild(divider);

  const totalRow = document.createElement('div');
  totalRow.className = 'row total';
  totalRow.innerHTML = `<span>Total due</span><span>${formatCurrency(subtotal)}</span>`;
  receiptEl.appendChild(totalRow);

  if (floatingTotalEl) {
    floatingTotalEl.innerHTML = `
      <div class="row"><span><strong>Shopping total</strong></span><span><strong>${formatCurrency(subtotal)}</strong></span></div>
    `;
  }
}

function renderCategoryOptions() {
  if (!itemCategoryEl) return;
  itemCategoryEl.innerHTML = CATEGORY_OPTIONS.map((category) => `
    <option value="${category}">${category}</option>
  `).join('');
}

function render() {
  renderCategoryOptions();
  renderCatalog();
  renderCart();
}

function addCustomItem() {
  const name = itemNameEl.value.trim();
  const price = Number(itemPriceEl.value);
  const customCategory = newCategoryEl.value.trim();
  let category = itemCategoryEl.value;

  if (!name || Number.isNaN(price) || price <= 0) {
    alert('Please enter an item name and a price greater than zero.');
    return;
  }

  if (customCategory) {
    category = customCategory;
    if (!CATEGORY_OPTIONS.includes(category)) {
      CATEGORY_OPTIONS.push(category);
    }
  }

  catalog.push({ name, price, category });
  itemNameEl.value = '';
  itemPriceEl.value = '';
  newCategoryEl.value = '';
  itemCategoryEl.value = CATEGORY_OPTIONS[0] || '';
  itemNameEl.focus();
  saveState();
  render();
}

function addToCart(name, price, category) {
  const existingItem = cart.find((item) => item.name === name && item.category === category);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, category, quantity: 1 });
  }

  saveState();
  renderCart();
}

function updateCartQuantity(index, action) {
  if (action === 'increase') {
    cart[index].quantity += 1;
  } else if (action === 'decrease' && cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else if (action === 'decrease' || action === 'remove') {
    cart.splice(index, 1);
  }

  saveState();
  render();
}

function updateCatalogItem(index, category) {
  const item = catalog.find((entry) => entry.category === category && entry.name === catalog.filter((entry2) => entry2.category === category)[index].name);
  if (!item) return;

  const priceInput = document.querySelector(`input[data-role="price-edit"][data-index="${index}"][data-category="${category}"]`);
  if (!priceInput) return;

  const newPrice = Number(priceInput.value);
  if (Number.isNaN(newPrice) || newPrice <= 0) {
    alert('Please enter a valid price.');
    return;
  }

  item.price = newPrice;
  saveState();
  render();
}

function deleteCatalogItem(index, category) {
  const filtered = catalog.filter((entry) => entry.category === category);
  if (!filtered[index]) return;

  const actualIndex = catalog.findIndex((entry) => entry === filtered[index]);
  if (actualIndex >= 0) {
    catalog.splice(actualIndex, 1);
  }

  saveState();
  render();
}

addBtn.addEventListener('click', addCustomItem);
clearBtn.addEventListener('click', () => {
  cart = [];
  saveState();
  renderCart();
});

[itemNameEl, itemPriceEl, itemCategoryEl, newCategoryEl].forEach((input) => {
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addCustomItem();
    }
  });
});

catalogEl.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const { name, price, category, action, index } = button.dataset;
  if (action === 'update-price') {
    updateCatalogItem(Number(index), category);
    return;
  }

  if (action === 'delete-item') {
    deleteCatalogItem(Number(index), category);
    return;
  }

  addToCart(name, Number(price), category);
});

cartListEl.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const index = Number(button.dataset.index);
  const action = button.dataset.action;

  if (!Number.isNaN(index)) {
    if (action === 'remove') {
      updateCartQuantity(index, 'remove');
    } else {
      updateCartQuantity(index, action);
    }
  }
});

loadState();
render();
