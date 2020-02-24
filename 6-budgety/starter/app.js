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

  var calculateTotal = function(type) {
    data.totals[type] = data.allItems[type].reduce(
      (total, current) => total + current.value, 0
    );
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
    budget: 0,
    percentage: -1,
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
    }

    // Add new item to list and return it
    data.allItems[type].push(newItem);
    return newItem;
  };

  const calculateBudget = function() {
    // Calculate total income and expenses
    calculateTotal("exp");
    calculateTotal("inc");

    // Calculate the budget: income - expenses
    data.budget = data.totals.inc - data.totals.exp;

    // Calculate the percentage of income that we've spent
    if (data.totals.inc > 0) {
      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    } else {
      data.percentage = -1;
    }
  };

  const getBudget = function() {
    return {
      budget:     data.budget,
      totalInc:   data.totals.inc,
      totalExp:   data.totals.exp,
      percentage: data.percentage,
    }
  }

  return {
    addItem: addItem,
    calculateBudget: calculateBudget,
    getBudget: getBudget,
  };

})();


const UIController = (function() {
  const DOMClasses = {
    inputType:        ".add__type",
    inputDescription: ".add__description",
    inputValue:       ".add__value",
    inputButton:      ".add__btn",
    incomeList:       ".income__list",
    expenseList:      ".expenses__list",
    budgetLabel:      ".budget__value",
    incomeLabel:      ".budget__income--value",
    expensesLabel:    ".budget__expenses--value",
    percentageLabel:  ".budget__expenses--percentage",
  };

  const getFieldInput = function() {
    return {
      type: document.querySelector(DOMClasses.inputType).value, // will be inc or exp
      description: document.querySelector(DOMClasses.inputDescription).value,
      value: parseFloat(document.querySelector(DOMClasses.inputValue).value)
    };
  };

  const addListItem = function(newItem, type) {
    let html, element;

    // Generate the html
    if (type === "inc") {
      element = DOMClasses.incomeList;
      html = `<div class="item clearfix" id="income-${newItem.id}">
                <div class="item__description">${newItem.description}</div>
                <div class="right clearfix">
                  <div class="item__value">+ ${newItem.value}</div>
                  <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
                </div>
              </div>`
    } else if (type === "exp") {
      element = DOMClasses.expenseList;
      html = `<div class="item clearfix" id="expense-${newItem.id}">
                <div class="item__description">${newItem.description}</div>
                <div class="right clearfix">
                  <div class="item__value">- ${newItem.value}</div>
                  <div class="item__percentage">21%</div>
                  <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
                </div>
              </div>`
    }

    // Insert HTML into DOM
    if (element !== undefined && html !== undefined) {
      document.querySelector(element).insertAdjacentHTML("beforeend", html);
    }
  };

  const clearFields = function() {
    let fields, fieldsArray;

    fields = document.querySelectorAll(`${DOMClasses.inputDescription}, ${DOMClasses.inputValue}`);

    // Convert fields NodeList to an Array
    fieldsArray = Array.prototype.slice.call(fields);
    fieldsArray.forEach(function(current) { current.value = ""; });

    // Set focus to DOMClasses.inputDescription which is the first element of our array.
    fieldsArray[0].focus();
  };

  const displayBudget = function(budgetData) {
    document.querySelector(DOMClasses.budgetLabel).textContent = budgetData.budget;
    document.querySelector(DOMClasses.incomeLabel).textContent = budgetData.totalInc;
    document.querySelector(DOMClasses.expensesLabel).textContent = budgetData.totalExp;
    if (budgetData.percentage > 0) {
      document.querySelector(DOMClasses.percentageLabel).textContent = `${budgetData.percentage}%`;
    } else {
      document.querySelector(DOMClasses.percentageLabel).textContent = "---";
    }
  };

  return {
    getFieldInput: getFieldInput,
    addListItem: addListItem,
    DOMClasses: DOMClasses,
    clearFields: clearFields,
    displayBudget: displayBudget,
  };

})();


const appController = (function(budgetCtrl, UICtrl) {
  const updateBudget = function() {
    let budget;

    // 1. Calculate budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    budget = budgetCtrl.getBudget();

    // 3. Update budget in UI
    UICtrl.displayBudget(budget);

  }

  const addButtonClick = function() {
    let input, newItem;

    // 1. Get field input data
    input = UICtrl.getFieldInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add item to ui controller and clear the fields
      UICtrl.addListItem(newItem, input.type);
      UICtrl.clearFields();

      // 4. Calculate and update budget
      updateBudget();
    }

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
    updateBudget();
  };

  return {
    init: init,
  };

})(budgetController, UIController);

appController.init();
