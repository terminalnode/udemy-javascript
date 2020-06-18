import { elements }  from "./views/base"
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
    await state.search.getResults();
    searchView.renderResults(state.search.result);
  }
};

// Add event listeners
elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});