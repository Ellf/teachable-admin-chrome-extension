"use strict";
// src/options.ts
document.addEventListener('DOMContentLoaded', () => {
    const defaultSettings = {
        hideRenewalNotice: false,
        sideNavbar: '#5F5271',
        oddRowColor: '#af9dcb',
        evenRowColor: '#c0b2d5',
        userIdBackground: '#8d73b4'
    };
    const hideRenewalNoticeInput = document.getElementById('hideRenewalNoticeInput');
    const sideNavbarInput = document.getElementById('sideNavbarColor');
    const oddRowInput = document.getElementById('oddRowColor');
    const evenRowInput = document.getElementById('evenRowColor');
    const userIdBgInput = document.getElementById('userIdBackground');
    // Load saved options.
    chrome.storage.sync.get(defaultSettings, (items) => {
        hideRenewalNoticeInput.checked = items.hideRenewalNotice;
        sideNavbarInput.value = items.sideNavbar;
        oddRowInput.value = items.oddRowColor;
        evenRowInput.value = items.evenRowColor;
        userIdBgInput.value = items.userIdBackground;
    });
    // Save options on form submit.
    const form = document.getElementById('optionsForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newSettings = {
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
