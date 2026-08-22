(function(){
  const dishes = [
    {id:'item_0',name:'黑椒牛肉饭',price:28,emoji:'🍛',cat:'主食'},
    {id:'item_1',name:'番茄鸡蛋面',price:18,emoji:'🍜',cat:'主食'},
    {id:'item_2',name:'家常炒饭',price:20,emoji:'🍚',cat:'主食'},
    {id:'item_3',name:'咖喱鸡排饭',price:32,emoji:'🍛',cat:'主食'},
    {id:'item_4',name:'奶油意面',price:26,emoji:'🍝',cat:'主食'},
    {id:'item_5',name:'薯条',price:12,emoji:'🍟',cat:'小吃'},
    {id:'item_6',name:'烤鸡翅',price:22,emoji:'🍗',cat:'小吃'},
    {id:'item_7',name:'脆皮肠',price:10,emoji:'🌭',cat:'小吃'},
    {id:'item_8',name:'鸡米花',price:16,emoji:'🍿',cat:'小吃'},
    {id:'item_9',name:'洋葱圈',price:14,emoji:'🧅',cat:'小吃'},
    {id:'item_10',name:'冰可乐',price:5,emoji:'🥤',cat:'喝的'},
    {id:'item_11',name:'热牛奶',price:8,emoji:'🥛',cat:'喝的'},
    {id:'item_12',name:'橙汁',price:8,emoji:'🍊',cat:'喝的'},
    {id:'item_13',name:'柠檬茶',price:9,emoji:'🍋',cat:'喝的'},
    {id:'item_14',name:'热可可',price:12,emoji:'☕',cat:'喝的'},
    {id:'item_20',name:'小蛋糕',price:18,emoji:'🍰',cat:'甜的'},
    {id:'item_21',name:'冰淇淋',price:12,emoji:'🍦',cat:'甜的'},
    {id:'item_22',name:'焦糖布丁',price:16,emoji:'🍮',cat:'甜的'},
    {id:'item_23',name:'奶油泡芙',price:15,emoji:'🧁',cat:'甜的'},
    {id:'item_24',name:'小松饼',price:17,emoji:'🥞',cat:'甜的'}
  ];

  const style = document.createElement('style');
  style.textContent = `
    #homePage{padding:18px 16px 120px;background:#fffaf0;min-height:100vh}
    .home-hero{background:linear-gradient(180deg,#fff1ad,#ffe28a);border:1px solid #efd16b;border-radius:24px;padding:18px;box-shadow:0 8px 20px rgba(137,99,48,.08);margin-bottom:14px}
    .home-hero h2{margin:0;color:#684b36;font-size:23px}
    .home-hero p{margin:7px 0 0;color:#98765a;font-size:13px;line-height:1.65}
    .pick-card{background:#fffef9;border:1px solid #f0dfb2;border-radius:22px;padding:16px;box-shadow:0 6px 16px rgba(103,76,45,.05)}
    .pick-title{font-size:16px;font-weight:900;color:#6e503a;margin-bottom:4px}
    .pick-sub{font-size:12px;color:#aa8c73;margin-bottom:14px}
    .pick-list{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
    .pick-item{background:#fff7d5;border:1px solid #f0d777;border-radius:17px;padding:12px 8px;text-align:center;min-width:0}
    .pick-emoji{font-size:29px;margin-bottom:6px}
    .pick-name{font-size:12px;font-weight:800;color:#714f39;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .pick-meta{font-size:10px;color:#ae8a69;margin-top:3px}
    .pick-actions{display:grid;grid-template-columns:1fr 1.3fr;gap:10px;margin-top:14px}
    .pick-btn{height:46px;border-radius:15px;font-weight:900;font-size:14px;border:1px solid #e8c75e;background:#fff9df;color:#76543d}
    .pick-btn.primary{background:linear-gradient(180deg,#f6d86d,#efb951);color:#654731}
    .home-note{margin-top:12px;text-align:center;color:#b09276;font-size:11px}
  `;
  document.head.appendChild(style);

  let current = [];

  function shufflePick(){
    const pool = dishes.slice();
    for(let i=pool.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [pool[i],pool[j]]=[pool[j],pool[i]];
    }
    current = pool.slice(0,3);
    renderPicks();
  }

  function renderPicks(){
    const box = document.getElementById('pickList');
    if(!box) return;
    box.innerHTML = current.map(function(x){
      return `<div class="pick-item"><div class="pick-emoji">${x.emoji}</div><div class="pick-name">${x.name}</div><div class="pick-meta">${x.cat} · ¥${x.price}</div></div>`;
    }).join('');
  }

  function renderHome(){
    const page = document.getElementById('homePage');
    if(!page) return;
    page.innerHTML = `
      <div class="home-hero"><h2>今天不知道吃什么？ 🍮</h2><p>让小食堂帮你们随便挑三样，纠结的时候就交给运气。</p></div>
      <div class="pick-card">
        <div class="pick-title">今日随机推荐</div>
        <div class="pick-sub">不满意就换一组，满意就去点菜。</div>
        <div class="pick-list" id="pickList"></div>
        <div class="pick-actions"><button class="pick-btn" id="rerollPick">换一组</button><button class="pick-btn primary" id="gotoMenu">去点这组</button></div>
        <div class="home-note">这次只做推荐，不会自动往购物车里塞菜。</div>
      </div>`;
    document.getElementById('rerollPick').addEventListener('click', shufflePick);
    document.getElementById('gotoMenu').addEventListener('click', function(){
      const nav = Array.from(document.querySelectorAll('.nav')).find(function(n){ return n.dataset.page==='menuPage'; });
      if(nav && typeof window.switchPage==='function') window.switchPage(nav);
      if(typeof window.toast==='function') window.toast('这组看起来不错，去点菜吧 ♡');
    });
    shufflePick();
  }

  const originalSwitchPage = window.switchPage;
  window.switchPage = function(el){
    if(typeof originalSwitchPage==='function') originalSwitchPage(el);
    if(el && el.dataset && el.dataset.page==='homePage') renderHome();
  };

  renderHome();
})();