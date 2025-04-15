// src/options.ts

interface ThemeSettings {
    hideRenewalNotice: boolean;
    sideNavbar: string;
    oddRowColor: string;
    evenRowColor: string;
    userIdBackground: string;
}

document.addEventListener('DOMContentLoaded', () => {
    const defaultSettings: ThemeSettings = {
        hideRenewalNotice: false,
        sideNavbar: '#5F5271',
        oddRowColor: '#af9dcb',
        evenRowColor: '#c0b2d5',
        userIdBackground: '#8d73b4'
    };
    const hideRenewalNoticeInput = document.getElementById('hideRenewalNoticeInput') as HTMLInputElement;
    const sideNavbarInput = document.getElementById('sideNavbarColor') as HTMLInputElement;
    const oddRowInput = document.getElementById('oddRowColor') as HTMLInputElement;
    const evenRowInput = document.getElementById('evenRowColor') as HTMLInputElement;
    const userIdBgInput = document.getElementById('userIdBackground') as HTMLInputElement;

    // Load saved options.
    chrome.storage.sync.get(defaultSettings, (items: ThemeSettings) => {
        hideRenewalNoticeInput.checked = items.hideRenewalNotice;
        sideNavbarInput.value = items.sideNavbar;
        oddRowInput.value = items.oddRowColor;
        evenRowInput.value = items.evenRowColor;
        userIdBgInput.value = items.userIdBackground;
    });

    // Save options on form submit.
    const form = document.getElementById('optionsForm') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newSettings: ThemeSettings = {
            hideRenewalNotice: hideRenewalNoticeInput.checked,
            sideNavbar: sideNavbarInput.value,
            oddRowColor: oddRowInput.value,
            evenRowColor: evenRowInput.value,
            userIdBackground: userIdBgInput.value
        };
        chrome.storage.sync.set(newSettings, () => {
            // Send message to reload the content script tab.
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length && tabs[0].id) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "reloadPage" });
                }
            });
        });

    });
});
