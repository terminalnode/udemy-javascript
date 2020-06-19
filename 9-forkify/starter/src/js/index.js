import { clearLoader, elements, renderLoader }  from "./views/base"
import * as recipeView from "./views/recipeView";
import * as searchView from "./views/searchView";
import List from "./models/List";
import Recipe from "./models/Recipe";
import Search from "./models/Search";

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

const controlSearch = async () => {
  const query = searchView.getInput();

  if (query) {
    state.search = new Search(query);
    searchView.clearInput();
    renderLoader(elements.searchResult);
    try {
      await state.search.getResults();
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      console.log("Failed to load recipe!");
      clearLoader();
    }
  }
};

const controlRecipe = async () => {
  const id = window.location.hash.replace("#", "");

  if (id) {
    // Create new recipe
    state.recipe = new Recipe(id);
    renderLoader(elements.recipe);
    if (state.search) {
      searchView.highlightSelected(id);
    }

    try {
      // Load recipe information
      await state.recipe.getRecipe();
      state.recipe.calcServings();
      state.recipe.calcTime();
      state.recipe.parseIngredients();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);

    } catch (err) {
      console.log(err);
      console.log("Failed to load recipe!");
    }
  }
}

// Add event listeners
elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultPages.addEventListener("click", e => {
  const button = e.target.closest(".btn-inline");
  if (button) {
    const goToPage = parseInt(button.dataset.goto, 10);
    searchView.renderResults(state.search.result, goToPage);
  }
});

["hashchange", "load"].forEach(event => window.addEventListener(event, controlRecipe));
elements.recipe.addEventListener("click", e => {
  if (state.recipe.servings > 1 && e.target.matches(".btn-decrease, .btn-decrease *")) {
    state.recipe.updateServings("dec");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  }
});