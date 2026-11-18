export class WindowInstance {
    constructor(el, manager) {
        this.el = el;
        this.manager = manager;
        this.id = el.id;
        this.title = el.dataset.title || el.querySelector('.title-bar-text')?.textContent?.trim() || 'Window';
        this.icon = el.dataset.icon || 'ico/EXE File.ico';
        this.noTaskbar = el.dataset.noTaskbar === 'true';

        this.titleBar = el.querySelector('.title-bar');
        this.minimizeBtn = el.querySelector('button[aria-label="Minimize"]');
        this.maximizeBtn = el.querySelector('button[aria-label="Maximize"]');
        this.restoreBtn = el.querySelector('button[aria-label="Restore"]');
        this.closeBtn = el.querySelector('button[aria-label="Close"]');

        this.isOpen = !el.classList.contains('is-hidden');
        this.isMinimized = false;
        this.isMaximized = false;

        this.savedBounds = null;
        this.taskbarBtn = null;

        this._initEvents();
    }

    _initEvents() {
        // Focus window when clicking anywhere inside it
        this.el.addEventListener('pointerdown', () => {
            this.manager.focus(this.id);
        });

        // Window control buttons
        if (this.minimizeBtn) {
            this.minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.minimize();
            });
        }

        if (this.maximizeBtn) {
            this.maximizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.maximize();
            });
        }

        if (this.restoreBtn) {
            this.restoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.restore();
            });
        }

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
        }

        // Double click title bar to toggle maximize/restore
        if (this.titleBar && (this.maximizeBtn || this.restoreBtn)) {
            this.titleBar.addEventListener('dblclick', (e) => {
                if (e.target.closest('.title-bar-controls')) return;
                if (this.isMaximized) {
                    this.restore();
                } else {
                    this.maximize();
                }
            });
        }

        // Dragging support via Pointer Events (works on mouse and touch)
        if (this.titleBar) {
            this._initDrag();
        }
    }

    _initDrag() {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let initialLeft = 0;
        let initialTop = 0;

        this.titleBar.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 && e.pointerType === 'mouse') return;
            if (e.target.closest('.title-bar-controls')) return;

            this.manager.focus(this.id);

            // If maximized, restore proportionally when dragging starts
            if (this.isMaximized) {
                return;
            }

            isDragging = true;
            this.titleBar.setPointerCapture(e.pointerId);

            const rect = this.el.getBoundingClientRect();
            // Ensure absolute pixel positioning instead of CSS %/transform
            this.el.style.transform = 'none';
            this.el.style.margin = '0';
            this.el.style.left = `${rect.left}px`;
            this.el.style.top = `${rect.top}px`;

            startX = e.clientX;
            startY = e.clientY;
            initialLeft = rect.left;
            initialTop = rect.top;

            this.el.classList.add('is-dragging');
        });

        this.titleBar.addEventListener('pointermove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            const taskbarHeight = 36;
            const maxTop = window.innerHeight - taskbarHeight - 30;
            const maxLeft = window.innerWidth - 80;

            const newLeft = Math.max(-this.el.offsetWidth + 80, Math.min(maxLeft, initialLeft + dx));
            const newTop = Math.max(0, Math.min(maxTop, initialTop + dy));

            this.el.style.left = `${newLeft}px`;
            this.el.style.top = `${newTop}px`;
        });

        const stopDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;
            this.el.classList.remove('is-dragging');
            if (this.titleBar.hasPointerCapture(e.pointerId)) {
                this.titleBar.releasePointerCapture(e.pointerId);
            }
        };

        this.titleBar.addEventListener('pointerup', stopDrag);
        this.titleBar.addEventListener('pointercancel', stopDrag);
    }

    open() {
        this.isOpen = true;
        this.isMinimized = false;
        this.el.classList.remove('is-hidden', 'is-minimized');
        this.manager.ensureTaskbarButton(this);
        this.manager.focus(this.id);
    }

    minimize() {
        if (!this.isOpen) return;
        this.isMinimized = true;
        this.el.classList.add('is-minimized');
        this.setActiveUI(false);
        this.manager.focusNextAvailable(this.id);
    }

    maximize() {
        if (this.isMaximized) return;

        const rect = this.el.getBoundingClientRect();
        this.savedBounds = {
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: this.el.style.width || '',
            height: this.el.style.height || ''
        };

        this.isMaximized = true;
        this.el.classList.add('is-maximized');
        this.el.style.transform = 'none';
        this.el.style.margin = '0';
        this.el.style.left = '0px';
        this.el.style.top = '0px';
        this.el.style.width = '100vw';
        this.el.style.height = 'calc(100vh - 34px)';

        if (this.maximizeBtn) this.maximizeBtn.style.display = 'none';
        if (this.restoreBtn) this.restoreBtn.style.display = 'inline-block';
    }

    restore() {
        if (!this.isMaximized) return;

        this.isMaximized = false;
        this.el.classList.remove('is-maximized');

        if (this.savedBounds) {
            this.el.style.left = this.savedBounds.left;
            this.el.style.top = this.savedBounds.top;
            this.el.style.width = this.savedBounds.width;
            this.el.style.height = this.savedBounds.height;
        }

        if (this.restoreBtn) this.restoreBtn.style.display = 'none';
        if (this.maximizeBtn) this.maximizeBtn.style.display = 'inline-block';
    }

    close() {
        this.isOpen = false;
        this.isMinimized = false;
        if (this.isMaximized) {
            this.restore();
        }
        this.el.classList.add('is-hidden');
        this.el.classList.remove('is-minimized');
        this.manager.removeTaskbarButton(this);
        this.manager.focusNextAvailable(this.id);
    }

    setActiveUI(active) {
        if (this.titleBar) {
            this.titleBar.classList.toggle('inactive', !active);
        }
        if (this.taskbarBtn) {
            this.taskbarBtn.classList.toggle('active', active && !this.isMinimized && this.isOpen);
        }
    }
}

