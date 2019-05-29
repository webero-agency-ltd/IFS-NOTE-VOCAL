	
module.exports = function ( arg ) {
	let obj = {} ;
	for( const i of arg ){
		if ( i.indexOf('--env') !== -1 ) {
			let op = i.replace(new RegExp('--env.','g'), '');
			let ops = op.split('=')
			if ( ops.length > 0 ) {
				obj[ops[0]] = ops[1] ;
			}
		}
	}
	return obj
}