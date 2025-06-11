// Star Animation Functions
function createStarAnimation() {
    // Remove any existing star animations
    const existingStars = document.querySelectorAll('.star-animation');
    existingStars.forEach(star => star.remove());

    const star = document.createElement('div');
    star.className = 'star-animation';
    document.body.appendChild(star);

    // Create more sparkles with varying sizes and positions
    for (let i = 0; i < 20; i++) { // Increased number of sparkles
        const sparkle = document.createElement('div');
        sparkle.className = 'star-trail';
        sparkle.style.left = `${Math.random() * 80}px`;
        sparkle.style.top = `${Math.random() * 80}px`;
        sparkle.style.width = `${Math.random() * 6 + 6}px`; // Larger sparkles
        sparkle.style.height = sparkle.style.width;
        sparkle.style.animationDelay = `${Math.random() * 0.5}s`;
        star.appendChild(sparkle);
    }

    // Remove the star after animation completes
    setTimeout(() => {
        star.remove();
    }, 2000); // Match the animation duration
}

async function handleSearch() {
    const searchInput = document.querySelector('.input-area textarea');
    const searchResults = document.querySelector('.search-results-area');
    const query = searchInput.value.trim();

    if (!query) return;

    // Show loading state
    searchResults.style.opacity = '0.5';
    searchResults.innerHTML = '<div class="loading">Searching...</div>';

    try {
        // Create star animation
        createStarAnimation();

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Clear loading state
        searchResults.style.opacity = '1';
        searchResults.innerHTML = `<div class="result">Results for: ${query}</div>`;
    } catch (error) {
        console.error('Search error:', error);
        searchResults.innerHTML = '<div class="error">An error occurred during search</div>';
    }
}

// Add click event listener to search button
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, looking for search button');
    const searchButton = document.querySelector('.input-buttons-left .input-button[data-tooltip="Search"]');
    console.log('Found search button:', searchButton);
    
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            console.log('Search button clicked');
            e.preventDefault();
            handleSearch();
        });
    } else {
        console.error('Search button not found');
    }
}); 