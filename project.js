let products = [
    {
        id: 1,
        name: "Glow Face Serum",
        category: "Skincare",
        price: 499,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Hydrating Face Cream",
        category: "Skincare",
        price: 349,
        image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Rose Lipstick",
        category: "Makeup",
        price: 299,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Daily Sunscreen",
        category: "Skincare",
        price: 399,
        image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Soft Blush Palette",
        category: "Makeup",
        price: 599,
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Nourishing Hair Oil",
        category: "Haircare",
        price: 249,
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        name: "Gentle Face Cleanser",
        category: "Skincare",
        price: 279,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 8,
        name: "Beauty Lip Gloss",
        category: "Makeup",
        price: 199,
        image: "https://images.unsplash.com/photo-1631214540242-8f97e0d6a3c7?auto=format&fit=crop&w=500&q=80"
    }
];



let cart = JSON.parse(localStorage.getItem("glowCart")) || [];

let couponCode = "";


function showProducts() {
    let list = document.getElementById("product-list");

    let search = document.getElementById("search").value.toLowerCase();
    let category = document.getElementById("category").value;
    let sort = document.getElementById("sort").value;
    let maxPrice = Number(document.getElementById("max-price").value);

    let filteredProducts = [];


    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        if (
            product.name.toLowerCase().includes(search) &&
            (category === "All" || product.category === category) &&
            product.price <= maxPrice
        ) {
            filteredProducts.push(product);
        }
    }


    if (sort === "low") {
        filteredProducts.sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (sort === "high") {
        filteredProducts.sort(function(a, b) {
            return b.price - a.price;
        });
    } else if (sort === "name") {
        filteredProducts.sort(function(a, b) {
            if (a.name < b.name) {
                return -1;
            }

            if (a.name > b.name) {
                return 1;
            }

            return 0;
        });
    }

    list.innerHTML = "";

    if (filteredProducts.length === 0) {
        list.innerHTML = "<p>No products found. Try another search.</p>";
        return;
    }


    for (let i = 0; i < filteredProducts.length; i++) {
        let product = filteredProducts[i];

        list.innerHTML += `
            <div class="product-card">

                <img src="${product.image}"
                     alt="${product.name}"
                     onerror="this.onerror=null;this.src='https://placehold.co/400x300/fce8ec/a83f60?text=GlowBasket'">

                <p class="category-name">${product.category}</p>

                <h3>${product.name}</h3>

                <p>₹${product.price}</p>

                <button onclick="addToCart(${product.id})">
                    <i class="fa-solid fa-cart-plus"></i>
                    Add to Cart
                </button>

            </div>
        `;
    }
}



function addToCart(id) {
    let found = false;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity++;
            found = true;
            break;
        }
    }

    if (found === false) {
        cart.push({
            id: id,
            quantity: 1
        });
    }

    saveCart();
    showCart();
}

function removeFromCart(id) {
    let newCart = [];

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id !== id) {
            newCart.push(cart[i]);
        }
    }

    cart = newCart;

    couponCode = "";

    document.getElementById("coupon").value = "";
    document.getElementById("coupon-message").innerText = "";

    saveCart();
    showCart();
}


function changeQuantity(id, amount) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart[i].quantity = cart[i].quantity + amount;

            if (cart[i].quantity <= 0) {
                removeFromCart(id);
                return;
            }

            break;
        }
    }

    saveCart();
    showCart();
}


function saveCart() {
    localStorage.setItem("glowCart", JSON.stringify(cart));
}


function calculateSubtotal() {
    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
        for (let j = 0; j < products.length; j++) {
            if (cart[i].id === products[j].id) {
                subtotal = subtotal +
                    products[j].price * cart[i].quantity;
            }
        }
    }

    return subtotal;
}

