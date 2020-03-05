const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // clear single meal
  single_mealEl.innerHTML = '';

  // get search term
  const term = search.value;

  // check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
        if (data.meals === null) {
          resultHeading.innerHTML =
            '<p>There is no search results. Try again.</p>';
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealid="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `
            )
            .join('');
        }
        // clear search text
        search.value = '';
      })
      .catch(err => console.log(err));
  } else {
    alert('Please Enter a search term');
  }
}

// Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    })
    .catch(err => console.log(err));
}

// Fetch random meal from API
function getRandomMeal() {
  // Clear meals and heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    })
    .catch(err => console.log(err));
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; meal[`strIngredient${i}`]; i++) {
    ingredients.push(
      `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
    );
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.reduce((html, ingredient) => {
            return html + `<li>${ingredient}</li>`;
          }, '')}
        </ul>
      </div>
    </div>
  `;
}

// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => item.classList.contains('meal-info'));
  const mealID = mealInfo.dataset.mealid;
  getMealById(mealID);
});
random.addEventListener('click', getRandomMeal);
