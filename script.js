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

document.querySelectorAll('.quick').forEach(btn => {
  btn.addEventListener('click', e => {
    const p = e.target.closest('.product');

    cart.push({
      name: p.dataset.name,
      price: +p.dataset.price,
      image: p.dataset.image
    });

    renderCart();
    openCart();
  });
});

function renderCart() {
  countEl.textContent = cart.length;

  if (!cart.length) {
    itemsEl.innerHTML = '<p class="empty">Your bag is empty.</p>';
    subtotalEl.textContent = '₹0';
    return;
  }

  itemsEl.innerHTML = cart.map((x, i) => `
    <div class="cart-row">
      <img src="${x.image}" alt="">
      <div>
        <h4>${x.name}</h4>
        <p>₹${x.price.toLocaleString('en-IN')}</p>
      </div>
      <button onclick="removeItem(${i})">Remove</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  subtotalEl.textContent = '₹' + total.toLocaleString('en-IN');
}

function removeItem(i) {
  cart.splice(i, 1);
  renderCart();
}

document.getElementById('checkout').onclick = async function () {

  if (cart.length === 0) {
    alert('Your bag is empty.');
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbxBLivF3Ng1M006HSzsS31Y2zsyScurzM8CsbBVEw4YW7Cmw-QhlZCmL-vRt-YcXStYlA/exec',
      {
        method: 'POST',
        body: JSON.stringify({
          amount: total
        })
      }
    );

    const order = await response.json();

    if (!order.order_id) {
      throw new Error(order.error || 'Order creation failed');
    }

    const options = {
      key: 'rzp_test_Tafraj9NP8ietI',
      amount: order.amount,
      currency: 'INR',
      name: 'CLOCKIN.HUB',
      description: 'CLOCKIN.HUB Order',
      order_id: order.order_id,

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

  } catch (error) {
    console.error(error);
    alert('Payment start nahi ho paaya. Please try again.');
  }
};
  if (cart.length === 0) {
    alert('Your bag is empty.');
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

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

document.getElementById('newsletter').addEventListener('submit', e => {
  e.preventDefault();

  document.getElementById('formMsg').textContent =
    'You’re in. Welcome to the Hub ✦';

  e.target.reset();
});