function showCart() {
    let cartItems = document.getElementById("cart-items");

    let subtotal = 0;
    let itemCount = 0;

    cartItems.innerHTML = "";

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let product = null;

        // Find the product details

        for (let j = 0; j < products.length; j++) {
            if (products[j].id === item.id) {
                product = products[j];
                break;
            }
        }

        if (product !== null) {
            let itemTotal = product.price * item.quantity;

            subtotal = subtotal + itemTotal;
            itemCount = itemCount + item.quantity;

            cartItems.innerHTML += `
                <div class="cart-item">

                    <div>
                        <h3>${product.name}</h3>
                        <p>Price: ₹${product.price}</p>
                        <p>Item Total: ₹${itemTotal.toFixed(2)}</p>
                    </div>

                    <div class="quantity">
                        <button onclick="changeQuantity(${product.id}, -1)">
                            -
                        </button>

                        <span>${item.quantity}</span>

                        <button onclick="changeQuantity(${product.id}, 1)">
                            +
                        </button>
                    </div>

                    <button class="remove-button"
                            onclick="removeFromCart(${product.id})">
                        <i class="fa-solid fa-trash"></i>
                        Remove
                    </button>

                </div>
            `;
        }
    }

    if (cartItems.innerHTML === "") {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }


    document.getElementById("cart-count").innerText = itemCount;


    let discount = 0;

    if (couponCode === "GLOW10") {
        discount = subtotal * 10 / 100;
    } else if (couponCode === "FIRST15") {
        discount = subtotal * 15 / 100;
    } else if (couponCode === "GLOW100" && subtotal >= 799) {
        discount = 100;
    }


    let delivery = 0;

    if (subtotal > 0 && subtotal < 999) {
        delivery = 50;
    }


    let total = subtotal - discount + delivery;

    document.getElementById("subtotal").innerText =
        subtotal.toFixed(2);

    document.getElementById("discount").innerText =
        discount.toFixed(2);

    document.getElementById("delivery").innerText =
        delivery.toFixed(2);

    document.getElementById("total").innerText =
        total.toFixed(2);


    let progress = subtotal / 999 * 100;

    if (progress > 100) {
        progress = 100;
    }

    document.getElementById("delivery-progress").style.width =
        progress + "%";

    if (subtotal === 0) {
        document.getElementById("delivery-message").innerText =
            "Add products to start shopping!";
    } else if (subtotal >= 999) {
        document.getElementById("delivery-message").innerText =
            "Congratulations! You get free delivery!";
    } else {
        document.getElementById("delivery-message").innerText =
            "Shop for ₹" + (999 - subtotal).toFixed(2) +
            " more to get free delivery!";
    }
}


function applyCoupon() {
    let code = document.getElementById("coupon").value.trim().toUpperCase();
    let message = document.getElementById("coupon-message");

    let subtotal = calculateSubtotal();

    if (subtotal === 0) {
        couponCode = "";
        message.innerText = "Add products to your cart first.";
    } else if (code === "GLOW10") {
        couponCode = code;
        message.innerText = "Success! 10% discount applied.";
    } else if (code === "FIRST15") {
        couponCode = code;
        message.innerText = "Success! 15% discount applied.";
    } else if (code === "GLOW100" && subtotal >= 799) {
        couponCode = code;
        message.innerText = "Success! ₹100 discount applied.";
    } else if (code === "GLOW100") {
        couponCode = "";
        message.innerText = "Add products worth ₹799 to use this coupon.";
    } else {
        couponCode = "";
        message.innerText = "Invalid coupon code.";
    }

    showCart();
}



function goToCheckout() {
    if (cart.length === 0) {
        alert("Please add products to your cart first.");
    } else {
        document.getElementById("checkout").scrollIntoView({
            behavior: "smooth"
        });
    }
}

document.getElementById("checkout-form").addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let name = document.getElementById("customer-name").value;
    let payment = document.getElementById("payment").value;
    let total = document.getElementById("total").innerText;

    let orderNumber = Math.floor(10000 + Math.random() * 90000);

    document.getElementById("order-message").innerHTML =
        "<h3>Thank you, " + name + "!</h3>" +
        "<p>Your order has been placed successfully.</p>" +
        "<p>Order Number: GB" + orderNumber + "</p>" +
        "<p>Payment Method: " + payment + "</p>" +
        "<p>Order Total: ₹" + total + "</p>";

    // Empty the cart after the demo order

    cart = [];
    couponCode = "";

    saveCart();
    showCart();

    document.getElementById("coupon").value = "";
    document.getElementById("coupon-message").innerText = "";

    document.getElementById("checkout-form").reset();
});


document.getElementById("search").addEventListener("input", showProducts);

document.getElementById("category").addEventListener("change", showProducts);

document.getElementById("sort").addEventListener("change", showProducts);

document.getElementById("max-price").addEventListener("change", showProducts);


// Start the website

showProducts();
showCart();