const API_BASE_URL = 'https://v2.api.noroff.dev';

async function registerUser(url, data) {
  try {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, postData);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error during registration:', error);
  }
}

const user = {
  name: 'malintheier',
  email: 'malhei01980@stud.noroff.no',
  password: 'Noroff2002',
};

registerUser(`${API_BASE_URL}/auth/register`, user);

const userLogin = {
  email: 'malhei01980@stud.noroff.no',
  password: 'Noroff2002',
};

async function loginUser(url, data) {
  try {
    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, postData);
    const json = await response.json();
    const accessToken = json.accessToken;

    localStorage.setItem('accessToken', accessToken);
    return json;
  } catch (error) {
    console.error('Error during login:', error);
  }
}

loginUser(`${API_BASE_URL}/auth/login`, user);






const apiUrl = 'https://v2.api.noroff.dev/rainy-days';
const apiKey = '4af5f64c-f709-4782-8d59-c5436d4ced6b';

async function fetchNewsSection() {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const limitedProducts = data.data.slice(0, 3);
    let news = '';

    limitedProducts.forEach(product => {
      news += `<div class="news_section_col">
        <a href="single_product.html?id=${product.id}">
          <img src="${product.image.url}" alt="${product.image.alt}">
          <h2>${product.title}</h2>
          <p>${product.price} $</p>
        </a>
      </div>`;
    });

    document.getElementById('news_section').innerHTML = news;
  } catch (error) {
    console.error('Error fetching news:', error);
    document.getElementById('news_section').innerHTML =
      '<p>Something went wrong while loading the news.</p>';
  }
}







let allProducts = [];

async function fetchAndDisplayProducts() {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    allProducts = data.data;
    displayProducts('all');
  } catch (error) {
    document.getElementById('products-container').innerHTML =
      '<p>Something went wrong while loading products.</p>';
  }
}

function displayProducts(gender) {
  let filteredProducts = allProducts;

  if (gender !== 'all') {
    filteredProducts = allProducts.filter(product => product.gender === gender);
  }

  let productsHTML = '';
  filteredProducts.forEach(product => {
    productsHTML += `
      <div class="item">
        <a href="single_product.html?id=${product.id}">
          <img src="${product.image.url}" alt="${product.image.alt}">
          <h2>${product.title}</h2>
          <p>${product.price} $</p>
        </a>
      </div>`;
  });

  document.getElementById('products-container').innerHTML = productsHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('news_section')) {
    fetchNewsSection();
  }

  if (document.getElementById('products-container')) {
    fetchAndDisplayProducts();

    document.getElementById('gender_filter').addEventListener('change', (event) => {
      const selectedGender = event.target.value;
      displayProducts(selectedGender);
    });
  }
});





let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

async function fetchSingleProduct(productId) {
  try {
    const response = await fetch(`${apiUrl}/${productId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product details: ${response.status}`);
    }

    const responseData = await response.json();
    const data = responseData.data;

    const productDetails = `
    <div class="single_product">
      <img src="${data.image.url}" alt="${data.image.alt}">
      <h2>${data.title}</h2>
      <h3>${data.price} $</h3>
      <p>${data.description}</p>
      <label for="size_select">Size:</label>
      <select id="size_select">
        <option value="">Select size</option>
      </select>
      <button id="add_to_cart_btn">Add to Cart</button>
    </div>
    `;

    document.getElementById('single_product_container').innerHTML = productDetails;

    populateSizeDropdown(data.sizes);

    document.getElementById('add_to_cart_btn').addEventListener('click', () => {
      const selectedSize = document.getElementById('size_select').value;
      if (!selectedSize) {
        alert('Please select a size before adding to cart.');
        return;
      }
      addToCart(data, selectedSize);
    });

  } catch (error) {
    document.getElementById('single_product_container').innerHTML =
      '<p>Something went wrong. Please try again later.</p>';
  }
}



function populateSizeDropdown(sizes) {
  const sizeSelect = document.getElementById('size_select');
  sizes.forEach(size => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = size;
    sizeSelect.appendChild(option);
  });
}

function addToCart(product, size) {
  const cartItem = {
    id: product.id,
    title: product.title,
    price: product.price,
    size: size,
    image: product.image.url,
    quantity: 1,
  };

  shoppingCart.push(cartItem);

  localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));

  alert(`${product.title} (Size: ${size}) has been added to your cart!`);
}

document.addEventListener('DOMContentLoaded', () => {
  const productDetailsDiv = document.getElementById('single_product_container');
  if (productDetailsDiv) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (productId) {
      fetchSingleProduct(productId);
    } else {
      productDetailsDiv.innerHTML = '<p>Product ID not found.</p>';
    }
  }
});




document.addEventListener('DOMContentLoaded', () => {
  const cartItems = JSON.parse(localStorage.getItem('shoppingCart')) || [];
  const cartContainer = document.getElementById('cart_items');

  if (cartItems.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty!</p>';
    return;
  }

  cartItems.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart_item');
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.title}" width="100">
      <h2>${item.title}</h2>
      <p>Size: ${item.size}</p>
      <div class="quantity">
        <button class="decrease_btn" data-index="${index}">-</button>
        <span id="quantity_${index}">${item.quantity}</span>
        <button class="increase_btn" data-index="${index}">+</button>
      </div>
      <p id="price_${index}">Price: ${(item.price * item.quantity).toFixed(2)} $</p>
      <button class="remove_btn" data-index="${index}">Remove</button>
    `;
    cartContainer.appendChild(itemDiv);
  });

  document.querySelectorAll('.increase_btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      updateQuantity(index, 1);
    });
  });

  document.querySelectorAll('.decrease_btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      updateQuantity(index, -1);
    });
  });

  document.querySelectorAll('.remove_btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      removeFromCart(index);
    });
  });
});

function updateQuantity(index, change) {
  const cartItems = JSON.parse(localStorage.getItem('shoppingCart')) || [];
  const item = cartItems[index];

  item.quantity = Math.max(1, item.quantity + change);

  localStorage.setItem('shoppingCart', JSON.stringify(cartItems));

  document.getElementById(`quantity_${index}`).textContent = item.quantity;
  document.getElementById(`price_${index}`).textContent = `Price: ${(item.price * item.quantity).toFixed(2)} $`;

  calculateTotalPrice();
}

function removeFromCart(index) {
  const cartItems = JSON.parse(localStorage.getItem('shoppingCart')) || [];
  cartItems.splice(index, 1);
  localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  location.reload();

  calculateTotalPrice();
}

function calculateTotalPrice() {
  const cartItems = JSON.parse(localStorage.getItem('shoppingCart')) || [];
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  document.getElementById('total_price').textContent = `Total: ${totalPrice.toFixed(2)} $`;
}

calculateTotalPrice();












      










