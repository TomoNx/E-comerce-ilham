let cart = [];

function addToCart(productId) {
    const product = products.find(function (item) {
        return item.id === productId;
    });

    const existingItem = cart.find(function (item) {
        return item.id === productId;
    });

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    updateCartBadge();
    displayCart();
}


// Fungsi untuk memgubah angka menjadi format rupiah
function formatRupiah(angka) {
    return 'Rp ' + angka.toLocaleString('id-ID');
}

// fungsi untuk menampilkan produk ke layar
function displayProducts(items) {
    const container = document.getElementById('product-container');
    let cardsHTML = '';

    items.forEach(function (product) {
        cardsHTML += `
            <div class="col">
                <div class="card h-100 product-card shadow-sm border-0">
                    <img src="${product.image}" class="card-img-top product-card-img" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <span class="badge bg-secondary mb-2 align-self-start">${product.category}</span>
                        <h5 class="card-title fw-bold">${product.name}</h5>
                        <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="fw-bold fs-5 text-primary">${formatRupiah(product.price)}</span>
                                <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                                    <i class="bi bi-cart-plus me-1"></i> Beli
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    // Masukan seluruh kartu ke dalam wadah di layar / container
    container.innerHTML = cardsHTML;
}

displayProducts(products);

function filterCategory(categoryName, clickedButton) {
    if (clickedButton) {
        const allButtons = document.querySelectorAll('#category-filter-buttons button');
        allButtons.forEach(function (btn) {
            btn.classList.remove('btn-dark', 'active');
            btn.classList.add('btn-outline-dark');
        });
        clickedButton.classList.remove('btn-outline-dark');
        clickedButton.classList.add('btn-dark', 'active');
    }

    if (categoryName === 'Semua') {
        displayProducts(products);
    } else {
        // filter produk sesuai kategori yang di tekan
        const filtered = products.filter(function (item) {
            return item.category === categoryName;
        });
        displayProducts(filtered);
    }
}

// Fungsi untuk mengupdate angka counter di navbar
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    let totalJumlahBarang = 0;
    cart.forEach(function (item) {
        totalJumlahBarang += item.quantity;
    });

    badge.innerText = totalJumlahBarang;
}

//Fungsi untuk menampilkan isi keranjang dan menghitung total harga
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total')

    //Jika keranjang kosong
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-muted text-center my-auto py-5">Keranjang belanja masih kosong</p>';
        totalElement.innerText = 'Rp 0';
        return;
    }

    let cartHTML = '';
    let totalHarga = 0;

    cart.forEach(function (item) {
        totalHarga += item.price * item.quantity;

        cartHTML += `
                    <div class="d-flex align-items-center justify-content-between p-2 border-bottom">
                <img src="${item.image}" class="rounded" width="55" height="55" style="object-fit: cover;" alt="${item.name}">
                <div class="ms-2 flex-grow-1">
                    <h6 class="mb-0 fw-semibold">${item.name}</h6>
                    <small class="text-primary fw-bold">${formatRupiah(item.price)}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary py-0 px-2 fw-bold" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span class="fw-semibold px-1">${item.quantity}</span>
                    <button type="button" class="btn btn-sm btn-outline-secondary py-0 px-2 fw-bold" onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            </div>`;
    });

    cartContainer.innerHTML = cartHTML;
    totalElement.innerText = formatRupiah(totalHarga);


}

// Fungsi untuk mengubah jumlah barang di keranjang
function changeQuantity(productId, delta) {
    const item = cart.find(function (p) {
        return p.id === productId;
    });

    if (item) {
        item.quantity += delta;

        // jika barang nya 0 atau kurang, maka akan di hps dari keranjang
        if (item.quantity <= 0) {
            cart = cart.filter(function (p) {
                return p.id !== productId
            });
        }
    }

    //refresh tampilan badge dan isi keranjang nya
    updateCartBadge();
    displayCart();
}

// logika checkout via wa
const checkoutBtn = document.getElementById('checkout-btn');
checkoutBtn.addEventListener('click', function () {
    if (cart.length === 0) {
        alert('Keranjang belanja masih kosong. Silakan pilih barang dulu.');
        return;
    }

    let pesan = 'Halo admin, saya mau memesan produk berikut :%0A';
    cart.forEach(function (item) {
        pesan += '- ' + item.name + ' (' + item.quantity + 'x)%0A';
    });

    const totalBayar = document.getElementById('cart-total').innerText;
    pesan += '%0ATotal bayar: ' + totalBayar;

    const nomorWA = '';
    window.open('https://wa.me/' + nomorWA + '?text=' + pesan, '_blank');
});
