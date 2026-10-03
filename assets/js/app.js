const app = document.getElementById("app");
const money = n => "₹" + Number(n).toLocaleString("en-IN");
const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const getWishlist = () => JSON.parse(localStorage.getItem("wishlist") || "[]");
const saveCart = c => { localStorage.setItem("cart", JSON.stringify(c)); render(); };
const saveWishlist = w => { localStorage.setItem("wishlist", JSON.stringify(w)); render(); };
const params = new URLSearchParams(location.search);

function nav() { 
    return `<nav class="navbar navbar-expand-lg bg-white sticky-top">
    <div class="container"> 

        <a class="navbar-brand fs-4" href="index.html">
            <i class="bi bi-lightning-charge-fill"></i> ElectroMart
        </a> 

        <button class="navbar-toggler" data-bs-toggle="collapse" 
            data-bs-target="#nav">
            <span class="navbar-toggler-icon"></span>
        </button> 

        <div class="collapse navbar-collapse" id="nav">

            <ul class="navbar-nav mx-auto gap-lg-2"> 
                ${[
                    "Home|index.html",
                    "Shop|shop.html",
                    "Categories|categories.html",
                    "Brands|brands.html",
                    "Deals|deals.html",
                    "New Arrivals|new-arrivals.html",
                    "About|about.html",
                    "Contact|contact.html"
                ].map(x => { 
                    let [t, h] = x.split("|"); 
                    return `<li class="nav-item">
                        <a class="nav-link" href="${h}">${t}</a>
                    </li>`;
                }).join("")} 
            </ul>

            <!-- SEARCH -->
            <form class="d-flex me-2 my-2 my-lg-0" 
                  onsubmit="event.preventDefault(); searchProducts(this)">
                <div class="input-group">
                    <input 
                        type="search" 
                        name="search"
                        class="form-control"
                        placeholder="Search products..."
                        aria-label="Search products">
                    <button class="btn btn-outline-primary" type="submit">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </form>

            <!-- WISHLIST / CART / LOGIN -->
            <div class="d-flex align-items-center gap-2">

                <a class="btn btn-light position-relative" 
                   href="shop.html?view=wishlist">
                    <i class="bi bi-heart"></i>
                    <span class="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
                        ${getWishlist().length}
                    </span>
                </a>

                <a class="btn btn-primary position-relative" 
                   href="shop.html?view=cart">
                    <i class="bi bi-cart3"></i>
                    <span class="badge bg-dark rounded-pill position-absolute top-0 start-100 translate-middle">
                        ${getCart().reduce((a, b) => a + b.qty, 0)}
                    </span>
                </a>

                <a class="btn btn-outline-dark d-none d-lg-inline-block" 
                   href="login.html">
                    <i class="bi bi-person"></i>
                </a>

            </div>

        </div>
    </div>
    </nav>`;
}

function searchProducts(form) {
    const search = form.search.value.trim();

    if (search) {
        window.location.href = "shop.html?q=" + encodeURIComponent(search);
    }
}
// Newsletter Subscribe
document.addEventListener("click", function (event) {

    if (event.target.closest(".newsletter button") ||
        event.target.closest("footer button")) {

        const button = event.target.closest("button");
        const container = button.closest(".input-group");

        if (!container) return;

        const input = container.querySelector("input");

        if (!input) return;

        const email = input.value.trim();

        if (!email) {
            toast("Please enter your email address", "danger");
            return;
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            toast("Please enter a valid email address", "danger");
            return;
        }

        // Get subscribers
        let subscribers = JSON.parse(
            localStorage.getItem("newsletterSubscribers") || "[]"
        );

        // Check duplicate
        if (
            subscribers.some(
                subscriber =>
                    subscriber.toLowerCase() === email.toLowerCase()
            )
        ) {
            toast("You are already subscribed!", "warning");
            return;
        }

        // Save email
        subscribers.push(email);

        localStorage.setItem(
            "newsletterSubscribers",
            JSON.stringify(subscribers)
        );

        // Clear input
        input.value = "";

        // Success message
        toast(
            "Successfully subscribed to our newsletter!",
            "success"
        );
    }

});




function footer() { return `<footer class="footer mt-5 pt-5 pb-4"><div class="container"><div class="row g-4"><div class="col-lg-4"><h4 class="text-white fw-bold">ElectroMart</h4><p>Everything electronic, all in one place. A modern storefront frontend for your electronics business.</p></div><div class="col-6 col-lg-2"><h6 class="text-white">Shop</h6><a class="d-block mb-2" href="shop.html">All Products</a><a class="d-block mb-2" href="deals.html">Deals</a><a class="d-block mb-2" href="new-arrivals.html">New Arrivals</a></div><div class="col-6 col-lg-2"><h6 class="text-white">Company</h6><a class="d-block mb-2" href="about.html">About</a><a class="d-block mb-2" href="contact.html">Contact</a><a class="d-block mb-2" href="admin.html">Admin</a></div><div class="col-lg-4"><h6 class="text-white">Newsletter</h6><div class="input-group"><input class="form-control" placeholder="Your email"><button class="btn btn-primary">Subscribe</button></div></div></div><hr class="border-secondary my-4"><div class="d-flex justify-content-between small"><span>© 2026 ElectroMart</span></div></div></footer>` }
function layout(content) { app.innerHTML = nav() + content + footer(); }

