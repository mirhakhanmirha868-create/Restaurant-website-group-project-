
const signupForm = document.querySelector("#signup form");
const loginForm = document.querySelector("#login form");
const bookingForm = document.querySelector("#reservation form");

function showMessage(form, text) {
    let message = form.querySelector(".form-message");

    if (!message) {
        message = document.createElement("p");
        message.className = "form-message";
        form.appendChild(message);
    }

    message.textContent = text;
}

// SIGN UP

signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim().toLowerCase();
    const password = document.getElementById("signup-password").value;

    if (name === "" || email === "" || password === "") {
        showMessage(signupForm, "Please fill all fields.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(function (user) {
        return user.email === email;
    });

    if (exists) {
        showMessage(signupForm, "Email already registered.");
    } else {
        users.push({
            name: name,
            email: email,
            password: password
        });

        localStorage.setItem("users", JSON.stringify(users));

        showMessage(signupForm, "Account created successfully!");
        signupForm.reset();
    }
});

// LOGIN

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(function (item) {
        return item.email === email && item.password === password;
    });

    if (user) {
        showMessage(loginForm, "Welcome, " + user.name + "!");
    } else {
        showMessage(loginForm, "Invalid email or password. Please sign up first.");
    }
});

// ADD TO CART

let cart = [];

const cartSection = document.createElement("section");
cartSection.id = "cart";

cartSection.innerHTML = `
    <h2>Your Cart</h2>
    <div id="cart-items"></div>
    <h3 id="cart-total">Total: Rs. 0</h3>
`;

document.getElementById("restaurant-content").appendChild(cartSection);

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(function (item, index) {
        const row = document.createElement("p");

        row.textContent =
            item.name + " x " + item.quantity +
            " = Rs. " + item.price * item.quantity + " ";

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function () {
            cart.splice(index, 1);
            updateCart();
        });

        row.appendChild(removeButton);
        cartItems.appendChild(row);

        total += item.price * item.quantity;
    });

    cartTotal.textContent = "Total: Rs. " + total;
}

document.querySelectorAll("article button").forEach(function (button) {
    if (button.textContent.trim() === "Add to Cart") {
        button.addEventListener("click", function () {
            const article = button.closest("article");
            const nameElement = article.querySelector("h3, h4");
            const paragraphs = article.querySelectorAll("p");

            let price = 0;

            paragraphs.forEach(function (paragraph) {
                if (paragraph.textContent.includes("Price:")) {
                    price = Number(
                        paragraph.textContent
                            .replace("Price:", "")
                            .replace("Rs.", "")
                            .replace(/,/g, "")
                            .trim()
                    );
                }
            });

            if (!nameElement || price <= 0) {
                return;
            }

            const name = nameElement.textContent;

            const existingItem = cart.find(function (item) {
                return item.name === name;
            });

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();
        });
    }
});

// BOOK A TABLE

bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("customer-name").value.trim();
    const email = document.getElementById("customer-email").value.trim();
    const date = document.getElementById("booking-date").value;
    const time = document.getElementById("booking-time").value;
    const guests = document.getElementById("guests").value;

    if (!name || !email || !date || !time || !guests) {
        showMessage(bookingForm, "Please fill all required fields.");
        return;
    }

    const booking = {
        name: name,
        email: email,
        date: date,
        time: time,
        guests: guests,
        message: document.getElementById("booking-message").value
    };

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    showMessage(bookingForm, "Your booking request has been saved!");
    bookingForm.reset();
});
      
