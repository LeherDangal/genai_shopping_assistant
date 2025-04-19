// DOM Elements
const screens = {
    welcome: document.getElementById('welcome-screen'),
    profile: document.getElementById('profile-screen'),
    dietary: document.getElementById('dietary-screen'),
    allergies: document.getElementById('allergies-screen'),
    habits: document.getElementById('habits-screen'),
    dashboard: document.getElementById('dashboard')
};

const profileForm = document.getElementById('profile-form');
const dietaryForm = document.getElementById('dietary-form');
const allergiesForm = document.getElementById('allergies-form');
const habitsForm = document.getElementById('habits-form');
const foodSearch = document.getElementById('food-search');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const navItems = document.querySelectorAll('.sidebar nav ul li');
const contentSections = document.querySelectorAll('.content-section');
const platformFilter = document.getElementById('platform-filter');
const sortFilter = document.getElementById('sort-filter');
const profileName = document.getElementById('profile-name');
const locationSummary = document.getElementById('location-summary');
const modal = document.getElementById('product-modal');
const closeModal = document.querySelector('.close-modal');
const modalBody = document.getElementById('modal-body');
const feedbackModal = document.getElementById('feedback-modal');
const feedbackForm = document.getElementById('feedback-form');
const feedbackItemId = document.getElementById('feedback-item-id');

// Current user data
let currentUser = {
    name: '',
    age: '',
    sex: '',
    state: '',
    city: '',
    pincode: '',
    dietaryRestrictions: [],
    allergies: [],
    habits: '',
    cuisinePref: [],
    searchHistory: [],
    savedItems: []
};

// Navigation functions
function showScreen(screenId) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenId].classList.add('active');
}

// Event Listeners
document.getElementById('welcome-next').addEventListener('click', () => {
    showScreen('profile');
});

profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentUser.name = document.getElementById('name').value;
    currentUser.age = document.getElementById('age').value;
    currentUser.sex = document.getElementById('sex').value;
    currentUser.state = document.getElementById('state').value;
    currentUser.city = document.getElementById('city').value;
    currentUser.pincode = document.getElementById('pincode').value;
    saveUserData();
    showScreen('dietary');
});

dietaryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkboxes = document.querySelectorAll('input[name="dietary"]:checked');
    currentUser.dietaryRestrictions = Array.from(checkboxes).map(cb => cb.value);
    const otherDietary = document.getElementById('other-dietary').value;
    if (otherDietary) {
        currentUser.dietaryRestrictions.push(otherDietary);
    }
    saveUserData();
    showScreen('allergies');
});

allergiesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkboxes = document.querySelectorAll('input[name="allergies"]:checked');
    currentUser.allergies = Array.from(checkboxes).map(cb => cb.value);
    const otherAllergies = document.getElementById('other-allergies').value;
    if (otherAllergies) {
        currentUser.allergies.push(otherAllergies);
    }
    saveUserData();
    showScreen('habits');
});

habitsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentUser.habits = document.querySelector('input[name="habits"]:checked').value;
    const cuisinePref = document.getElementById('cuisine-pref').value;
    currentUser.cuisinePref = cuisinePref.split(',').map(item => item.trim()).filter(item => item);
    saveUserData();
    initializeDashboard();
    showScreen('dashboard');
});

// Dashboard functionality
function initializeDashboard() {
    profileName.textContent = currentUser.name;
    locationSummary.textContent = `${currentUser.city}, ${currentUser.state} - ${currentUser.pincode}`;
    
    // Load search history
    renderSearchHistory();
    
    // Load saved items
    renderSavedItems();
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(navItem => navItem.classList.remove('active'));
        item.classList.add('active');
        
        const sectionId = item.getAttribute('data-section') + '-section';
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
    });
});

// Search functionality
searchBtn.addEventListener('click', performSearch);
foodSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

