// content.js
document.addEventListener('DOMContentLoaded', function () {
  const noteArea = document.getElementById('note');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  const viewAll = document.getElementById('ViewAll');
  const noteSelect = document.getElementById('noteSelect');
  const newNoteBtn = document.getElementById('newNoteBtn');

  // helper: generate id
  function genId() {
    return `note-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  // get active tab URL
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0]?.url;
    if (!url) return;

    // Load all stored items, then filter notes for this url.
    chrome.storage.local.get(null, function (items) {
      const notes = [];

      // 1) Migrate legacy single-note-per-url items (string or object stored under URL key)
      // If items[url] exists and looks like a text or object without id, migrate it.
      if (items[url]) {
        const legacy = items[url];
        // if legacy is string or object without id, migrate
        if (typeof legacy === 'string' || (typeof legacy === 'object' && !legacy.id)) {
          const newId = genId();
          const migrated = {
            id: newId,
            url,
            text: typeof legacy === 'string' ? legacy : (legacy.text || ''),
            caption: legacy.caption || '',
            important: legacy.important || false,
            lastModified: legacy.lastModified || Date.now()
          };
          chrome.storage.local.set({ [newId]: migrated }, () => {
            // remove legacy key
            chrome.storage.local.remove(url);
            items[newId] = migrated;
            delete items[url];
          });
        }
      }

      // collect notes associated with this URL
      for (const [k, v] of Object.entries(items)) {
        if (v && typeof v === 'object' && v.text !== undefined) {
          // match url field
          if (v.url === url) {
            // ensure id exists
            if (!v.id) v.id = k;
            notes.push(v);
          }
        }
      }

      // render select options
      function renderSelect() {
        noteSelect.innerHTML = '';
        if (notes.length === 0) return;
        notes.sort((a, b) => b.lastModified - a.lastModified);
        notes.forEach(n => {
          const opt = document.createElement('option');
          opt.value = n.id;
          opt.textContent = n.text ? (n.text.slice(0, 40).replace(/\n/g, ' ') || '[empty]') : '[empty]';
          noteSelect.appendChild(opt);
        });
      }

      // if no notes: create a default new note
      function createNewNoteAndSelect() {
        const id = genId();
        const noteObj = {
          id,
          url,
          text: '',
          caption: '',
          important: false,
          lastModified: Date.now()
        };
        notes.unshift(noteObj);
        chrome.storage.local.set({ [id]: noteObj }, () => {
          renderSelect();
          noteSelect.value = id;
          noteArea.value = '';
        });
      }

      // init UI
      if (notes.length === 0) {
        noteSelect.innerHTML = '';
        noteArea.value = '';
      } else {
        renderSelect();
        noteSelect.selectedIndex = 0;
        const first = notes[0];
        noteArea.value = first.text || '';
      }

      // change selected note
      noteSelect.addEventListener('change', () => {
        const id = noteSelect.value;
        const n = notes.find(x => x.id === id);
        if (n) {
          noteArea.value = n.text || '';
        }
      });

      // new note button
      newNoteBtn.addEventListener('click', () => {
        createNewNoteAndSelect();
      });

///////////////////////////////////////////////////////////////////
      noteArea.addEventListener('input', () => {
        let id = noteSelect.value;

        // If NO note selected → user started typing → create note
        if (!id) {
          id = genId();
          const newNote = {
            id,
            url,
            text: noteArea.value,
            caption: "",
            important: false,
            lastModified: Date.now()
          };
          notes.unshift(newNote);
          chrome.storage.local.set({ [id]: newNote });
          renderSelect();
          noteSelect.value = id;
          return;
        }

        // update existing note
        const n = notes.find(x => x.id === id);
        if (!n) return;

        n.text = noteArea.value;
        n.lastModified = Date.now();
        const obj = {};
        obj[n.id] = n;
        chrome.storage.local.set(obj);
      });
//////////////////////////////////////////////////////////////////

      // save note (saves the currently selected note)
      saveBtn.addEventListener('click', function () {
        const id = noteSelect.value;
        const n = notes.find(x => x.id === id);
        if (!n) return;

        n.text = noteArea.value;
        n.lastModified = Date.now();

        const setObj = {};
        setObj[n.id] = n;
        chrome.storage.local.set(setObj, function () {
          status.textContent = "Thought Processed";
          setTimeout(() => status.textContent = "", 1200);
        });
      });

      // view all notes
      viewAll.addEventListener('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("all_notes.html") });
      });
    });
  });
});
