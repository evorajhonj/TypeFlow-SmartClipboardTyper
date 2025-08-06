// State management
let typingStates = {};

// Default settings
const defaultSettings = {
  typingSpeed: 120,
  minTypingSpeed: 50,
  maxTypingSpeed: 200,
  snippets: [],
};

// Utility to get settings from storage
const getSettings = () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(defaultSettings, (items) => {
      resolve(items);
    });
  });
};

// Function to type a single character
const typeCharacter = async (tabId, character) => {
  try {
    await chrome.debugger.sendCommand({ tabId }, "Input.insertText", { text: character });
  } catch (e) {
    console.warn(`Failed to type character: ${e.message}`);
    stopTyping(tabId);
  }
};

// Function to read from clipboard
const readClipboard = async (tabId) => {
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => navigator.clipboard.readText(),
    });
    return result;
  } catch (e) {
    console.warn(`Failed to read clipboard: ${e.message}`);
    return '';
  }
};

// Main function to start typing
const startTyping = async (tabId, textToType) => {
  if (typingStates[tabId]) {
    console.log("Typing is already in progress for this tab.");
    return;
  }

  const taskId = Date.now();
  typingStates[tabId] = taskId;

  try {
    await new Promise((resolve, reject) => {
      chrome.debugger.attach({ tabId }, "1.3", () => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        resolve();
      });
    });
  } catch (e) {
    console.warn(`Debugger attach failed: ${e.message}`);
    delete typingStates[tabId];
    return;
  }

  const text = textToType || await readClipboard(tabId);
  if (!text) {
    stopTyping(tabId);
    return;
  }

  const settings = await getSettings();
  const wpm = parseInt(settings.typingSpeed, 10);
  const minDelay = parseInt(settings.minTypingSpeed, 10);
  const maxDelay = parseInt(settings.maxTypingSpeed, 10);
  const delayPerChar = 60000 / (wpm * 5);

  for (let i = 0; i < text.length; i++) {
    if (typingStates[tabId] !== taskId) {
      console.log("Typing task cancelled.");
      break;
    }
    await typeCharacter(tabId, text[i]);
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    await new Promise(resolve => setTimeout(resolve, delayPerChar + randomDelay));
  }

  stopTyping(tabId);
};

// Function to stop typing
const stopTyping = (tabId) => {
  if (typingStates[tabId]) {
    delete typingStates[tabId];
    chrome.debugger.detach({ tabId }, () => {
      if (chrome.runtime.lastError) {
        console.warn(`Debugger detach failed: ${chrome.runtime.lastError.message}`);
      }
    });
  }
};

// Function to force paste text
const forcePaste = async (tabId, textToPaste) => {
    const text = textToPaste || await readClipboard(tabId);
    if (text) {
        try {
            await new Promise((resolve, reject) => {
                chrome.debugger.attach({ tabId }, "1.3", () => {
                    if (chrome.runtime.lastError) {
                        return reject(new Error(chrome.runtime.lastError.message));
                    }
                    resolve();
                });
            });
            await chrome.debugger.sendCommand({ tabId }, "Input.insertText", { text });
            chrome.debugger.detach({ tabId });
        } catch (e) {
            console.warn(`Force paste failed: ${e.message}`);
            chrome.debugger.detach({ tabId });
        }
    }
};

// Function to update the context menu
const updateContextMenu = async () => {
    await chrome.contextMenus.removeAll();

    // Always create static menu items first
    chrome.contextMenus.create({
        id: "start-typing",
        title: "Start Typing",
        contexts: ["editable"],
    });
    chrome.contextMenus.create({
        id: "stop-typing",
        title: "Stop Typing",
        contexts: ["editable"],
    });
    chrome.contextMenus.create({
        id: "force-paste",
        title: "Force Paste",
        contexts: ["editable"],
    });

    // Create snippet sub-menu
    const { snippets } = await getSettings();
    if (snippets && snippets.length > 0) {
        chrome.contextMenus.create({
            id: "paste-snippet-parent",
            title: "Paste from Snippets",
            contexts: ["editable"],
        });
        snippets.forEach((snippet, index) => {
            if (snippet && typeof snippet.name === 'string') {
                const title = snippet.name.length > 35 ? snippet.name.substring(0, 32) + "..." : snippet.name;
                chrome.contextMenus.create({
                    id: `paste-snippet-${index}`,
                    parentId: "paste-snippet-parent",
                    title,
                    contexts: ["editable"],
                });
            } else {
                console.warn(`Invalid snippet at index ${index}:`, snippet);
            }
        });

        // Add Type Snippet sub-menu
        chrome.contextMenus.create({
            id: "type-snippet-parent",
            title: "Type Snippet",
            contexts: ["editable"],
        });
        snippets.forEach((snippet, index) => {
            if (snippet && typeof snippet.name === 'string') {
                const title = snippet.name.length > 35 ? snippet.name.substring(0, 32) + "..." : snippet.name;
                chrome.contextMenus.create({
                    id: `type-snippet-${index}`,
                    parentId: "type-snippet-parent",
                    title,
                    contexts: ["editable"],
                });
            }
        });
    }
};

// Initial context menu setup
chrome.runtime.onInstalled.addListener(updateContextMenu);
chrome.runtime.onStartup.addListener(updateContextMenu);


// Context menu click listener
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId.startsWith("paste-snippet-")) {
        const index = parseInt(info.menuItemId.split("-")[2], 10);
        if (isNaN(index)) {
            console.error("Invalid snippet index:", info.menuItemId);
            return;
        }
        const { snippets } = await getSettings();
        // Check if the snippet and its content exist
        if (snippets && snippets[index] && typeof snippets[index].content === 'string') {
            forcePaste(tab.id, snippets[index].content);
        } else {
            console.error("Invalid snippet or snippet content for index:", index);
        }
    } else if (info.menuItemId.startsWith("type-snippet-")) {
        const index = parseInt(info.menuItemId.split("-")[2], 10);
        if (isNaN(index)) {
            console.error("Invalid snippet index for typing:", info.menuItemId);
            return;
        }
        const { snippets } = await getSettings();
        if (snippets && snippets[index] && typeof snippets[index].content === 'string') {
            startTyping(tab.id, snippets[index].content);
        } else {
            console.error("Invalid snippet or snippet content for typing at index:", index);
        }
    } else {
        switch (info.menuItemId) {
            case "start-typing":
                startTyping(tab.id);
                break;
            case "stop-typing":
                stopTyping(tab.id);
                break;
            case "force-paste":
                forcePaste(tab.id);
                break;
        }
    }
});

// Message listener for popup and options page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'update-menu') {
      updateContextMenu().then(() => {
          sendResponse({ success: true });
      }).catch((error) => {
          sendResponse({ success: false, error: error.message });
      });
      return true; // Indicates we will respond asynchronously
  } else if (request.command === 'type') {
      const [tab] = sender.tab ? [sender.tab] : [];
      if (tab && request.text) {
          startTyping(tab.id, request.text);
          sendResponse({ success: true });
      } else {
          sendResponse({ success: false, error: 'No tab or text provided' });
      }
      return true; // Indicates we will respond asynchronously
  }
  
  // For unknown commands, respond immediately
  sendResponse({ success: false, error: 'Unknown command' });
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'start_typing') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      startTyping(tab.id);
    }
  }
});