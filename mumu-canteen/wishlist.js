(function(){
  const KEY = 'mumu-canteen-wishlist-v1';

  const style = document.createElement('style');
  style.textContent = `
    .static-item{position:relative}
    .wish-heart{position:absolute;top:9px;left:9px;z-index:3;width:31px;height:31px;border-radius:50%;border:1px solid #efd477;background:rgba(255,249,223,.96);color:#a98a6f;font-size:18px;line-height:29px;text-align:center;padding:0;box-shadow:0 3px 9px rgba(112,80,50,.08)}
    .wish-heart.active{background:#fff0b6;color:#d77b72;border-color:#ebc86a}
    .wishlist-card{margin-top:12px;background:#fffef9;border:1px solid #f0dfb2;border-radius:22px;padding:16px;box-shadow:0 6px 16px rgba(103,76,45,.05)}
    .wishlist-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:4px}
    .wishlist-title{font-size:16px;font-weight:900;color:#6e503a}
    .wishlist-count{font-size:11px;color:#98765a;background:#fff1b5;border:1px solid #edd276;border-radius:999px;padding:4px 8px}
    .wishlist-sub{font-size:12px;color:#aa8c73;margin-bottom:12px}
    .wishlist-empty{padding:18px 8px;text-align:center;color:#b09276;font-size:12px;line-height:1.7}
    .wishlist-list{display:flex;flex-direction:column;gap:8px}
    .wishlist-row{display:flex;align-items:center;gap:10px;background:#fff8dc;border:1px solid #f1dc91;border-radius:16px;padding:10px}
    .wishlist-emoji{width:38px;height:38px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:#ffe9a3;font-size:22px;flex:none}
    .wishlist-info{min-width:0;flex:1}
    .wishlist-name{font-size:13px;font-weight:900;color:#72523c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .wishlist-meta{font-size:10px;color:#a98a70;margin-top:2px}
    .wishlist-remove{border:0;background:transparent;color:#b79376;font-size:18px;padding:7px}
    .wishlist-go{margin-top:11px;width:100%;height:44px;border-radius:15px;border:1px solid #e8c75e;background:linear-gradient(180deg,#f6d86d,#efb951);color:#654731;font-size:14px;font-weight:900}
  `;
  document.head.appendChild(style);

  function getList(){
    try{return JSON.parse(localStorage.getItem(KEY) || '[]');}catch(e){return [];}
  }

  function saveList(list){
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function isSaved(id){
    return getList().some(function(x){return x.id===id;});
  }

  function readDish(item){
    const section = item.closest('.static-section');
    return {
      id:item.id,
      name:item.dataset.name || '',
      price:Number(item.dataset.price || 0),
      emoji:(item.querySelector('.thumb') || {}).textContent || '🍮',
      cat:section && section.querySelector('.section-title') ? section.querySelector('.section-title').textContent.trim() : '菜单'
    };
  }

  function refreshHeart(btn){
    const saved = isSaved(btn.dataset.id);
    btn.classList.toggle('active', saved);
    btn.textContent = saved ? '♥' : '♡';
    btn.setAttribute('aria-label', saved ? '移出想吃清单' : '加入想吃清单');
  }

  function attachHearts(){
    document.querySelectorAll('.static-item').forEach(function(item){
      let btn = item.querySelector('.wish-heart');
      if(!btn){
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'wish-heart';
        btn.dataset.id = item.id;
        btn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          const dish = readDish(item);
          let list = getList();
          const exists = list.some(function(x){return x.id===dish.id;});
          if(exists){
            list = list.filter(function(x){return x.id!==dish.id;});
            if(typeof window.toast==='function') window.toast('已经从想吃清单移除');
          }else{
            list.unshift(dish);
            if(typeof window.toast==='function') window.toast('已加入想吃清单 ♡');
          }
          saveList(list);
          refreshHeart(btn);
          renderWishlist();
        });
        item.appendChild(btn);
      }
      refreshHeart(btn);
    });
  }

  function renderWishlist(){
    const home = document.getElementById('homePage');
    if(!home) return;
    let card = document.getElementById('wishlistCard');
    if(!card){
      card = document.createElement('div');
      card.id = 'wishlistCard';
      card.className = 'wishlist-card';
      const pick = home.querySelector('.pick-card');
      if(pick) pick.insertAdjacentElement('afterend', card);
      else home.appendChild(card);
    }

    const list = getList();
    let body = '';
    if(!list.length){
      body = '<div class="wishlist-empty">还没有收藏想吃的菜。<br>去点菜页点一下菜品左上角的 ♡ 吧。</div>';
    }else{
      body = '<div class="wishlist-list">'+list.map(function(x){
        return '<div class="wishlist-row"><div class="wishlist-emoji">'+x.emoji+'</div><div class="wishlist-info"><div class="wishlist-name">'+x.name+'</div><div class="wishlist-meta">'+x.cat+' · ¥'+x.price+'</div></div><button class="wishlist-remove" type="button" data-wish-remove="'+x.id+'">×</button></div>';
      }).join('')+'</div><button class="wishlist-go" type="button" id="wishlistGo">去点菜</button>';
    }

    card.innerHTML = '<div class="wishlist-head"><div class="wishlist-title">我们的想吃清单 ♡</div><div class="wishlist-count">'+list.length+' 道</div></div><div class="wishlist-sub">看到想吃的先记下来，下次纠结就来这里翻。</div>'+body;

    card.querySelectorAll('[data-wish-remove]').forEach(function(btn){
      btn.addEventListener('click', function(){
        const id = btn.dataset.wishRemove;
        saveList(getList().filter(function(x){return x.id!==id;}));
        const heart = document.querySelector('.wish-heart[data-id="'+id+'"]');
        if(heart) refreshHeart(heart);
        renderWishlist();
      });
    });

    const go = document.getElementById('wishlistGo');
    if(go) go.addEventListener('click', function(){
      const nav = Array.from(document.querySelectorAll('.nav')).find(function(n){return n.dataset.page==='menuPage';});
      if(nav && typeof window.switchPage==='function') window.switchPage(nav);
    });
  }

  const previousSwitchPage = window.switchPage;
  window.switchPage = function(el){
    if(typeof previousSwitchPage==='function') previousSwitchPage(el);
    if(el && el.dataset && el.dataset.page==='homePage') renderWishlist();
    if(el && el.dataset && el.dataset.page==='menuPage') attachHearts();
  };

  window.renderWishlist = renderWishlist;
  attachHearts();
  renderWishlist();
})();