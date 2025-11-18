# Log Tail Emulator 
## Real-Time Log Viewer for WordPress

**Monitor your WordPress debug logs *as they happen*.**  
Log Tail Emulator brings the power of the `tail -f` command directly into your WordPress admin panel — no terminal needed.

---

## Why Log Tail Emulator?

When developing or debugging WordPress, jumping between FTP, SSH, or hosting panels to view logs is frustrating and slow.  
**Log Tail Emulator** solves this by providing a fast, secure, real-time view of your `debug.log` file right where you work — inside WordPress.

### 🔥 Key Features

- ⏱ **Live Monitoring (tail -f)**  
  Watch new log entries appear instantly without refreshing the page.

- 🔄 **Auto-Refresh Every 1.5 Seconds**  
  Smooth, near–real-time updates for efficient debugging.

- 🔍 **Built-In Log Filtering**  
  Quickly find the messages you’re looking for.

- 📏 **File Size Tracking**  
  See how your log grows as your site runs.

- 🔐 **Secure File Access**  
  Uses WordPress Filesystem API for safe and compatible file operations.

- 🛠 **No SSH Required**  
  View logs directly in wp-admin — perfect for shared hosting or restricted environments.

Perfect for developers, support teams, and anyone maintaining WordPress websites.

---

## 📦 Installation

1. Upload the plugin to  
   `/wp-content/plugins/log-tail-emulator`  
   **or install it directly from the WordPress admin panel.**

2. Activate it via **Plugins**.

3. Make sure debugging is enabled in your `wp-config.php`.
```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
```
4. Go to Tools → Log Tail and enjoy real-time logs without SSH.   

## ❓ FAQ
 - Why am I seeing “No logs found”?

> Your WordPress debug mode might not be enabled. Add to `wp-config.php`:

- The plugin says “File does not exist”

> Ensure that `wp-content/debug.log` exists and is writable.

🕘 Changelog
1.0.8

Security enhancements

Improved sanitization & escaping

Fixed filesystem operation edge cases

1.0.7

Initial release

⬆️ Upgrade Notice
1.0.8

This version includes important security improvements. Updating is strongly recommended.

📄 License

Licensed under GPLv2 or later.