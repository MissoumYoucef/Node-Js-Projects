document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');

    // Replace with your actual API endpoint
    const apiEndpoint = 'http://localhost:3000/api/products'; // Example API endpoint 

    fetch(apiEndpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response as JSON
        })
        .then(products => {
            // Clear existing content
            productList.innerHTML = ''; 

            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <h2>${product.name}</h2>
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <p>${product.description}</p>
                    <p>$${product.price}</p>
                    <button>Add to Cart</button>
                `;
                productList.appendChild(productDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            productList.innerHTML = '<p>Error loading products. Please try again later.</p>';
        });
});