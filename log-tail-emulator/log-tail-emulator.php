<?php
/**
 * Plugin Name: Log Tail Emulator
 * Plugin URI:  https://plugins4.own.pl/wordpress/log-tail-emulator
 * Description: Emulates tail -f function for debug.log file in WordPress.
 * Version:     1.1.2
 * Author:      Plugins4.OWN.pl
 * Author URI:  https://plugins4.own.pl
 * License:     GPL-2.0-or-later
 * Icon:        icon.png
 * Text Domain: log-tail-emulator
 */

if (!defined('ABSPATH')) exit;

define('LTE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('LTE_PLUGIN_URL', plugin_dir_url(__FILE__));
define('LTE_MAX_INITIAL_CHUNK', 51200);

// MAIN PATH TO DEBUG LOG FILE - SINGLE SOURCE
define('LTE_DEBUG_LOG_PATH', WP_CONTENT_DIR . '/debug.log');

// Autoloader for classes
spl_autoload_register(function ($class_name) {
    if (strpos($class_name, 'LTE_') === 0) {
        $file = LTE_PLUGIN_DIR . 'includes/class-' . strtolower(str_replace('_', '-', $class_name)) . '.php';
        if (file_exists($file)) {
            require_once $file;
        }
    }
});

// Plugin initialization
add_action('plugins_loaded', function () {
    LTE_Admin::init();
    LTE_Ajax::init();
});