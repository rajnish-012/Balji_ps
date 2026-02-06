/********* CONFIG *********/
// const ADMIN_PIN = "1234";

// 🔹 Firebase config (YOURS)
const firebaseConfig = {
  // your firebase api key
};

// 🔹 Cloudinary config
const CLOUD_NAME = "dudtthh6z";
const UPLOAD_PRESET = "balaji_unsigned";

/********* INIT *********/
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/********* LOGIN *********/
function login() {
  if (adminPin.value === ADMIN_PIN) {
    adminArea.style.display = "block";
    loadAdminProducts();
  } else {
    alert("Wrong PIN");
  }
}

/********* ADD PRODUCT *********/
async function addProduct() {
  const file = pImg.files[0];
  if (!file) {
    alert("Select image");
    return;
  }

  // Upload image to Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();

  // Save product to Firebase
  await db.collection("products").add({
    name: pName.value,
    size: pSize.value,
    price: Number(pPrice.value),
    desc: pDesc.value,
    img: data.secure_url,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("Product Added ✅");
  clearForm();
  loadAdminProducts();
}

function clearForm() {
  pName.value = "";
  pSize.value = "";
  pPrice.value = "";
  pDesc.value = "";
  pImg.value = "";
}

/********* LOAD PRODUCTS *********/
function loadAdminProducts() {
  adminProductList.innerHTML = "";

  db.collection("products")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      adminProductList.innerHTML = "";
      snapshot.forEach(doc => {
        const p = doc.data();
        adminProductList.innerHTML += `
          <li>
            ${p.name} – ₹${p.price}
            <button onclick="deleteProduct('${doc.id}')">❌</button>
          </li>
        `;
      });
    });
}

/********* DELETE PRODUCT *********/
function deleteProduct(id) {
  db.collection("products").doc(id).delete();
}
