var pl_index = -1;
var pl_list = null;
var pl_selected = null;
var pl_current = null;

function pl_log(msg) {
  console.log(`Paste List (${pl_selected}): ${msg}`);
}

function pl_onPaste() {
  if (pl_list != null && pl_index >= 0) {
    if (pl_index >= pl_list.length) {
      pl_stop(true);
      return;
    }
    navigator.clipboard.writeText(pl_list[pl_index]);
    pl_log(`copied index ${pl_index} to clipboard`);
    pl_current.innerText = pl_selected + ': ' + (pl_index + 1);
    pl_index++;
  }
}

function pl_start(items) {
  pl_log('starting paste handler');

  if (document.getElementById('paste-list-extension') != null) {
    pl_log('detected active paste list, removing that first');
    pl_stop(false);
    pl_log('removed active paste list');
  }

  pl_list = items;
  pl_index = -1;

  pl_log('initialized paste handler');

  document.addEventListener('paste', pl_onPaste, true);

  pl_log('added paste event listener to document');

  const html = `
    <div id="paste-list-extension">
      <p id="paste-list-element-current-item">
        ${pl_selected}
      </p>
      <div>
        <button id="paste-list-element-stop">
          Stop
        </button>
        <button id="paste-list-element-continue">
          Start
        </button>
      </div>
    </div>
  `;

  document.body.innerHTML += html;
  pl_current = document.getElementById('paste-list-element-current-item');

  document
    .getElementById('paste-list-element-stop')
    .addEventListener('click', () => {
      pl_stop(false);
    });

  let continueButton = document.getElementById('paste-list-element-continue');

  continueButton.addEventListener('click', () => {
    if (pl_index < 0) {
      pl_index = 0;
      continueButton.innerText = 'Skip';
    }
    pl_onPaste();
  });

  pl_log(`added paste list element to document body`);
}

function pl_stop(complete) {
  pl_log(`stopping paste handler (${complete ? 'complete' : 'cancelled'})`);

  pl_list = null;
  document.removeEventListener('paste', pl_onPaste, true);

  pl_log(`removed paste event listener from document`);

  document.getElementById('paste-list-extension').remove();

  pl_log(`removed paste list element from document body`);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'start') {
    pl_selected = message.selected;
    pl_start(message.items);
  }
  if (message.action === 'stop') {
    pl_stop(false);
  }
});
