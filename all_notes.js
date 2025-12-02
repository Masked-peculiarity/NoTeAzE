// all_notes.js
document.addEventListener('DOMContentLoaded', () => {
  const noteLinks = document.getElementById('noteLinks');
  const noteView = document.getElementById('noteView');
  const searchInput = document.getElementById('searchInput');
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.getElementById('toggleSidebar');
  const toggleDark = document.getElementById('toggleDark');
  const toggleDrawBox = document.getElementById('toggleDrawBox');
  const drawBoxContainer = document.getElementById('drawBoxContainer');

  if (!noteLinks || !noteView || !searchInput || !toggleBtn || !sidebar) {
    console.error("Missing required elements in HTML.");
    return;
  }

  let allNotes = [];
  let currentPriorityID = null;

  // load all notes
  function loadNotesAndUpdate() {
    chrome.storage.local.get(null, (items) => {
      allNotes = Object.entries(items)
        .filter(([_, v]) => typeof v === 'object' && v.text !== undefined && (v.id || true))
        .map(([key, v]) => {
          // ensure id and lastModified exist, and ensure url may be missing for drawings
          return {
            id: v.id || key,
            url: v.url || '',
            text: v.text || '',
            caption: v.caption || '',
            important: !!v.important,
            lastModified: v.lastModified || 0
          };
        });
      updateUI();
    });
  }

  loadNotesAndUpdate();

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  toggleDark.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  searchInput.addEventListener('input', () => {
    updateUI();
  });

  function updateUI() {
    const filter = searchInput.value.trim().toLowerCase();
    const filtered = allNotes.filter(n =>
      (n.text && n.text.toLowerCase().includes(filter)) ||
      (n.url && n.url.toLowerCase().includes(filter)) ||
      (n.caption && n.caption.toLowerCase().includes(filter))
    );

    renderNoteLinks(filtered);
    renderNotes(filtered);
  }

  function renderNoteLinks(notes) {
    // create a UL wrapper for accessibility and predictable styling
    noteLinks.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'note-links-list';

    const sorted = [...notes].sort((a, b) => (b.important - a.important) || (b.lastModified - a.lastModified));

    sorted.forEach(n => {
      const li = document.createElement('li');

      const timestamp = formatTimestamp(n.lastModified);
      li.textContent = `${trimHostname(n.url)} — ${timestamp}`;

      li.title = n.url || `Drawing ${new Date(n.lastModified).toLocaleString()}`;
      if (n.important) li.classList.add('important');
      li.addEventListener('click', () => {
        currentPriorityID = n.id; // if drawing, use id
        renderNotes(notes);
      });
      ul.appendChild(li);
    });

    noteLinks.appendChild(ul);
  }

  function renderNotes(notes) {
    noteView.innerHTML = '';

    const sorted = [...notes].sort((a, b) => (b.important - a.important) || (b.lastModified - a.lastModified));

    // if a priority item selected, bring it to top (match by url or id for drawings)
    if (currentPriorityID) {
      const idx = sorted.findIndex(n => (n.id) === currentPriorityID);
      if (idx > -1) {
        const [prio] = sorted.splice(idx, 1);
        sorted.unshift(prio);
      }
    }

    sorted.slice(0, 25).forEach(createNoteEntry);
  }

  function createNoteEntry(n) {
    const entry = document.createElement('div');
    entry.className = 'note-entry';
    if (n.important) entry.classList.add('important');

    const title = document.createElement('h3');
    const timestamp = formatTimestamp(n.lastModified);
    title.innerHTML = `🔗 <a href="${n.url || '#'}" target="_blank">${trimHostname(n.url)} — ${timestamp}</a>`;

    entry.appendChild(title);

    // If it's an image note
    if (n.text && n.text.trim().startsWith('<img')) {
      const imgWrapper = document.createElement('div');
      imgWrapper.innerHTML = n.text;
      entry.appendChild(imgWrapper);

      const caption = document.createElement('textarea');
      caption.placeholder = 'Add a caption...';
      caption.value = n.caption || '';
      entry.appendChild(caption);

      // Debounced save for caption
      let captionTimer;
      caption.addEventListener('input', () => {
        clearTimeout(captionTimer);
        captionTimer = setTimeout(() => {
          n.caption = caption.value;
          n.lastModified = Date.now();
          const obj = {};
          obj[n.id] = n;
          chrome.storage.local.set(obj, () => {
            loadNotesAndUpdate();
          });
        }, 700);
      });
    } else {
      // text note
      const textArea = document.createElement('textarea');
      textArea.value = n.text || '';
      entry.appendChild(textArea);

      // Debounced save for text note
      let timer;
      textArea.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          n.text = textArea.value;
          n.lastModified = Date.now();
          const obj = {};
          obj[n.id] = n;
          chrome.storage.local.set(obj, () => {
            loadNotesAndUpdate();
          });
        }, 800);
      });
    }

    // Important toggle
    const impBtn = document.createElement('button');
    impBtn.className = 'important';
    impBtn.textContent = n.important ? 'Unmark Important' : 'Mark Important';
    impBtn.addEventListener('click', () => {
      n.important = !n.important;
      const obj = {};
      obj[n.id] = n;
      chrome.storage.local.set(obj, () => {
        entry.classList.toggle('important');
        impBtn.textContent = n.important ? 'Unmark Important' : 'Mark Important';
        loadNotesAndUpdate();
      });
    });

    // Delete
    const delBtn = document.createElement('button');
    delBtn.className = 'delete';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
      chrome.storage.local.remove(n.id, () => {
        allNotes = allNotes.filter(x => x.id !== n.id);
        if (currentPriorityID === (n.id)) currentPriorityID = null;
        loadNotesAndUpdate();
      });
    });

    entry.appendChild(impBtn);
    entry.appendChild(delBtn);
    noteView.appendChild(entry);
  }
  // Helpers
  function trimHostname(url) {
    try { return new URL(url).hostname; }
    catch { return url || "Drawing"; }
  }

  function formatTimestamp(ts) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }


  // Drawing UI (moved into DOMContentLoaded scope)
  if (drawBoxContainer && toggleDrawBox) {
    toggleDrawBox.addEventListener('click', () => {
      drawBoxContainer.style.display =
        drawBoxContainer.style.display === 'none' ? 'block' : 'none';
    });

    const canvas = document.getElementById('drawarea');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorpicker');
    const brushsize = document.getElementById('brushsize');
    const eraser = document.getElementById('eraser');
    const clearBtn = document.getElementById('clear');
    const saveDrawing = document.getElementById('saveDrawing');

    // Always white canvas
    canvas.style.background = "#ffffff";

    let isDrawing = false;
    let lastX = 0, lastY = 0;
    let erasing = false;

    function applyPen() {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = colorPicker.value;
      ctx.lineWidth = Number(brushsize.value);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    applyPen();

    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();

      [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    function stopDrawing() {
      isDrawing = false;

      // ⭐ FIX: after user stops erasing → auto-restore to pen
      if (erasing) {
        erasing = false;
        applyPen();
        eraser.classList.remove("active");  // optional
      }
    }

    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    colorPicker.addEventListener('input', () => {
      if (!erasing) ctx.strokeStyle = colorPicker.value;
    });

    brushsize.addEventListener('input', () => {
      ctx.lineWidth = brushsize.value;
    });

    // CLICKING ERASER BUTTON enters erase mode
    eraser.addEventListener('click', () => {
      erasing = true;
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = Number(brushsize.value);
      eraser.classList.add("active");
    });

    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.background = "#ffffff";

      erasing = false;
      applyPen();
      eraser.classList.remove("active");
    });

    saveDrawing.addEventListener('click', () => {
      const dataURL = canvas.toDataURL('image/png');
      const id = `note-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      const drawingNote = {
        id,
        url: '',
        text: `<img src="${dataURL}" alt="Drawing Note">`,
        caption: '',
        important: false,
        lastModified: Date.now()
      };

      const setObj = {};
      setObj[id] = drawingNote;

      chrome.storage.local.set(setObj, () => {
        allNotes.unshift(drawingNote);
        loadNotesAndUpdate();
        alert('Drawing saved as note!');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.background = "#ffffff";

        erasing = false;
        applyPen();
        eraser.classList.remove("active");
      });
    });
  }
});
