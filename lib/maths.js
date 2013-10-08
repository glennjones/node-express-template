'use strict';

// this could be a stand alone module


// export functions as a single object
module.exports = {


	// 'add' 
	add: function (options, callback){
		var result;
		if( testNumbers(options) ) {
			result = options.a + options.b;
			callback(null, result);
		} else {
			callback('The one of the two numbers was not provided', null);
		}
	},


	// 'subtract' 
	subtract: function (options, callback){
		var result;
		if( testNumbers(options) ) {
			result = options.a - options.b;
			callback(null, result);
		}else{
			callback('The one of the two numbers was not provided', null);
		}
	},


	// 'divide' 
	divide: function(options, callback){
		var result;
		if( testNumbers(options) && isNotZero(options.a) && isNotZero(options.b) ) {
			result = options.a / options.b;
			callback(null, result);
		}else{
			callback('The one of the two numbers was not provided or you try to divide by zero.', null);
		}
	},


	// 'multiple' 
	multiple: function (options, callback){
		var result;
		if( testNumbers(options) ) {
			result = options.a * options.b;
			callback(null, result);
		}else{
			callback('The one of the two numbers was not provided', null);
		}
	}


};



// tests that object has properties a and b and they are both numbers
function testNumbers(options){
	if (options.hasOwnProperty('a') && options.hasOwnProperty('b') && isNum(options.a) && isNum(options.b) ) {
		return true;
	}
	return false;
}


// is object a number
function isNum(n) {
  return (!isNaN(parseFloat(n)) && isFinite(n));
}


// is object a number that is NOT a zero
function isNotZero( obj ){
	if( obj && isNum( obj ) && obj !== 0){
		return true;
	}
	return false;
}




