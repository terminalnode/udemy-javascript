import { elements }  from "./base"

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

const limitRecipeTitle = (title, limit = 17) => {
  if (title.length > limit) {
    // If the first word is longer than the limit, take the
    // <limit> first number of characters and make title of that.
    const newTitle = [];

    const wordList = title.split(" ");
    if (wordList[0].length > limit) {
      newTitle.push(wordList[0].substr(0, limit));
      console.log(newTitle);

    } else {
      // Otherwise take as many words as you can without
      // going over the limit.
      wordList.reduce((acc, cur) => {
        if (acc + cur.length <= limit) {
          newTitle.push(cur);
        }
        return acc + cur.length;
      }, 0);
    }

    return `${newTitle.join(" ")} ...`;
  }

  return title;
};

const renderRecipe = recipe => {
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">${recipe.publisher}</p>
        </div>
      </a>
    </li>`;
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
}

export const renderResults = recipes => {
  elements.searchResultList.innerHTML = "";
  recipes.forEach(renderRecipe);
};