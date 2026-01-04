// DOM references
const listEl = document.getElementById('list');
const codeBoxEl = document.getElementById('codeBox');
const copyBtnEl = document.getElementById('copyBtn');
const titleEl = document.getElementById('currentTitle');
const toastEl = document.getElementById('toast');

let currentCode = '';
let currentId = null;

// Populate sidebar with practical names
function renderList() {
  listEl.innerHTML = '';
  PRACTICALS.forEach(p => {
    const li = document.createElement('button');
    li.type = 'button';
    li.className = 'item';
    li.textContent = p.name;
    li.setAttribute('data-id', p.id);
    li.addEventListener('click', () => onSelect(p));
    listEl.appendChild(li);
  });
}

// On selecting a practical: show code and update heading
function onSelect(p) {
  currentId = p.id;
  currentCode = sanitizeCode(p.code);
  codeBoxEl.textContent = currentCode;
  titleEl.textContent = p.name;
  highlightSelected(currentId);
  // enable copy button
  copyBtnEl.disabled = false;
}

// Highlight selected item
function highlightSelected(id) {
  const items = listEl.querySelectorAll('.item');
  items.forEach(el => {
    if (el.getAttribute('data-id') === id) {
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }
  });
}

// Clipboard copy using navigator.clipboard.writeText
function copyText(text) {
  const clean = sanitizeCode(text);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(clean)
      .then(() => showToast('Code Copied ✅'))
      .catch(() => showToast('Copy failed'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = clean;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    showToast('Code Copied ✅');
  }
}

function sanitizeCode(text) {
  let t = text || '';
  t = t.replace(/\uFEFF/g, '');
  t = t.replace(/\u00A0/g, ' ');
  t = t.replace(/Â /g, ' ');
  t = t.replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '');
  t = t.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  t = t.replace(/[ \t]+$/gm, '');
  t = t.replace(/^\s+|\s+$/g, '');
  return t;
}
// Toast message for 1.5 seconds
let toastTimer = null;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 1500);
}

// Manual copy button wiring
copyBtnEl.addEventListener('click', () => {
  if (currentCode) {
    copyText(currentCode);
  }
});

// Disable copy button initially until a practical is selected
copyBtnEl.disabled = true;

// Initialize app
renderList();
