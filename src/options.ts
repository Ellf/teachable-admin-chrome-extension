// src/options.ts

interface ThemeSettings {
    oddRowColor: string;
    evenRowColor: string;
    userIdBackground: string;
}

document.addEventListener('DOMContentLoaded', () => {
    const defaultSettings: ThemeSettings = {
        oddRowColor: '#af9dcb',
        evenRowColor: '#c0b2d5',
        userIdBackground: '#8d73b4'
    };
    const oddRowInput = document.getElementById('oddRowColor') as HTMLInputElement;
    const evenRowInput = document.getElementById('evenRowColor') as HTMLInputElement;
    const userIdBgInput = document.getElementById('userIdBackground') as HTMLInputElement;

    // Load saved options.
    chrome.storage.sync.get(defaultSettings, (items: ThemeSettings) => {
        oddRowInput.value = items.oddRowColor;
        evenRowInput.value = items.evenRowColor;
        userIdBgInput.value = items.userIdBackground;
    });

    // Save options on form submit.
    const form = document.getElementById('optionsForm') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newSettings: ThemeSettings = {
            oddRowColor: oddRowInput.value,
            evenRowColor: evenRowInput.value,
            userIdBackground: userIdBgInput.value
        };
        chrome.storage.sync.set(newSettings, () => {
            alert('Options saved.');
        });
    });
});