function productCard(p) {
    const wish = getWishlist().includes(p.id);
    return `<div class="col"><div class="card product-card h-100 position-relative"><div class="position-relative"><img src="${p.image}" class="card-img-top product-img" alt="${p.name}"><span class="badge badge-soft position-absolute top-0 start-0 m-3">${p.badge}</span><button class="wishlist-btn position-absolute top-0 end-0 m-3 ${wish ? "active" : ""}" onclick="toggleWish(${p.id})"><i class="bi ${wish ? "bi-heart-fill" : "bi-heart"}"></i></button></div><div class="card-body d-flex flex-column"><small class="text-muted">${p.brand} • ${p.category}</small><h6 class="mt-2 mb-1">${p.name}</h6><div class="rating small mb-2">${"★".repeat(Math.round(p.rating))}<span class="text-muted ms-1">${p.rating}</span></div><div class="mt-auto d-flex align-items-center justify-content-between"><div><span class="price">${money(p.price)}</span><span class="old-price ms-2">${money(p.oldPrice)}</span></div></div><div class="d-flex gap-2 mt-3"><a href="product.html?id=${p.id}" class="btn btn-outline-dark flex-fill">View</a><button onclick="addToCart(${p.id})" class="btn btn-primary flex-fill"><i class="bi bi-cart-plus"></i> Add</button></div></div></div></div>`;
}
function toggleWish(id) { let w = getWishlist(); w = w.includes(id) ? w.filter(x => x !== id) : [...w, id]; saveWishlist(w); toast(w.includes(id) ? "Added to wishlist" : "Removed from wishlist"); }
function addToCart(id) { let c = getCart(), item = c.find(x => x.id === id); item ? item.qty++ : c.push({ id, qty: 1 }); saveCart(c); toast("Product added to cart"); }
function removeCart(id) { saveCart(getCart().filter(x => x.id !== id)); }
function changeQty(id, d) { let c = getCart(), i = c.find(x => x.id === id); if (i) { i.qty = Math.max(1, i.qty + d); saveCart(c) } }
function toast(msg) { let el = document.getElementById("toast"); if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast-container position-fixed bottom-0 end-0 p-3"; document.body.appendChild(el) } el.innerHTML = `<div class="toast show text-bg-dark"><div class="d-flex"><div class="toast-body">${msg}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div>`; setTimeout(() => el.innerHTML = "", 2200) }

function home() {
    layout(`<section class="hero py-5"><div class="container py-4"><div class="row align-items-center"><div class="col-lg-6"><span class="badge bg-light text-dark mb-3">SMART TECH. BETTER LIFE.</span><h1 class="display-4 mb-3">Upgrade your world with smarter electronics.</h1><p class="lead text-white-50">Shop phones, laptops, gaming gear, audio, TVs and smart-home essentials.</p><a href="shop.html" class="btn btn-light btn-lg me-2">Shop Now</a><a href="deals.html" class="btn btn-outline-light btn-lg">View Deals</a></div><div class="col-lg-6"><img class="hero-img w-100" src="${products[0].image}" alt="Electronics"></div></div></div></section>
 <section class="container py-5"><div class="d-flex justify-content-between align-items-end mb-4"><div><p class="text-primary fw-semibold mb-1">EXPLORE</p><h2 class="section-title">Shop by category</h2></div><a href="categories.html">View all <i class="bi bi-arrow-right"></i></a></div><div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">${categories.slice(0, 5).map(c => `<div class="col"><a class="text-decoration-none text-dark" href="shop.html?category=${encodeURIComponent(c.name)}"><div class="category-card"><img src="${c.image}" class="w-100 category-img"><div class="p-3 text-center"><i class="bi ${c.icon} fs-4 text-primary"></i><div class="fw-semibold mt-2">${c.name}</div></div></div></a></div>`).join("")}</div></section>
 <section class="container pb-5"><div class="d-flex justify-content-between align-items-end mb-4"><div><p class="text-primary fw-semibold mb-1">TRENDING NOW</p><h2 class="section-title">Featured products</h2></div><a href="shop.html">Shop all <i class="bi bi-arrow-right"></i></a></div><div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">${products.slice(0, 8).map(productCard).join("")}</div></section>
 <section class="container pb-5"><div class="newsletter p-5 text-center"><h2 class="section-title">Get exclusive deals</h2><p class="text-muted">Subscribe for new product alerts and weekly offers.</p><div class="row justify-content-center"><div class="col-md-6"><div class="input-group"><input class="form-control form-control-lg" placeholder="Email address"><button class="btn btn-primary px-4">Subscribe</button></div></div></div></div></section>`);
}

function shop() {
    const cat = params.get("category") || "", q = params.get("q") || "", view = params.get("view") || "";
    if (view === "cart") return cartPage();
    if (view === "wishlist") return wishlistPage();
    let list = products.filter(p => (!cat || p.category === cat) && (!q || p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase())));
    layout(`<section class="page-banner"><div class="container"><p class="text-primary fw-semibold mb-1">STORE</p><h1 class="section-title">Shop ${cat ? `• ${cat}` : "All Products"}</h1><p class="text-muted mb-0">${list.length} products available</p></div></section><section class="container py-5"><div class="row g-4"><div class="col-lg-3"><div class="filter-panel sticky-lg-top" style="top:90px"><h6 class="fw-bold">Search</h6><form onsubmit="event.preventDefault();location.href='shop.html?q='+encodeURIComponent(this.q.value)"><div class="input-group mb-4"><input name="q" value="${q}" class="form-control" placeholder="Search products"><button class="btn btn-primary"><i class="bi bi-search"></i></button></div></form><h6 class="fw-bold">Categories</h6>${categories.map(c => `<a class="d-block text-decoration-none text-dark py-1" href="shop.html?category=${encodeURIComponent(c.name)}">${c.name}</a>`).join("")}<hr><a href="shop.html" class="btn btn-outline-secondary w-100">Clear Filters</a></div></div><div class="col-lg-9"><div class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">${list.length ? list.map(productCard).join("") : `<div class="col-12"><div class="empty-state"><i class="bi bi-search display-4"></i><h4 class="mt-3">No products found</h4><p>Try another search or category.</p></div></div>`}</div></div></div></section>`);
}

