customElements.define(
  'paste-list-element',
  class PasteListOverlay extends HTMLElement {
    constructor() {
      super();

      const shadow = this.attachShadow({ mode: 'open' });

      const html = `
      <div id="paste-list-extension">
        <p id="paste-list-element-current-item"></p>
        <div>
          <button id="paste-list-element-stop">Stop</button>
          <button id="paste-list-element-continue">Start</button>
        </div>
      </div>
      <style>
        #paste-list-extension {
          position: fixed;
          top: 12px;
          right: 12px;
          background-color: #242424;
          padding: 12px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 9999;
        }
        
        #paste-list-extension p {
          font-family: Arial;
          margin: 0 auto;
          text-align: center;
          color: white;
          font-weight: bold;
        }
        
        #paste-list-extension div {
          display: flex;
          gap: 12px;
        }
        
        #paste-list-extension button {
          background: none;
          border: none;
          font-family: Arial;
          font-size: 14px;
          font-weight: bold;
          opacity: 0.7;
        }
        
        #paste-list-extension button:hover {
          opacity: 1;
        }
        
        #paste-list-extension button:active {
          opacity: 0.85;
        }
        
        #paste-list-extension #paste-list-element-stop {
          color: #ed4245;
        }
        
        #paste-list-extension #paste-list-element-continue {
          color: #22c55e;
        }
      </style>
    `;

      shadow.innerHTML = html;
    }
  }
);
