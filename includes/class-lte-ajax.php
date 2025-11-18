<?php
class LTE_Ajax {
    
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
        add_action('wp_ajax_log_tail_emulator', [$this, 'handle_ajax_request']);
    }
    
    public function handle_ajax_request() {
        // Check nonce for security with proper sanitization
        $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
        
        if (!wp_verify_nonce($nonce, 'lte_nonce')) {
            wp_send_json_error('Invalid nonce');
            return;
        }
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Insufficient permissions');
            return;
        }
        
        $last_size = isset($_POST['last_size']) ? intval($_POST['last_size']) : 0;
        
        $result = $this->file_reader->get_file_chunk(LTE_DEBUG_LOG_PATH, $last_size);
        
        wp_send_json_success($result);
    }
}