// ===============================
// THEME TOGGLE LOGIC
// ===============================

(function () {
    // 1. Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // 2. Wait for DOM to inject toggle button
    document.addEventListener('DOMContentLoaded', () => {
        const navbarRight = document.querySelector('.navbar-right');
        if (!navbarRight) return;

        // Create Toggle Button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle-btn';
        toggleBtn.className = 'theme-toggle-btn';
        toggleBtn.setAttribute('aria-label', 'Toggle Dark Mode');
        toggleBtn.style.background = 'transparent';
        toggleBtn.style.border = 'none';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.fontSize = '1.2rem';
        toggleBtn.style.padding = '8px';
        toggleBtn.style.borderRadius = '50%';
        toggleBtn.style.transition = 'background 0.2s ease';
        toggleBtn.style.display = 'flex';
        toggleBtn.style.alignItems = 'center';
        toggleBtn.style.justifyContent = 'center';
        toggleBtn.style.marginRight = '8px';
        toggleBtn.style.color = 'var(--text-main)';

        // Hover effect
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.background = 'rgba(0,0,0,0.05)';
        });
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.background = 'transparent';
        });

        // Set initial icon
        updateIcon(toggleBtn);

        // Insert before the profile or logout button
        // We want it to be the first item in navbar-right or before profile
        if (navbarRight.firstChild) {
            navbarRight.insertBefore(toggleBtn, navbarRight.firstChild);
        } else {
            navbarRight.appendChild(toggleBtn);
        }

        // 3. Handle Click
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(toggleBtn);
        });
    });

    function updateIcon(btn) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        // Moon for dark mode (to switch to light), Sun for light mode (to switch to dark)
        // Actually standard is showing the current state or the action. 
        // Let's show the icon of the mode we are IN, or the mode we switch TO?
        // Usually: Sun icon implies "Switch to Light" (so show in Dark mode) or "It is Light".
        // Let's go with: Show Moon in Light Mode (click to go Dark), Show Sun in Dark Mode (click to go Light).

        if (isDark) {
            btn.innerHTML = '☀️'; // Sun icon to switch to light
            btn.title = "Switch to Light Mode";
        } else {
            btn.innerHTML = '🌙'; // Moon icon to switch to dark
            btn.title = "Switch to Dark Mode";
        }
    }
})();
