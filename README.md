📝 NoTeAzE 2.0
Your thoughts, right where you need them.

NoTeAzE is a lightweight Chrome extension that allows you to take notes while browsing the web. Save thoughts, ideas, important information, and drawings directly from your browser, with notes organized and associated with their respective webpages.

Built using Vanilla JavaScript, HTML, and CSS, NoTeAzE makes capturing and organizing information simple and convenient.

✨ Features
📌 Website-Specific Notes: Create and save multiple notes for individual webpages. Each note is associated with its source URL.
✍️ Quick Note Taking: Write down thoughts and ideas directly from the Chrome extension popup.
➕ Multiple Notes: Create, switch between, and manage multiple notes for the same webpage.
🎨 Drawing Canvas: Sketch ideas and create handwritten-style notes using the built-in drawing canvas.
🖌️ Drawing Tools: Customize brush color and size, use the eraser, and clear the canvas.
⭐ Important Notes: Mark notes as important to keep them at the top of your notes collection.
🔍 Search Notes: Find saved notes using their content, website URL, or captions.
🌙 Dark Mode: Switch between light and dark themes for a comfortable viewing experience.
📚 All Notes Dashboard: Access and manage your saved notes from one centralized interface.
💾 Automatic Saving: Changes made in the notes dashboard are automatically saved using Chrome local storage.
🛠️ Built With
Technology	Purpose
HTML5	Structure and layout
CSS3	Styling and responsive UI
Vanilla JavaScript	Application logic and interactions
Chrome Extension APIs	Browser integration
Chrome Storage API	Local note storage
HTML Canvas API	Drawing functionality
📂 Project Structure
text
NoTeAzE/
│
├── images/
│   ├── note.png
│   ├── note (1).png
│   └── note (2) (1).png
│
├── all_notes.html       # All notes dashboard
├── all_notes.js         # Notes management and drawing logic
├── content.js           # Popup functionality and note handling
├── manifest.json        # Chrome extension configuration
├── popup.html           # Extension popup interface
├── popup.css            # Popup styling
├── styles.css           # Dashboard styling
│
└── README.md

🚀 Installation

Follow these steps to install NoTeAzE locally.

1. Clone the Repository
bash
git clone https://github.com/Masked-peculiarity/NoTeAzE.git

2. Navigate to the Project Directory
bash
cd NoTeAzE

3. Load the Extension in Chrome
Open Google Chrome.
Navigate to chrome://extensions/.
Enable Developer mode using the toggle in the top-right corner.
Click Load unpacked.
Select the cloned NoTeAzE project folder.
Pin NoTeAzE to your Chrome toolbar for easy access.

That's it! NoTeAzE is ready to use. 🎉

📖 How to Use
1. Take Notes on Any Webpage
Open a webpage in Chrome.
Click the NoTeAzE extension icon.
Start writing in the text area.
Click Save to save your note.
Use New Note to create additional notes for the same webpage.
2. Manage All Your Notes
Open the NoTeAzE extension popup.
Click View All Notes.
Browse your saved notes in the dashboard.
Search for notes using the search bar.
Edit or delete notes as needed.
3. Create Drawings
Open the All Notes dashboard.
Open the drawing canvas.
Select your preferred brush color and size.
Draw using the canvas.
Use the eraser or clear option when needed.
Click Save Drawing to save your creation as a note.
4. Organize Important Notes
Click Mark Important to prioritize a note.
Important notes automatically appear at the top of the collection.
Click Unmark Important to remove the priority.
💾 Data Storage

NoTeAzE uses the Chrome Storage API (chrome.storage.local) to store notes locally in the browser.

Each note maintains information such as:

Unique note ID
Associated webpage URL
Note content
Caption
Importance status
Last modified timestamp

Drawings are stored as image data within the note content.

🔐 Permissions

NoTeAzE uses the following Chrome extension permissions:

Permission	Purpose
storage	Store and retrieve notes locally
activeTab	Access information about the active tab
scripting	Support browser scripting capabilities

The extension uses Chrome's Manifest V3 format.

🤝 Contributing

Contributions, suggestions, and bug reports are welcome!

If you'd like to contribute:

Fork this repository.
Create a new branch:
bash
git checkout -b feature/your-feature-name

Make your changes.
Commit your changes:
bash
git commit -m "Add: your feature description"

Push your branch:
bash
git push origin feature/your-feature-name

Open a Pull Request.
💡 Future Improvements

Some ideas for future development:

Export and import notes.
Organize notes using tags and categories.
Add rich-text formatting.
Add customizable keyboard shortcuts.
Improve drawing tools and canvas functionality.
Add note synchronization across devices.
📄 License

NoTeAzE is licensed under the MIT License.

You are free to use, copy, modify, distribute, and sublicense this project, subject to the terms of the MIT License.

🌟 Support

If you find NoTeAzE useful, consider giving the repository a ⭐ on GitHub!

Repository: Masked-peculiarity/NoTeAzE

<p align="center">
<strong>NoTeAzE — Capture your thoughts. Save your ideas. Never lose a thought while browsing.</strong>
</p>
