import axios from "axios";

export default class Recipe {
  constructor(id) {
    this.id = id;
    this.url = `https://forkify-api.herokuapp.com/api/get?rId=${id}`;
  }

  async getRecipe() {
    try {
      const res = await axios(this.url);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (exc) {
      console.log(`Something went wrong, fetching recipe ${this.id} failed!`);
    }
  }

  calcTime() {
    // Doing some kind of bullshit estimate, saying that every
    // three ingredients take 15 minutes to prepare.
    const periods = Math.ceil(this.ingredients.length / 3);
    this.time = periods * 15;
  }

  calcServings() {
    // Currently we just assume that every recipe is four servings.
    this.servings = 4;
  }
}