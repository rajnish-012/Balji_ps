/************* FIREBASE CONFIG *************/
const firebaseConfig = {
  apiKey: "AIzaSyBILALSnDeyTjqEZOOnOtMP9H2M9ErOaO8",
  authDomain: "balaji-plastic-b1714.firebaseapp.com",
  projectId: "balaji-plastic-b1714",
  storageBucket: "balaji-plastic-b1714.firebasestorage.app",
  messagingSenderId: "208066795917",
  appId: "1:208066795917:web:1df24d805146574a68c5c4"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/************* DATA *************/
let cart = [];
let products = [];

const productList = document.getElementById("productList");

/************* LOAD PRODUCTS FROM FIREBASE *************/
db.collection("products")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    products = [];
    snapshot.forEach(doc => {
      products.push(doc.data());
    });
    renderProducts();
  });

/************* RENDER PRODUCTS (UNCHANGED UI) *************/
function renderProducts() {
  productList.innerHTML = "";

  products.forEach((p, i) => {
    productList.innerHTML += `
      <div class="product">
        <img src="${p.img}" />
        <div class="product-info">
          <h3>${p.name}</h3>
          <p class="desc">${p.desc}</p>
          <p class="size">Size: ${p.size}</p>
          <div class="price">₹${p.price}</div>
        </div>
        <div class="action">
          <input type="number" min="1" value="1" id="qty${i}">
          <button onclick="addToCart('${p.name}',${p.price},'${p.size}','qty${i}')">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  });
}

/************* CART LOGIC (SAME AS BEFORE) *************/
function addToCart(name, price, size, qtyId) {
  const qty = parseInt(document.getElementById(qtyId).value);
  cart.push({ name, price, size, qty });
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    cartItems.innerHTML += `
      <li>
        <div>
          <strong>${item.name}</strong><br>
          Qty: ${item.qty} × ₹${item.price}
        </div>
        <button onclick="removeItem(${index})">❌</button>
      </li>
    `;
  });

  document.getElementById("totalPrice").innerText = "Total: ₹" + total;
  document.getElementById("cartBtn").innerText =
    `🛒 Cart (${cart.length}) • Order on WhatsApp`;
}

function removeItem(i) {
  cart.splice(i, 1);
  updateCart();
}

function orderWhatsApp() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  let msg = "🛍️ New Order\n\n";
  cart.forEach(i => {
    msg += `${i.name} | Qty: ${i.qty} | ₹${i.price}\n`;
  });

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  msg += `\nTotal: ₹${total}`;

  window.open(
    `https://wa.me/918292666585?text=${encodeURIComponent(msg)}`
  );
}
