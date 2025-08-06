document.addEventListener('DOMContentLoaded', () => {
    const typingSpeed = document.getElementById('typing-speed');
    const minDelay = document.getElementById('min-delay');
    const maxDelay = document.getElementById('max-delay');
    const save = document.getElementById('save');
    const reset = document.getElementById('reset');
    const status = document.getElementById('status');
    const snippetName = document.getElementById('snippet-name');
    const newSnippet = document.getElementById('new-snippet');
    const addSnippet = document.getElementById('add-snippet');
    const snippetList = document.getElementById('snippet-list');
    const deleteAllSnippets = document.getElementById('delete-all-snippets');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    // Modal elements
    const modal = document.getElementById('confirmation-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalCancel = document.getElementById('modal-cancel');
    const modalConfirm = document.getElementById('modal-confirm');

    const defaultSettings = {
        typingSpeed: 120,
        minTypingSpeed: 50,
        maxTypingSpeed: 200,
        snippets: [],
        theme: 'light'
    };

    // Theme Management
    const initTheme = () => {
        chrome.storage.sync.get({ theme: 'light' }, (items) => {
            setTheme(items.theme);
        });
    };

    const setTheme = (theme) => {
        document.body.setAttribute('data-theme', theme);
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        chrome.storage.sync.set({ theme });
    };

    const toggleTheme = () => {
        chrome.storage.sync.get({ theme: 'light' }, (items) => {
            const newTheme = items.theme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            showMessage(`Switched to ${newTheme} theme`, 'success');
        });
    };

    // Custom confirmation modal
    const showConfirmation = (title, message, onConfirm, confirmText = 'Delete') => {
        return new Promise((resolve) => {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            modalConfirm.textContent = confirmText;
            
            modal.classList.add('show');
            
            const handleConfirm = () => {
                modal.classList.remove('show');
                cleanup();
                resolve(true);
            };
            
            const handleCancel = () => {
                modal.classList.remove('show');
                cleanup();
                resolve(false);
            };
            
            const cleanup = () => {
                modalConfirm.removeEventListener('click', handleConfirm);
                modalCancel.removeEventListener('click', handleCancel);
                modal.removeEventListener('click', handleBackdropClick);
            };
            
            const handleBackdropClick = (e) => {
                if (e.target === modal) {
                    handleCancel();
                }
            };
            
            modalConfirm.addEventListener('click', handleConfirm);
            modalCancel.addEventListener('click', handleCancel);
            modal.addEventListener('click', handleBackdropClick);
        });
    };

    const updateSliderLabel = (slider, labelId) => {
        const label = document.getElementById(labelId);
        if (label) {
            label.textContent = slider.value;
        }
    };

    typingSpeed.addEventListener('input', () => updateSliderLabel(typingSpeed, 'typing-speed-label'));
    minDelay.addEventListener('input', () => updateSliderLabel(minDelay, 'min-delay-label'));
    maxDelay.addEventListener('input', () => updateSliderLabel(maxDelay, 'max-delay-label'));

    const restoreOptions = () => {
        chrome.storage.sync.get(defaultSettings, (items) => {
            typingSpeed.value = items.typingSpeed;
            minDelay.value = items.minTypingSpeed;
            maxDelay.value = items.maxTypingSpeed;
            updateSliderLabel(typingSpeed, 'typing-speed-label');
            updateSliderLabel(minDelay, 'min-delay-label');
            updateSliderLabel(maxDelay, 'max-delay-label');
            loadSnippets(items.snippets);
        });
    };

    const loadSnippets = (snippets) => {
        snippetList.innerHTML = '';
        // Show all snippets in popup
        snippets.forEach((snippet, index) => {
            if (snippet && typeof snippet.name === 'string' && typeof snippet.content === 'string') {
                const li = document.createElement('li');
                li.className = 'snippet-item-compact';
                
                const preview = snippet.content.length > 30 
                    ? snippet.content.substring(0, 30) + '...'
                    : snippet.content;
                
                li.innerHTML = `
                    <div class="snippet-info-compact">
                        <div class="snippet-name-compact">${snippet.name}</div>
                        <div class="snippet-preview">${preview}</div>
                    </div>
                    <div class="snippet-actions-compact">
                        <button class="btn-snippet" data-index="${index}" data-action="delete" title="Delete">🗑️</button>
                    </div>
                `;
                snippetList.appendChild(li);
            }
        });

        // Show message if no snippets
        if (snippets.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = '<div style="color: rgba(255,255,255,0.6); font-size: 12px; text-align: center; padding: 20px;">No snippets yet</div>';
            snippetList.appendChild(li);
        }
    };

    const showMessage = (message, type = 'success') => {
        status.textContent = message;
        status.className = `status-toast ${type} show`;
        setTimeout(() => {
            status.classList.remove('show');
        }, 3000);
    };

    const saveOptions = () => {
        const options = {
            typingSpeed: parseInt(typingSpeed.value, 10),
            minTypingSpeed: parseInt(minDelay.value, 10),
            maxTypingSpeed: parseInt(maxDelay.value, 10)
        };
        chrome.storage.sync.set(options, () => {
            showMessage('Settings saved!', 'success');
            chrome.runtime.sendMessage({ command: 'update-menu' }, (response) => {
                if (chrome.runtime.lastError) {
                    console.warn('Message failed:', chrome.runtime.lastError.message);
                }
            });
        });
    };

    const resetOptions = () => {
        typingSpeed.value = defaultSettings.typingSpeed;
        minDelay.value = defaultSettings.minTypingSpeed;
        maxDelay.value = defaultSettings.maxTypingSpeed;
        updateSliderLabel(typingSpeed, 'typing-speed-label');
        updateSliderLabel(minDelay, 'min-delay-label');
        updateSliderLabel(maxDelay, 'max-delay-label');
        showMessage('Settings reset to defaults!', 'success');
    };

    // Event Listeners
    save.addEventListener('click', saveOptions);
    reset.addEventListener('click', resetOptions);
    themeToggle.addEventListener('click', toggleTheme);

    // Add snippet functionality
    addSnippet.addEventListener('click', () => {
        const name = snippetName.value.trim();
        const content = newSnippet.value.trim();
        if (name && content) {
            chrome.storage.sync.get({ snippets: [] }, (items) => {
                const snippets = items.snippets;
                if (typeof name === 'string' && typeof content === 'string') {
                    snippets.push({ name, content });
                    chrome.storage.sync.set({ snippets }, () => {
                        snippetName.value = '';
                        newSnippet.value = '';
                        restoreOptions();
                        chrome.runtime.sendMessage({ command: 'update-menu' }, (response) => {
                            if (chrome.runtime.lastError) {
                                console.warn('Message failed:', chrome.runtime.lastError.message);
                            }
                        });
                        showMessage('Snippet added!', 'success');
                    });
                } else {
                    console.error("Invalid snippet structure:", { name, content });
                }
            });
        } else {
            showMessage('Name and content required!', 'error');
        }
    });

    // Handle snippet actions
    snippetList.addEventListener('click', async (e) => {
        const index = e.target.dataset.index;
        const action = e.target.dataset.action;
        
        if (action === 'delete' && index !== undefined) {
            chrome.storage.sync.get({ snippets: [] }, async (items) => {
                const snippets = items.snippets;
                const snippet = snippets[index];
                if (snippet) {
                    const confirmed = await showConfirmation(
                        '🗑️ Delete Snippet',
                        `Delete snippet "${snippet.name}"?\n\nThis action cannot be undone.`,
                        null,
                        'Delete'
                    );
                    
                    if (confirmed) {
                        snippets.splice(index, 1);
                        chrome.storage.sync.set({ snippets }, () => {
                            restoreOptions();
                            chrome.runtime.sendMessage({ command: 'update-menu' }, (response) => {
                                if (chrome.runtime.lastError) {
                                    console.warn('Message failed:', chrome.runtime.lastError.message);
                                }
                            });
                            showMessage('Snippet deleted!', 'success');
                        });
                    }
                }
            });
        }
    });

    // Clear all snippets functionality
    deleteAllSnippets.addEventListener('click', async () => {
        chrome.storage.sync.get({ snippets: [] }, async (items) => {
            const snippetCount = items.snippets.length;
            if (snippetCount === 0) {
                showMessage('No snippets to delete!', 'error');
                return;
            }
            
            const snippetList = items.snippets.map(s => '• ' + s.name).slice(0, 5).join('\n');
            const overflowText = snippetCount > 5 ? `\n• ... and ${snippetCount - 5} more` : '';
            
            const confirmMessage = `Delete all ${snippetCount} snippet${snippetCount > 1 ? 's' : ''}?\n\nThis will permanently remove:\n${snippetList}${overflowText}\n\nThis action cannot be undone.`;
            
            const confirmed = await showConfirmation(
                '🗑️ Delete All Snippets',
                confirmMessage,
                null,
                'Delete All'
            );
            
            if (confirmed) {
                chrome.storage.sync.set({ snippets: [] }, () => {
                    restoreOptions();
                    chrome.runtime.sendMessage({ command: 'update-menu' }, (response) => {
                        if (chrome.runtime.lastError) {
                            console.warn('Message failed:', chrome.runtime.lastError.message);
                        }
                    });
                    showMessage(`All ${snippetCount} snippets deleted!`, 'success');
                });
            }
        });
    });

    // Initialize
    initTheme();
    restoreOptions();
});
