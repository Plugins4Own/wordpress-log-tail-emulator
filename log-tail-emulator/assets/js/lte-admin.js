(function($) {
    'use strict';
    
    class LogTailEmulator {
        constructor() {
            this.lastSize = parseInt(lte_ajax.initial_size) || 0;
            this.currentFilter = '';
            
            this.init();
        }
        
        init() {
            // Znajdź elementy DOM
            this.logDiv = document.getElementById('log-view');
            this.filterInput = document.getElementById('lte-filter');
            this.clearBtn = document.getElementById('lte-clear');
            this.fileSizeSpan = document.getElementById('lte-file-size');
            this.fileUpdatedSpan = document.getElementById('lte-file-updated');
            
            // Sprawdź tylko wymagane elementy (logDiv jest absolutnie wymagany)
            if (!this.logDiv) {
                console.error('LTE: Required element #log-view not found!');
                return;
            }
            
            console.log('LTE: Found elements:', {
                logDiv: !!this.logDiv,
                filterInput: !!this.filterInput,
                clearBtn: !!this.clearBtn,
                fileSizeSpan: !!this.fileSizeSpan,
                fileUpdatedSpan: !!this.fileUpdatedSpan
            });
            
            this.logDiv.style.whiteSpace = 'pre-wrap';
            
            // Event listeners tylko jeśli elementy istnieją
            if (this.filterInput) {
                this.filterInput.addEventListener('input', () => {
                    this.currentFilter = this.filterInput.value.trim();
                    this.filterLogs(this.currentFilter);
                });
            }
            
            if (this.clearBtn) {
                this.clearBtn.addEventListener('click', () => {
                    if (this.filterInput) {
                        this.filterInput.value = '';
                    }
                    this.currentFilter = '';
                    this.filterLogs('');
                });
            }
            
            console.log('LTE JS initialized, initial last_size:', this.lastSize);
            
            // Start polling
            this.startPolling();
        }
        
        formatFileSize(bytes) {
            if (bytes === 0) return '0 B';
            
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        updateFileSizeDisplay(newSize) {
            if (!this.fileSizeSpan) return;
            
            const currentText = this.fileSizeSpan.textContent;
            const newText = this.formatFileSize(newSize);
            
            // Update only if changed
            if (currentText !== newText) {
                this.fileSizeSpan.textContent = newText;
                
                // Show "updated" indicator with animation
                if (this.fileUpdatedSpan) {
                    this.fileUpdatedSpan.style.display = 'inline';
                    this.fileSizeSpan.classList.add('lte-update-flash');
                    
                    // Remove animation class after animation completes
                    setTimeout(() => {
                        this.fileSizeSpan.classList.remove('lte-update-flash');
                    }, 1000);
                    
                    // Hide "updated" after 3 seconds
                    setTimeout(() => {
                        this.fileUpdatedSpan.style.display = 'none';
                    }, 3000);
                }
            }
        }
        
        filterLogs(pattern) {
            if (!pattern) {
                // Remove any hidden spans if they exist
                this.logDiv.innerHTML = this.logDiv.textContent.replace(/<span class="lte-hidden">.*?<\/span>/g, '');
                this.logDiv.scrollTop = this.logDiv.scrollHeight;
                return;
            }

            const lines = this.logDiv.textContent.split('\n');
            let filteredHtml = '';
            lines.forEach(line => {
                const trimmedLine = line.trim();
                if (trimmedLine === '' || !line.toLowerCase().includes(pattern.toLowerCase())) {
                    return;
                }
                filteredHtml += line + '\n';
            });
            this.logDiv.innerHTML = filteredHtml;
            this.logDiv.scrollTop = this.logDiv.scrollHeight;
        }
        
        fetchLogs() {
            console.log('LTE: Fetch start, last_size:', this.lastSize);
            
            $.post(lte_ajax.ajax_url, {
                action: 'log_tail_emulator',
                last_size: this.lastSize,
                nonce: lte_ajax.nonce
            }).done((response) => {
                if (response.success && response.data) {
                    const data = response.data;
                    
                    // Update file size display
                    this.updateFileSizeDisplay(data.size);
                    
                    if (data.chunk && data.chunk.length > 0) {
                        console.log('LTE: Adding chunk, length:', data.chunk.length);
                        this.logDiv.textContent += data.chunk;
                        this.logDiv.scrollTop = this.logDiv.scrollHeight;
                        
                        if (this.currentFilter) {
                            this.filterLogs(this.currentFilter);
                        }
                    } else if (data.size === 0) {
                        this.logDiv.textContent += 'File empty.\n';
                    }
                    this.lastSize = data.size || this.lastSize;
                    console.log('LTE: New last_size:', this.lastSize);
                } else {
                    console.error('LTE: AJAX error:', response);
                }
            }).fail((xhr, status, error) => {
                console.error('LTE: AJAX fail:', status, error, xhr.responseText);
                this.logDiv.textContent += 'Error: ' + status + '\n';
            });
        }
        
        startPolling() {
            // First call immediately
            this.fetchLogs();
            
            // Set interval
            setInterval(() => {
                this.fetchLogs();
            }, 1500);
        }
    }
    
    // Initialize when DOM is ready
    $(document).ready(() => {
        console.log('LTE: DOM ready, initializing...');
        new LogTailEmulator();
    });
    
})(jQuery);