"use strict";
// src/content.ts
// Default theme, used if no settings are saved.
const defaultTheme = {
    oddRowColor: '#af9dcb',
    evenRowColor: '#c0b2d5',
    userIdBackground: '#8d73b4'
};
// Wrapper that loads theme settings from Chrome Storage.
chrome.storage.sync.get(defaultTheme, (theme) => {
    // Build CSS using retrieved theme.
    const css = `
    :root {
          --obsidian: #583f7d !important;
          --obsidian-light: #af9dcb;
        }
        html, .admin-content, .tch-section-nav .tch-section-nav-wrapper .tch-section-nav-box { background: var(--obsidian-light) !important; }
        tbody tr:nth-child(odd) {
            background-color: #af9dcb !important; /* lighter version of #8d73b4 */
        }
        tbody tr:nth-child(even) {
            background-color: #c0b2d5 !important;
        }
        .state-admin-users .student-table tr > td:not(:last-child) {
            border-right: 1px solid #f3f3f3;
        }
        tr td:nth-of-type(11) {
            display: flex;
            justify-content: center;
        }
        #sidebar_layout_main_content { background: var(--obsidian-light); }
  `;
    const styleNode = document.createElement('style');
    styleNode.type = 'text/css';
    styleNode.appendChild(document.createTextNode(css));
    document.head.appendChild(styleNode);
    // Function to insert the header and user ID cells.
    const buildUI = () => {
        const headerRow = document.querySelector('.tch-table.student-table tbody tr:first-of-type');
        if (headerRow && !headerRow.dataset.useridInjected) {
            headerRow.insertAdjacentHTML('beforeend', '<th class="users-table-header _22oLp">User ID</th>');
            headerRow.dataset.useridInjected = 'true';
        }
        const rows = document.querySelectorAll('tr.border-bottom');
        rows.forEach((row) => {
            if (row.querySelector('td.user_label'))
                return;
            const anchor = row.querySelector('.whole-cell');
            if (anchor) {
                const href = anchor.getAttribute('href');
                if (href) {
                    const parts = href.split('/');
                    if (parts.length > 3) {
                        const userId = parts[3];
                        row.insertAdjacentHTML('beforeend', `
              <td class="user_label jdGIU">
                <span style="display: block; text-align: center; background: ${theme.userIdBackground}; color: #ffffff; padding: 2px; border-radius: 4px;">
                  ${userId}
                </span>
              </td>
            `);
                    }
                }
            }
        });
        // Optional: insert school ID if not already present.
        if (!document.querySelector('.sc_id')) {
            const schoolLink = document.querySelector('.school-link a.school-link-name');
            if (schoolLink && window.hasOwnProperty('APP_CONFIG') && window.APP_CONFIG.school) {
                schoolLink.insertAdjacentHTML('beforeend', `<p class="sc_id user_label jdGIU">(${window.APP_CONFIG.school._id})</p>`);
            }
        }
    };
    // Debounce helper.
    let debounceTimer;
    const observeTable = () => {
        const tableContainer = document.querySelector('.tch-table.student-table');
        if (tableContainer) {
            const observer = new MutationObserver(() => {
                if (debounceTimer) {
                    clearTimeout(debounceTimer);
                }
                debounceTimer = window.setTimeout(buildUI, 300);
            });
            observer.observe(tableContainer, { childList: true, subtree: true });
        }
    };
    // Wait for an element to appear.
    const waitForElement = (selector, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element)
                return resolve(element);
            const observer = new MutationObserver((mutations, obs) => {
                const found = document.querySelector(selector);
                if (found) {
                    obs.disconnect();
                    resolve(found);
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout: Element "${selector}" not found within ${timeout}ms.`));
            }, timeout);
        });
    };
    // Initialize function—wait for Angular content then build UI.
    const init = () => {
        waitForElement('.tch-table.student-table tbody tr.border-bottom', 15000)
            .then(() => {
            buildUI();
            const refreshInterval = setInterval(buildUI, 1000);
            setTimeout(() => clearInterval(refreshInterval), 10000);
        })
            .catch((error) => console.error(error));
    };
    init();
    observeTable();
});