async function performSearch() {
    const query = foodSearch.value.trim();
    if(!query) return;
    
        // Show loading state
        searchResults.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Finding the best options for you...</p>
            </div>
        `;
    
        // Add to search history
        if (!currentUser.searchHistory.includes(query)) {
            currentUser.searchHistory.push(query);
            saveUserData();
            renderSearchHistory();
        }
    
        try {
            // Get recommendations from AI agents
            const recommendations = await getRecommendations(query, currentUser);
            
            // Filter by platform if selected
            const platform = platformFilter.value;
            let filteredResults = platform === 'all' 
                ? recommendations 
                : recommendations.filter(item => item.platform === platform);
    
            // Sort results
            const sortBy = sortFilter.value;
            filteredResults = sortRecommendations(filteredResults, sortBy);
    
            // Display results
            renderSearchResults(filteredResults);
        } catch (error) {
            console.error('Search failed:', error);
            searchResults.innerHTML = `
                <div class="error-message">
                    <p>Sorry, we couldn't find any results. Please try a different search term.</p>
                </div>
            `;
        }
    }
    
    async function getRecommendations(query, user) {
        // This would be replaced with actual API calls to your backend/AI agents
        // For now, we'll use mock data that simulates real recommendations
        
        // AI Agent 1: Intent Understanding
        const intent = await understandUserIntent(query, user);
        
        // AI Agent 2: Search Agent
        const searchResults = await searchFoodItems(intent, user);
        
        // AI Agent 3: Filtering Agent
        const filteredResults = filterRecommendations(searchResults, user);
        
        // AI Agent 4: Personalization Agent
        const personalizedResults = personalizeRecommendations(filteredResults, user);
        
        return personalizedResults;
    }
    
    // AI Agent Functions (these would be more sophisticated in a real implementation)
    async function understandUserIntent(query, user) {
        // Analyze query to understand if user wants to buy or cook, specific cuisine, etc.
        return {
            type: query.includes('recipe') ? 'cook' : 'buy',
            cuisine: user.cuisinePref.length ? user.cuisinePref[0] : null,
            mealType: getMealTypeFromQuery(query),
            originalQuery: query
        };
    }
    
    // In your main.js, replace the mock functions with API calls:

const API_BASE_URL = 'http://localhost:5000/api';

async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

async function getRecommendations(query, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/recommendations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });
        
        if (!response.ok) {
            throw new Error('Failed to get recommendations');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Recommendation error:', error);
        throw error;
    }
}

// Update your performSearch function:
async function performSearch() {
    const query = foodSearch.value.trim();
    if (!query) return;

    // Show loading state
    searchResults.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Finding the best options for you...</p>
        </div>
    `;

    try {
        // Get JWT token from where you stored it after login/registration
        const token = localStorage.getItem('authToken');
        
        // Call the backend API
        const { results } = await getRecommendations(query, token);
        
        // Filter and sort (if needed)
        const platform = platformFilter.value;
        let filteredResults = platform === 'all' 
            ? results 
            : results.filter(item => item.platform === platform);

        const sortBy = sortFilter.value;
        filteredResults = sortRecommendations(filteredResults, sortBy);

        // Display results
        renderSearchResults(filteredResults);
    } catch (error) {
        console.error('Search failed:', error);
        searchResults.innerHTML = `
            <div class="error-message">
                <p>Sorry, we couldn't find any results. Please try a different search term.</p>
            </div>
        `;
    }
}
    
    function filterRecommendations(results, user) {
        // Filter based on dietary restrictions and allergies
        return results.filter(item => {
            // Filter out items that contain allergens
            for (const allergy of user.allergies) {
                if (item.description.toLowerCase().includes(allergy.toLowerCase()) || 
                    item.title.toLowerCase().includes(allergy.toLowerCase())) {
                    return false;
                }
            }
            
            // Filter based on dietary restrictions
            if (user.dietaryRestrictions.includes('vegetarian') && 
                item.title.toLowerCase().includes('chicken') || 
                item.title.toLowerCase().includes('beef') || 
                item.title.toLowerCase().includes('pork')) {
                return false;
            }
            
            if (user.dietaryRestrictions.includes('vegan') && 
                (item.description.toLowerCase().includes('dairy') || 
                 item.description.toLowerCase().includes('cheese') || 
                 item.description.toLowerCase().includes('egg'))) {
                return false;
            }
            
            return true;
        });
    }
    
    function personalizeRecommendations(results, user) {
        // Sort by relevance to user preferences
        return results.sort((a, b) => {
            // Prioritize preferred cuisines
            if (user.cuisinePref.length) {
                const aCuisineMatch = user.cuisinePref.includes(a.cuisine) ? 1 : 0;
                const bCuisineMatch = user.cuisinePref.includes(b.cuisine) ? 1 : 0;
                if (aCuisineMatch !== bCuisineMatch) return bCuisineMatch - aCuisineMatch;
            }
            
            // Then by distance
            const aDistance = parseFloat(a.distance);
            const bDistance = parseFloat(b.distance);
            return aDistance - bDistance;
        });
    }
    
    function sortRecommendations(results, sortBy) {
        return [...results].sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return parseFloat(a.price) - parseFloat(b.price);
                case 'price-desc':
                    return parseFloat(b.price) - parseFloat(a.price);
                case 'rating':
                    return parseFloat(b.rating) - parseFloat(a.rating);
                case 'distance':
                    return parseFloat(a.distance) - parseFloat(b.distance);
                default: // relevance
                    return 0; // already sorted by relevance
            }
        });
    }
    
    function renderSearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="no-results">
                    <p>No results found that match your criteria. Try adjusting your filters.</p>
                </div>
            `;
            return;
        }
    
        searchResults.innerHTML = results.map(item => `
            <div class="result-card" data-id="${item.id}">
                <div class="result-image">
                    <img src="${item.image}" alt="${item.title}">
                    <span class="platform-badge">${item.platform}</span>
                    <span class="distance-badge">${item.distance}</span>
                </div>
                <div class="result-content">
                    <h3 class="result-title">${item.title}</h3>
                    <p class="result-description">${item.description}</p>
                    <div class="result-meta">
                        <span class="result-price">₹${item.price}</span>
                        <span class="result-rating">
                            <i class="fas fa-star"></i> ${item.rating}
                        </span>
                    </div>
                    <div class="result-actions">
                        <button class="action-btn primary view-detail" data-id="${item.id}">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                        <button class="action-btn secondary save-item" data-id="${item.id}">
                            <i class="fas fa-bookmark"></i> Save
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    
        // Add event listeners to detail buttons
        document.querySelectorAll('.view-detail').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.getAttribute('data-id');
                const item = results.find(i => i.id === itemId);
                showProductDetail(item);
            });
        });
    
        // Add event listeners to save buttons
        document.querySelectorAll('.save-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.getAttribute('data-id');
                const item = results.find(i => i.id === itemId);
                saveItem(item);
            });
        });
    }
    
    function showProductDetail(item) {
        modalBody.innerHTML = `
            <div class="modal-product">
                <div class="modal-product-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="modal-product-content">
                    <h2 class="modal-product-title">${item.title}</h2>
                    <span class="modal-product-platform">${item.platform}</span>
                    <div class="modal-product-price">₹${item.price}</div>
                    <div class="modal-product-rating">
                        <div class="stars">
                            ${'<i class="fas fa-star"></i>'.repeat(Math.floor(parseFloat(item.rating)))}
                            ${parseFloat(item.rating) % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                        </div>
                        <span>${item.rating} (${Math.floor(Math.random() * 100) + 10} reviews)</span>
                    </div>
                    <p class="modal-product-description">${item.description}</p>
                    <div class="modal-product-details">
                        <div class="detail-item"><strong>Cuisine:</strong> ${item.cuisine}</div>
                        <div class="detail-item"><strong>Meal Type:</strong> ${item.mealType}</div>
                        <div class="detail-item"><strong>Distance:</strong> ${item.distance}</div>
                        <div class="detail-item"><strong>Preparation Time:</strong> ${item.preparationTime} mins</div>
                        <div class="detail-item"><strong>Availability:</strong> ${item.isAvailable ? 'In Stock' : 'Out of Stock'}</div>
                    </div>
                    <div class="modal-actions">
                        <button class="action-btn primary" id="order-now-btn">
                            <i class="fas fa-shopping-cart"></i> Order Now
                        </button>
                        <button class="action-btn secondary" id="give-feedback-btn" data-id="${item.id}">
                            <i class="fas fa-comment-alt"></i> Give Feedback
                        </button>
                    </div>
                </div>
            </div>
        `;
    
        // Add event listener to order button
        document.getElementById('order-now-btn').addEventListener('click', () => {
            window.open(item.link, '_blank');
        });
    
        // Add event listener to feedback button
        document.getElementById('give-feedback-btn').addEventListener('click', (e) => {
            feedbackItemId.value = e.target.getAttribute('data-id');
            modal.classList.remove('active');
            feedbackModal.classList.add('active');
        });
    
        modal.classList.add('active');
    }
    
    function saveItem(item) {
        if (!currentUser.savedItems.some(i => i.id === item.id)) {
            currentUser.savedItems.push(item);
            saveUserData();
            renderSavedItems();
            alert(`${item.title} has been saved to your favorites!`);
        } else {
            alert('This item is already in your saved items!');
        }
    }
    
    function renderSearchHistory() {
        const historyContainer = document.getElementById('history-items');
        if (currentUser.searchHistory.length === 0) {
            historyContainer.innerHTML = '<p>Your search history is empty.</p>';
            return;
        }
    
        historyContainer.innerHTML = currentUser.searchHistory.map(term => `
            <div class="history-item" data-term="${term}">
                <i class="fas fa-search"></i>
                <div class="history-item-content">
                    <div class="history-item-title">${term}</div>
                    <div class="history-item-meta">
                        <span>${new Date().toLocaleDateString()}</span>
                    </div>
                </div>
                <button class="search-again-btn" data-term="${term}">
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `).join('');
    
        // Add event listeners to search again buttons
        document.querySelectorAll('.search-again-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const term = e.target.getAttribute('data-term');
                foodSearch.value = term;
                performSearch();
                document.querySelector('[data-section="search"]').click();
            });
        });
    }
    
    function renderSavedItems() {
        const savedContainer = document.getElementById('saved-items');
        if (currentUser.savedItems.length === 0) {
            savedContainer.innerHTML = '<p>You have no saved items yet.</p>';
            return;
        }
    
        savedContainer.innerHTML = currentUser.savedItems.map(item => `
            <div class="saved-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}">
                <div class="saved-item-content">
                    <div class="saved-item-title">${item.title}</div>
                    <div class="saved-item-meta">
                        <span>${item.platform}</span>
                        <span>₹${item.price}</span>
                    </div>
                </div>
                <button class="remove-saved-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-saved-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.getAttribute('data-id');
                currentUser.savedItems = currentUser.savedItems.filter(i => i.id !== itemId);
                saveUserData();
                renderSavedItems();
            });
        });
    }
    
    // Helper functions
    function saveUserData() {
        localStorage.setItem('foodAIUser', JSON.stringify(currentUser));
    }
    
    function loadUserData() {
        const savedUser = localStorage.getItem('foodAIUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            initializeDashboard();
            showScreen('dashboard');
        }
    }
    
    function getMealTypeFromQuery(query) {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('breakfast')) return 'Breakfast';
        if (lowerQuery.includes('lunch')) return 'Lunch';
        if (lowerQuery.includes('dinner')) return 'Dinner';
        if (lowerQuery.includes('snack')) return 'Snack';
        return 'Meal';
    }
    
    function getRandomFoodDescriptor() {
        const descriptors = ['Deluxe', 'Special', 'Premium', 'Gourmet', 'Authentic', 'Homestyle', 'Chef\'s Choice', 'Signature'];
        return descriptors[Math.floor(Math.random() * descriptors.length)];
    }
    
    function getRandomDescription(query) {
        const descriptions = [
            `A delicious ${query} made with the finest ingredients.`,
            `Our famous ${query} that everyone loves.`,
            `Authentic ${query} recipe passed down for generations.`,
            `A modern twist on classic ${query}.`,
            `Healthy and nutritious ${query} perfect for any meal.`,
            `Our best-selling ${query} that customers keep coming back for.`
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }
    
    function getRandomFoodImage(query) {
        // In a real app, you would use actual food images from APIs
        // For demo, we'll use placeholder images based on the query
        const foodImages = {
            pizza: 'https://source.unsplash.com/random/300x200/?pizza',
            burger: 'https://source.unsplash.com/random/300x200/?burger',
            pasta: 'https://source.unsplash.com/random/300x200/?pasta',
            salad: 'https://source.unsplash.com/random/300x200/?salad',
            sushi: 'https://source.unsplash.com/random/300x200/?sushi',
            chicken: 'https://source.unsplash.com/random/300x200/?chicken',
            dessert: 'https://source.unsplash.com/random/300x200/?dessert',
            breakfast: 'https://source.unsplash.com/random/300x200/?breakfast'
        };
        
        const defaultImage = 'https://source.unsplash.com/random/300x200/?food';
        
        for (const [key, value] of Object.entries(foodImages)) {
            if (query.toLowerCase().includes(key)) {
                return value;
            }
        }
        
        return defaultImage;
    }
    
    function getRandomIngredients() {
        const ingredients = [
            'Tomatoes', 'Onions', 'Garlic', 'Olive Oil', 'Salt', 'Pepper',
            'Chicken', 'Beef', 'Pork', 'Fish', 'Shrimp', 'Tofu',
            'Rice', 'Pasta', 'Bread', 'Flour', 'Eggs', 'Milk',
            'Cheese', 'Butter', 'Potatoes', 'Carrots', 'Broccoli', 'Spinach',
            'Lemons', 'Limes', 'Herbs', 'Spices', 'Chili', 'Sugar'
        ];
        
        const numIngredients = Math.floor(Math.random() * 5) + 3; // 3-7 ingredients
        const selected = [];
        
        while (selected.length < numIngredients) {
            const randomIngredient = ingredients[Math.floor(Math.random() * ingredients.length)];
            if (!selected.includes(randomIngredient)) {
                selected.push(randomIngredient);
            }
        }
        
        return selected.join(', ');
    }
    
    // Modal close functionality
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        feedbackModal.classList.remove('active');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
        if (e.target === feedbackModal) {
            feedbackModal.classList.remove('active');
        }
    });
    
    // Feedback form
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rating = document.querySelector('input[name="rating"]:checked').value;
        const comments = document.getElementById('feedback-comments').value;
        
        // In a real app, you would send this feedback to your backend
        console.log('Feedback submitted:', {
            itemId: feedbackItemId.value,
            rating,
            comments
        });
        
        alert('Thank you for your feedback! It will help improve our recommendations.');
        feedbackModal.classList.remove('active');
        feedbackForm.reset();
    });
    
    // Initialize the app
    document.addEventListener('DOMContentLoaded', () => {
        loadUserData();
        
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
                feedbackModal.classList.remove('active');
            }
        });
    });
    