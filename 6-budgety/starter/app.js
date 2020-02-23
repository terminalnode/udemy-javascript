const budgetController = (function () {
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
    // 1. Get field input data
    const input = UICtrl.getFieldInput();
    console.log(input);

    // 2. Add item to budget controller
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
    init: init
  };

})(budgetController, UIController);

appController.init();
