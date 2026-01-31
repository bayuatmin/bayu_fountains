function showSection(id) {
    document.querySelectorAll('.content').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
}

function productSlide(className, images) {
    let index = 0;
    const img = document.querySelector(`.${className}`);

    setInterval(() => {
        img.style.opacity = 0;
        setTimeout(() => {
            img.src = images[index];
            img.style.opacity = 1;
            index = (index + 1) % images.length;
        }, 400);
    }, 3000);
}

productSlide("p1", ["OREOCRAMBS2.jpg","OREOCRAMBS3.jpg","OREOCRAMBS1.jpg"]);
productSlide("p2", ["NASGOR2.jpg","NASGOR3.jpg","NASGOR1.jpg"]);
productSlide("p3", ["GRASSJELLY2.jpg","GRASSJELLY3.jpg","GRASSJELLY1.jpg"]);
productSlide("p4", ["SUPIGA2.jpg","SUPIGA3.jpg","SUPIGA1.jpg"]);
productSlide("p5", ["CAKEICE2.jpg","CAKEICE3.jpg","CAKEICE1.jpg"]);
productSlide("p6", ["SPG2.jpg","SPG3.jpg","SPG1.jpg"]);

const popular = [
    {img:"CAKEICE1.jpg", name:"CAKE & ICE CREAM"},
    {img:"SPG1.jpg", name:"SPAGHETTI BOLOGNESE"}
];
let popIndex = 0;
setInterval(() => {
    const img = document.getElementById("popularImg");
    const name = document.getElementById("popularName");

    img.style.opacity = 0;
    name.style.opacity = 0;

    setTimeout(() => {
        img.src = popular[popIndex].img;
        name.innerText = popular[popIndex].name;
        img.style.opacity = 1;
        name.style.opacity = 1;
        popIndex = (popIndex + 1) % popular.length;
    }, 400);
}, 3000);

// ------------------ Cart & Checkout Logic ------------------

const cart = [];

const STORAGE_KEY = 'fountain_cart';

function saveCart() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
        console.warn('Gagal menyimpan keranjang:', e);
    }
}

function loadCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) return;
        // replace contents of cart array
        cart.length = 0;
        data.forEach(it => {
            // basic validation
            const name = it.name || 'Produk';
            const price = parseInt(it.price || it.p || '0', 10) || 0;
            const qty = parseInt(it.qty || 1, 10) || 1;
            cart.push({name, price, qty});
        });
    } catch (e) {
        console.warn('Gagal memuat keranjang:', e);
    }
}

function parsePrice(text) {
    // transform string like "Rp 34.410" into number 34410
    if (!text) return 0;
    const digits = text.replace(/[^0-9]/g, '');
    return parseInt(digits || '0', 10);
}

function formatRupiah(number) {
    return number.toLocaleString('id-ID');
}

