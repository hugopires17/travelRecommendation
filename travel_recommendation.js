// DOM Elements
const homeLink = document.getElementById('home-link');
const aboutLink = document.getElementById('about-link');
const contactLink = document.getElementById('contact-link');
const homePage = document.getElementById('home-page');
const aboutPage = document.getElementById('about-page');
const contactPage = document.getElementById('contact-page');
const searchBtn = document.getElementById('search-btn');
const clearBtn = document.getElementById('clear-btn');
const searchInput = document.getElementById('search-input');
const recommendationsContainer = document.getElementById('recommendations');

// Show Page Function
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  page.classList.add('active');
}

// Event Listeners for Navigation
homeLink.addEventListener('click', (e) => {
  e.preventDefault();
  showPage(homePage);
});

aboutLink.addEventListener('click', (e) => {
  e.preventDefault();
  showPage(aboutPage);
});

contactLink.addEventListener('click', (e) => {
  e.preventDefault();
  showPage(contactPage);
});

// Fetch Travel Data (Task 6)
async function fetchTravelData() {
  try {
    const response = await fetch('travel_recommendation_api.json');
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Search Function (Task 7-8)
searchBtn.addEventListener('click', async () => {
  const keyword = searchInput.value.trim().toLowerCase();
  if (!keyword) return;

  const data = await fetchTravelData();
  if (!data) return;

  let results = [];
  
  if (["beach", "beaches"].some(k => keyword.includes(k))) {
    results = data.beaches;
  } else if (["temple", "temples"].some(k => keyword.includes(k))) {
    results = data.temples;
  } else {
    // Verifica se o nome do país ou cidade está no texto
    results = data.countries.flatMap(country =>
      country.cities.filter(city =>
        city.name.toLowerCase().includes(keyword) ||
        country.name.toLowerCase().includes(keyword)
      )
    );
  }
  displayRecommendations(results);
});

// Clear Function (Task 9)
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  recommendationsContainer.innerHTML = '';
});

// Display Recommendations
function displayRecommendations(results) {
  recommendationsContainer.innerHTML = '';
  
  if (results.length === 0) {
    recommendationsContainer.innerHTML = '<p>No results found. Try another keyword!</p>';
    return;
  }

  results.forEach(item => {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
    `;
    recommendationsContainer.appendChild(card);
  });
}