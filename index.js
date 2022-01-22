// import dependencies you will use
const express = require("express");
const path = require("path");
//setting up Express Validator
const { check, validationResult, Result } = require("express-validator"); // ES6 standard for destructuring an object

// set up variables to use packages
var myApp = express();
myApp.use(express.urlencoded({ extended: false }));
// start the server and listen at a port
const port = 8081;
myApp.listen(port, () => {
  console.log(`Express server listening on port ${port}!`);
});

// set path to public folders and view folders
myApp.set("views", path.join(__dirname, "views"));
//use public folder for CSS etc.
myApp.use(express.static(__dirname + "/public"));
myApp.set("view engine", "ejs");

const productArray = [
  {
    id: "product1",
    name: "Milk",
    rate: 2.87,
  },
  {
    id: "product2",
    name: "Ice cream",
    rate: 5.87,
  },
  {
    id: "product3",
    name: "Bread",
    rate: 5,
  },
  {
    id: "product4",
    name: "Pizza",
    rate: 7.1,
  },
  {
    id: "product5",
    name: "Cookies",
    rate: 4.88,
  },
  {
    id: "product6",
    name: "Coffee",
    rate: 5.1,
  },
];

const provinceArray = [
  {
    province: "alberta",
    name: "Alberta",
    tax: 5,
  },
  {
    province: "britishcolumbia",
    name: "Britishcolumbia",
    tax: 12,
  },
  {
    province: "manitoba",
    name: "Manitoba",
    tax: 12,
  },
  {
    province: "newbrunswick",
    name: "New brunswick",
    tax: 15,
  },
  {
    province: "newfoundlandandlabrador",
    name: "Newfoundland and labrador",
    tax: 15,
  },
  {
    province: "northwestterritories",
    name: "Northwest territories",
    tax: 5,
  },
  {
    province: "novascotia",
    name: "Novascotia",
    tax: 15,
  },
  {
    province: "ontario",
    name: "Ontario",
    tax: 13,
  },
  {
    province: "quebec",
    name: "Quebec",
    tax: 14.975,
  },
  {
    province: "saskatchewan",
    name: "Saskatchewan",
    tax: 11,
  },
];

var allProductTotal;
//home page
myApp.get("/", function (req, res) {
  return res.render("form", { productArray, provinceArray });
});

//form submission handler
myApp.post(
  "/",
  [
    check("name", "Must have a name.").notEmpty(),
    check("address", "Must have a address.").notEmpty(),
    check("city", "Must have a city.").notEmpty(),
    check("selectpicker", "Must have a province.").notEmpty(),
    check("phoneNumber").custom(validatePhoneNumber),
    check("email").custom(validateEmail),
  ],
  function (req, res) {
    const errors = validationResult(req).array();
    const selectedProducts = validateProduct(req);

    if (selectedProducts.length < 2) {
      errors.push({
        msg: "Please select atleast two products to continue.",
      });
    }
    if (errors.length > 0) {
      res.render("form", { errors, productArray, provinceArray });
    } else {
      let selectedProvince = getProvince(req.body.selectpicker);
      let tax = selectedProvince.tax;
      let province = selectedProvince.name;

      let taxAmount = parseFloat((allProductTotal * tax) / 100).toFixed(2);
      let finalTotal = (
        parseFloat(allProductTotal) + parseFloat(taxAmount)
      ).toFixed(2);

      var pageData = {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        province: province,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        tax: tax,
        taxAmount: taxAmount,
        finalTotal: finalTotal,
      };
      res.render("form", {
        productArray,
        provinceArray,
        pageData,
        selectedProducts,
      });
    }
  }
);

function isNotEmpty(str) {
  return str != null && str.trim().length > 0;
}

function checkRegex(userInput, regex) {
  if (regex.test(userInput)) {
    return true;
  } else {
    return false;
  }
}
function validatePhoneNumber(phoneNumber) {
  const regex = /^\d{10}$/;
  if (!checkRegex(phoneNumber, regex)) {
    throw new Error(
      "Must have a phone number. It should be in xxxxxxxxxx format."
    );
  }
  return true;
}
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!checkRegex(email, re)) {
    throw new Error(
      "Must have a Email Address. It should be in proper format."
    );
  }
  return true;
}

function validateProduct(req) {
  let quantityArray = [
    req.body.product1,
    req.body.product2,
    req.body.product3,
    req.body.product4,
    req.body.product5,
    req.body.product6,
  ];
  let resultArray = [];
  allProductTotal = 0;
  let counter = 0;
  productArray.forEach((product, index) => {
    if (isNotEmpty(quantityArray[index])) {
      let valInt = parseInt(`${quantityArray[index]}`);
      if (!isNaN(valInt) && valInt > 0) {
        resultArray[counter] = product;
        resultArray[counter].quantity = valInt;
        resultArray[counter].total = parseFloat(valInt * product.rate).toFixed(
          2
        );
        allProductTotal += parseFloat(resultArray[counter].total);
        counter++;
      }
    }
  });
  return resultArray;
}
function getProvince(provinceInput) {
  let selectedProvince = "";
  provinceArray.forEach((data) => {
    if (data.province.toLowerCase() === provinceInput) {
      selectedProvince = data;
    }
  });
  return selectedProvince;
}