function updateCartUI() {
    const list = document.getElementById('cartlist');
    const count = document.getElementById('cartCount');
    const totalEl = document.getElementById('total');

    list.innerHTML = '';
    let total = 0;
    let itemsCount = 0;

    cart.forEach((item, idx) => {
        const li = document.createElement('li');
        li.className = 'cart-item';

        const left = document.createElement('div');
        left.className = 'cart-item-left';
        left.innerText = `${item.name}`;

        const right = document.createElement('div');
        right.className = 'cart-item-right';

        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.min = 1;
        qtyInput.value = item.qty;
        qtyInput.className = 'cart-qty-input';
        qtyInput.addEventListener('change', (e) => {
            const v = parseInt(e.target.value || '1', 10);
            if (v <= 0) return;
            item.qty = v;
            updateCartUI();
        });

        const priceSpan = document.createElement('span');
        priceSpan.className = 'cart-item-price';
        priceSpan.innerText = `Rp ${formatRupiah(item.price * item.qty)}`;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'cart-remove';
        removeBtn.innerText = 'Hapus';
        removeBtn.addEventListener('click', () => {
            const i = cart.indexOf(item);
            if (i > -1) cart.splice(i,1);
            updateCartUI();
        });

        right.appendChild(qtyInput);
        right.appendChild(priceSpan);
        right.appendChild(removeBtn);

        li.appendChild(left);
        li.appendChild(right);
        list.appendChild(li);

        const lineTotal = item.price * item.qty;
        total += lineTotal;
        itemsCount += item.qty;
    });

    count.innerText = itemsCount;
    totalEl.innerText = formatRupiah(total);

    // update modal confirm button text with total and icon
    setModalConfirmText(total);

    // persist after UI update
    saveCart();

    // also update modal content if open
    const modalList = document.getElementById('modalCartList');
    const modalTotal = document.getElementById('modalTotal');
    if (modalList) {
        modalList.innerHTML = '';
        cart.forEach((item, idx) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.justifyContent = 'space-between';
            li.style.marginBottom = '8px';

            const left = document.createElement('div');
            left.innerText = `${idx+1}. ${item.name}`;

            const right = document.createElement('div');
            right.style.display = 'flex';
            right.style.alignItems = 'center';
            right.style.gap = '8px';

            const qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.min = 1;
            qtyInput.value = item.qty;
            qtyInput.style.width = '56px';
            qtyInput.addEventListener('change', (e) => {
                const v = parseInt(e.target.value || '1', 10);
                if (v <= 0) return;
                item.qty = v;
                updateCartUI();
            });

            const priceSpan = document.createElement('span');
            priceSpan.innerText = `Rp ${formatRupiah(item.price * item.qty)}`;

            const removeBtn = document.createElement('button');
            removeBtn.innerText = 'Hapus';
            removeBtn.addEventListener('click', () => {
                const i = cart.indexOf(item);
                if (i > -1) cart.splice(i,1);
                updateCartUI();
            });

            right.appendChild(qtyInput);
            right.appendChild(priceSpan);
            right.appendChild(removeBtn);

            li.appendChild(left);
            li.appendChild(right);
            modalList.appendChild(li);
        });

        modalTotal.innerText = formatRupiah(total);
    }
}

function addToCart(name, price, qty = 1) {
    const existing = cart.find(i => i.name === name && i.price === price);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({name, price, qty});
    }
    updateCartUI();
    // show brief toast and reveal small view-cart popup
    showToast(`${name} x${qty} ditambahkan ke keranjang`);
    showViewCartPopup();
}

// set modal confirm button content with WhatsApp icon and formatted total
function setModalConfirmText(total) {
    const btn = document.getElementById('modalConfirm');
    if (!btn) return;
    const formatted = formatRupiah(total || 0);
    // inline SVG WhatsApp icon (small)
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.7 2.3a11 11 0 0 0-15.6 15.6L2 22l4.2-1.1A11 11 0 1 0 21.7 2.3z"></path><path d="M17.3 14.3c-.3-.2-1.8-.9-2-.9-.2 0-.4 0-.6.2-.2.1-.7.3-1 .5-.3.2-.6.2-.9 0-.8-.4-2.5-1.6-3.3-2.9-.2-.3 0-.5.1-.7.1-.1.2-.4.2-.6 0-.2 0-.5-.1-.7-.1-.3-.9-2-1.2-2.3-.3-.3-.6-.2-.8-.2-.3 0-.6 0-.9 0-.3 0-.7.1-1 .5-.3.4-1 1.1-1 2.5 0 1.4 1 2.8 1.1 3 .1.2 1.9 3 4.7 4.2 3 .8 3 .6 3.5.6.5 0 1.6-.6 1.8-1.3.2-.6.2-1.3.1-1.4-.1-.1-.4-.2-.7-.4z"></path></svg>`;

    btn.innerHTML = `${svg} Konfirmasi via WhatsApp — Rp ${formatted}`;
}

// Toast helper
function showToast(message, ms = 2000) {
    let el = document.getElementById('toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'toast';
        el.className = 'toast';
        document.body.appendChild(el);
    }
    el.innerText = message;
    el.style.display = 'block';
    // trigger animation
    requestAnimationFrame(() => el.classList.add('show'));
    // hide after timeout
    clearTimeout(el._hideTimeout);
    el._hideTimeout = setTimeout(() => {
        el.classList.remove('show');
        // allow transition to finish before hiding
        setTimeout(() => el.style.display = 'none', 250);
    }, ms);
}

