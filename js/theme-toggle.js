// ===============================
// THEME TOGGLE LOGIC
// ===============================

(function () {
    // 1. Check for saved theme or system preference
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('theme');
    } catch (e) {
        console.warn('LocalStorage access denied', e);
    }

    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // 2. Wait for DOM to inject toggle button
    function initThemeToggle() {
        // Prevent double injection
        if (document.getElementById('theme-toggle-btn')) return;

        const navbarRight = document.querySelector('.navbar-right');

        // Create Toggle Button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle-btn';
        toggleBtn.className = 'theme-toggle-btn';
        toggleBtn.setAttribute('aria-label', 'Toggle Dark Mode');
        toggleBtn.style.background = 'transparent';
        toggleBtn.style.border = 'none';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.fontSize = '1.4rem'; // Increased size
        toggleBtn.style.padding = '8px';
        toggleBtn.style.borderRadius = '50%';
        toggleBtn.style.transition = 'background 0.2s ease, transform 0.2s ease'; // Added transform
        toggleBtn.style.display = 'flex';
        toggleBtn.style.alignItems = 'center';
        toggleBtn.style.justifyContent = 'center';
        toggleBtn.style.marginRight = '8px';
        toggleBtn.style.color = 'var(--text-main)';
        toggleBtn.style.zIndex = '9999'; // Very high z-index

        // Hover effect
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.background = 'rgba(127,127,127,0.1)';
            toggleBtn.style.transform = 'scale(1.1)';
        });
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.background = 'transparent';
            toggleBtn.style.transform = 'scale(1)';
        });

        // Set initial icon
        updateIcon(toggleBtn);

        // Insert logic
        if (navbarRight) {
            // Navbar exists (Dashboard, Home, etc.)
            // Use prepend to ensure it's first
            if (navbarRight.prepend) {
                navbarRight.prepend(toggleBtn);
            } else {
                navbarRight.insertBefore(toggleBtn, navbarRight.firstChild);
            }
        } else {
            // No Navbar (Login, Register, etc.) -> Floating Button
            toggleBtn.style.position = 'fixed';
            toggleBtn.style.top = '15px';
            toggleBtn.style.right = '15px';
            toggleBtn.style.width = '45px';
            toggleBtn.style.height = '45px';
            toggleBtn.style.background = 'var(--card-bg)';
            toggleBtn.style.backdropFilter = 'blur(10px)';
            toggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            toggleBtn.style.border = '1px solid var(--border-light)';
            document.body.appendChild(toggleBtn);
        }

        // 3. Handle Click
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            try {
                localStorage.setItem('theme', newTheme);
            } catch (e) {
                // Ignore
            }
            updateIcon(toggleBtn);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeToggle);
    } else {
        initThemeToggle();
    }

    function updateIcon(btn) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            btn.innerHTML = '☀️'; // Sun icon to switch to light
            btn.title = "Switch to Light Mode";
        } else {
            btn.innerHTML = '🌙'; // Moon icon to switch to dark
            btn.title = "Switch to Dark Mode";
        }
    }
})();
