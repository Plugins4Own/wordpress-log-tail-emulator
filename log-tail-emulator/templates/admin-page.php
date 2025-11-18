<div class="wrap">
    <h1><?php echo esc_html__('Log Tail Emulator', 'log-tail-emulator'); ?></h1>
    <p><em><?php echo esc_html__('Auto-refreshes every 1.5s. Check console for debug.', 'log-tail-emulator'); ?></em></p>
    
    <div style="margin-bottom:10px;">
        <input type="text" id="lte-filter" placeholder="<?php echo esc_attr__('Filter logs (e.g., "error" or "PHP")', 'log-tail-emulator'); ?>" style="width:300px;padding:5px;border:1px solid #0f0;background:#111;color:#0f0;">
        <button id="lte-clear" style="margin-left:10px;padding:5px 10px;background:#333;color:#0f0;border:1px solid #0f0;cursor:pointer;"><?php echo esc_html__('Clear', 'log-tail-emulator'); ?></button>
    </div>
    
    <div id="log-view" style="height:500px;overflow-y:scroll;background:#111;color:#0f0;font-family:monospace;padding:10px;border:1px solid #ccc;white-space:pre-wrap;">
        <?php 
        if ($initial_chunk) {
            echo esc_html($initial_chunk);
        } else {
            echo esc_html__('No logs found. Enable WP_DEBUG.', 'log-tail-emulator');
        }
        ?>
    </div>
    
    <div style="margin-top:10px;font-size:12px;color:#666;">
        <strong><?php echo esc_html__('File path:', 'log-tail-emulator'); ?></strong> <?php echo esc_html(LTE_DEBUG_LOG_PATH); ?><br>
        <strong><?php echo esc_html__('File size:', 'log-tail-emulator'); ?></strong> <span id="lte-file-size">
        <?php 
        $file_reader = new LTE_File_Reader();
        if ($file_reader->file_exists()) {
            echo esc_html(size_format($file_reader->file_size()));
        } else {
            echo esc_html__('File does not exist', 'log-tail-emulator');
        }
        ?>
        </span>
        <span id="lte-file-updated" style="margin-left:10px;color:#999;display:none;"><?php echo esc_html__('(updated)', 'log-tail-emulator'); ?></span>
    </div>
</div>

<style>
.lte-hidden { display: none !important; }
#lte-filter:focus { outline: none; box-shadow: 0 0 5px #0f0; }
.lte-update-flash { animation: lteFlash 1s ease-in-out; }
@keyframes lteFlash {
    0% { color: #666; }
    50% { color: #0f0; }
    100% { color: #666; }
}
</style>