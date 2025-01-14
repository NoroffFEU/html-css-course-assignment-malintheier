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
	    console.log(response);
	    const json = await response.json();
	    console.log(json);
	    return json;
	  } catch (error) {
	    console.log(error);
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
          console.log(response);
          const json = await response.json();
          const accessToken = json.accessToken;
          localStorage.setItem('accessToken', accessToken);
          console.log(json);
          return json;
        } catch (error) {
          console.log(error);
        }
      }
      
      loginUser(`${API_BASE_URL}/auth/login`, user);









const apiUrl = 'https://v2.api.noroff.dev/rainy-days';
const apiKey = '4af5f64c-f709-4782-8d59-c5436d4ced6b';


function fetchNewsSection() {
  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
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
    })
    .catch(error => {
      console.error('Error fetching news:', error);
      document.getElementById('news_section').innerHTML =
        '<p>Something went wrong while loading the news.</p>';
    });
}


let allProducts = [];

function fetchAndDisplayProducts() {
  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      allProducts = data.data;
      displayProducts('all'); 
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      document.getElementById('products-container').innerHTML =
        '<p>Something went wrong while loading products.</p>';
    });
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




function fetchSingleProduct(productId) {
  fetch(`${apiUrl}/${productId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to fetch product details: ${response.status}`);
    }
    return response.json();
  })
.then(responseData => {
  const data = responseData.data;
  console.log(data);

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
  </div>
  `;

  document.getElementById('single_product_container').innerHTML = productDetails;

  populateSizeDropdown(data.sizes);

})
.catch(error => {
  console.error('Error fetching product details:', error);
  document.getElementById('single_product_container').innerHTML =
  '<p>Something went wrong. Please try again later.</p>';
});
}

function populateSizeDropdown(sizes) {
  const sizeSelect = document.getElementById('size_select');
  sizes.forEach(size => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = size;
    sizeSelect.appendChild(option);
  })

  sizeSelect.addEventListener('change', () => {
    const selectedSize = sizeSelect.value;
    console.log(`Selected size: ${selectedSize}`);
  });
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













      










