import { clearLoader, elements, renderLoader }  from "./views/base"
import * as likesView from "./views/likesView";
import * as listView from "./views/listView";
import * as recipeView from "./views/recipeView";
import * as searchView from "./views/searchView";
import Likes from "./models/Likes";
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
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
        );

    } catch (err) {
      console.log(err);
      console.log("Failed to load recipe!");
    }
  }
};

const controlList = () => {
  if (!state.list) {
    state.list = new List();
  }

  state.recipe.ingredients.forEach( el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

const controlLike = () => {
  const currentId = state.recipe.id;
  if (!state.likes.isLiked(currentId)) {
    // Add like to state
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    // Toggle like button
    likesView.toggleLikeButton(true);

    // Add like to UI list
    likesView.renderLike(newLike);

  } else {
    // Remove like from state
    state.likes.deleteLike(currentId);

    // Toggle like button
    likesView.toggleLikeButton(false);

    // Remove like from UI list
    likesView.deleteLike(currentId);
  }

  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
}

// Add event listeners
window.addEventListener("load", () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
  
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

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
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

elements.shopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    state.list.deleteItem(id);
    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    const value = parseFloat(e.target.value);
    state.list.updateCount(id, value);
    console.log(state.list);
  }
});