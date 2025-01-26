const entriesSection = document.getElementById('entries');
const addEntryButton = document.getElementById('add-entry');
const entryText = document.getElementById('entry-text');
const entryImage = document.getElementById('entry-image');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const noSearchResultsMessage = document.getElementById('no-search-results');
const uploadStatus = document.getElementById('upload-status');

document.addEventListener('DOMContentLoaded', loadEntries);

addEntryButton.addEventListener('click', handleAddEntry);
entryImage.addEventListener('change', handleFileUpload);
searchButton.addEventListener('click', performSearch);

function loadEntries() {
    const entries = getEntriesFromLocalStorage();
    if (entries.length > 0) {
        entries.forEach(entry => displayEntry(entry.date, entry.text, entry.image));
        hideNoEntriesMessage();
    } else {
        showNoEntriesMessage();
    }
}

function handleFileUpload() {
    if (entryImage.files.length > 0) {
        const fileName = entryImage.files[0].name;
        uploadStatus.textContent = `File "${fileName}" uploaded successfully!`;
        uploadStatus.style.display = 'block';
        setTimeout(() => {
            uploadStatus.style.display = 'none';
        }, 3000);
    }
}

function handleAddEntry() {
    const text = entryText.value.trim();
    const imageFile = entryImage.files[0];

    if (text) {
        const date = new Date().toLocaleDateString();
        let imageBase64 = null;

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imageBase64 = e.target.result;
                saveEntryToLocalStorage(date, text, imageBase64);
                displayEntry(date, text, imageBase64);
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveEntryToLocalStorage(date, text, imageBase64);
            displayEntry(date, text, imageBase64);
        }

        entryText.value = '';
        entryImage.value = '';
        entryText.focus();
        hideNoEntriesMessage();
        uploadStatus.style.display = 'none';
    } else {
        alert('Please write something before adding an entry!');
    }
}

function saveEntryToLocalStorage(date, text, image) {
    const entries = getEntriesFromLocalStorage();
    entries.unshift({ date, text, image });
    localStorage.setItem('journalEntries', JSON.stringify(entries));
}

function displayEntry(date, text, image) {
    const entryCard = document.createElement('div');
    entryCard.className = 'journal-entry';
    entryCard.style.padding = '1.5rem';
    entryCard.style.border = '1px solid #ddd';
    entryCard.style.borderRadius = '12px';
    entryCard.style.marginBottom = '1rem';
    entryCard.style.background = 'white';

    const entryTitle = document.createElement('h2');
    entryTitle.textContent = `Entry - ${date}`;
    entryTitle.style.fontSize = '1.25rem';
    entryTitle.style.marginBottom = '0.5rem';

    const entryContent = document.createElement('p');
    entryContent.textContent = text;
    entryContent.style.marginBottom = '1rem';

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-entry';
    deleteButton.addEventListener('click', () => deleteEntry(entryCard, date, text));

    entryCard.appendChild(entryTitle);
    entryCard.appendChild(entryContent);

    if (image) {
        const entryImage = document.createElement('img');
        entryImage.src = image;
        entryImage.alt = 'Journal entry image';
        entryImage.style.maxWidth = '100%';
        entryImage.style.borderRadius = '8px';
        entryImage.style.marginBottom = '1rem';
        entryCard.appendChild(entryImage);
    }

    entryCard.appendChild(deleteButton);
    entriesSection.prepend(entryCard);
}

function deleteEntry(entryCard, date, text) {
    entriesSection.removeChild(entryCard);

    const entries = getEntriesFromLocalStorage();
    const updatedEntries = entries.filter(entry => !(entry.date === date && entry.text === text));
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

    if (entriesSection.children.length === 0) {
        showNoEntriesMessage();
    }
}

function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const entries = getEntriesFromLocalStorage();
    const filteredEntries = entries.filter(entry =>
        entry.date.toLowerCase().includes(query) || entry.text.toLowerCase().includes(query)
    );

    entriesSection.innerHTML = '';

    if (filteredEntries.length > 0) {
        filteredEntries.forEach(entry => displayEntry(entry.date, entry.text, entry.image));
        noSearchResultsMessage.hidden = true;
    } else {
        noSearchResultsMessage.hidden = false;
    }
}

function getEntriesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('journalEntries')) || [];
}

function showNoEntriesMessage() {
    const message = document.createElement('p');
    message.textContent = 'No journal entries yet. Start by adding one!';
    message.id = 'no-entries-message';
    message.className = 'empty-state';
    entriesSection.appendChild(message);
}

function hideNoEntriesMessage() {
    const noEntriesMessage = document.getElementById('no-entries-message');
    if (noEntriesMessage) {
        entriesSection.removeChild(noEntriesMessage);
    }
}