export class WindowManager {
    constructor(taskbarContainer) {
        this.windows = new Map();
        this.taskbarContainer = taskbarContainer;
        this.highestZ = 20;
        this.activeWindowId = null;
    }

    register(el) {
        const instance = new WindowInstance(el, this);
        this.windows.set(instance.id, instance);

        if (instance.isOpen) {
            this.ensureTaskbarButton(instance);
            instance.el.style.zIndex = ++this.highestZ;
            this.activeWindowId = instance.id;
        } else {
            instance.setActiveUI(false);
        }

        return instance;
    }

    get(id) {
        return this.windows.get(id);
    }

    open(id) {
        const win = this.windows.get(id);
        if (!win) return;
        win.open();
    }

    focus(id) {
        const target = this.windows.get(id);
        if (!target || !target.isOpen || target.isMinimized) return;

        this.activeWindowId = id;
        target.el.style.zIndex = ++this.highestZ;

        for (const [winId, win] of this.windows.entries()) {
            win.setActiveUI(winId === id);
        }
    }

    focusNextAvailable(excludedId) {
        let topWin = null;
        let maxZ = -1;

        for (const [id, win] of this.windows.entries()) {
            if (id !== excludedId && win.isOpen && !win.isMinimized) {
                const z = parseInt(win.el.style.zIndex || '0', 10);
                if (z > maxZ) {
                    maxZ = z;
                    topWin = win;
                }
            }
        }

        if (topWin) {
            this.focus(topWin.id);
        } else {
            this.activeWindowId = null;
            for (const win of this.windows.values()) {
                win.setActiveUI(false);
            }
        }
    }

    toggleFromTaskbar(id) {
        const win = this.windows.get(id);
        if (!win) return;

        if (win.isMinimized) {
            win.open();
        } else if (this.activeWindowId === id) {
            win.minimize();
        } else {
            this.focus(id);
        }
    }

    minimizeAll() {
        const anyVisible = Array.from(this.windows.values()).some(w => w.isOpen && !w.isMinimized);
        if (anyVisible) {
            for (const win of this.windows.values()) {
                if (win.isOpen && !win.isMinimized) {
                    win.minimize();
                }
            }
        } else {
            // If all are already minimized, restore open ones
            for (const win of this.windows.values()) {
                if (win.isOpen && win.isMinimized) {
                    win.open();
                }
            }
        }
    }

    ensureTaskbarButton(win) {
        if (win.noTaskbar || !this.taskbarContainer) return;
        if (win.taskbarBtn) return;

        const btn = document.createElement('button');
        btn.className = 'taskbar-window-btn';
        btn.type = 'button';
        btn.innerHTML = `
            <img src="${win.icon}" alt="" width="16" height="16" />
            <span>${win.title}</span>
        `;
        btn.addEventListener('click', () => {
            this.toggleFromTaskbar(win.id);
        });

        this.taskbarContainer.appendChild(btn);
        win.taskbarBtn = btn;
    }

    removeTaskbarButton(win) {
        if (win.taskbarBtn) {
            win.taskbarBtn.remove();
            win.taskbarBtn = null;
        }
    }
}
