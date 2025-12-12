# MediaWiki Nostr Extensions

Three MediaWiki extensions to integrate Nostr functionality:

1. **NostrEditPost** - Posts all edits as Nostr kind 1 notes
2. **NostrAuth** - NIP-07 browser extension authentication
3. **NostrNIP5** - Serves NIP-5 verification via .well-known/nostr.json

## Installation

1. Clone or download these extensions to your MediaWiki `extensions/` directory
2. Add to `LocalSettings.php`:

```php
// Shared relay configuration (used by all extensions)
$wgNostrRelays = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    // Add more relays as needed
];

// NostrEditPost Extension
wfLoadExtension( 'NostrEditPost' );
$wgNostrEditPostEnabled = true;
$wgNostrNsec = 'nsec1...'; // Optional: private key for signing events

// NostrAuth Extension
wfLoadExtension( 'NostrAuth' );
$wgNostrAuthEnabled = true;
$wgNostrAllowedNIP5Domains = null; // null = no restriction, or array like ['example.com', 'wiki.org']

// NostrNIP5 Extension
wfLoadExtension( 'NostrNIP5' );
$wgNostrNIP5Enabled = true;
```

## Configuration

### Shared Configuration

#### `$wgNostrRelays` (array, required)
Array of Nostr relay URLs. All extensions that need relay access will use this shared configuration.

**Example:**
```php
$wgNostrRelays = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.snort.social'
];
```

**Validation:**
- URLs must start with `wss://` or `ws://`
- Invalid URLs will be logged but won't break the wiki

### NostrEditPost Configuration

#### `$wgNostrEditPostEnabled` (bool, default: false)
Enable or disable posting edits to Nostr.

#### `$wgNostrNsec` (string|null, default: null)
Optional private key (nsec) for signing Nostr events. If not provided, events will be posted unsigned (may be rejected by some relays).

**Security Note:** Store nsec securely. The `LocalSettings.php` file should have restricted permissions (e.g., 600) and not be web-accessible.

### NostrAuth Configuration

#### `$wgNostrAuthEnabled` (bool, default: false)
Enable or disable Nostr authentication.

#### `$wgNostrAllowedNIP5Domains` (array|null, default: null)
Whitelist of allowed NIP-5 domains for authentication. Set to `null` to allow all domains, or provide an array:

```php
$wgNostrAllowedNIP5Domains = ['example.com', 'wiki.org'];
```

### NostrNIP5 Configuration

#### `$wgNostrNIP5Enabled` (bool, default: true)
Enable or disable the NIP-5 verification endpoint.

## Usage

### NostrEditPost

Once enabled, all page edits will automatically be posted to Nostr as kind 1 notes. The note format is:

```
Edit: [Page Title] - [Edit Summary] [Diff URL]
```

### NostrAuth

Users can log in using their Nostr browser extension:

1. Navigate to `Special:NostrLogin`
2. Click "Login with Nostr"
3. Approve the signature request in your Nostr browser extension
4. You'll be logged in and a MediaWiki account will be created if needed

### NostrNIP5

Users can set their Nostr public key (npub) in their user preferences. Once set, the NIP-5 endpoint will be available at:

```
/.well-known/nostr.json?name=[username]
```

This returns JSON in the format:
```json
{
  "names": {
    "username": "hex_pubkey"
  }
}
```

## Requirements

- MediaWiki 1.42+
- PHP 7.4+ (or as required by MediaWiki 1.42)
- Optional: PHP secp256k1 extension for cryptographic operations (recommended for production)

## Dependencies

The extensions use shared utilities in the `NostrUtils/` directory for:
- Bech32 encoding/decoding (npub/nsec <-> hex)
- Event signing and verification
- Cryptographic operations

## Security Considerations

1. **nsec Storage**: The private key (nsec) should be stored securely. Consider using environment variables or encrypted storage instead of `LocalSettings.php` for production deployments.

2. **NIP-5 Verification**: When using domain restrictions, ensure the whitelist is properly configured to prevent unauthorized access.

3. **Challenge Signing**: Authentication challenges use secure random nonces and timestamps to prevent replay attacks.

4. **File Permissions**: Ensure `LocalSettings.php` has restricted permissions (600) and is not web-accessible.

## Troubleshooting

### Events not posting to Nostr

- Check that `$wgNostrRelays` is configured correctly
- Verify relay URLs are accessible
- Check MediaWiki logs for errors
- Ensure nsec is valid if signing is required

### Authentication not working

- Verify the Nostr browser extension is installed and enabled
- Check that `$wgNostrAuthEnabled` is set to `true`
- Review MediaWiki logs for authentication errors
- Ensure NIP-5 domain restrictions are configured correctly if enabled

### NIP-5 endpoint not responding

- Verify `$wgNostrNIP5Enabled` is set to `true`
- Check that users have set their npub in preferences
- Ensure the `.well-known/nostr.json` path is accessible (may require web server configuration)

## License

MIT

