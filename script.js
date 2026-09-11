document.addEventListener('DOMContentLoaded', function () {

  const cart = [];

  const cartEl = document.getElementById('cart');
  const overlay = document.getElementById('overlay');
  const itemsEl = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const subtotalEl = document.getElementById('subtotal');

  function openCart() {
    cartEl.classList.add('open');
    overlay.classList.add('show');
  }

  function closeCart() {
    cartEl.classList.remove('open');
    overlay.classList.remove('show');
  }

  document.getElementById('cartOpen').onclick = openCart;
  document.getElementById('cartClose').onclick = closeCart;
  overlay.onclick = closeCart;

  document.querySelectorAll('.quick').forEach(function (btn) {

    btn.addEventListener('click', function (e) {

      const product = e.target.closest('.product');

      cart.push({
        name: product.dataset.name,
        price: Number(product.dataset.price),
        image: product.dataset.image
      });

      renderCart();
      openCart();
    });

  });

  function renderCart() {

    countEl.textContent = cart.length;

    if (cart.length === 0) {
      itemsEl.innerHTML = '<p class="empty">Your bag is empty.</p>';
      subtotalEl.textContent = '₹0';
      return;
    }

    itemsEl.innerHTML = cart.map(function (item, index) {
      return `
        <div class="cart-row">
          <img src="${item.image}" alt="">
          <div>
            <h4>${item.name}</h4>
            <p>₹${item.price.toLocaleString('en-IN')}</p>
          </div>
          <button onclick="removeItem(${index})">Remove</button>
        </div>
      `;
    }).join('');

    const total = cart.reduce(function (sum, item) {
      return sum + item.price;
    }, 0);

    subtotalEl.textContent = '₹' + total.toLocaleString('en-IN');
  }

  window.removeItem = function (index) {
    cart.splice(index, 1);
    renderCart();
  };

  document.getElementById('checkout').onclick = function () {

    if (cart.length === 0) {
      alert('Your bag is empty.');
      return;
    }

    if (typeof Razorpay === 'undefined') {
      alert('Payment system load nahi hua. Page refresh karke try karo.');
      return;
    }

    const total = cart.reduce(function (sum, item) {
      return sum + item.price;
    }, 0);

    const options = {
      key: 'rzp_test_Tafraj9NP8ietI',
      amount: total * 100,
      currency: 'INR',
      name: 'CLOCKIN.HUB',
      description: 'CLOCKIN.HUB Order',

      handler: function (response) {
        alert(
          'Payment successful!\nPayment ID: ' +
          response.razorpay_payment_id
        );
      },

      theme: {
        color: '#000000'
      }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  };

  document.getElementById('newsletter').addEventListener('submit', function (e) {
    e.preventDefault();

    document.getElementById('formMsg').textContent =
      'You’re in. Welcome to the Hub ✦';

    e.target.reset();
  });

});
