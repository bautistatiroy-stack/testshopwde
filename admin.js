const ADMIN_USERNAME = "christian";
const ADMIN_PASSWORD = "mypassword2026";
const ADMIN_EMAIL = "christian@example.com";

function loginAdmin() {

    let user = document.getElementById("adminUser").value;
    let pass = document.getElementById("adminPass").value;
    let email = document.getElementById("adminEmail").value;

    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD && email === ADMIN_EMAIL) {

        document.getElementById("adminPanel").style.display = "block";

        loadProducts();

    } else {
        alert("Wrong username, password, or email");
    }
}


/*product add remove quntity price*/
let products =
    JSON.parse(localStorage.getItem("products")) || [];

function addProduct() {

    let name =
        document.getElementById("name").value;

    let price =
        document.getElementById("price").value;

    let stock =
        document.getElementById("stock").value;

    let img =
        document.getElementById("img").value;

    if (!name || !price || !stock || !img) {
        alert("Complete all fields!");
        return;
    }

    products.push({
        name,
        price: Number(price),
        stock: Number(stock),
        img
    });

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    render();

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("img").value = "";

    alert("Product Added!");
}

function render() {

    let html = "";

    products.forEach((p, i) => {

        html += `
                
                <div class="card">

                    <img src="${p.img}">

                    <div class="card-content">

                        <h3>${p.name}</h3>

                        <div class="price">
                            ₱${p.price}
                        </div>

                        <p>Stock:</p>

                        <input
                            class="stock-input"
                            type="number"
                            value="${p.stock}"
                            onchange="updateStock(${i}, this.value)"
                        >

                        <button
                            class="remove-btn"
                            onclick="deleteItem(${i})"
                        >
                            Remove
                        </button>

                    </div>

                </div>
                `;
    });

    document.getElementById("list").innerHTML = html;
}

function updateStock(i, value) {

    products[i].stock = Number(value);

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );
}

function deleteItem(i) {

    let confirmDelete =
        confirm("Delete this product?");

    if (!confirmDelete) return;

    products.splice(i, 1);

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    render();
}

render();

/*log out*/

function logoutAdmin() {

    document.getElementById("adminPanel")
        .style.display = "none";

    document.getElementById("adminUser").value = "";
    document.getElementById("adminPass").value = "";
    document.getElementById("adminEmail").value = "";
    alert("Logged out");
}

/* checkout */
function goCheckout() {
    const url =
        "https://script.google.com/macros/s/AKfycbxM8L1uitADVVUf8JoGaTja58RNgeZ_4exaHOqxySB0DZvFBQyz83Kn-6Eo767HdDdDjA/exec";

    const form = document.getElementById("form");
    const msg = document.getElementById("msg");
    const submitBtn = document.getElementById("submitBtn");

    // USER INFO
    let name = localStorage.getItem("name") || "";
    let address = localStorage.getItem("address") || "";
    let phone = localStorage.getItem("phone") || "";
    let timetodelever = localStorage.getItem("delivery") || "";
    // CART
    let cartItems =
        JSON.parse(localStorage.getItem("cartItems")) || [];

    let total = 0;
    let itemsHTML = "";

    // BUILD ITEMS
    cartItems.forEach(item => {

        total += item.subtotal;

        itemsHTML += `
        <div class="item">
            <b>${item.name}</b><br>
            Price: ₱${item.price}<br>
            Qty: ${item.qty}<br>
            Subtotal: ₱${item.subtotal}
        </div>
    `;
    });

    // DISPLAY
    document.getElementById("n").innerText = name;
    document.getElementById("a").innerText = address;
    document.getElementById("p").innerText = phone;
    document.getElementById("d").innerText = timetodelever;
    document.getElementById("itemList").innerHTML = itemsHTML;
    document.getElementById("total").innerText = total;

    // HIDDEN INPUTS
    document.getElementById("name").value = name;
    document.getElementById("address").value = address;
    document.getElementById("phone").value = phone;
    document.getElementById("delivery").value = timetodelever;
    document.getElementById("items").value =
        JSON.stringify(cartItems);
    document.getElementById("total").value = total;

    // SUBMIT
    form.addEventListener("submit", async(e) => {

        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerText = "⏳ Sending...";

        msg.innerText = "Submitting order...";

        try {

            const response = await fetch(url, {
                method: "POST",
                body: new FormData(form)
            });

            const result = await response.text();

            if (response.ok) {

                msg.innerText =
                    "✅ Order Sent Successfully";

                localStorage.removeItem("cartItems");

            } else {

                msg.innerText =
                    "❌ Failed: " + result;
            }

        } catch (error) {

            msg.innerText =
                "❌ Network Error";
        }

        submitBtn.disabled = false;
        submitBtn.innerText = "Send Order";
    });

}