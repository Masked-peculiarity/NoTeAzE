# NoTeAzE 2.0
> **Your thoughts, right where you need them.**

**NoTeAzE** is a lightweight Chrome extension that allows you to take notes while browsing the web. Save thoughts, ideas, important information, and drawings directly from your browser, with notes organized and associated with their respective webpages.

Built using Vanilla JavaScript, HTML, and CSS, NoTeAzE makes capturing and organizing information simple and convenient.

---

## ✨ Features

* **📌 Website-Specific Notes:** Create and save multiple notes for individual webpages. Each note is associated with its source URL.
* **✍️ Quick Note Taking:** Write down thoughts and ideas directly from the Chrome extension popup.
* **➕ Multiple Notes:** Create, switch between, and manage multiple notes for the same webpage.
* **🎨 Drawing Canvas:** Sketch ideas and create handwritten-style notes using the built-in drawing canvas.
* **🖌️ Drawing Tools:** Customize brush color and size, use the eraser, and clear the canvas.
* **⭐ Important Notes:** Mark notes as important to keep them at the top of your notes collection.
* **🔍 Search Notes:** Find saved notes using their content, website URL, or captions.
* **🌙 Dark Mode:** Switch between light and dark themes for a comfortable viewing experience.
* **📚 All Notes Dashboard:** Access and manage your saved notes from one centralized interface.
* **💾 Automatic Saving:** Changes made in the notes dashboard are automatically saved using Chrome local storage.

---

## 🛠️ Built With

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Structure and layout |
| **CSS3** | Styling and responsive UI |
| **Vanilla JavaScript** | Application logic and interactions |
| **Chrome Extension APIs** | Browser integration |
| **Chrome Storage API** | Local note storage |
| **HTML Canvas API** | Drawing functionality |

---

## 📂 Project Structure

```text
NoTeAzE/
│
├── images/
│   ├── note.png
│   ├── note (1).png
│   └── note (2) (1).png
│
├── all_notes.html         # All notes dashboard
├── all_notes.js           # Notes management and drawing logic
├── content.js             # Popup functionality and note handling
├── manifest.json          # Chrome extension configuration
├── popup.html             # Extension popup interface
├── popup.css              # Popup styling
├── styles.css             # Dashboard styling
│
└── README.md
