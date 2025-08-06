# ⚡ TypeFlow - Smart Clipboard Typer

An intelligent Chrome extension that transforms clipboard content into natural, human-like typing with advanced automation features and professional snippet management.

![Extension Version](https://img.shields.io/badge/version-1.0.0-blue)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)
![Manifest](https://img.shields.io/badge/Manifest-V3-orange)
![Release](https://img.shields.io/badge/Release-Stable-brightgreen)

## ✨ Features

### 🎯 **Smart Typing Automation**
- **Natural typing simulation** with customizable speed and delays
- **Human-like randomization** to avoid detection
- **Precision control** with WPM settings (20-300 WPM)
- **Variable delays** between keystrokes for realistic typing patterns

### 📝 **Advanced Snippet Management**
- **Create and manage** unlimited text snippets
- **Quick access** via right-click context menu
- **Instant paste** or **animated typing** for any snippet
- **Smart organization** with preview and search capabilities

### 🎨 **Modern UI Design**
- **Beautiful popup interface** - no more tab switching needed
- **Dark/Light theme toggle** for comfortable use anytime
- **Professional design** with smooth animations and transitions
- **Intuitive controls** with real-time feedback

### 🚀 **Enhanced User Experience**
- **Custom confirmation modals** instead of browser dialogs
- **Toast notifications** for instant feedback
- **Context-aware actions** based on page content
- **Streamlined popup interface** for quick access
- **Smart keyboard shortcuts** (`Alt+T` & `Alt+Shift+T`) for instant access

## 📦 Installation

### From Chrome Web Store (Recommended)
*Coming soon - Submit to Chrome Web Store*

### Quick Installation (Pre-built Files)
Ready-to-install files are available:

**Option 1: CRX File Installation**
1. **Download** the pre-built `typeflow.crx` file
2. **Install CRX Launcher** extension from Chrome Web Store
3. **Drag and drop** the `.crx` file into CRX Launcher
4. **Click "Install"** to add the extension to Chrome

**Option 2: ZIP File Installation**
1. **Download** the pre-built `typeflow.zip` file
2. **Extract** the ZIP contents to a folder
3. **Open Chrome** and navigate to `chrome://extensions/`
4. **Enable Developer mode** (toggle in top-right corner)
5. **Click "Load unpacked"** and select the extracted folder

### Manual Installation (Developer Mode)
1. **Download** the extension source files or clone this repository
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer mode** (toggle in top-right corner)
4. **Click "Load unpacked"** and select the extension directory
5. **Pin the extension** to your toolbar for easy access

**Note:** Pre-built files are the easiest option. Developer mode installation is recommended if CRX installation is blocked.

## 🎮 Usage

### Quick Start
1. **Click the extension icon** in your toolbar
2. **Adjust typing settings** with the intuitive sliders
3. **Add your frequently used snippets**
4. **Right-click on any text field** to access typing options

### Main Interface
The extension popup provides everything you need:

- **⚡ Typing Settings**
  - Speed control (20-300 WPM)
  - Minimum delay (0-500ms)
  - Maximum delay (0-500ms)
  - Save/Reset buttons

- **📝 Snippet Library**
  - Add new snippets instantly
  - View all snippets with previews
  - Delete individual or all snippets
  - Smart confirmation dialogs

### Context Menu Options
Right-click on any text field to access:

- **Start Typing** - Begin typing from clipboard
- **Stop Typing** - Halt current typing process
- **Force Paste** - Instant clipboard paste
- **Paste from Snippets** - Choose snippet to paste instantly
- **Type Snippet** - Choose snippet to type with animation

### Keyboard Shortcuts
- **`Alt+T`** - Start typing from clipboard (works from any page)
- **`Alt+Shift+T`** - Open TypeFlow settings popup

### Permissions Required

| Permission | Purpose |
|------------|---------|
| `debugger` | Enables reliable text insertion that works on all websites (including Google Docs) |
| `scripting` | Allows clipboard reading from active tabs |
| `activeTab` | Provides access to the current page for typing simulation |
| `storage` | Saves your settings and snippets across browser sessions |
| `contextMenus` | Adds right-click menu options for quick access |

### Browser Compatibility
- **Chrome**: Full support (recommended)
- **Chromium-based browsers**: Full support (Edge, Brave, etc.)
- **Firefox**: Not tested

## 🎨 Customization

### Themes
Switch between light and dark themes using the toggle button in the popup header.

### Typing Patterns
Fine-tune your typing simulation:
- **Speed**: Controls overall typing velocity
- **Min Delay**: Shortest pause between characters
- **Max Delay**: Longest pause between characters

### Snippet Organization
- Create unlimited snippets for frequently used text
- Preview content before using
- Organize with descriptive names

## 🐛 Troubleshooting

### Common Issues

**Typing not working on certain sites:**
- Ensure the site allows focus on text fields
- Try using "Force Paste" as an alternative
- Some sites block automated input for security

**Extension not appearing:**
- Check if extension is enabled in `chrome://extensions/`
- Try refreshing the page
- Ensure you're not in incognito mode (unless allowed)

**Snippets not saving:**
- Check Chrome storage quota
- Ensure sync is enabled in Chrome settings
- Try clearing extension data and re-adding snippets

## 📈 Changelog

### Version 1.0.0 (First Release - Latest)
🎉 **Initial Release - Complete Feature Set**
- ✨ **Modern popup interface** with intuitive design
- 🌙 **Dark/Light theme toggle** for comfortable usage
- 📝 **Advanced snippet management** with unlimited storage
- 🔧 **Custom confirmation modals** for better UX
- ⚡ **Smart typing automation** with human-like patterns
- 🎯 **Professional error handling** and user feedback
- 🚀 **Optimized performance** with Manifest V3
- ⌨️ **Smart keyboard shortcuts** (Alt+T, Alt+Shift+T)
- 🎨 **Beautiful UI design** with smooth animations
- 📱 **Context menu integration** for quick access

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

### Development Setup
1. Clone the repository
2. Make your changes
3. Test thoroughly with different websites
4. Submit a pull request with detailed description

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons from emoji sets
- Inspiration from typing automation needs
- Chrome Extension API documentation
- Community feedback and suggestions

---

**Made with ❤️ for productivity enthusiasts**

*Automate your typing with precision and style*
