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

  parseIngredients() {
    const unitsLong = [ "tablespoons", "tablespoon", "ounces", "ounce", "teaspoons", "teaspoon", "cups", "pounds" ];
    const unitsShort = [ "tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup", "pound" ];
    const units = [ ...unitsShort, "kg", "g" ]

    const newIngredients = this.ingredients.map(ingredient => {
      // Make units uniform
      ingredient = ingredient.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i])
      });

      // Remove anything in parenthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      // Split ingredients into amount, unit, name
      const ingredientArray = ingredient.split(" ");
      const unitIndex = ingredientArray.findIndex(el => unitsShort.includes(el));

      let ingredientObject;
      if (unitIndex > -1) {
        // There is a unit
        const arrayCount = ingredientArray.slice(0, unitIndex);

        let count;
        if (arrayCount.length === 1) {
          count = eval(ingredientArray[0].replace("-", "+"));
        } else {
          count = eval(ingredientArray.slice(0, unitIndex).join("+"));
        }

        ingredientObject = {
          count,
          unit: ingredientArray[unitIndex],
          ingredient: ingredientArray.slice(unitIndex + 1).join(" ")
        }

      } else if (parseInt(ingredientArray[0], 10)) {
        // There is no unit, but first element is a number
        ingredientObject = {
          count: parseInt(ingredientArray[0], 10),
          unit: "",
          ingredient: ingredientArray.slice(1).join(" ")
        }

      } else if (unitIndex === -1) {
        // No unit and no number
        ingredientObject = {
          count: 1,
          unit: "",
          ingredient
        };
      }

      return ingredientObject;
    });
    this.ingredients = newIngredients;
  }

  updateServings (type) {
    // Servings
    const newServings = type === "inc" ? this.servings + 1 : this.servings - 1;

    // Ingredients
    this.ingredients.forEach(ingredient => {
      ingredient.count = ingredient.count * (newServings / this.servings);
    });
    this.servings = newServings;
  }
}