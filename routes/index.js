var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Credit Card Validator' });
});

function validateCardNumber(cardNumber, date, cvvNumber, callback) {
	 var visa_re = new RegExp("^(?:4[0-9]{12}(?:[0-9]{3})?)$");
	 var mastercard_re = new RegExp("^(?:5[1-5][0-9]{14})$");
	 var americanExpress_re = new RegExp("^(?:3[47][0-9]{13})$");
	 var discover_re = new RegExp("^(?:6(?:011|5[0-9][0-9])[0-9]{12})$");
	 var diners_re = new RegExp("^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$");
	 var visaElectron_re = new RegExp("^(?:(?:2131|1800|35\d{3})\d{11})$");
	 var date_re = new RegExp("^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$");
	 var CVV_re = new RegExp("^[0-9]{3,4}$");
	 var isValidCard = false;
	 var isValidDate = false;
	 var isValidCVV = false;
	 if(cardNumber.match(visa_re) !== null || cardNumber.match(mastercard_re) !== null || cardNumber.match(americanExpress_re) !== null || 
			 cardNumber.match(discover_re) !== null || cardNumber.match(diners_re) !== null || cardNumber.match(visaElectron_re) !== null){
		 isValidCard = true;
	 }
	 if(date.match(date_re) !== null){
		 isValidDate = true;
	 }
	 if(cvvNumber.match(CVV_re) !== null){
		 isValidCVV = true;
	 }
	callback(isValidCard,isValidDate,isValidCVV);
}

router.get('/validate', function(req, res, next) {
	var cardNumber = req.param('CreditCardNumber');
	var date = req.param('Date');
	var cvvNumber = req.param('CVV');
	validateCardNumber(cardNumber, date, cvvNumber,function(isValidCard,isValidDate,isValidCVV){
		var display = [];
		if(isValidCard === true && isValidDate === true && isValidCVV === true)
		{
			display.push("The Credit Card is valid !!!");
		}
		else
		{
		if(isValidCard === false){
			display.push("Credit Card number is not valid !!");	
		}
		if(isValidDate === false){
			display.push("Expiry Date is not valid !!");				
		}
		if(isValidCVV === false){
			display.push("CVV number is not valid !!");	
		}
		}
		res.render('result', { display: display});
	});
});

module.exports = router;
