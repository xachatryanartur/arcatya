const products = [
    { id: 1, name: 'Գնդակ', price: 799, image: 'https://catalog.detmir.st/media/jbubjanXhwWQZCLc3Y4FKO_Tzb3ASPbHh76rA5LxVWk=', description: 'High-performance laptop for all your needs.' },
    { id: 2, name: 'Հեռախոս', price: 499.99, image: 'https://yerevanmobile.am/media/catalog/product/cache/07720dad39bc68bc6b838050c0f2e34d/y/u/yuiop.jpg', description: 'Stay connected with this sleek smartphone.' },
    { id: 3, name: 'Գլխարկ', price: 199.99, image: 'https://goggles.su/image/catalog/hats/fedora/bao/dsc00019.jpg', description: 'Enjoy your music with crystal-clear sound.' },
    { id: 4, name: 'աթոռ', price: 249.99, image: 'https://annihaus.ru/upload/iblock/087/0877447b7ddb31f595ccbaaca9b0d584.jpg', description: 'Keep track of your health and notifications on the go.' },
    { id: 5, name: 'Սեղան', price: 299.99, image: 'https://grandmebel.uz/uploads/products/59311f650a0a8%D0%91%D0%B5%D0%B7%20%D0%B8%D0%BC%D0%B5%D0%BD%D0%B8-4.jpg', description: 'Portable tablet for entertainment and work.' },
    { id: 6, name: 'Կովի ապառատ', price: 899.99, image: 'https://pelengagro.ru/wp-content/uploads/2016/11/tandem-DOILKA.jpg', description: 'Top quality item for your daily needs.' }
  ];
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Function to render products
  function renderProducts() {
    console.log('Rendering products...');
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>${product.price.toFixed(2)} ֏</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productList.appendChild(productElement);
    });
  }
  
  // Function to add item to cart
  function addToCart(productId) {
    console.log(`Adding product ${productId} to cart...`);
    const product = products.find(p => p.id === productId);
    if (product) {
      const cartItem = cart.find(item => item.id === productId);
      if (cartItem) {
        cartItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      updateCart();
    }
  }
  
  // Function to remove item from cart
  function removeFromCart(productId) {
    console.log(`Removing product ${productId} from cart...`);
    const cartItemIndex = cart.findIndex(item => item.id === productId);
    if (cartItemIndex > -1) {
      cart.splice(cartItemIndex, 1);
      updateCart();
    }
  }
  
  // Function to update cart display
  function updateCart() {
    console.log('Updating cart...');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;
  
    cart.forEach(item => {
      total += item.price * item.quantity;
      count += item.quantity;
      const itemElement = document.createElement('li');
      itemElement.innerHTML = `
        ${item.name} - ${item.price.toFixed(2)} ֏ x ${item.quantity}
        <button onclick="removeFromCart(${item.id})">Remove</button>
      `;
      cartItems.appendChild(itemElement);
    });
  
    cartTotal.textContent = total.toFixed(2) + ' ֏';
    cartCount.textContent = count;
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  // Show/hide cart
  document.getElementById('view-cart').addEventListener('click', () => {
    document.getElementById('cart').classList.toggle('hidden');
  });
  
  document.getElementById('close-cart').addEventListener('click', () => {
    document.getElementById('cart').classList.add('hidden');
  });
  
  // PayPal Integration
  if (typeof paypal !== 'undefined') {
    paypal.Buttons({
      createOrder: function(data, actions) {
        console.log('Creating PayPal order...');
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: (calculateTotalAmount() / exchangeRate).toFixed(2) // Convert dram to dollars
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        console.log('Approving PayPal order...');
        return actions.order.capture().then(function(details) {
          document.getElementById('payment-message').textContent = 'Transaction completed by ' + details.payer.name.given_name;
          cart = [];
          updateCart();
        });
      },
      onError: function(err) {
        document.getElementById('payment-message').textContent = 'Payment failed: ' + err.message;
      }
    }).render('#paypal-button-container');
  } else {
    console.error('PayPal SDK is not loaded.');
  }
  
  function calculateTotalAmount() {
    let total = 0;
    cart.forEach(item => total += item.price * item.quantity);
    return total;
  }
  
  // You need to define your exchange rate from dram to USD here
  const exchangeRate = 1; // Replace with actual rate
  
  renderProducts();
  updateCart();