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
	 var date_re = new RegExp("^(0[0-9]|1[0-2])\/((20)?([0-9]{2}))$");
	 var CVV_re = new RegExp("^[0-9]{3,4}$");
	 var isValidCard = false;
	 var isValidDate = false;
	 var isValidCVV = false;
	 var isExpiredCard = false;
	 var isLongYear = false;
	 var temp = date.match(date_re);
	 if(cardNumber.match(visa_re) !== null || cardNumber.match(mastercard_re) !== null || cardNumber.match(americanExpress_re) !== null || 
			 cardNumber.match(discover_re) !== null || cardNumber.match(diners_re) !== null || cardNumber.match(visaElectron_re) !== null){
		 isValidCard = true;
	 }
	 var dates = date.match(date_re);
	 if(dates !== null){
		 isValidDate = true;
		 var currentDate = new Date();
		 if(parseInt("20" + dates[4]) < Number(currentDate.getFullYear())) {
			 isExpiredCard = true;
		 } else if(parseInt("20" + dates[4]) === Number(currentDate.getFullYear())) {
			 if(dates[1] < currentDate.getMonth() + 1) {
				 isExpiredCard = true;
			 }
		 }else if(parseInt("20" + dates[4]) > Number(currentDate.getFullYear() + 50)) {
			 isLongYear = true;
		 }
	 }
	 if(cvvNumber.match(CVV_re) !== null){
		 isValidCVV = true;
	 }
	callback(isValidCard,isValidDate,isValidCVV,isExpiredCard,isLongYear);
}

router.post('/validate', function(req, res, next) {
	var cardNumber = req.param('CreditCardNumber');
	var date = req.param('Date');
	var cvvNumber = req.param('CVV');
	validateCardNumber(cardNumber, date, cvvNumber,function(isValidCard,isValidDate,isValidCVV,isExpiredCard,isLongYear){
		var display = [];
		
		if(isValidCard === true && isValidDate === true && isValidCVV === true && isExpiredCard === false && isLongYear === false)
		{
			display.push("The Credit Card is valid !!!");
		}
		else
		{
		if(isValidCard === false ){
			display.push("Credit Card number is not valid !!");		
		}
		if(isValidDate === false ){
			display.push("Expiry Date is not valid !!");				
		}
		if(isValidCVV === false){
			display.push("CVV number is not valid !!");	
		}
		if(isExpiredCard === true) {
			display.push("The Credit Card is Expired !!!");
		}
		if(isLongYear === true) {
			display.push("Expiry date should not exceed 50 years from now !!!");
		}
		}
		res.render('result', { display: display});
	});
});

module.exports = router;
