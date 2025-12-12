<?php
/**
 * Hook handlers for NostrEditPost
 *
 * @file
 * @ingroup Extensions
 */

namespace NostrEditPost;

use MediaWiki\Hook\PageContentSaveCompleteHook;
use MediaWiki\Revision\RevisionRecord;
use MediaWiki\User\UserIdentity;
use Title;
use WikiPage;

class Hooks implements PageContentSaveCompleteHook {
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
		global $wgNostrEditPostEnabled, $wgNostrRelays;

		// Check if extension is enabled
		if ( !$wgNostrEditPostEnabled ) {
			return;
		}

		// Check if relays are configured
		if ( empty( $wgNostrRelays ) || !is_array( $wgNostrRelays ) ) {
			return;
		}

		// Build the note content
		$title = $wikiPage->getTitle();
		$pageTitle = $title->getPrefixedText();
		$diffUrl = $title->getFullURL( [
			'diff' => $revisionRecord->getId(),
			'oldid' => 'prev'
		] );

		$content = "Edit: {$pageTitle}";
		if ( $summary ) {
			$content .= " - {$summary}";
		}
		$content .= " {$diffUrl}";

		// Post to Nostr (deferred to avoid blocking the save)
		\MediaWiki\DeferredUpdates::addCallableUpdate( function() use ( $content ) {
			global $wgNostrNsec, $wgNostrRelays;
			$client = new NostrClient( $wgNostrRelays );
			$client->publishNote( $content, $wgNostrNsec );
		} );

		return true;
	}
}

