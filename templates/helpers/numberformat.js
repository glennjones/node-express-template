// Handlebars helper 
// takes a number 3456 and formats it ie 3,456

module.exports = function(number) {
    if(number){
    	var str = number.toString();

    	// fix to two places if floating point
    	if(str.indexOf('.') > -1){
    		str = number.toFixed(2).toString()
    	}
    	
      	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }else{
      	return number;
    }
}
