(function(){
  const api = typeof browser !== 'undefined' ? browser : chrome;
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const radios = Array.from(document.querySelectorAll('input[name="mode"]'));
  const donateBtn = document.getElementById('donate');
  let mqListener = null;

  function setPopupTheme(mode){
    const r = document.documentElement;
    r.classList.remove('dark','light');
    if (mode === 'dark') r.classList.add('dark');
    if (mode === 'light') r.classList.add('light');
  }

  function applyPopupTheme(mode){
    if (mqListener){ mq.removeEventListener('change', mqListener); mqListener = null; }
    if (mode === 'system'){
      setPopupTheme(mq.matches ? 'dark' : 'light');
      mqListener = (e)=> setPopupTheme(e.matches ? 'dark' : 'light');
      mq.addEventListener('change', mqListener);
    } else {
      setPopupTheme(mode);
    }
  }

  function tryNotifyActiveTab(msg){
    try {
      if (!api.tabs || !api.tabs.query) return;  // no "tabs" permission—skip
      api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs && tabs[0];
        if (tab && tab.id) {
          try { api.tabs.sendMessage(tab.id, msg); } catch(e){}
        }
      });
    } catch {}
  }

  if (donateBtn){
    donateBtn.addEventListener('click', () => {
      const url = 'https://www.paypal.com/donate/?hosted_button_id=ULWBB6SKP259J';
      try {
        if (api.tabs && api.tabs.create) api.tabs.create({ url });
        else window.open(url, '_blank', 'noopener');
      } catch {
        window.open(url, '_blank', 'noopener');
      }
    });
  }

  api.storage.sync.get('inatDarkPref', ({ inatDarkPref }) => {
    let v = 'system';
    if (inatDarkPref === 'dark') v = 'dark';
    else if (inatDarkPref === 'light') v = 'light';
    const el = document.getElementById('opt-' + v);
    if (el) el.checked = true;
    applyPopupTheme(v);
  });

  radios.forEach(r => r.addEventListener('change', () => {
    const v = (document.querySelector('input[name="mode"]:checked')||{}).value;
    if (v === 'system') {
      api.storage.sync.remove('inatDarkPref', () => {
        applyPopupTheme('system');
        tryNotifyActiveTab({ type: 'inat-reapply-theme' }); // optional
        // content.js should also react via storage.onChanged
      });
    } else {
      api.storage.sync.set({ inatDarkPref: v }, () => {
        applyPopupTheme(v);
        tryNotifyActiveTab({ type: 'inat-reapply-theme' }); // optional
        // content.js should also react via storage.onChanged
      });
    }
  }));
})();