function cartPage() {
    const c = getCart(); let total = c.reduce((s, x) => s + (products.find(p => p.id === x.id)?.price || 0) * x.qty, 0);
    layout(`<section class="page-banner"><div class="container"><h1 class="section-title">Shopping Cart</h1><p class="text-muted">Review your items before checkout.</p></div></section><section class="container py-5">${c.length ? `<div class="row g-4"><div class="col-lg-8">${c.map(x => { let p = products.find(p => p.id === x.id); return `<div class="card border-0 shadow-sm mb-3"><div class="card-body"><div class="row align-items-center g-3"><div class="col-3 col-md-2"><img src="${p.image}" class="img-fluid rounded" style="height:80px;width:100%;object-fit:cover"></div><div class="col-9 col-md-4"><h6>${p.name}</h6><small class="text-muted">${p.brand}</small></div><div class="col-6 col-md-3"><div class="btn-group"><button class="btn btn-outline-secondary" onclick="changeQty(${p.id},-1)">−</button><button class="btn btn-outline-secondary">${x.qty}</button><button class="btn btn-outline-secondary" onclick="changeQty(${p.id},1)">+</button></div></div><div class="col-4 col-md-2 fw-bold">${money(p.price * x.qty)}</div><div class="col-2 text-end"><button class="btn btn-sm btn-outline-danger" onclick="removeCart(${p.id})"><i class="bi bi-trash"></i></button></div></div></div></div>` }).join("")}</div><div class="col-lg-4"><div class="card border-0 shadow-sm"><div class="card-body p-4"><h5>Order Summary</h5><div class="d-flex justify-content-between mt-3"><span>Subtotal</span><b>${money(total)}</b></div><div class="d-flex justify-content-between mt-2"><span>Shipping</span><b class="text-success">FREE</b></div><hr><div class="d-flex justify-content-between"><span class="fw-bold">Total</span><b class="fs-5">${money(total)}</b></div><button onclick="toast('Demo checkout: connect your backend/payment gateway here')" class="btn btn-primary w-100 mt-4">Proceed to Checkout</button></div></div></div></div>` : `<div class="empty-state"><i class="bi bi-cart-x display-4"></i><h4 class="mt-3">Your cart is empty</h4><a href="shop.html" class="btn btn-primary mt-2">Start Shopping</a></div>`}</section>`);
}
function wishlistPage() { const w = getWishlist(); let list = products.filter(p => w.includes(p.id)); layout(`<section class="page-banner"><div class="container"><h1 class="section-title">Wishlist</h1><p class="text-muted">Your saved products.</p></div></section><section class="container py-5"><div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">${list.length ? list.map(productCard).join("") : `<div class="col-12"><div class="empty-state"><i class="bi bi-heart display-4"></i><h4 class="mt-3">Your wishlist is empty</h4><a href="shop.html" class="btn btn-primary">Browse Products</a></div></div>`}</div></section>`) }

function productPage() { let p = products.find(x => x.id == params.get("id")) || products[0]; layout(`<section class="container py-5"><div class="row g-5 align-items-center"><div class="col-lg-6"><img src="${p.image}" class="product-detail-img" alt="${p.name}"></div><div class="col-lg-6"><span class="badge badge-soft mb-3">${p.badge}</span><p class="text-muted mb-1">${p.brand} • ${p.category}</p><h1 class="fw-bold">${p.name}</h1><div class="rating mb-3">${"★".repeat(Math.round(p.rating))} <span class="text-muted">${p.rating} / 5</span></div><p class="display-6 fw-bold">${money(p.price)} <del class="fs-5 text-muted">${money(p.oldPrice)}</del></p><p class="text-muted lead">${p.desc}</p><div class="d-flex gap-2 mb-4"><span class="badge bg-success-subtle text-success"><i class="bi bi-check-circle"></i> In stock (${p.stock})</span><span class="badge bg-light text-dark">Free delivery</span></div><div class="d-flex gap-2"><button class="btn btn-primary btn-lg px-4" onclick="addToCart(${p.id})"><i class="bi bi-cart-plus"></i> Add to Cart</button><button class="btn btn-outline-danger btn-lg" onclick="toggleWish(${p.id})"><i class="bi bi-heart"></i></button></div></div></div><hr class="my-5"><h3 class="section-title">Customer Reviews</h3><div class="row g-3 mt-1">${[["Aarav", "Excellent quality and quick delivery.", 5], ["Meera", "Product matches the description.", 4], ["Rohan", "Good value for the price.", 5]].map(r => `<div class="col-md-4"><div class="info-card p-4"><div class="rating">${"★".repeat(r[2])}</div><h6 class="mt-2">${r[0]}</h6><p class="text-muted mb-0">${r[1]}</p></div></div>`).join("")}</div></section>`) }

function categoriesPage() { layout(`<section class="page-banner"><div class="container"><h1 class="section-title">Categories</h1><p class="text-muted">Explore electronics by category.</p></div></section><section class="container py-5"><div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">${categories.map(c => `<div class="col"><a href="shop.html?category=${encodeURIComponent(c.name)}" class="text-decoration-none text-dark"><div class="category-card h-100"><img src="${c.image}" class="w-100 category-img"><div class="p-4"><i class="bi ${c.icon} text-primary fs-3"></i><h5 class="mt-2">${c.name}</h5><small class="text-muted">${products.filter(p => p.category === c.name).length} products</small></div></div></a></div>`).join("")}</div></section>`) }

function brandsPage() { layout(`<section class="page-banner"><div class="container"><h1 class="section-title">Brands</h1><p class="text-muted">Discover products from popular electronics brands.</p></div></section><section class="container py-5"><div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">${brands.map(b => `<div class="col"><a href="shop.html?q=${encodeURIComponent(b)}" class="text-decoration-none text-dark"><div class="brand-card p-4 text-center h-100"><div class="rounded-circle bg-light d-inline-flex align-items-center justify-content-center" style="width:80px;height:80px"><i class="bi bi-award fs-2 text-primary"></i></div><h5 class="mt-3">${b}</h5><p class="text-muted mb-0">${products.filter(p => p.brand === b).length} products</p></div></a></div>`).join("")}</div></section>`) }

function dealsPage() { let list = products.filter(p => p.oldPrice > p.price); layout(`<section class="page-banner"><div class="container"><span class="badge bg-danger mb-2">LIMITED OFFERS</span><h1 class="section-title">Deals & Offers</h1><p class="text-muted">Save on selected electronics.</p></div></section><section class="container py-5"><div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">${list.map(productCard).join("")}</div></section>`) }

function newPage() { let list = products.filter(p => p.badge === "New"); layout(`<section class="page-banner"><div class="container"><span class="badge badge-soft mb-2">JUST IN</span><h1 class="section-title">New Arrivals</h1><p class="text-muted">Fresh products added to the store.</p></div></section><section class="container py-5"><div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">${list.map(productCard).join("")}</div></section>`) }

function aboutPage() { layout(`<section class="page-banner"><div class="container"><h1 class="section-title">About ElectroMart</h1><p class="text-muted">Technology made simple.</p></div></section><section class="container py-5"><div class="row g-5 align-items-center"><div class="col-lg-6"><img class="rounded-4 w-100" src="${products[3].image}" style="height:420px;object-fit:cover"></div><div class="col-lg-6"><p class="text-primary fw-semibold">OUR STORY</p><h2 class="section-title">A modern electronics shopping experience.</h2><p class="text-muted">ElectroMart is a frontend reference project for an electronics store. It demonstrates product discovery, category navigation, shopping cart, wishlist, reviews, authentication screens and an admin dashboard.</p><div class="row g-3 mt-3">${[["10K+", "Products"], ["50+", "Brands"], ["24/7", "Support"], ["4.8/5", "Customer rating"]].map(x => `<div class="col-6"><div class="info-card p-3"><h3 class="fw-bold">${x[0]}</h3><p class="text-muted mb-0">${x[1]}</p></div></div>`).join("")}</div></div></div></section>`) }

