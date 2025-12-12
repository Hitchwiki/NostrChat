/**
 * Entry point for bundling Nostr libraries
 * This file imports all the libraries needed by NostrChat
 */

// Import NDK main library
// NDK v2 uses default export and named exports
import NDK, { NDKEvent, NDKUser, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';

// Export everything for use in the extension
window.NostrLibs = {
	NDK: NDK,
	NDKEvent: NDKEvent,
	NDKUser: NDKUser,
	NDKPrivateKeySigner: NDKPrivateKeySigner
};

// Also set NDKModule for backward compatibility with existing code
window.NDKModule = window.NostrLibs;

// Dispatch event when libraries are loaded
window.dispatchEvent( new CustomEvent( 'nostrLibsReady', {
	detail: { source: 'bundled' }
} ) );

