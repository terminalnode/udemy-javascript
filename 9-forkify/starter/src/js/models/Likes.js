export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, image) {
    const newLike = {id, title, author, image};
    this.likes.push(newLike);
    this.persistData();

    return newLike;
  }

  deleteLike(id) {
    const deleteIndex = this.likes.findIndex(like => like.id === id);
    this.likes.splice(deleteIndex, 1);
    this.persistData();
  }

  isLiked(id) {
    const index = this.likes.findIndex(like => like.id === id);
    return index !== -1;
  }

  getNumberOfLikes() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem("likes"));
    if (storage) {
      this.likes = storage;
    }
  }
}