function contactPage() { layout(`<section class="page-banner"><div class="container"><h1 class="section-title">Contact Us</h1><p class="text-muted">We would love to hear from you.</p></div></section><section class="container py-5"><div class="row g-4"><div class="col-lg-5"><div class="info-card p-4 h-100"><h4>Get in touch</h4><p class="text-muted">Use the form or contact us using the details below.</p><div class="d-flex gap-3 mb-3"><i class="bi bi-envelope text-primary fs-4"></i><div><b>Email</b><div class="text-muted">support@electromart.demo</div></div></div><div class="d-flex gap-3 mb-3"><i class="bi bi-telephone text-primary fs-4"></i><div><b>Phone</b><div class="text-muted">+91 98765 43210</div></div></div><div class="d-flex gap-3"><i class="bi bi-geo-alt text-primary fs-4"></i><div><b>Address</b><div class="text-muted">Bengaluru, India</div></div></div></div></div><div class="col-lg-7"><div class="card border-0 shadow-sm p-4"><form onsubmit="event.preventDefault();toast('Message submitted successfully (demo)');this.reset()"><div class="row g-3"><div class="col-md-6"><label class="form-label">Name</label><input class="form-control" required></div><div class="col-md-6"><label class="form-label">Email</label><input type="email" class="form-control" required></div><div class="col-12"><label class="form-label">Subject</label><input class="form-control" required></div><div class="col-12"><label class="form-label">Message</label><textarea class="form-control" rows="6" required></textarea></div><div class="col-12"><button class="btn btn-primary px-4">Send Message</button></div></div></form></div></div></div></section>`) }


function loginPage() {
    layout(`
    <section class="page-banner">
        <div class="container">
            <h1 class="section-title">Login</h1>
            <p class="text-muted">Access your ElectroMart account.</p>
        </div>
    </section>

    <section class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">

                <div class="card border-0 shadow-sm p-4">

                    <div class="text-center mb-4">
                        <i class="bi bi-person-circle display-4 text-primary"></i>
                        <h3 class="mt-2">Welcome back</h3>
                        <p class="text-muted">Login to continue shopping</p>
                    </div>

                    <form onsubmit="loginUser(event)">

                        <label class="form-label">Email</label>
                        <input 
                            type="email"
                            id="loginEmail"
                            class="form-control mb-3"
                            required
                            placeholder="you@example.com">

                        <label class="form-label">Password</label>
                        <input 
                            type="password"
                            id="loginPassword"
                            class="form-control mb-3"
                            required
                            placeholder="••••••••">

                        <div class="d-flex justify-content-between mb-3">
                            <label>
                                <input type="checkbox" id="rememberMe">
                                Remember me
                            </label>

                            <a href="#" onclick="forgotPassword(event)">
                                Forgot password?
                            </a>
                        </div>

                        <button type="submit" class="btn btn-primary w-100">
                            <i class="bi bi-box-arrow-in-right"></i>
                            Login
                        </button>

                    </form>

                    <hr>

                    <p class="text-center mb-2">
                        Don't have an account?
                    </p>

                    <a href="register.html" class="btn btn-outline-primary w-100">
                        Create Account
                    </a>

                    <p class="text-center text-muted small mt-3 mb-0">
                        Admins can login using their admin account.
                    </p>

                </div>

            </div>
        </div>
    </section>
    `);
}

function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value
        .trim()
        .toLowerCase();

    const password = document.getElementById("loginPassword").value;

    // Get registered users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Default admin account
    const adminEmail = "admin@electromart.com";
    const adminPassword = "admin123";

    // Check admin login
    if (email === adminEmail && password === adminPassword) {

        const admin = {
            email: adminEmail,
            role: "admin",
            name: "Administrator"
        };

        localStorage.setItem("currentUser", JSON.stringify(admin));

        toast("Admin login successful");

        setTimeout(() => {
            location.href = "admin.html";
        }, 500);

        return;
    }

    // Check normal user login
    const user = users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        toast("Invalid email or password");
        return;
    }

    // Save logged-in user
    localStorage.setItem(
        "currentUser",
        JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: "user"
        })
    );

    toast("Login successful");

    setTimeout(() => {
        location.href = "index.html";
    }, 500);
}


function forgotPassword(event) {
    event.preventDefault();

    const email = prompt("Enter your registered email:");

    if (!email) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u => u.email === email.trim().toLowerCase()
    );

    if (user) {
        alert(
            "Password reset demo:\n\n" +
            "Your current password is: " + user.password
        );
    } else {
        alert("No account found with this email.");
    }
}




function render() {
    const page =
        location.pathname.split("/").pop() || "index.html";

    if (page === "shop.html") {
        shop();

    } else if (page === "categories.html") {
        categoriesPage();

    } else if (page === "product.html") {
        productPage();

    } else if (page === "brands.html") {
        brandsPage();

    } else if (page === "deals.html") {
        dealsPage();

    } else if (page === "new-arrivals.html") {
        newPage();

    } else if (page === "about.html") {
        aboutPage();

    } else if (page === "contact.html") {
        contactPage();

    } else if (page === "login.html") {
        loginPage();

    } else if (page === "register.html") {
        registerPage();

    } else if (page === "dashboard.html") {
        dashboardPage();

    } else if (page === "admin.html") {
        adminDashboard();

    } else {
        home();
    }
}

render();


