import { elements, clearLoader, renderLoader }  from "./views/base"
import * as searchView from "./views/searchView";
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
    await state.search.getResults();
    clearLoader();
    searchView.renderResults(state.search.result);
  }
};

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