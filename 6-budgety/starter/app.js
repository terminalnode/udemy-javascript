const budgetController = (function () {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calculatePercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round(this.value / totalIncome * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
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

  const deleteItem = function(type, id) {
    let idList, index;
    idList = data.allItems[type].map( (item) => item.id );
    index = idList.indexOf(id);

    if (index !== -1) {
      data.allItems[type].splice(index, 1);
    }
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

  const calculatePercentages = function() {
    let totalIncome, expenseItems;
    totalIncome = data.totals.inc;
    expenseItems = data.allItems.exp;

    expenseItems.forEach((current) => current.calculatePercentage(totalIncome));
  };

  const getPercentages = function() {
    return data.allItems.exp.map((current) => current.getPercentage());
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
    deleteItem: deleteItem,
    calculateBudget: calculateBudget,
    calculatePercentages: calculatePercentages,
    getPercentages: getPercentages,
    getBudget: getBudget,
  };

})();


const UIController = (function() {
  const DOMClasses = {
    inputType:          ".add__type",
    inputDescription:   ".add__description",
    inputValue:         ".add__value",
    inputButton:        ".add__btn",
    incomeList:         ".income__list",
    expenseList:        ".expenses__list",
    budgetLabel:        ".budget__value",
    incomeLabel:        ".budget__income--value",
    expensesLabel:      ".budget__expenses--value",
    percentageLabel:    ".budget__expenses--percentage",
    container:          ".container",
    expPercentageLabel: ".item__percentage",
    dateLabel:          ".budget__title--month",
  };

  const getFieldInput = function() {
    return {
      type: document.querySelector(DOMClasses.inputType).value, // will be inc or exp
      description: document.querySelector(DOMClasses.inputDescription).value,
      value: parseFloat(document.querySelector(DOMClasses.inputValue).value)
    };
  };

  const formatNumber = function(num, type) {
    let numSplit, int, dec;

    num = Math.abs(num);  // Get absolute value of the number.
    num = num.toFixed(2); // Format number to have 2 decimal points.

    numSplit = num.split(".");
    int = numSplit[0];
    dec = numSplit[1];
    if (int.length > 3) {
      let afterComma = int.length - 3;
      int = `${int.substr(0, afterComma)},${int.substr(afterComma, int.length)}`;
    }

    // Combine int and dec
    num = `${int}.${dec}`

   // Prepend + or -
    return type === "inc" ? `+ ${num}` : `- ${num}`;
  };

  const nodeListForEach = function(list, callback) {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  const addListItem = function(newItem, type) {
    let html, element;

    // Generate the html
    if (type === "inc") {
      element = DOMClasses.incomeList;
      html = `<div class="item clearfix" id="inc-${newItem.id}">
                <div class="item__description">${newItem.description}</div>
                <div class="right clearfix">
                  <div class="item__value">${formatNumber(newItem.value, type)}</div>
                  <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
                </div>
              </div>`
    } else if (type === "exp") {
      element = DOMClasses.expenseList;
      html = `<div class="item clearfix" id="exp-${newItem.id}">
                <div class="item__description">${newItem.description}</div>
                <div class="right clearfix">
                  <div class="item__value">${formatNumber(newItem.value, type)}</div>
                  <div class="item__percentage">21%</div>
                  <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
                </div>
              </div>`
    };

    // Insert HTML into DOM
    if (element !== undefined && html !== undefined) {
      document.querySelector(element).insertAdjacentHTML("beforeend", html);
    }
  };

  const removeListItem = function(selectorID) {
    let target, parent;

    target = document.getElementById(selectorID);
    parent = target.parentNode;
    parent.removeChild(target);
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
    let type;
    type = budgetData.budget >= 0 ? "inc" : "exp";

    document.querySelector(DOMClasses.budgetLabel).textContent = formatNumber(budgetData.budget, type);
    document.querySelector(DOMClasses.incomeLabel).textContent = formatNumber(budgetData.totalInc, "inc");
    document.querySelector(DOMClasses.expensesLabel).textContent = formatNumber(budgetData.totalExp, "exp");
    if (budgetData.percentage > 0) {
      document.querySelector(DOMClasses.percentageLabel).textContent = `${budgetData.percentage}%`;
    } else {
      document.querySelector(DOMClasses.percentageLabel).textContent = "---";
    }
  };

  const displayPercentages = function(percentages) {
    let fields;

    fields = document.querySelectorAll(DOMClasses.expPercentageLabel);
    nodeListForEach(fields, function(current, index) {
      if (percentages[index] > 0) {
        current.textContent = `${percentages[index]}%`;
      } else {
        current.textContent = "---"
      }
    });
  };

  const displayMonth = function() {
    let now, year, month, months;
    now = new Date();
    year = now.getFullYear();
    month = now.getMonth();
    months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    document.querySelector(DOMClasses.dateLabel).textContent = `${months[month]} ${year}`;
  };

  const changedType = function() {
    let fields;
    fields = document.querySelectorAll(
      DOMClasses.inputType + "," +
      DOMClasses.inputDescription + "," +
      DOMClasses.inputValue
    );

    nodeListForEach(fields, function(cur) {
      cur.classList.toggle("red-focus");
    });

    document.querySelector(DOMClasses.inputButton)
      .classList
      .toggle("red")
  }

  return {
    getFieldInput: getFieldInput,
    addListItem: addListItem,
    removeListItem: removeListItem,
    DOMClasses: DOMClasses,
    clearFields: clearFields,
    displayBudget: displayBudget,
    displayPercentages: displayPercentages,
    displayMonth: displayMonth,
    changedType: changedType,
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
      updatePercentages();
    }
  };

  const updatePercentages = function() {
    let percentages;

    // Calculate percentages
    budgetCtrl.calculatePercentages();

    // Read percentages from the budget controller
    percentages = budgetCtrl.getPercentages();

    // Update the UI with new percentages
    UICtrl.displayPercentages(percentages);
    console.log(percentages);
  };

  const deleteItemClick = function(event) {
    let target = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (target) {
      let splitID, type, id;

      splitID = target.split("-");
      type = splitID[0];
      id = parseInt(splitID[1], 10);

      // 1. Delete item from data structure.
      budgetCtrl.deleteItem(type, id);

      // 2. Delete item from UI
      UICtrl.removeListItem(target);

      // 3. Update and show new budget.
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
    document.querySelector(DOMClasses.container).addEventListener("click", deleteItemClick);
    document.querySelector(DOMClasses.inputType).addEventListener("change", UIController.changedType);
    document.querySelector(DOMClasses.inputType).options[0].selected = 1;
  };

  const init = function() {
    console.log("Application has started.");
    UIController.displayMonth();
    setupEventListeners();
    updateBudget();
  };

  return {
    init: init,
  };

})(budgetController, UIController);

appController.init();
