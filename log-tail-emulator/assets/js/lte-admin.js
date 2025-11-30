(function($) {
    'use strict';

    class LogTailEmulator {
        constructor() {
            this.lastSize = parseInt(lte_ajax.initial_size) || 0;
            this.currentFilter = '';
            this.isPaused = false;
            this.pollInterval = null; // przechowujemy ID intervala

            this.init();
        }

        init() {
            // Elementy DOM
            this.logDiv         = document.getElementById('log-view');
            this.filterInput   = document.getElementById('lte-filter');
            this.clearBtn      = document.getElementById('lte-clear');
            this.pauseBtn      = document.getElementById('lte-pause');     // NOWY
            this.fileSizeSpan  = document.getElementById('lte-file-size');
            this.fileUpdatedSpan = document.getElementById('lte-file-updated');

            if (!this.logDiv) {
                console.error('LTE: Required element #log-view not found!');
                return;
            }

            this.logDiv.style.whiteSpace = 'pre-wrap';

            // Eventy
            if (this.filterInput) {
                this.filterInput.addEventListener('input', () => {
                    this.currentFilter = this.filterInput.value.trim();
                    this.filterLogs();
                });
            }

            if (this.clearBtn) {
                this.clearBtn.addEventListener('click', () => {
                    if (this.filterInput) this.filterInput.value = '';
                    this.currentFilter = '';
                    this.filterLogs();
                });
            }

            // NOWY: Obsługa przycisku Pause / Resume
            if (this.pauseBtn) {
                this.pauseBtn.textContent = 'Pause'; // domyślny tekst
                this.pauseBtn.addEventListener('click', () => {
                    this.togglePause();
                });
            }

            console.log('LTE: Initialized. Starting live tail...');
            this.startPolling();
        }

        // Przełączanie pauzy
        togglePause() {
            this.isPaused = !this.isPaused;

            if (this.isPaused) {
                this.pauseBtn.textContent = 'Resume';
                this.pauseBtn.classList.add('paused');
                if (this.pollInterval) {
                    clearInterval(this.pollInterval);
                    this.pollInterval = null;
                }
                console.log('LTE: Paused');
            } else {
                this.pauseBtn.textContent = 'Pause';
                this.pauseBtn.classList.remove('paused');
                this.startPolling(); // wznowienie
                console.log('LTE: Resumed');
            }
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

            const newText = this.formatFileSize(newSize);
            if (this.fileSizeSpan.textContent !== newText) {
                this.fileSizeSpan.textContent = newText;

                if (this.fileUpdatedSpan) {
                    this.fileUpdatedSpan.style.display = 'inline';
                    this.fileSizeSpan.classList.add('lte-update-flash');
                    setTimeout(() => this.fileSizeSpan.classList.remove('lte-update-flash'), 1000);
                    setTimeout(() => this.fileUpdatedSpan.style.display = 'none', 3000);
                }
            }
        }

        filterLogs() {
            if (!this.currentFilter) {
                // Przywróć pełny tekst (bez ukrytych spanów)
                this.logDiv.innerHTML = this.logDiv.textContent;
                this.logDiv.scrollTop = this.logDiv.scrollHeight;
                return;
            }

            const lines = this.logDiv.textContent.split('\n');
            let html = '';
            lines.forEach(line => {
                if (line.trim() === '') return; // pomijamy puste linie
                if (line.toLowerCase().includes(this.currentFilter.toLowerCase())) {
                    html += line + '\n';
                }
            });
            this.logDiv.innerHTML = html;
            this.logDiv.scrollTop = this.logDiv.scrollHeight;
        }

        fetchLogs() {
            if (this.isPaused) return; // nie pobieraj, gdy zapauzowane

            console.log('LTE: Fetching... last_size =', this.lastSize);

            $.post(lte_ajax.ajax_url, {
                action: 'log_tail_emulator',
                last_size: this.lastSize,
                nonce: lte_ajax.nonce
            }).done((response) => {
                if (!response.success || !response.data) {
                    console.error('LTE: Bad response', response);
                    return;
                }

                const data = response.data;

                // Aktualizacja rozmiaru pliku
                this.updateFileSizeDisplay(data.size);

                // Dodanie nowego kawałka logów
                if (data.chunk && data.chunk.length > 0) {
                    console.log('LTE: +', data.chunk.length, 'bytes');
                    this.logDiv.textContent += data.chunk;

                    // Reaplikuj filtr jeśli aktywny
                    if (this.currentFilter) {
                        this.filterLogs();
                    }

                    // Auto-scroll
                    this.logDiv.scrollTop = this.logDiv.scrollHeight;
                }

                // Zapamiętaj aktualny rozmiar pliku
                this.lastSize = data.size;
            }).fail((xhr, status, err) => {
                console.error('LTE: AJAX error:', status, err);
                this.logDiv.textContent += '\n[Connection error – retrying...]\n';
            });
        }

        startPolling() {
            // Natychmiastowe pierwsze pobranie
            this.fetchLogs();

            // Potem co 1.5s
            this.pollInterval = setInterval(() => {
                this.fetchLogs();
            }, 1500);
        }
    }

    // Inicjalizacja po załadowaniu DOM
    $(document).ready(() => {
        console.log('LTE: Starting Log Tail Emulator...');
        new LogTailEmulator();
    });
    
})(jQuery);