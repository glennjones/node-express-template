/*
 * Handlers
 */

'use strict';
var maths = require('../lib/maths.js');


module.exports = {

	index: function(req, res){
		res.render('index', {});
	},

	add: function(req, res){
		sumHandler('Add', '+', req, res);	
	},

	subtract: function(req, res){
		sumHandler('Subtract', '-', req, res);
	},

	divide: function(req, res){
		sumHandler('Divide', '/', req, res);
	},

	multiple: function(req, res){
		sumHandler('Multiple', '*', req, res);
	}

};



function sumHandler(title, operator, req, res){

	var options = { 
			title: title, 
			a: 0,
			b: 0,
			sumOperator: operator,
			result: 0,
			error: ''
		};

	if(req.method === 'POST'){

		options.a = (req.body.a)? parseFloat(req.body.a) : 0;
		options.b = (req.body.b)? parseFloat(req.body.b) : 0;

		switch (operator) {
			case '+':
				maths.add(options, function(error, result){
					options.error = error;	
					options.result = result;
				});
				break;
			case '-':
				maths.subtract(options, function(error, result){
					options.error = error;	
					options.result = result;
				});
				break;
			case '/':
				maths.divide(options, function(error, result){
					options.error = error;	
					options.result = result;
				});
				break;
			case '*':
				maths.multiple(options, function(error, result){
					options.error = error;	
					options.result = result;
				});
				break;
		}

		res.render('sum', options);
	}else{
		delete options.results;
		res.render('sum', options);	
	}	
}




