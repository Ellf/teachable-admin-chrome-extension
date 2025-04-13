"use strict";
// src/options.ts
document.addEventListener('DOMContentLoaded', () => {
    const defaultSettings = {
        oddRowColor: '#af9dcb',
        evenRowColor: '#c0b2d5',
        userIdBackground: '#8d73b4'
    };
    const oddRowInput = document.getElementById('oddRowColor');
    const evenRowInput = document.getElementById('evenRowColor');
    const userIdBgInput = document.getElementById('userIdBackground');
    // Load saved options.
    chrome.storage.sync.get(defaultSettings, (items) => {
        oddRowInput.value = items.oddRowColor;
        evenRowInput.value = items.evenRowColor;
        userIdBgInput.value = items.userIdBackground;
    });
    // Save options on form submit.
    const form = document.getElementById('optionsForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newSettings = {
            oddRowColor: oddRowInput.value,
            evenRowColor: evenRowInput.value,
            userIdBackground: userIdBgInput.value
        };
        chrome.storage.sync.set(newSettings, () => {
            alert('Options saved.');
        });
    });
});
