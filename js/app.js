import { WindowManager } from './window.js';

document.addEventListener('DOMContentLoaded', () => {
    const taskbarList = document.getElementById('taskbar-windows');
    const wm = new WindowManager(taskbarList);

    // Register all windows
    document.querySelectorAll('[data-window]').forEach((el) => {
        wm.register(el);
    });

    // Focus the About Me window initially
    if (wm.get('window-about-me')?.isOpen) {
        wm.focus('window-about-me');
    }

    // --- Desktop Icons (1 click select, double-click or touch tap open) ---
    const desktop = document.getElementById('desktop');
    const desktopIcons = document.querySelectorAll('.desktop-icon');

    const clearIconSelection = () => {
        desktopIcons.forEach((ic) => ic.classList.remove('selected'));
    };

    desktopIcons.forEach((icon) => {
        const targetWindowId = icon.dataset.openWindow;
        const externalUrl = icon.dataset.externalUrl;

        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            clearIconSelection();
            icon.classList.add('selected');
        });

        const triggerIconAction = () => {
            if (targetWindowId) {
                wm.open(targetWindowId);
            } else if (externalUrl) {
                window.open(externalUrl, '_blank', 'noopener');
            }
        };

        icon.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            triggerIconAction();
        });

        // On touch devices, open on single tap
        icon.addEventListener('pointerup', (e) => {
            if (e.pointerType === 'touch') {
                triggerIconAction();
            }
        });

        // Keyboard accessibility (Enter / Space)
        icon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                triggerIconAction();
            }
        });
    });

    if (desktop) {
        desktop.addEventListener('pointerdown', (e) => {
            if (e.target === desktop || e.target.classList.contains('desktop-icons-grid')) {
                clearIconSelection();
            }
        });
    }

    // --- Start Menu ---
    const startBtn = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');

    const closeStartMenu = () => {
        if (!startMenu || !startBtn) return;
        startMenu.classList.add('is-hidden');
        startBtn.classList.remove('active');
        startBtn.setAttribute('aria-expanded', 'false');
    };

    const toggleStartMenu = (e) => {
        e.stopPropagation();
        const isHidden = startMenu.classList.toggle('is-hidden');
        startBtn.classList.toggle('active', !isHidden);
        startBtn.setAttribute('aria-expanded', String(!isHidden));
    };

    if (startBtn && startMenu) {
        startBtn.addEventListener('click', toggleStartMenu);

        document.addEventListener('pointerdown', (e) => {
            if (!startMenu.classList.contains('is-hidden')) {
                if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
                    closeStartMenu();
                }
            }
        });
    }

    // --- Any element with [data-open-window] inside menus or buttons ---
    document.querySelectorAll('[data-action-open]').forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.dataset.actionOpen;
            closeStartMenu();
            if (targetId) {
                wm.open(targetId);
            }
        });
    });

    // --- Quick Launch: Show Desktop ---
    const showDesktopBtn = document.getElementById('btn-show-desktop');
    if (showDesktopBtn) {
        showDesktopBtn.addEventListener('click', () => {
            closeStartMenu();
            wm.minimizeAll();
        });
    }

    // --- Technologies Grid -> Tech Info Modal ---
    const techItems = document.querySelectorAll('.tech-card');
    const techInfoIcon = document.getElementById('tech-info-icon');
    const techInfoName = document.getElementById('tech-info-name');
    const techInfoYears = document.getElementById('tech-info-years');
    const techInfoCategory = document.getElementById('tech-info-category');
    const techInfoLink = document.getElementById('tech-info-link');

    const formatYears = (raw) => {
        if (!raw) return 'Experienced';
        if (raw === 'ALL LIFE' || raw === 'A L L L I F E') return 'Toda la vida (All life)';
        if (raw === '-1') return '< 1 año de experiencia';
        if (raw === '+1') return '+1 año de experiencia';
        if (raw === '1') return '1 año de experiencia';
        return `${raw} años de experiencia`;
    };

    techItems.forEach((item) => {
        item.addEventListener('click', () => {
            const name = item.dataset.name || 'Technology';
            const url = item.dataset.url || '#';
            const year = item.dataset.year || '';
            const category = item.dataset.category || 'Software Development';
            const imgEl = item.querySelector('img');
            const src = imgEl ? imgEl.getAttribute('src') : '';

            if (techInfoIcon) techInfoIcon.src = src;
            if (techInfoName) techInfoName.textContent = name;
            if (techInfoYears) techInfoYears.textContent = formatYears(year);
            if (techInfoCategory) techInfoCategory.textContent = category;
            if (techInfoLink) techInfoLink.href = url;

            wm.open('window-tech-info');
        });
    });

    // --- Filter tabs inside Technologies.exe ---
    const techFilterBtns = document.querySelectorAll('[data-tech-filter]');
    techFilterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.techFilter;
            techFilterBtns.forEach((b) => b.setAttribute('aria-selected', String(b === btn)));

            techItems.forEach((card) => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.style.display = match ? 'flex' : 'none';
            });
        });
    });

    // --- Internet Explorer Address Bar & Controls ---
    const ieForm = document.getElementById('ie-address-form');
    const ieInput = document.getElementById('ie-address-input');
    const ieFrame = document.getElementById('ie-iframe');
    const ieHomeBtn = document.getElementById('ie-home-btn');
    const ieRefreshBtn = document.getElementById('ie-refresh-btn');
    const defaultIeUrl = 'https://www.google.com/webhp?igu=1';

    if (ieForm && ieInput && ieFrame) {
        ieForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let url = ieInput.value.trim();
            if (!url) return;
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
                ieInput.value = url;
            }
            ieFrame.src = url;
        });
    }

    if (ieHomeBtn && ieFrame && ieInput) {
        ieHomeBtn.addEventListener('click', () => {
            ieInput.value = defaultIeUrl;
            ieFrame.src = defaultIeUrl;
        });
    }

    if (ieRefreshBtn && ieFrame) {
        ieRefreshBtn.addEventListener('click', () => {
            const current = ieFrame.src;
            ieFrame.src = current;
        });
    }

    // --- Shut Down Dialog Actions ---
    const confirmShutdownBtn = document.getElementById('btn-confirm-shutdown');
    const cancelShutdownBtn = document.getElementById('btn-cancel-shutdown');

    if (cancelShutdownBtn) {
        cancelShutdownBtn.addEventListener('click', () => {
            wm.get('window-shutdown')?.close();
        });
    }

    if (confirmShutdownBtn) {
        confirmShutdownBtn.addEventListener('click', () => {
            const selected = document.querySelector('input[name="shutdown-option"]:checked')?.value;
            if (selected === 'restart') {
                window.location.reload();
            } else {
                wm.get('window-shutdown')?.close();
                document.body.classList.add('bsod-active');
            }
        });
    }

    // Wake back up from retro shutdown screen on any key or click
    const shutdownScreen = document.getElementById('shutdown-screen');
    if (shutdownScreen) {
        shutdownScreen.addEventListener('click', () => {
            document.body.classList.remove('bsod-active');
        });
    }
    document.addEventListener('keydown', () => {
        if (document.body.classList.contains('bsod-active')) {
            document.body.classList.remove('bsod-active');
        }
    });

    // --- System Tray Live Clock ---
    const clockEl = document.getElementById('taskbar-clock');
    const updateClock = () => {
        if (!clockEl) return;
        const now = new Date();
        clockEl.textContent = now.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        clockEl.title = now.toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    updateClock();
    setInterval(updateClock, 10000);
});
