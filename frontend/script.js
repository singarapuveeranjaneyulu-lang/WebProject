// script.js
const cart = [];

    function addToCart(itemName, itemPrice) {
        cart.push({ name: itemName, price: itemPrice });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(itemName + ' has been added to your cart!');
    }

    function goToCart() {
        window.location.href = 'cart.html';
    }
document.addEventListener('DOMContentLoaded', () => {
    const categories = document.querySelectorAll('.category');
    const categoryItems = document.querySelector('.category-items');
    const itemsContainers = document.querySelectorAll('.items-container');
    const backButtons = document.querySelectorAll('.back-btn');

    // Function to show category items
    const showCategoryItems = (category) => {
        categoryItems.style.display = 'block';
        itemsContainers.forEach(container => {
            if(container.id === category) {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });
        // Scroll to menu section
        window.scrollTo({
            top: document.querySelector('.menu-section').offsetTop - 60,
            behavior: 'smooth'
        });
    };
    
    // Function to hide category items and show categories
    const hideCategoryItems = () => {
        categoryItems.style.display = 'none';
        itemsContainers.forEach(container => {
            container.style.display = 'none';
        });
        // Scroll to menu section
        window.scrollTo({
            top: document.querySelector('.menu-section').offsetTop - 60,
            behavior: 'smooth'
        });
    };

    // Add event listeners to categories
    categories.forEach(category => {
        category.addEventListener('click', () => {
            const selectedCategory = category.getAttribute('data-category');
            showCategoryItems(selectedCategory);
        });
    });

    // Add event listeners to back buttons
    backButtons.forEach(btn => {
        btn.addEventListener('click', hideCategoryItems);
    });
    // Optional: Add to Cart functionality (Basic Example)
    const addCartButtons = document.querySelectorAll('.add-cart-btn');
    const cartLink = document.querySelector('.cart a');
    let cartCount = 0;

    addCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartCount += 1;
            cartLink.textContent = `Cart(${cartCount})`;
            // Optionally, implement more cart functionalities
            alert('Item added to cart!');
        });
    });
});

