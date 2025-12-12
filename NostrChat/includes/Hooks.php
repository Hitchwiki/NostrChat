<?php
/**
 * Hook handlers for NostrChat
 *
 * @file
 * @ingroup Extensions
 */

use MediaWiki\Config\Config;
use MediaWiki\Output\OutputPage;
use MediaWiki\Skin\Skin;

// Global hook function for testing
function NostrChatBeforePageDisplay( $out, $skin ) {
    $out->addHTML( '<!-- NostrChat global hook called -->' );
}

class NostrChatHooks {
	/**
	 * Add chat widget to sidebar
	 *
	 * @param OutputPage $out
	 * @param Skin $skin
	 * @return void
	 */
	public static function onBeforePageDisplay( $out, $skin ): void {
		// DEBUG: Always add a test element to see if hook is called
		error_log( 'NostrChat hook called for page: ' . $out->getTitle()->getPrefixedText() );
		$out->addHTML( '<!-- NostrChat hook called -->' );
		$config = $out->getConfig();

		// Check if chat is enabled
		$enabled = $config->get( 'NostrChatEnabled' );
		if ( !$enabled ) {
			return;
		}

		// Only add to Vector skin (or compatible skins)
		$skinName = $skin->getSkinName();
		if ( $skinName !== 'vector' && $skinName !== 'vector-2022' ) {
			return;
		}

		// Load module only when enabled and on a compatible skin
		$out->addModules( 'ext.nostrChat' );
		
		// Get user's Nostr pubkey if logged in (null if anonymous or not set)
		$user = $out->getUser();
		$pubkey = null;
		$isLoggedIn = $user->isRegistered();
		
		if ( $isLoggedIn ) {
			$userOptionsLookup = \MediaWiki\MediaWikiServices::getInstance()->getUserOptionsLookup();
			$pubkey = $userOptionsLookup->getOption( $user, 'nostr-pubkey' );
		}
		
		// Pass config to JavaScript via addJsConfigVars (preferred method)
		$channel = $config->get( 'NostrChatChannel' ) ?: 'hitchwiki';
		$relays = $config->get( 'NostrChatRelays' );
		
		// Ensure relays are defined in LocalSettings.php
		if ( !$relays || !is_array( $relays ) || count( $relays ) === 0 ) {
			// Fallback to default relays if not configured
			$relays = [ 'wss://relay.trustroots.org', 'wss://relay.nomadwiki.org' ];
		}
		
		$out->addJsConfigVars( [
			'wgNostrChatChannel' => $channel,
			'wgNostrChatRelays' => $relays,
			'wgNostrChatUserPubkey' => $pubkey, // null if anonymous or not set
			'wgNostrChatUserLoggedIn' => $isLoggedIn
		] );
		
		// Also add config as data attributes in a script tag (for backward compatibility)
		$relaysJson = json_encode( $relays );
		$channelEscaped = htmlspecialchars( $channel, ENT_QUOTES );
		$relaysEscaped = htmlspecialchars( $relaysJson, ENT_QUOTES );
		
		// Add config script tag
		$out->addHTML( 
			'<script type="application/json" id="mw-nostr-chat-config" data-nostr-chat-channel="' . 
			$channelEscaped . '" data-nostr-chat-relays="' . $relaysEscaped . '"></script>'
		);
		
		// Add chat HTML (will be created by JS if not present)
		$out->addHTML( self::getChatHtml( $config ) );
	}
	
	/**
	 * Generate chat widget HTML
	 *
	 * @param Config $config
	 * @return string
	 */
	private static function getChatHtml( Config $config ): string {
		$channel = $config->get( 'NostrChatChannel' );
		$relays = $config->get( 'NostrChatRelays' );
		
		// Ensure relays are defined in LocalSettings.php
		if ( !$relays || !is_array( $relays ) || count( $relays ) === 0 ) {
			// Fallback to default relays if not configured
			$relays = [ 'wss://relay.trustroots.org', 'wss://relay.nomadwiki.org' ];
		}
		
		$relaysJson = json_encode( $relays );
		
		// Escape for HTML attribute
		$channelEscaped = htmlspecialchars( $channel, ENT_QUOTES );
		$relaysEscaped = htmlspecialchars( $relaysJson, ENT_QUOTES );
		
		return <<<HTML
<div id="mw-nostr-chat-trigger" class="mw-nostr-chat-trigger" title="Chat">
	<div class="mw-nostr-chat-icon"></div>
</div>
<div id="mw-nostr-chat-widget" 
     data-channel="{$channelEscaped}" 
     data-relays="{$relaysEscaped}"
     class="mw-nostr-chat-widget-hidden">
</div>
HTML;
	}
}

