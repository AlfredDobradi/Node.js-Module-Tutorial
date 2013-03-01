var logger = require('./logger.js');

for(var i=0;i<50;i++) {
	if ( i%5 == 0 ) {
		logger.log_message('Az i értéke ' + i,'debug');
	}
}