render();
function registerPage() {

    layout(`
        <section class="page-banner">
            <div class="container">

                <h1 class="section-title">
                    Create Account
                </h1>

                <p class="text-muted">
                    Register for your ElectroMart account.
                </p>

            </div>
        </section>

        <section class="container py-5">

            <div class="row justify-content-center">

                <div class="col-md-8 col-lg-6">

                    <div class="card border-0 shadow-sm p-4">

                        <div class="text-center mb-4">

                            <i class="bi bi-person-plus display-4 text-primary"></i>

                            <h3 class="mt-2">
                                Create Your Account
                            </h3>

                        </div>

                        <form onsubmit="registerUser(event)">

                            <label class="form-label">
                                Full Name
                            </label>

                            <input
                                type="text"
                                id="registerName"
                                class="form-control mb-3"
                                required
                            >

                            <label class="form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                id="registerEmail"
                                class="form-control mb-3"
                                required
                            >

                            <label class="form-label">
                                Phone
                            </label>

                            <input
                                type="tel"
                                id="registerPhone"
                                class="form-control mb-3"
                            >

                            <label class="form-label">
                                Password
                            </label>

                            <input
                                type="password"
                                id="registerPassword"
                                class="form-control mb-3"
                                minlength="6"
                                required
                            >

                            <label class="form-label">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                id="registerConfirmPassword"
                                class="form-control mb-3"
                                required
                            >

                            <label class="form-label">
                                Address
                            </label>

                            <textarea
                                id="registerAddress"
                                class="form-control mb-3"
                                rows="3"
                            ></textarea>

                            <div class="form-check mb-3">

                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    id="terms"
                                    required
                                >

                                <label
                                    class="form-check-label"
                                    for="terms"
                                >
                                    I agree to the terms and conditions.
                                </label>

                            </div>

                            <button
                                type="submit"
                                class="btn btn-primary w-100"
                            >
                                <i class="bi bi-person-plus"></i>
                                Create Account
                            </button>

                        </form>

                        <p class="text-center mt-3 mb-0">

                            Already have an account?

                            <a href="login.html">
                                Login
                            </a>

                        </p>

                    </div>

                </div>

            </div>

        </section>
    `);
}


function registerUser(event) {

    event.preventDefault();

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value
            .trim()
            .toLowerCase();

    const phone =
        document.getElementById("registerPhone").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("registerConfirmPassword").value;

    const address =
        document.getElementById("registerAddress").value.trim();


    if (password !== confirmPassword) {

        toast(
            "Passwords do not match",
            "danger"
        );

        return;
    }


    const users =
        JSON.parse(
            localStorage.getItem("users") || "[]"
        );


    const existingUser =
        users.find(
            user => user.email === email
        );


    if (existingUser) {

        toast(
            "Email is already registered",
            "danger"
        );

        return;
    }


    const newUser = {

        id: Date.now(),

        name: name,

        email: email,

        phone: phone,

        password: password,

        address: address,

        role: "user",

        createdAt: new Date().toISOString()

    };


    users.push(newUser);


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    localStorage.setItem(
        "currentUser",
        JSON.stringify({

            id: newUser.id,

            name: newUser.name,

            email: newUser.email,

            role: "user"

        })
    );


    toast(
        "Registration successful!",
        "success"
    );


    setTimeout(() => {

        location.href = "dashboard.html";

    }, 800);
}

function adminDashboard() {

    const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "null"
    );

    // Admin login protection
    if (!currentUser || currentUser.role !== "admin") {
        window.location.href = "login.html";
        return;
    }

    const users = JSON.parse(
        localStorage.getItem("users") || "[]"
    );

    const orders = JSON.parse(
        localStorage.getItem("orders") || "[]"
    );


const baseProducts =
    typeof PRODUCTS !== "undefined"
        ? PRODUCTS
        : [];

const adminProducts = JSON.parse(
    localStorage.getItem("adminProducts") || "[]"
);

const products = [
    ...baseProducts,
    ...adminProducts
];

const baseCategories =
    typeof CATEGORIES !== "undefined"
        ? CATEGORIES
        : [];

const adminCategories = JSON.parse(
    localStorage.getItem("adminCategories") || "[]"
);

const categories = [
    ...baseCategories,
    ...adminCategories
];



    const totalRevenue = orders.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0
    );

    // --------------------------------------------------
    // ADMIN LAYOUT
    // --------------------------------------------------

    layout(`
        <div class="container-fluid py-4">

            <div class="row">

                <!-- SIDEBAR -->
                <div class="col-lg-3 col-xl-2 mb-4">

                    <div class="card shadow-sm">

                        <div class="card-header bg-dark text-white">
                            <h5 class="mb-0">
                                <i class="bi bi-speedometer2 me-2"></i>
                                Admin Panel
                            </h5>
                        </div>

                        <div class="list-group list-group-flush"
                             id="adminSidebar">

                            <button
                                type="button"
                                class="list-group-item list-group-item-action active"
                                data-section="overview">
                                <i class="bi bi-speedometer2 me-2"></i>
                                Overview
                            </button>

                            <button
                                type="button"
                                class="list-group-item list-group-item-action"
                                data-section="products">
                                <i class="bi bi-box me-2"></i>
                                Products
                            </button>

                            <button
                                type="button"
                                class="list-group-item list-group-item-action"
                                data-section="orders">
                                <i class="bi bi-cart-check me-2"></i>
                                Orders
                            </button>

                            <button
                                type="button"
                                class="list-group-item list-group-item-action"
                                data-section="users">
                                <i class="bi bi-people me-2"></i>
                                Customers
                            </button>

                            <button
                                type="button"
                                class="list-group-item list-group-item-action"
                                data-section="inventory">
                                <i class="bi bi-boxes me-2"></i>
                                Inventory
                            </button>

                            <button
                                type="button"
                                class="list-group-item list-group-item-action"
                                data-section="categories">
                                <i class="bi bi-grid me-2"></i>
                                Categories
                            </button>

                            <button
                                type="button"
                                class="list-group-item list-group-item-action"
                                data-section="brands">
                                <i class="bi bi-tags me-2"></i>
                                Brands
                            </button>

                            <button
                                type="button"
                                class="list-group-item list-group-item-action"
                                data-section="reviews">
                                <i class="bi bi-star me-2"></i>
                                Reviews
                            </button>

                            <button
                                type="button"
                                class="list-group-item list-group-item-action text-danger"
                                id="adminLogoutBtn">
                                <i class="bi bi-box-arrow-right me-2"></i>
                                Logout
                            </button>

                        </div>
                    </div>

                </div>


                <!-- MAIN CONTENT -->
                <div class="col-lg-9 col-xl-10">

                    <div class="card shadow-sm">

                        <div class="card-body"
                             id="adminContent">

                            ${adminOverviewContent()}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    `);


    // --------------------------------------------------
    // SIDEBAR BUTTONS
    // --------------------------------------------------

    const sidebar = document.getElementById("adminSidebar");

    if (sidebar) {

        sidebar.addEventListener("click", function (event) {

            const button =
                event.target.closest("[data-section]");

            if (!button) return;

            const section =
                button.getAttribute("data-section");

            // Active button
            sidebar
                .querySelectorAll("[data-section]")
                .forEach(function (item) {
                    item.classList.remove("active");
                });

            button.classList.add("active");

            // Load selected section
            loadAdminSection(section);
        });
    }


    // --------------------------------------------------
    // LOGOUT
    // --------------------------------------------------

    const logoutButton =
        document.getElementById("adminLogoutBtn");

    if (logoutButton) {

        logoutButton.addEventListener("click", function () {

            localStorage.removeItem("currentUser");

            window.location.href = "login.html";
        });
    }
}


