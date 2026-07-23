/**
 * YUKgas.in - Shared Notification Badge Loader
 * Automatically loads unread notification count from backend API
 * and updates all badge elements on the page.
 * Include this script after app.js on every page with notification badges.
 */
(function () {
    'use strict';

    async function loadNotifBadge() {
        try {
            if (!YG_AUTH || !YG_AUTH.getToken()) return;

            const response = await fetch(`${window.API_BASE_URL}/notifications/unread-count`, {
                headers: YG_AUTH.getHeaders()
            });
            const data = await response.json();

            if (data.success) {
                const count = data.data.count;
                // Update all desktop badges (header)
                document.querySelectorAll('.notif-badge-desktop').forEach(badge => {
                    if (count > 0) {
                        badge.textContent = count > 9 ? '9+' : count;
                        badge.classList.remove('hidden');
                    } else {
                        badge.classList.add('hidden');
                    }
                });
                // Update all mobile badges (bottom nav)
                document.querySelectorAll('.notif-badge-mobile').forEach(badge => {
                    if (count > 0) {
                        badge.textContent = count > 9 ? '9+' : count;
                        badge.classList.remove('hidden');
                    } else {
                        badge.classList.add('hidden');
                    }
                });
            }
        } catch (e) {
            // Silent fail - badge just won't show
        }
    }

    // Load on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadNotifBadge);
    } else {
        loadNotifBadge();
    }

    // Expose for manual refresh
    window.YG_NOTIF = { refreshBadge: loadNotifBadge };
})();
