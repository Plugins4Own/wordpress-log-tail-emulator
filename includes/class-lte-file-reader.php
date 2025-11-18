<?php
class LTE_File_Reader {
    
    private $wp_filesystem;
    
    public function __construct() {
        $this->init_filesystem();
    }
    
    private function init_filesystem() {
        global $wp_filesystem;
        
        if (empty($wp_filesystem)) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            WP_Filesystem();
        }
        
        $this->wp_filesystem = $wp_filesystem;
    }
    
    public function get_tail_chunk($file = null, $max_bytes = LTE_MAX_INITIAL_CHUNK) {
        $file = $file ?: LTE_DEBUG_LOG_PATH;
        
        if (!$this->wp_filesystem->exists($file) || $this->wp_filesystem->size($file) == 0) {
            return '';
        }

        $size = $this->wp_filesystem->size($file);
        $start = max(0, $size - $max_bytes);
        
        $chunk = $this->wp_filesystem->get_contents($file, false, $start, $max_bytes);
        
        if ($start > 0) {
            $chunk = '...\n' . $chunk;
        }
        
        return $chunk;
    }
    
    public function display_last_debug_safe($log_file = null) {
        $log_file = $log_file ?: LTE_DEBUG_LOG_PATH;
        
        if (!$this->wp_filesystem->exists($log_file)) {
            return 'File does not exist.';
        }

        $content = $this->wp_filesystem->get_contents($log_file);
        if ($content === false) {
            return 'File opening error.';
        }

        $lines = explode("\n", $content);
        $lines = array_filter($lines); // Remove empty lines
        
        if (empty($lines)) {
            return 'File is empty.';
        }
        
        $last_line = trim(end($lines));
        return esc_html($last_line);
    }
    
    public function get_file_chunk($file = null, $last_size = 0) {
        $file = $file ?: LTE_DEBUG_LOG_PATH;
        
        if (!$this->wp_filesystem->exists($file)) {
            return ['size' => 0, 'chunk' => ''];
        }

        $current_size = $this->wp_filesystem->size($file);

        if ($current_size < $last_size) {
            $last_size = 0;
        }

        $chunk = '';
        if ($current_size > $last_size) {
            $read_size = $current_size - $last_size;
            if ($read_size > 102400) {
                $read_size = 102400;
            }
            
            $chunk = $this->wp_filesystem->get_contents($file, false, $last_size, $read_size);
        }

        return [
            'size' => $current_size,
            'chunk' => $chunk ?: ''
        ];
    }
    
    public function file_exists($file = null) {
        $file = $file ?: LTE_DEBUG_LOG_PATH;
        return $this->wp_filesystem->exists($file);
    }
    
    public function file_size($file = null) {
        $file = $file ?: LTE_DEBUG_LOG_PATH;
        return $this->wp_filesystem->exists($file) ? $this->wp_filesystem->size($file) : 0;
    }
}