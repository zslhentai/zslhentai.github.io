(function(){
  const KEY = 'mumu-canteen-records-v1';

  const style = document.createElement('style');
  style.textContent = `
    #ordersPage{padding:18px 16px 120px;background:#fffaf0;min-height:100vh}
    .record-top{background:linear-gradient(180deg,#fff1ad,#ffe28a);border:1px solid #efd16b;border-radius:22px;padding:18px;box-shadow:0 8px 20px rgba(137,99,48,.08);margin-bottom:14px}
    .record-top h2{margin:0;color:#684b36;font-size:22px}
    .record-top p{margin:6px 0 0;color:#98765a;font-size:13px;line-height:1.6}
    .record-list{display:flex;flex-direction:column;gap:12px}
    .record-card{background:#fffef9;border:1px solid #f0dfb2;border-radius:20px;padding:15px;box-shadow:0 6px 16px rgba(103,76,45,.05)}
    .record-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
    .record-date{font-size:16px;font-weight:900;color:#694d38}
    .record-time{margin-top:3px;font-size:12px;color:#ad9279}
    .record-mode{flex:none;background:#fff0b6;border:1px solid #efd271;color:#7a593f;padding:5px 9px;border-radius:999px;font-size:11px;font-weight:800}
    .record-dish{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-top:1px dashed #f0dfbf}
    .record-dish:first-of-type{border-top:0}
    .record-dish-main{min-width:0}
    .record-name{font-size:14px;font-weight:800;color:#73533d}
    .record-meta{font-size:11px;color:#aa8c73;line-height:1.5;margin-top:2px}
    .record-price{flex:none;color:#76543d;font-size:13px;font-weight:800}
    .record-foot{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:11px;border-top:1px solid #f3e5c6;color:#8d6c52;font-size:12px}
    .record-total{font-size:17px;font-weight:900;color:#654731}
    .record-empty{text-align:center;padding:70px 20px;color:#b09175}
    .record-empty .emoji{font-size:50px;margin-bottom:12px}
    .record-empty b{display:block;color:#765841;font-size:17px;margin-bottom:5px}
  `;
  document.head.appendChild(style);

  function getRecords(){
    try{return JSON.parse(localStorage.getItem(KEY) || '[]');}catch(e){return [];}
  }

  function saveRecords(records){
    localStorage.setItem(KEY, JSON.stringify(records));
  }

  function esc(v){
    return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function formatRecordTime(ts){
    const d = new Date(ts);
    return {
      date:(d.getMonth()+1)+'月'+d.getDate()+'日',
      time:String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')
    };
  }

  function renderRecords(){
    const page = document.getElementById('ordersPage');
    if(!page) return;
    const records = getRecords();
    let body = '';

    if(!records.length){
      body = `<div class="record-empty"><div class="emoji">🍮</div><b>还没有吃饭记录</b><span>第一次点完「就吃这些」后，会记在这里。</span></div>`;
    }else{
      body = '<div class="record-list">'+records.map(function(r){
        const ft = formatRecordTime(r.createdAt);
        const dishes = r.items.map(function(x){
          const meta = [x.person ? x.person+'点的' : '', x.spec || '', '×'+x.qty].filter(Boolean).join(' · ');
          return `<div class="record-dish"><div class="record-dish-main"><div class="record-name">${esc(x.name)}</div><div class="record-meta">${esc(meta)}</div></div><div class="record-price">¥${(x.price*x.qty).toFixed(2)}</div></div>`;
        }).join('');
        return `<div class="record-card"><div class="record-head"><div><div class="record-date">${ft.date} · 今天吃了这些</div><div class="record-time">${ft.time}</div></div><div class="record-mode">${r.mode==='dine'?'现在吃':'带走吃'}</div></div>${dishes}<div class="record-foot"><span>共 ${r.count} 份</span><span class="record-total">¥${r.total.toFixed(2)}</span></div></div>`;
      }).join('')+'</div>';
    }

    page.innerHTML = `<div class="record-top"><h2>我们的吃饭记录 🍮</h2><p>每次点完「就吃这些」，都会在这里留下一条小记录。</p></div>${body}`;
  }

  const originalSubmitOrder = window.submitOrder;
  window.submitOrder = function(){
    const entries = Object.entries(window.cart || cart || {});
    if(!entries.length){
      if(typeof originalSubmitOrder === 'function') originalSubmitOrder();
      return;
    }

    const items = entries.map(function(pair){
      const x = pair[1];
      return {name:x.name, price:x.price, qty:x.qty, spec:x.spec || '', person:x.person || ''};
    });
    const count = items.reduce((s,x)=>s+x.qty,0);
    const total = items.reduce((s,x)=>s+x.qty*x.price,0);
    const records = getRecords();
    records.unshift({createdAt:Date.now(), mode:window.orderMode || orderMode || 'pickup', count:count, total:total, items:items});
    saveRecords(records.slice(0,100));

    if(typeof closeCart === 'function') closeCart();
    const ids = [...new Set(Object.values(cart).map(function(x){return x.itemId;}))];
    cart = {};
    ids.forEach(function(id){ if(typeof renderControl === 'function') renderControl(id); });
    if(typeof updateCart === 'function') updateCart();
    renderRecords();
    if(typeof toast === 'function') toast('已经记进吃饭记录啦 ♡');
  };

  const originalSwitchPage = window.switchPage;
  window.switchPage = function(el){
    if(typeof originalSwitchPage === 'function') originalSwitchPage(el);
    if(el && el.dataset && el.dataset.page === 'ordersPage') renderRecords();
  };

  renderRecords();
})();