// Small popup button to prompt user to view cart
function showViewCartPopup() {
    const btn = document.getElementById('viewCartPopup');
    if (!btn) return;
    btn.style.display = 'block';
    btn.style.opacity = '1';
    // auto-hide after 6 seconds if not clicked
    clearTimeout(btn._hideTimeout);
    btn._hideTimeout = setTimeout(() => {
        btn.style.display = 'none';
    }, 6000);
}

function clearCart() {
    cart.length = 0;
    updateCartUI();
}

function buildWhatsAppMessage() {
    if (cart.length === 0) return '';
    let msg = 'Halo, saya ingin memesan dari Fountain:%0A';
    let total = 0;
    cart.forEach((item, idx) => {
        const lineTotal = item.price * item.qty;
        msg += `${idx+1}. ${item.name} x${item.qty} - Rp ${formatRupiah(lineTotal)}%0A`;
        total += lineTotal;
    });
    msg += `%0ATotal: Rp ${formatRupiah(total)}%0A%0ANama:%0AAlamat / Catatan:`;
    return msg;
}

// attach events to product buttons
function initProductButtons() {
    document.querySelectorAll('.product-grid .card').forEach(card => {
        const btn = card.querySelector('.buy-btn');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const name = card.querySelector('h4') ? card.querySelector('h4').innerText.trim() : 'Produk';
            const priceText = card.querySelector('.price') ? card.querySelector('.price').innerText : 'Rp 0';
            const price = parsePrice(priceText);
            const qtyInput = card.querySelector('.qty-input');
            const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value || '1', 10)) : 1;
            addToCart(name, price, qty);
        });
    });
}

function openCartModal() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    // show overlay and animate modal in
    modal.style.display = 'flex';
    // allow layout then set active class for transition
    requestAnimationFrame(() => modal.classList.add('active'));
    updateCartUI();
    // hide the floating popup when modal opens
    const popup = document.getElementById('viewCartPopup');
    if (popup) popup.style.display = 'none';
    // populate preview message (plain text)
    const preview = document.getElementById('modalPreview');
    if (preview) {
        const enc = buildWhatsAppMessage();
        preview.value = enc ? decodeURIComponent(enc) : '';
    }
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    // animate out then hide
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 240);
}

document.addEventListener('DOMContentLoaded', () => {
    initProductButtons();

    const clearBtn = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('checkout');
    const modalClose = document.getElementById('modalClose');
    const modalConfirm = document.getElementById('modalConfirm');

    if (clearBtn) clearBtn.addEventListener('click', () => {
        if (confirm('Kosongkan keranjang?')) clearCart();
    });

    if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Keranjang kosong. Silakan tambahkan produk terlebih dahulu.');
            return;
        }
        openCartModal();
    });

    if (modalClose) modalClose.addEventListener('click', () => closeCartModal());

    const modalClear = document.getElementById('modalClear');
    if (modalClear) modalClear.addEventListener('click', () => {
        if (cart.length === 0) return;
        if (!confirm('Kosongkan keranjang?')) return;
        clearCart();
        // update preview
        const preview = document.getElementById('modalPreview');
        if (preview) preview.value = '';
    });

    if (modalConfirm) modalConfirm.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Keranjang kosong.');
            closeCartModal();
            return;
        }
        const msg = buildWhatsAppMessage();
        const phone = '6281244303268';
        const url = `https://wa.me/${phone}?text=${msg}`;
        window.open(url, '_blank');
    });

    // load persisted cart (if any) then update UI
    loadCart();
    updateCartUI();

    // ensure modal confirm shows current total on load
    const totalEl = document.getElementById('total');
    setModalConfirmText(parseInt((totalEl && totalEl.innerText.replace(/\D/g,''))||0,10));

    // wire floating view-cart popup
    const viewPopup = document.getElementById('viewCartPopup');
    if (viewPopup) {
        viewPopup.addEventListener('click', () => {
            openCartModal();
            viewPopup.style.display = 'none';
        });
    }
});
