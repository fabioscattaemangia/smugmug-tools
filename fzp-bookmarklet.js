// FABIO ZITO PHOTOGRAPHY — Preferiti (bookmarklet v2)
// Versione standalone: crea tutto da zero, non dipende dall'HTML SmugMug
(function(){
  if(document.getElementById('fzp-bar'))return;

  var css='li.sm-tile-wrapper{position:relative!important}.fzp-btn{position:absolute;top:8px;right:8px;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.9);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:999;box-shadow:0 1px 4px rgba(0,0,0,.2);transition:transform .15s,background .2s}.fzp-btn:hover{transform:scale(1.12)}.fzp-btn.on{background:#e8334a}.fzp-btn svg path{fill:#bbb;transition:fill .2s}.fzp-btn.on svg path{fill:#fff}@keyframes fzpP{0%{transform:scale(1)}50%{transform:scale(1.4)}100%{transform:scale(1)}}.fzp-btn.pop{animation:fzpP .3s ease}#fzp-bar{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:#1a1a1a;color:#fff;border-radius:999px;padding:12px 20px;display:flex;align-items:center;gap:14px;z-index:9999;font-family:-apple-system,sans-serif;font-size:14px;box-shadow:0 4px 24px rgba(0,0,0,.3);transition:transform .35s cubic-bezier(.34,1.56,.64,1);white-space:nowrap}#fzp-bar.show{transform:translateX(-50%) translateY(0)}#fzp-share{background:#e8334a;border:none;color:#fff;border-radius:999px;padding:7px 16px;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit}#fzp-clear{background:transparent;border:1px solid rgba(255,255,255,.3);color:rgba(255,255,255,.75);border-radius:999px;padding:6px 12px;font-size:12px;cursor:pointer;font-family:inherit}#fzp-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10000;align-items:center;justify-content:center}#fzp-overlay.open{display:flex}#fzp-modal{background:#fff;border-radius:16px;padding:28px;max-width:420px;width:calc(100vw - 40px);box-shadow:0 8px 40px rgba(0,0,0,.2)}#fzp-modal h3{margin:0 0 6px;font-size:17px;font-weight:600;color:#111}#fzp-modal p{margin:0 0 16px;font-size:14px;color:#666}#fzp-field{width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #ddd;border-radius:8px;font-size:13px;font-family:monospace;color:#333;background:#f9f9f9;resize:none;margin-bottom:14px}#fzp-copy{width:100%;padding:11px;background:#e8334a;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit;margin-bottom:10px}#fzp-close{width:100%;padding:9px;background:transparent;color:#888;border:1px solid #ddd;border-radius:8px;font-size:14px;cursor:pointer;font-family:inherit}';
  var st=document.createElement('style');
  st.textContent=css;
  document.head.appendChild(st);

  var bar=document.createElement('div');
  bar.id='fzp-bar';
  bar.innerHTML='<span id="fzp-count">0 preferite</span><button id="fzp-clear">Cancella</button><button id="fzp-share">❤ Condividi selezione</button>';
  document.body.appendChild(bar);

  var ov=document.createElement('div');
  ov.id='fzp-overlay';
  ov.innerHTML='<div id="fzp-modal"><h3>La tua selezione è pronta</h3><p>Copia il link e invialo a Fabio Zito Photography.</p><textarea id="fzp-field" rows="3" readonly></textarea><button id="fzp-copy">Copia link</button><button id="fzp-close">Chiudi</button></div>';
  document.body.appendChild(ov);

  var favs=[];

  function upd(){
    var n=favs.length;
    document.getElementById('fzp-count').textContent=n+(n===1?' preferita':' preferite');
    n>0?bar.classList.add('show'):bar.classList.remove('show');
  }

  function addH(){
    document.querySelectorAll('li.sm-tile-wrapper').forEach(function(el){
      if(el.querySelector('.fzp-btn'))return;
      var a=el.querySelector('a.sm-tile-content');
      if(!a)return;
      var id=encodeURIComponent(a.href);
      el.style.position='relative';
      var btn=document.createElement('button');
      btn.className='fzp-btn'+(favs.includes(id)?' on':'');
      btn.title='Aggiungi ai preferiti';
      btn.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
      btn.onclick=function(e){
        e.preventDefault();e.stopPropagation();
        btn.classList.add('pop');
        btn.addEventListener('animationend',function(){btn.classList.remove('pop');},{once:true});
        if(favs.includes(id)){favs=favs.filter(function(f){return f!==id;});btn.classList.remove('on');}
        else{favs.push(id);btn.classList.add('on');}
        upd();
      };
      el.appendChild(btn);
    });
  }

  document.getElementById('fzp-share').onclick=function(){
    if(!favs.length)return;
    document.getElementById('fzp-field').value=location.origin+location.pathname+'?sel='+favs.join(',');
    ov.classList.add('open');
  };
  document.getElementById('fzp-copy').onclick=function(){
    var f=document.getElementById('fzp-field');
    f.select();
    navigator.clipboard.writeText(f.value).then(function(){
      document.getElementById('fzp-copy').textContent='Copiato!';
      setTimeout(function(){document.getElementById('fzp-copy').textContent='Copia link';},2000);
    });
  };
  document.getElementById('fzp-close').onclick=function(){ov.classList.remove('open');};
  ov.onclick=function(e){if(e.target===ov)ov.classList.remove('open');};
  document.getElementById('fzp-clear').onclick=function(){
    favs=[];upd();
    document.querySelectorAll('.fzp-btn.on').forEach(function(b){b.classList.remove('on');});
  };

  addH();
  new MutationObserver(addH).observe(document.body,{childList:true,subtree:true});
  upd();
})();
