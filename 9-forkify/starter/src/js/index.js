import { elements, clearLoader, renderLoader }  from "./views/base"
import * as searchView from "./views/searchView";
import Search from "./models/Search";
import Recipe from "./models/Recipe";

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

    // Load recipe information
    try {
      await state.recipe.getRecipe();
      state.recipe.calcServings();
      state.recipe.calcTime();
      state.recipe.parseIngredients();
      console.log(state.recipe);
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