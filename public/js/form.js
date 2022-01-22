function formSubmit() {
  //On submit button
  return true;
  //get all fields Value
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var cardNumber = document.getElementById("cardNumber").value;
  var expiryMonth = document.getElementById("expiryMonth").value;
  var expiryYear = document.getElementById("expiryYear").value;
  var product1 = document.getElementById("product1").value;
  var product2 = document.getElementById("product2").value;
  var product3 = document.getElementById("product3").value;
  var product4 = document.getElementById("product4").value;
  var product5 = document.getElementById("product5").value;

  //check error
  var errors = "";

  if (!name) {
    errors += "Please enter input for Name. <br>";
  }
  if (!email || !validateEmail(email)) {
    errors += "Please enter input for Email. <br>";
  }
  if (!validateCreditCard(cardNumber)) {
    errors +=
      "Please enter proper Card Number. It should be in xxxx-xxxx-xxxx-xxxx format. <br>";
  }
  if (!validateMonth(expiryMonth)) {
    errors +=
      "Please enter proper Expiry month. It should be in MMM format. <br>";
  }
  if (!validateYear(expiryYear)) {
    errors +=
      "Please enter proper Expiry year. It should be in yyyy format. <br>";
  } else if (!validateYearWithCurrentYear(expiryYear)) {
    errors +=
      "Please enter proper Expiry year. It should not be less than current year. <br>";
  }
  errors += validateProduct(product1, 1);
  errors += validateProduct(product2, 2);
  errors += validateProduct(product3, 3);
  errors += validateProduct(product4, 4);
  errors += validateProduct(product5, 5);

  if (!validateMinimumProduct()) {
    errors += "Please select atleast one product to continue. <br>";
  }
  if (errors) {
    let errorEle = document.getElementById("error-div");
    errorEle.classList.remove("hide");

    let finalError = "<div class='err-msg'>" + errors + "</div>";
    // show the errors
    document.getElementById("errors").innerHTML = finalError;

    let element = document.getElementById("receipt-div");
    element.classList.add("hide");
  } else {
    // clear errors
    let errorEle = document.getElementById("error-div");
    errorEle.classList.add("hide");

    document.getElementById("errors").innerHTML = "";

    let element = document.getElementById("receipt-div");
    element.classList.remove("hide");
    createHTMLTable();
  }
  return false;
}

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//validate credit card with xxxx-xxxx-xxxx-xxxx format
function validateCreditCard(creditCard) {
  if (isNotEmpty(creditCard)) {
    const re = /\b(?:\d[-]*?){16}\b/gm;
    return re.test(creditCard);
  } else {
    return true;
  }
}

//validate month with MMM format
function validateMonth(month) {
  if (isNotEmpty(month)) {
    const re = /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/;
    return re.test(month);
  }
  return true;
}

//validate year with yyyy format
function validateYear(year) {
  if (isNotEmpty(year)) {
    const re = /^\d{4}$/;
    return re.test(year);
  }
  return true;
}

function validateYearWithCurrentYear(year) {
  if (isNotEmpty(year)) {
    let currYr = new Date().getFullYear();
    if (currYr > year) {
      return false;
    }
  }
  return true;
}

function isNotEmpty(str) {
  return str != null && str.trim().length > 0;
}

//validate product with digit only
function validateProduct(itemVal, itemNum) {
  if (isNotEmpty(itemVal)) {
    let val = parseInt(`${itemVal}`);
    if (isNaN(val)) {
      return (
        "Please enter digits only for " +
        document.getElementById("product" + itemNum + "-label").innerText +
        "<br>"
      );
    }
  }
  return "";
}

//user must have selected atleast one product
function validateMinimumProduct() {
  let flag = false;
  for (let i = 1; i <= 5; i++) {
    let val = document.getElementById("product" + i).value;
    if (isNotEmpty(val)) {
      let valInt = parseInt(`${val}`);
      if (!isNaN(valInt) && valInt > 0) {
        return true;
      }
    }
  }
  return flag;
}

//create HTML dynamic table
function createHTMLTable() {
  var result =
    "<span class='receipt-label'> Thank you for your order </span> </br>";
  result += "<h4 class='receipt-inner-label'>Customer Details: </h4>";
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let cardNumber = document.getElementById("cardNumber").value;

  //Add customer details
  if (isNotEmpty(name)) {
    result += `<span> <strong>Name :</strong> ${name}</span></br>`;
  }
  if (isNotEmpty(email)) {
    result += `<span> <strong>Email Address :</strong> ${email}</span></br>`;
  }
  if (isNotEmpty(cardNumber)) {
    result += `<span><strong> Credit Card Number :</strong> ${getCreditCardNumber(
      cardNumber
    )} </span>`;
  }

  // Add product details
  result +=
    "<h4 class='receipt-inner-label'> Please find your final receipt :</h4>";
  result += "<table class='tbl margin-top' border ='1'>";
  result += "<tr>";
  result += " <th> Item </th> ";
  result += " <th> Quantity </th> ";
  result += " <th> Unit Price </th> ";
  result += " <th> Total </th> ";
  result += " </tr> ";
  let allItemTotal = 0;
  for (let i = 1; i <= 5; i++) {
    let itemQnt = document.getElementById("product" + i).value;
    if (itemQnt > 0) {
      let itemRate = document.getElementById("item" + i + "-rate").innerHTML;
      let itemTotal = parseFloat(itemQnt * itemRate).toFixed(2);

      let itemName = document.getElementById(
        "product" + i + "-label"
      ).innerText;
      result += "<tr>";
      result += `<td> ${itemName} </td>`;
      result += `<td class='algn-right'>  ${itemQnt} </td>`;
      result += `<td class='algn-right'>$ ${itemRate} </td>`;
      result += `<td class='algn-right'> $  ${formatNumber(itemTotal)} </td>`;
      result += " </tr> ";
      allItemTotal += parseFloat(itemTotal);
    }
  }

  let body = document.getElementById("receipt-inner-div");
  result += "<tr>";
  result += `<td> Donation </td>`;
  //check 10% of the tax
  let taxAmount = parseFloat((allItemTotal * 10) / 100).toFixed(2);
  //if tax is less tahn $10 then use minimum tax which is $10
  if (taxAmount < 10) {
    taxAmount = parseFloat(10);
    result += "<td colspan = '2' class='algn-right'> Minimum Tax </td>";
  } else {
    result += "<td colspan = '2' class='algn-right'> 10% Of The Total </td>";
  }
  result += `<td class='algn-right'> $ ${formatNumber(taxAmount)}</td>`;
  result += "</tr>";

  let finalAmount = (parseFloat(allItemTotal) + parseFloat(taxAmount)).toFixed(
    2
  );

  result += "<tr>";
  result += "<td colspan = '3' class='algn-right'> Total </td>";
  result += `<td class='algn-right'><strong> $ ${formatNumber(
    finalAmount
  )} </strong></td>`;
  result += "</tr>";
  result += "</table>";

  document.getElementById("receipt-inner-div").innerHTML = result;
}

//format currency
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function getCreditCardNumber(creditCardNum) {
  const lastFourChar = creditCardNum.slice(-4);
  return `xxxx-xxxx-xxxx-${lastFourChar}`;
}
