// =============================================
// MAISON ÉLÈVE — Shared App Logic
// =============================================

// ─── CART COUNT ───
async function updateCartCount() {
  try {
    const res = await fetch('/cart')
    if (res.ok) {
      const items = await res.json()
      const el = document.getElementById('cartCount')
      if (el) el.textContent = items.length
    }
  } catch { /* session may not exist yet */ }
}

// ─── INDEX PAGE: Load Products ───
async function loadProducts() {
  const grid = document.getElementById('productsGrid')
  if (!grid) return

  try {
    const res = await fetch('/products')
    const products = await res.json()

    grid.innerHTML = ''
    products.forEach((p, i) => {
      const card = document.createElement('div')
      card.className = 'product-card'
      card.style.animationDelay = `${i * 0.1}s`
      card.innerHTML = `
        <div class="product-img-wrap">
          <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy"/>
          <div class="product-overlay">
            <button class="overlay-btn">Order Bespoke</button>
          </div>
        </div>
        <div class="product-info">
          <p class="product-name">${p.name}</p>
          <p class="product-price">€${p.price}</p>
        </div>
      `
      card.addEventListener('click', () => openModal(p))
      grid.appendChild(card)
    })
  } catch (err) {
    console.error('Error loading products:', err)
  }
}

// ─── MODAL ───
function openModal(product) {
  document.getElementById('modalImage').src = product.image
  document.getElementById('modalImage').alt = product.name
  document.getElementById('modalName').textContent = product.name
  document.getElementById('modalDesc').textContent = product.description
  document.getElementById('modalPrice').textContent = `€${product.price}`
  document.getElementById('modalRef').value = product.reference
  document.getElementById('formMsg').textContent = ''
  document.getElementById('modalOverlay').classList.add('open')
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open')
}

// Modal events
const overlay = document.getElementById('modalOverlay')
const closeBtn = document.getElementById('modalClose')
if (overlay) {
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal() })
}
if (closeBtn) closeBtn.addEventListener('click', closeModal)

// Add to cart form
const addToCartForm = document.getElementById('addToCartForm')
if (addToCartForm) {
  addToCartForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const msg = document.getElementById('formMsg')
    const ref = document.getElementById('modalRef').value
    const body = {
      quantity: parseInt(document.getElementById('quantity').value),
      chest: parseFloat(document.getElementById('chest').value),
      waist: parseFloat(document.getElementById('waist').value),
      hips: parseFloat(document.getElementById('hips').value)
    }

    try {
      const res = await fetch(`/cart/${ref}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.ok) {
        msg.style.color = '#c9a96e'
        msg.textContent = 'Added to your cart.'
        updateCartCount()
        setTimeout(closeModal, 1200)
      } else {
        msg.style.color = '#c0675a'
        msg.textContent = 'Could not add item. Please try again.'
      }
    } catch {
      msg.style.color = '#c0675a'
      msg.textContent = 'Server error.'
    }
  })
}

// ─── CART PAGE ───
async function loadCart() {
  const container = document.getElementById('cartItems')
  if (!container) return

  try {
    const res = await fetch('/cart')
    const items = await res.json()

    const emptyEl = document.getElementById('cartEmpty')
    const summaryEl = document.getElementById('cartSummary')

    if (!items.length) {
      emptyEl.style.display = 'block'
      summaryEl.style.display = 'none'
      return
    }

    emptyEl.style.display = 'none'
    summaryEl.style.display = 'block'

    container.innerHTML = ''
    let total = 0

    items.forEach(item => {
      total += item.price
      const el = document.createElement('div')
      el.className = 'cart-item'
      el.innerHTML = `
        <img src="${item.image}" alt="${item.reference}" class="cart-item-img"/>
        <div>
          <p class="cart-item-name">Ref. ${item.reference}</p>
          <p class="cart-item-details">
            Chest ${item.chest} cm &nbsp;·&nbsp; Waist ${item.waist} cm &nbsp;·&nbsp; Hips ${item.hips} cm<br/>
            Qty: ${item.quantity}
          </p>
        </div>
        <p class="cart-item-price">€${item.price}</p>
      `
      container.appendChild(el)
    })

    document.getElementById('cartTotal').textContent = `€${total.toFixed(2)}`
  } catch (err) {
    console.error('Error loading cart:', err)
  }
}

// Checkout form
const checkoutForm = document.getElementById('checkoutForm')
if (checkoutForm) {
  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const msg = document.getElementById('checkoutMsg')
    const body = {
      status: 'pending',
      firstname: document.getElementById('firstname').value,
      lastname: document.getElementById('lastname').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value,
      bankDetails: document.getElementById('bankDetails').value
    }

    try {
      const res = await fetch('/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.ok) {
        msg.style.color = '#c9a96e'
        msg.textContent = 'Order placed. Thank you — we will be in touch shortly.'
        document.getElementById('cartItems').innerHTML = ''
        document.getElementById('cartSummary').style.display = 'none'
        document.getElementById('cartEmpty').style.display = 'block'
        updateCartCount()
      } else {
        const data = await res.json()
        msg.style.color = '#c0675a'
        msg.textContent = data.message || 'Could not place order.'
      }
    } catch {
      msg.style.color = '#c0675a'
      msg.textContent = 'Server error.'
    }
  })
}

// ─── INIT ───
updateCartCount()
loadProducts()
loadCart()
