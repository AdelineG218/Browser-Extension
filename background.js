chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "defineAndSave",
        type: "Define and Save",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "defineAndSave") {
        const selectedText = info.selectionText;
        const definition = await fetchDefinition(selectedText);
        saveDefinition(selectedText, definition);
        console.log("Definition for " + selectedText + " saved")
    }
});

async function fetchDefinition(word) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    return data[0]?.meanings[0]?.definitions[0]?.definition || "No definition found.";
}

function saveDefinition(word, definition) {
    chrome.storage.local.get({ savedWords: [] }, (result) => {
        const updatedWords = [...result.savedWords, { word, definition }];
        chrome.storage.local.set({ savedWords: updatedWords });
    });
}