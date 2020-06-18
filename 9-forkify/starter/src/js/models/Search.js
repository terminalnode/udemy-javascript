import axios from "axios";

export default class Search {
  constructor(query) {
    this.query = query;
    this.url = `https://forkify-api.herokuapp.com/api/search?q=${query}`;
  }

  async getResults(query) {
    try {
      const res = await axios(this.url);
      this.result = res.data.recipes;
    } catch (exc) {
      console.log(`Something went wrong, search for ${this.query} failed!`);
    }
  }
}