// ======================================================
// ADMIN OVERVIEW
// ======================================================

function adminOverviewContent() {

    const users = JSON.parse(
        localStorage.getItem("users") || "[]"
    );

    const orders = JSON.parse(
        localStorage.getItem("orders") || "[]"
    );

    const products =
        typeof PRODUCTS !== "undefined" ? PRODUCTS : [];

    const revenue = orders.reduce(
        (sum, order) => sum + Number(order.total || 0),
        0
    );

    return `

        <h3 class="mb-1">
            <i class="bi bi-speedometer2 me-2"></i>
            Dashboard Overview
        </h3>

        <p class="text-muted mb-4">
            Welcome to the ElectroMart administration panel.
        </p>


        <div class="row g-3">

            <!-- PRODUCTS -->
            <div class="col-md-6 col-xl-3">

                <div class="card border-0 shadow-sm h-100">

                    <div class="card-body">

                        <div class="d-flex justify-content-between">

                            <div>
                                <small class="text-muted">
                                    Products
                                </small>

                                <h3 class="mt-2">
                                    ${products.length}
                                </h3>
                            </div>

                            <i class="bi bi-box fs-1 text-primary"></i>

                        </div>

                    </div>

                </div>

            </div>


            <!-- ORDERS -->
            <div class="col-md-6 col-xl-3">

                <div class="card border-0 shadow-sm h-100">

                    <div class="card-body">

                        <div class="d-flex justify-content-between">

                            <div>
                                <small class="text-muted">
                                    Orders
                                </small>

                                <h3 class="mt-2">
                                    ${orders.length}
                                </h3>
                            </div>

                            <i class="bi bi-cart-check fs-1 text-success"></i>

                        </div>

                    </div>

                </div>

            </div>


            <!-- CUSTOMERS -->
            <div class="col-md-6 col-xl-3">

                <div class="card border-0 shadow-sm h-100">

                    <div class="card-body">

                        <div class="d-flex justify-content-between">

                            <div>
                                <small class="text-muted">
                                    Customers
                                </small>

                                <h3 class="mt-2">
                                    ${users.length}
                                </h3>
                            </div>

                            <i class="bi bi-people fs-1 text-warning"></i>

                        </div>

                    </div>

                </div>

            </div>


            <!-- REVENUE -->
            <div class="col-md-6 col-xl-3">

                <div class="card border-0 shadow-sm h-100">

                    <div class="card-body">

                        <div class="d-flex justify-content-between">

                            <div>
                                <small class="text-muted">
                                    Revenue
                                </small>

                                <h3 class="mt-2">
                                    ₹${revenue.toLocaleString()}
                                </h3>
                            </div>

                            <i class="bi bi-currency-rupee fs-1 text-danger"></i>

                        </div>

                    </div>

                </div>

            </div>

        </div>


        <div class="mt-5">

            <h5>Admin Information</h5>

            <div class="alert alert-info">

                <i class="bi bi-info-circle me-2"></i>

                Use the sidebar to manage products, orders,
                customers, inventory, categories, brands and reviews.

            </div>

        </div>
    `;
}


// ======================================================
// LOAD ADMIN SECTION
// ======================================================

