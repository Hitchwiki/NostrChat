/**
 * Client-side NIP-07 integration for NostrAuth
 */
( function () {
	'use strict';

	// Check if Nostr extension is available
	if ( typeof window.nostr === 'undefined' ) {
		document.getElementById( 'nostr-login-button' ).disabled = true;
		document.getElementById( 'nostr-login-button' ).textContent = 'Nostr extension not found';
		return;
	}

	document.getElementById( 'nostr-login-button' ).addEventListener( 'click', async function ( e ) {
		e.preventDefault();

		try {
			// Get public key
			const npub = await window.nostr.getPublicKey();
			if ( !npub ) {
				alert( 'Failed to get public key from Nostr extension' );
				return;
			}

			// Generate challenge
			const challenge = 'MediaWiki login: ' + Date.now() + ':' + Math.random().toString( 36 );

			// Create event to sign
			const event = {
				kind: 1,
				content: challenge,
				created_at: Math.floor( Date.now() / 1000 ),
				tags: []
			};

			// Sign event
			const signedEvent = await window.nostr.signEvent( event );
			if ( !signedEvent ) {
				alert( 'Failed to sign event' );
				return;
			}

			// Set form values
			document.getElementById( 'nostr-npub' ).value = npub;
			document.getElementById( 'nostr-challenge' ).value = challenge;
			document.getElementById( 'nostr-signed-event' ).value = JSON.stringify( signedEvent );

			// Submit form
			document.querySelector( 'form' ).submit();
		} catch ( error ) {
			console.error( 'Nostr authentication error:', error );
			alert( 'Authentication failed: ' + error.message );
		}
	} );
}() );

