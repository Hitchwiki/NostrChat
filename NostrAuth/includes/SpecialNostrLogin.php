<?php
/**
 * Special page for Nostr login
 *
 * @file
 * @ingroup Extensions
 */

namespace NostrAuth;

use SpecialPage;
use Html;
use MediaWiki\MediaWikiServices;

class SpecialNostrLogin extends SpecialPage {
	public function __construct() {
		parent::__construct( 'NostrLogin' );
	}

	/**
	 * @param string|null $subPage
	 */
	public function execute( $subPage ) {
		global $wgNostrAuthEnabled;

		$this->setHeaders();
		$this->outputHeader();

		if ( !$wgNostrAuthEnabled ) {
			$this->getOutput()->addWikiTextAsInterface( 'Nostr authentication is disabled.' );
			return;
		}

		$request = $this->getRequest();

		// Handle authentication
		if ( $request->wasPosted() && $request->getVal( 'action' ) === 'login' ) {
			$this->handleLogin();
			return;
		}

		// Show login form
		$this->showLoginForm();
	}

	/**
	 * Show the login form
	 */
	private function showLoginForm() {
		$out = $this->getOutput();
		$out->addModules( 'ext.nostrAuth' );

		$out->addHTML( Html::openElement( 'div', [ 'id' => 'nostr-login-form' ] ) );
		$out->addHTML( Html::element( 'h2', [], $this->msg( 'nostrauth-login-title' )->text() ) );
		$out->addHTML( Html::element( 'p', [], $this->msg( 'nostrauth-login-instructions' )->text() ) );

		$form = Html::openElement( 'form', [
			'method' => 'POST',
			'action' => $this->getPageTitle()->getLocalURL()
		] );
		$form .= Html::hidden( 'action', 'login' );
		$form .= Html::hidden( 'token', $this->getUser()->getEditToken() );
		$form .= Html::hidden( 'npub', '', [ 'id' => 'nostr-npub' ] );
		$form .= Html::hidden( 'challenge', '', [ 'id' => 'nostr-challenge' ] );
		$form .= Html::hidden( 'signature', '', [ 'id' => 'nostr-signature' ] );
		$form .= Html::hidden( 'signedEvent', '', [ 'id' => 'nostr-signed-event' ] );
		$form .= Html::submitButton(
			$this->msg( 'nostrauth-login-button' )->text(),
			[ 'id' => 'nostr-login-button', 'class' => 'mw-htmlform-submit' ]
		);
		$form .= Html::closeElement( 'form' );
		$out->addHTML( $form );
		$out->addHTML( Html::closeElement( 'div' ) );
	}

	/**
	 * Handle login request
	 */
	private function handleLogin() {
		$request = $this->getRequest();
		$npub = $request->getVal( 'npub' );
		$challenge = $request->getVal( 'challenge' );
		$signedEvent = $request->getVal( 'signedEvent' );

		if ( !$npub || !$challenge || !$signedEvent ) {
			$this->getOutput()->addWikiTextAsInterface( 'Missing authentication data.' );
			return;
		}

		// Verify token
		if ( !$this->getUser()->matchEditToken( $request->getVal( 'token' ) ) ) {
			$this->getOutput()->addWikiTextAsInterface( 'Invalid security token.' );
			return;
		}

		$authProvider = new AuthProvider();
		$result = $authProvider->authenticate( $npub, $challenge, $signedEvent );

		if ( $result['success'] ) {
			// Login successful
			$user = $result['user'];
			$user->setCookies( null, null, true );
			$user->saveSettings();
			
			// Set user in session
			$session = $this->getRequest()->getSession();
			$session->setUser( $user );
			$session->save();
			
			$this->getOutput()->redirect( \Title::newMainPage()->getFullURL() );
		} else {
			$this->getOutput()->addWikiTextAsInterface( 'Error: ' . ( $result['error'] ?? 'Authentication failed' ) );
		}
	}

	protected function getGroupName() {
		return 'login';
	}
}