function loadAdminSection(section) {

    const content =
        document.getElementById("adminContent");

    if (!content) return;


    // --------------------------------------------------
    // OVERVIEW
    // --------------------------------------------------

    if (section === "overview") {

        content.innerHTML =
            adminOverviewContent();

        return;
    }


    // --------------------------------------------------
    // PRODUCTS
    // --------------------------------------------------

    if (section === "products") {

       const baseProducts =
    typeof PRODUCTS !== "undefined"
        ? PRODUCTS
        : [];

const adminProducts = JSON.parse(
    localStorage.getItem("adminProducts") || "[]"
);

const products = [
    ...baseProducts,
    ...adminProducts
];
        content.innerHTML = `

            <div class="d-flex justify-content-between
                        align-items-center mb-4">

                <h3>
                    <i class="bi bi-box me-2"></i>
                    Products
                </h3>

                <button
                    class="btn btn-primary"
                    onclick="addProductDemo()">

                    <i class="bi bi-plus-lg me-1"></i>
                    Add Product

                </button>

            </div>


            <div class="table-responsive">

                <table class="table table-hover align-middle">

                    <thead class="table-light">

                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Brand</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        ${
                            products.length
                            ? products.map(function(product) {

                                return `

                                    <tr>

                                        <td>
                                            ${product.id}
                                        </td>

                                        <td>
                                            ${product.name}
                                        </td>

                                        <td>
                                            ${product.brand || "-"}
                                        </td>

                                        <td>
                                            ₹${Number(product.price || 0).toLocaleString()}
                                        </td>

                                        <td>
                                            ${product.stock ?? 0}
                                        </td>

                                        <td>

                                            <button
                                                class="btn btn-sm btn-outline-primary me-1"
                                                onclick="editProductDemo('${product.id}')">

                                                <i class="bi bi-pencil"></i>

                                            </button>

                                            <button
                                                class="btn btn-sm btn-outline-danger"
                                                onclick="deleteProductDemo('${product.id}')">

                                                <i class="bi bi-trash"></i>

                                            </button>

                                        </td>

                                    </tr>

                                `;

                            }).join("")
                            : `
                                <tr>
                                    <td colspan="6"
                                        class="text-center text-muted py-4">
                                        No products found
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>
        `;

        return;
    }


    // --------------------------------------------------
    // ORDERS
    // --------------------------------------------------

    if (section === "orders") {

        const orders =
            JSON.parse(
                localStorage.getItem("orders") || "[]"
            );

        content.innerHTML = `

            <h3 class="mb-4">
                <i class="bi bi-cart-check me-2"></i>
                Orders
            </h3>

            <div class="table-responsive">

                <table class="table table-hover">

                    <thead class="table-light">

                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        ${
                            orders.length
                            ? orders.map(function(order) {

                                return `

                                    <tr>

                                        <td>
                                            ${order.id || "-"}
                                        </td>

                                        <td>
                                            ${order.email || order.userEmail || "-"}
                                        </td>

                                        <td>
                                            ₹${Number(order.total || 0).toLocaleString()}
                                        </td>

                                        <td>

                                            <select
                                                class="form-select form-select-sm"
                                                onchange="updateAdminOrderStatus('${order.id}', this.value)">

                                                <option value="Pending"
                                                    ${order.status === "Pending" ? "selected" : ""}>
                                                    Pending
                                                </option>

                                                <option value="Processing"
                                                    ${order.status === "Processing" ? "selected" : ""}>
                                                    Processing
                                                </option>

                                                <option value="Shipped"
                                                    ${order.status === "Shipped" ? "selected" : ""}>
                                                    Shipped
                                                </option>

                                                <option value="Delivered"
                                                    ${order.status === "Delivered" ? "selected" : ""}>
                                                    Delivered
                                                </option>

                                                <option value="Cancelled"
                                                    ${order.status === "Cancelled" ? "selected" : ""}>
                                                    Cancelled
                                                </option>

                                            </select>

                                        </td>

                                    </tr>

                                `;

                            }).join("")
                            : `
                                <tr>

                                    <td colspan="4"
                                        class="text-center text-muted py-4">

                                        No orders found

                                    </td>

                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>
        `;

        return;
    }


    // --------------------------------------------------
    // CUSTOMERS
    // --------------------------------------------------

    if (section === "users") {

        const users =
            JSON.parse(
                localStorage.getItem("users") || "[]"
            );

        content.innerHTML = `

            <h3 class="mb-4">
                <i class="bi bi-people me-2"></i>
                Customers
            </h3>

            <div class="table-responsive">

                <table class="table table-hover">

                    <thead class="table-light">

                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>

                    </thead>

                    <tbody>

                        ${
                            users.length
                            ? users.map(function(user) {

                                return `

                                    <tr>

                                        <td>
                                            ${user.name || "-"}
                                        </td>

                                        <td>
                                            ${user.email || "-"}
                                        </td>

                                        <td>
                                            ${user.role || "user"}
                                        </td>

                                    </tr>

                                `;

                            }).join("")
                            : `
                                <tr>
                                    <td colspan="3"
                                        class="text-center text-muted py-4">
                                        No customers found
                                    </td>
                                </tr>
                            `
                        }

                    </tbody>

                </table>

            </div>
        `;

        return;
    }


    // --------------------------------------------------
    // INVENTORY
    // --------------------------------------------------

    if (section === "inventory") {

        const products =
            typeof PRODUCTS !== "undefined"
                ? PRODUCTS
                : [];

        content.innerHTML = `

            <h3 class="mb-4">
                <i class="bi bi-boxes me-2"></i>
                Inventory
            </h3>

            <div class="row g-3">

                ${
                    products.map(function(product) {

                        const stock =
                            Number(product.stock || 0);

                        return `

                            <div class="col-md-6 col-xl-4">

                                <div class="card shadow-sm h-100">

                                    <div class="card-body">

                                        <h6>
                                            ${product.name}
                                        </h6>

                                        <p class="text-muted mb-2">
                                            ${product.brand || ""}
                                        </p>

                                        <strong>
                                            Stock:
                                            ${stock}
                                        </strong>

                                        <div class="progress mt-3">

                                            <div
                                                class="progress-bar ${stock < 5 ? "bg-danger" : "bg-success"}"
                                                style="width:${Math.min(stock * 5, 100)}%">
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        `;

                    }).join("")
                }

            </div>
        `;

        return;
    }


    // --------------------------------------------------
    // CATEGORIES
    // --------------------------------------------------

    if (section === "categories") {

       const baseCategories =
    typeof CATEGORIES !== "undefined"
        ? CATEGORIES
        : [];

const adminCategories = JSON.parse(
    localStorage.getItem("adminCategories") || "[]"
);

const categories = [
    ...baseCategories,
    ...adminCategories
];
        content.innerHTML = `

            <div class="d-flex justify-content-between
                        align-items-center mb-4">

                <h3>
                    <i class="bi bi-grid me-2"></i>
                    Categories
                </h3>

                <button
                    class="btn btn-primary"
                    onclick="addCategoryDemo()">

                    <i class="bi bi-plus-lg"></i>
                    Add Category

                </button>

            </div>


            <div class="row g-3">

                ${
                    categories.length
                    ? categories.map(function(category, index) {

                        const name =
                            typeof category === "string"
                                ? category
                                : category.name;

                        return `

                            <div class="col-md-4">

                                <div class="card shadow-sm">

                                    <div class="card-body
                                                d-flex
                                                justify-content-between">

                                        <strong>
                                            ${name}
                                        </strong>

                                        <button
                                            class="btn btn-sm btn-outline-danger"
                                            onclick="removeCategoryDemo(${index})">

                                            <i class="bi bi-trash"></i>

                                        </button>

                                    </div>

                                </div>

                            </div>

                        `;

                    }).join("")
                    : `
                        <div class="col-12">

                            <div class="alert alert-info">
                                No categories found.
                            </div>

                        </div>
                    `
                }

            </div>
        `;

        return;
    }


    // --------------------------------------------------
    // BRANDS
    // --------------------------------------------------

    if (section === "brands") {

        const products =
            typeof PRODUCTS !== "undefined"
                ? PRODUCTS
                : [];

        const brands = [
            ...new Set(
                products
                    .map(product => product.brand)
                    .filter(Boolean)
            )
        ];

        content.innerHTML = `

            <div class="d-flex justify-content-between
                        align-items-center mb-4">

                <h3>
                    <i class="bi bi-tags me-2"></i>
                    Brands
                </h3>

                <button
                    class="btn btn-primary"
                    onclick="addBrandDemo()">

                    <i class="bi bi-plus-lg"></i>
                    Add Brand

                </button>

            </div>


            <div class="row g-3">

                ${
                    brands.length
                    ? brands.map(function(brand) {

                        return `

                            <div class="col-md-4 col-lg-3">

                                <div class="card shadow-sm">

                                    <div class="card-body text-center">

                                        <i class="bi bi-tag fs-2"></i>

                                        <h6 class="mt-2 mb-0">
                                            ${brand}
                                        </h6>

                                    </div>

                                </div>

                            </div>

                        `;

                    }).join("")
                    : `
                        <div class="alert alert-info">
                            No brands found.
                        </div>
                    `
                }

            </div>
        `;

        return;
    }


    // --------------------------------------------------
    // REVIEWS
    // --------------------------------------------------

    if (section === "reviews") {

        const reviews =
            JSON.parse(
                localStorage.getItem("reviews") || "[]"
            );

        content.innerHTML = `

            <h3 class="mb-4">
                <i class="bi bi-star me-2"></i>
                Reviews
            </h3>

            ${
                reviews.length
                ? reviews.map(function(review) {

                    return `

                        <div class="card mb-3 shadow-sm">

                            <div class="card-body">

                                <h6>
                                    ${review.name || "Customer"}
                                </h6>

                                <div class="text-warning mb-2">

                                    ${"★".repeat(
                                        Number(review.rating || 5)
                                    )}

                                </div>

                                <p class="mb-0">
                                    ${review.comment || review.text || ""}
                                </p>

                            </div>

                        </div>

                    `;

                }).join("")
                : `

                    <div class="alert alert-info">

                        No reviews found.

                    </div>

                `
            }
        `;

        return;
    }


    // --------------------------------------------------
    // UNKNOWN SECTION
    // --------------------------------------------------

    content.innerHTML = `

        <div class="alert alert-warning">

            Section not found.

        </div>

    `;
}


// ======================================================
// ORDER STATUS
// ======================================================

function updateAdminOrderStatus(orderId, newStatus) {

    const orders =
        JSON.parse(
            localStorage.getItem("orders") || "[]"
        );

    const order =
        orders.find(function(item) {
            return String(item.id) === String(orderId);
        });

    if (!order) return;

    order.status = newStatus;

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    if (typeof toast === "function") {
        toast(
            "Order status updated successfully",
            "success"
        );
    }
}


// ======================================================
// DEMO PRODUCT FUNCTIONS
// ======================================================


// ======================================================
// ADMIN PRODUCT FUNCTIONS
// ======================================================

function addProductDemo() {

    const name = prompt("Enter product name:");
    if (!name) return;

    const price = Number(prompt("Enter product price:"));
    if (isNaN(price)) {
        toast("Please enter a valid price", "danger");
        return;
    }

    const brand = prompt("Enter brand:");
    if (!brand) return;

    const category = prompt("Enter category:");
    if (!category) return;

    const stock = Number(prompt("Enter stock quantity:"));
    if (isNaN(stock)) {
        toast("Please enter a valid stock quantity", "danger");
        return;
    }

    const products = JSON.parse(
        localStorage.getItem("adminProducts") || "[]"
    );

    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        oldPrice: price,
        brand: brand,
        category: category,
        stock: stock,
        rating: 0,
        image: "assets/images/product-placeholder.jpg",
        badge: "New",
        desc: "New product added from admin panel."
    };

    products.push(newProduct);

    localStorage.setItem(
        "adminProducts",
        JSON.stringify(products)
    );

    toast("Product added successfully", "success");

    loadAdminSection("products");
}


