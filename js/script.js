const apiUrl = 'https://v2.api.noroff.dev/rainy-days';
const apiKey = '4af5f64c-f709-4782-8d59-c5436d4ced6b';

async function fetchNewsSection() {
  const spinner = document.getElementById('spinner');
  const newsSection = document.getElementById('news_section');

  spinner.style.display = "block";
  newsSection.innerHTML = "";

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

    spinner.style.display = "none";

    newsSection.innerHTML = news;
  } catch (error) {
    spinner.style.display = "none";

    console.error('Error fetching news:', error);
    newsSection.innerHTML = '<p>Something went wrong while loading the news.</p>';
  }
}








let allProducts = [];

async function fetchAndDisplayProducts() {
  const spinner = document.getElementById('spinner');
  const productsContainer = document.getElementById('products-container');

  spinner.style.display = "block";
  productsContainer.innerHTML = "";

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

    spinner.style.display = "none";

    displayProducts('all');
  } catch (error) {
    spinner.style.display = "none";

    productsContainer.innerHTML =
      '<p>Something went wrong while loading products.</p>';
  }
}

function displayProducts(gender) {
  const productsContainer = document.getElementById('products-container');
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

  productsContainer.innerHTML = productsHTML;
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
  const spinner = document.getElementById('spinner');
  const singleProductContainer = document.getElementById('single_product_container');

  spinner.style.display = "block";
  singleProductContainer.innerHTML = "";

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

    spinner.style.display = "none";

    singleProductContainer.innerHTML = productDetails;

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
    spinner.style.display = "none";

    singleProductContainer.innerHTML =
      '<p>Something went wrong. Please try again later.</p>';
  }
}



function populateSizeDropdown(sizes) {
  const spinner = document.getElementById('spinner');
  const sizeSelect = document.getElementById('size_select');
  
  spinner.style.display = "block";
  
  sizes.forEach(size => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = size;
    sizeSelect.appendChild(option);
  });

  spinner.style.display = "none";
}

function addToCart(product, size) {
  const spinner = document.getElementById('spinner');
  spinner.style.display = "block";

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

  spinner.style.display = "none";
  alert(`${product.title} (Size: ${size}) has been added to your cart!`);
}

document.addEventListener('DOMContentLoaded', () => {
  const productDetailsDiv = document.getElementById('single_product_container');
  const cartContainer = document.getElementById('cart_items');

  const spinner = document.getElementById('spinner');
  
  if (productDetailsDiv) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
      spinner.style.display = "block";
      fetchSingleProduct(productId);
    } else {
      productDetailsDiv.innerHTML = '<p>Product ID not found.</p>';
    }
  }

  if (cartContainer) {
    spinner.style.display = "block";
    const cartItems = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    if (cartItems.length === 0) {
      cartContainer.innerHTML = '<p>Your cart is empty!</p>';
    } else {
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
    }

    spinner.style.display = "none";
  }

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
  
  const totalPriceElement = document.getElementById('total_price');
  if (totalPriceElement) {
    totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} $`;
  }
}

calculateTotalPrice();














      










