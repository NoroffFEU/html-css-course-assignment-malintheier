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







// Hentet produkter fra API

const apiUrl = 'https://v2.api.noroff.dev/rainy-days';
const apiKey = '4af5f64c-f709-4782-8d59-c5436d4ced6b';

// Fetch all products from the API
fetch(apiUrl, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
})

.then(response => response.json())
.then(res => {

    const data =res.data;

    let products = '';

    data.forEach(product => {
        products += `<div class="item">
        <img src="${product.image.url}" alt="${product.title}"> 
        <h2>${product.title}</h2> 
        <p>${product.price} $</p>
        </div>`
    })
    console.log(products);
    document.getElementById('products-container').innerHTML = products;
})
      


// Fetch 3 products from the API
fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })
  
  .then(response => {
    return response.json();
  })
  .then(data => {
      
      let news = '';

      const limitedProducts = data.data.slice(0, 3);

      limitedProducts.forEach(product => {
          news += `<div class="news_section_col">
          <img src="${product.image.url}" alt="${product.title}"> 
          <h2>${product.title}</h2> 
          <p>${product.price} $</p>
          </div>`
      });
      console.log(news);
      document.getElementById('news_section').innerHTML = news;
  })







      










