<?php
/**
 * Hook handlers for NostrEditPost
 *
 * @file
 * @ingroup Extensions
 */

// DEBUG: Extension file loaded
file_put_contents('/var/log/mediawiki/nostr-file-load.log',
	date('Y-m-d H:i:s') . " - NostrEditPost Hooks.php loaded\n",
	FILE_APPEND | LOCK_EX);

namespace NostrEditPost;

use MediaWiki\Revision\RevisionRecord;
use MediaWiki\User\UserIdentity;
use Title;
use WikiPage;

// Global hook function for testing
function NostrEditPostPageContentSaveComplete($wikiPage, $user, $summary, $flags, $revisionRecord, $editResult) {
	// DEBUG: Write to file to verify hook is called
	file_put_contents('/var/log/mediawiki/nostr-hook-debug.log',
		date('Y-m-d H:i:s') . " - GLOBAL Hook called for page: " .
		$wikiPage->getTitle()->getPrefixedText() . ", user: " . $user->getName() . "\n",
		FILE_APPEND | LOCK_EX);

	global $wgNostrEditPostEnabled, $wgNostrRelays;

	// Create instance for deferred update
	$instance = new Hooks();
	$instance->handlePageContentSaveComplete($wikiPage, $user, $summary, $flags, $revisionRecord, $editResult);
}

// Debug: Write when extension loads
file_put_contents('/var/log/mediawiki/nostr-extension-load.log',
	date('Y-m-d H:i:s') . " - NostrEditPost extension loaded\n",
	FILE_APPEND | LOCK_EX);

class Hooks {
	/**
	 * Hook handler for PageContentSaveComplete
	 *
	 * @param WikiPage $wikiPage
	 * @param UserIdentity $user
	 * @param string $summary
	 * @param int $flags
	 * @param RevisionRecord $revisionRecord
	 * @param \MediaWiki\Storage\EditResult $editResult
	 * @return bool|void
	 */
	public function onPageContentSaveComplete(
		$wikiPage,
		$user,
		$summary,
		$flags,
		$revisionRecord,
		$editResult
	) {
		// DEBUG: Write to file to verify hook is called
		file_put_contents('/var/log/mediawiki/nostr-hook-debug.log',
			date('Y-m-d H:i:s') . " - Hook called for page: " .
			$wikiPage->getTitle()->getPrefixedText() . ", user: " . $user->getName() . "\n",
			FILE_APPEND | LOCK_EX);

		global $wgNostrEditPostEnabled, $wgNostrRelays;
		
		// Debug: Write to file to verify hook is called (with error handling)
		try {
			$pageTitle = $wikiPage->getTitle() ? $wikiPage->getTitle()->getPrefixedText() : 'unknown';
			$debugFile = '/var/log/mediawiki/nostr-editpost-debug.log';
			$debugMsg = date('Y-m-d H:i:s') . " - Hook called for page: $pageTitle, user: " . $user->getName() . 
				", enabled: " . var_export( $wgNostrEditPostEnabled, true ) . 
				", relays: " . var_export( is_array( $wgNostrRelays ), true ) . PHP_EOL;
			file_put_contents( $debugFile, $debugMsg, FILE_APPEND | LOCK_EX );
		} catch ( \Exception $e ) {
			// Silently fail - we don't want to break page saves
		}
		
		// Create instance for deferred update
		$instance = new self();
		$instance->handlePageContentSaveComplete( $wikiPage, $user, $summary, $flags, $revisionRecord, $editResult );
		
		return true;
	}
	
	/**
	 * Instance method to handle the hook logic
	 */
	private function handlePageContentSaveComplete(
		$wikiPage,
		$user,
		$summary,
		$flags,
		$revisionRecord,
		$editResult
	) {
		global $wgNostrEditPostEnabled, $wgNostrRelays;
		
		$logger = \MediaWiki\Logger\LoggerFactory::getInstance( 'NostrEditPost' );
		$logger->info( 'NostrEditPost hook called', [
			'enabled' => $wgNostrEditPostEnabled,
			'relays_configured' => is_array( $wgNostrRelays ) && count( $wgNostrRelays ) > 0
		] );

		// Check if extension is enabled
		if ( !$wgNostrEditPostEnabled ) {
			$logger->info( 'NostrEditPost disabled, skipping' );
			return;
		}

		// Check if relays are configured
		if ( empty( $wgNostrRelays ) || !is_array( $wgNostrRelays ) ) {
			$logger->warning( 'NostrEditPost: No relays configured' );
			return;
		}

		// Build the note content
		$title = $wikiPage->getTitle();
		$pageTitle = $title->getPrefixedText();
		$pageUrl = $title->getFullURL();
		$diffUrl = $title->getFullURL( [
			'diff' => $revisionRecord->getId(),
			'oldid' => 'prev'
		] );

		// Get username
		$username = $user->getName();
		
		// Format: 📝 Username edited page 📄 #channel
		// Example: 📝 Guaka edited hitchwiki.org/en/Hitchwiki:About 📄 #hitchwiki
		$content = "📝 {$username} edited {$pageUrl} 📄";
		
		// Add summary if provided
		if ( $summary ) {
			$content .= " - {$summary}";
		}
		
		// Add diff link
		$content .= " {$diffUrl}";

		// Get channel from NostrChat config (default to 'hitchwiki')
		// This must match the channel NostrChat is listening to
		global $wgNostrChatChannel;
		$channel = $wgNostrChatChannel ?? 'hitchwiki';

		$logger->info( 'Preparing to post edit to Nostr', [
			'content' => substr( $content, 0, 100 ),
			'channel' => $channel,
			'username' => $username,
			'page' => $pageTitle
		] );

		// Post to Nostr (deferred to avoid blocking the save)
		// Include the channel tag so NostrChat can filter it, plus 'hitchhiking' hashtag
		\MediaWiki\DeferredUpdates::addCallableUpdate( function() use ( $content, $channel, $logger ) {
			global $wgNostrNsec, $wgNostrRelays;
			$logger->info( 'Deferred update running, posting to Nostr', [
				'relays' => $wgNostrRelays,
				'nsec_set' => !empty( $wgNostrNsec )
			] );
			try {
				$client = new NostrClient( $wgNostrRelays );
				$tags = [ 't' => [ $channel, 'hitchhiking' ] ];
				$logger->info( 'Calling publishNote', [ 'tags' => $tags ] );
				$result = $client->publishNote( $content, $wgNostrNsec, $tags );
				if ( !$result ) {
					$logger->warning( 'Failed to publish edit to Nostr relays' );
				} else {
					$logger->info( 'Successfully published edit to Nostr' );
				}
			} catch ( \Exception $e ) {
				$logger->error( 'Exception publishing to Nostr: {message}', [
					'message' => $e->getMessage(),
					'exception' => $e,
					'trace' => $e->getTraceAsString()
				] );
			}
		} );

		return true;
	}
}

