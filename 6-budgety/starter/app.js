const budgetController = (function () {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
  };

  const addItem = function(type, description, value) {
    let newItem, ID;

    // Create new ID
    if (data.allItems[type].length > 0) {
      ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
    } else {
      ID = 0;
    }

    // Create new item based on type
    if (type === "inc") {
      newItem = new Income(ID, description, value);
    } else if (type === "exp") {
      newItem = new Expense(ID, description, value);
    } else {
      console.log("Unknown item type (needs to be inc or exp)!");
    }

    // Add new item to list and return it
    data.allItems[type].push(newItem);
    return newItem;
  };

  return {
    addItem: addItem,
  };

})();


const UIController = (function() {
  const DOMClasses = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
  }

  const getFieldInput = function() {
    return {
      type: document.querySelector(DOMClasses.inputType).value, // will be inc or exp
      description: document.querySelector(DOMClasses.inputDescription).value,
      value: document.querySelector(DOMClasses.inputValue).value
    };
  }

  return {
    getFieldInput: getFieldInput,
    DOMClasses: DOMClasses,
  };

})();


const appController = (function(budgetCtrl, UICtrl) {
  const addButtonClick = function() {
    let input, newItem;

    // 1. Get field input data
    input = UICtrl.getFieldInput();

    // 2. Add item to budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add item to ui controller
    // 4. Calculate budget
    // 5. Update budget in UI
  };

  const keypressEvent = function(event) {
    // keyCode 13 is enter/return
    if (event.keyCode === 13) {
      addButtonClick();
    }
  };

  const setupEventListeners = function() {
    const DOMClasses = UICtrl.DOMClasses;
    document.querySelector(DOMClasses.inputButton).addEventListener("click", addButtonClick);
    document.addEventListener("keypress", keypressEvent);
  };

  const init = function() {
    console.log("Application has started.");
    setupEventListeners();
  };

  return {
    init: init,
  };

})(budgetController, UIController);

appController.init();
