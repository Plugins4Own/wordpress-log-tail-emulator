=== Log Tail Emulator ===
Contributors: pawelsikora
Tags: debug, logs, tail, monitoring
Requires at least: 5.0
Tested up to: 6.8
Stable tag: 1.1.2
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: log-tail-emulator

Emulates tail -f function for debug.log file in WordPress admin panel.

== Description ==

Log Tail Emulator is a WordPress plugin that provides real-time monitoring of your debug.log file directly from the WordPress admin panel. It emulates the `tail -f` command functionality, allowing you to watch log entries as they are being written.

= Features =

* Real-time log monitoring
* Auto-refresh every 1.5 seconds
* Log filtering capability
* File size tracking
* Secure file operations using WordPress Filesystem API

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/log-tail-emulator` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Ensure WP_DEBUG is enabled in your wp-config.php file
4. Navigate to Tools > Log Tail to view your debug logs

== Frequently Asked Questions ==

= Why do I see "No logs found"? =

Make sure WP_DEBUG is enabled in your wp-config.php file:
`define('WP_DEBUG', true);`
`define('WP_DEBUG_LOG', true);`

= The plugin shows "File does not exist" =

The plugin looks for debug.log in your wp-content directory. Make sure the file exists and is writable.

== Changelog ==

= 1.0.8 =
* Security improvements
* Added proper sanitization and escaping
* Fixed filesystem operations

= 1.0.7 =
* Initial release

== Upgrade Notice ==

= 1.0.8 =
Security release - recommended update for all users.