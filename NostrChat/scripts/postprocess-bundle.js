/**
 * Postprocess Rollup bundle to avoid syntax that MediaWiki's ResourceLoader minifier
 * can break (notably binary/octal numeric literals like 0b1010).
 *
 * ResourceLoader has historically had parsers/minifiers that don't fully understand
 * newer JS numeric literal syntaxes and may rewrite `0b...` into `0 b...`, causing
 * `Uncaught SyntaxError: unexpected token: identifier` in the browser.
 *
 * This script rewrites:
 * - 0b[01]+  => decimal
 * - 0o[0-7]+ => decimal
 */

'use strict';

const fs = require( 'fs' );
const path = require( 'path' );

const bundlePath = path.join( __dirname, '..', 'resources', 'lib', 'nostr-libs.bundle.js' );

if ( !fs.existsSync( bundlePath ) ) {
	console.error( `postprocess-bundle: bundle not found at ${bundlePath}` );
	process.exit( 1 );
}

const input = fs.readFileSync( bundlePath, 'utf8' );

function replaceBaseLiterals( source, prefix, radix, allowed ) {
	const re = new RegExp( `\\b0${prefix}[${allowed}]+\\b`, 'g' );
	return source.replace( re, ( m ) => {
		const digits = m.slice( 2 ); // drop 0<prefix>
		// parseInt is safe here: digits are validated by regex
		return String( parseInt( digits, radix ) );
	} );
}

let output = input;
output = replaceBaseLiterals( output, 'b', 2, '01' );
output = replaceBaseLiterals( output, 'o', 8, '0-7' );

if ( output !== input ) {
	fs.writeFileSync( bundlePath, output, 'utf8' );
	console.log( 'postprocess-bundle: rewritten binary/octal numeric literals in bundle' );
} else {
	console.log( 'postprocess-bundle: no binary/octal numeric literals found' );
}


