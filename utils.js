// Copyright 2020 Jason Kohles - https://github.com/jasonk/pogo-friend-maker
const got = require( 'got' ),
  fs = require( 'fs' ),
  path = require( 'path' ),
  qrcode = require( 'qrcode' ),
  split = require( 'split2' );

const didfile = path.resolve( __dirname, 'did.txt' );
const newfile = path.resolve( __dirname, 'new.txt' );
const code_re = /\d\d\d\d\s*\d\d\d\d\s*\d\d\d\d/ug;

const did_codes = fs.existsSync( didfile )
  ? fs.readFileSync( didfile, 'utf8' ).trim().split( '\n' )
  : [];
const new_codes = fs.existsSync( newfile )
  ? fs.readFileSync( newfile, 'utf8' ).trim().split( '\n' )
  : [];

const total = new_codes.length;
const did_more = fs.createWriteStream( didfile, { flags : 'a' } );

let new_fh;
let did_fh;
/**
 * Record that a code that has been processed by adding it to the
 * `did.txt` file.
 */
function did( code ) {
  if ( ! did_fh ) did_fh = fs.createWriteStream( didfile, { flags : 'a' } );
  did_fh.write( code + '\n' );
  did_codes.push( code );
}

/**
 * This function scans a block of text looking for friend codes.  For
 * each one that is found it is normalized (all the non-numeric
 * elements removed), validated (it's skipped if it isn't 12-digits
 * long), and check against the "already saw" list in `did.txt`.  If
 * it's valid, and wasn't already seen, then we add it to the
 * `new.txt` file.
 */
function scan( text ) {
  if ( ! new_fh ) new_fh = fs.createWriteStream( newfile, { flags : 'a' } );

  for ( const match of text.matchAll( code_re ) ) {
    const code = match[0].replace( /\D/gu, '' );
    if ( code.length === 12 && ! did_codes.includes( code ) ) {
      new_fh.write( code + '\n' );
    }
  }
}

/**
 * This function takes a URL and a RegExp and first retrieves the web
 * page from that URL, then extracts all the chunks that match the
 * regex.  It then passes each chunk to the `scan` function to check
 * it for friend codes (so the regex you provide for extracting
 * doesn't have to match a friend code exactly, it just needs to
 * provide a chunk that may or may not contain some number of friend
 * codes).  If the regex has match groups (sections wrapped in
 * parentheses) then each extracted match group will be separately
 * scanned for friend codes.  If there are no match groups, then the
 * whole chunk that matches will be scanned.
 */
async function scan_url( url, regex, opts ) {
  const page = await got( url, opts );
  for ( const match of text.matchAll( regex ) ) {
    if ( match.length > 1 ) {
      match.slice( 1 ).forEach( scan );
    } else {
      scan( match[0] );
    }
  }
}

function keypress() {
  process.stdin.setRawMode( true );
  console.log( ' --- Press any key to continue ---' );
  console.log( '   ( Press control-C to quit)' );
  return new Promise( resolve => process.stdin.once( 'data', ( data ) => {
    data = [ ...data ];
    if ( data.length > 0 && data[0] === 3) {
      console.log( '^C' );
      process.exit( 1 );
    }
    process.stdin.setRawMode( false );
    resolve();
  } ) );
}

module.exports = {
  scan, scan_url, keypress, code_re, did_codes, new_codes, did,
};
