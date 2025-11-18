<?php
class LTE_Admin {
    
    private static $instance = null;
    private $file_reader;
    
    public static function init() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->file_reader = new LTE_File_Reader();
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
    }
    
    public function add_admin_menu() {
        add_menu_page(
            __('Log Tail Emulator', 'log-tail-emulator'),
            __('Log Tail', 'log-tail-emulator'),
            'manage_options',
            'log-tail-emulator',
            [$this, 'render_admin_page'],
            'dashicons-media-text',
            90
        );
    }
    
    public function enqueue_scripts($hook) {
        if ('toplevel_page_log-tail-emulator' !== $hook) {
            return;
        }
        
        wp_enqueue_script('jquery');
        wp_enqueue_script(
            'lte-admin-js',
            LTE_PLUGIN_URL . 'assets/js/lte-admin.js',
            ['jquery'],
            '1.0.8',
            true
        );
        
        // Localize script for AJAX
        $initial_size = $this->file_reader->file_size();
        
        wp_localize_script('lte-admin-js', 'lte_ajax', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('lte_nonce'),
            'initial_size' => $initial_size
        ]);
    }
    
    public function render_admin_page() {
        $initial_chunk = $this->file_reader->get_tail_chunk(LTE_DEBUG_LOG_PATH);
        
        include LTE_PLUGIN_DIR . 'templates/admin-page.php';
    }
}