function editProductDemo(id) {

    const products = JSON.parse(
        localStorage.getItem("adminProducts") || "[]"
    );

    const product = products.find(
        p => String(p.id) === String(id)
    );

    if (!product) {
        toast("Product not found", "danger");
        return;
    }

    const name = prompt(
        "Product name:",
        product.name
    );

    if (name === null) return;

    const price = prompt(
        "Product price:",
        product.price
    );

    if (price === null) return;

    product.name = name;
    product.price = Number(price);

    localStorage.setItem(
        "adminProducts",
        JSON.stringify(products)
    );

    toast("Product updated successfully", "success");

    loadAdminSection("products");
}


function deleteProductDemo(id) {

    if (!confirm("Delete this product?")) {
        return;
    }

    let products = JSON.parse(
        localStorage.getItem("adminProducts") || "[]"
    );

    products = products.filter(
        p => String(p.id) !== String(id)
    );

    localStorage.setItem(
        "adminProducts",
        JSON.stringify(products)
    );

    toast("Product deleted successfully", "success");

    loadAdminSection("products");
}


// ======================================================
// ADMIN CATEGORY FUNCTIONS
// ======================================================

function addCategoryDemo() {

    const name = prompt("Enter category name:");

    if (!name || !name.trim()) {
        return;
    }

    let categories = JSON.parse(
        localStorage.getItem("adminCategories") || "[]"
    );

    const exists = categories.some(function(category) {

        const categoryName =
            typeof category === "string"
                ? category
                : category.name;

        return categoryName.toLowerCase() ===
            name.trim().toLowerCase();
    });

    if (exists) {
        toast("Category already exists", "warning");
        return;
    }

    categories.push({
        name: name.trim()
    });

    localStorage.setItem(
        "adminCategories",
        JSON.stringify(categories)
    );

    toast("Category added successfully", "success");

    loadAdminSection("categories");
}


function removeCategoryDemo(index) {

    if (!confirm("Delete this category?")) {
        return;
    }

    let categories = JSON.parse(
        localStorage.getItem("adminCategories") || "[]"
    );

    categories.splice(index, 1);

    localStorage.setItem(
        "adminCategories",
        JSON.stringify(categories)
    );

    toast("Category deleted successfully", "success");

    loadAdminSection("categories");
}


// ======================================================
// ADMIN BRAND FUNCTIONS
// ======================================================

function addBrandDemo() {

    const name = prompt("Enter brand name:");

    if (!name || !name.trim()) {
        return;
    }

    let brands = JSON.parse(
        localStorage.getItem("adminBrands") || "[]"
    );

    const exists = brands.some(function(brand) {

        const brandName =
            typeof brand === "string"
                ? brand
                : brand.name;

        return brandName.toLowerCase() ===
            name.trim().toLowerCase();
    });

    if (exists) {
        toast("Brand already exists", "warning");
        return;
    }

    brands.push({
        name: name.trim()
    });

    localStorage.setItem(
        "adminBrands",
        JSON.stringify(brands)
    );

    toast("Brand added successfully", "success");

    loadAdminSection("brands");
}

