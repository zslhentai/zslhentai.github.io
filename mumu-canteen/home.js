(function(){
  const VERSION='202608231247';
  const IMG={};
  const assetSources={
    hero1:'home-assets/img0.b64',
    hero2:'home-assets/img1.b64',
    hero3:'home-assets/img2.b64',
    eat:'preview-assets/eat.b64',
    take:'preview-assets/take.b64',
    random:'preview-assets/random.b64',
    feature:'preview-assets/feature.b64',
    footer:'preview-assets/footer.b64'
  };

  const dishes=[
    '黑椒牛肉饭','番茄鸡蛋面','家常炒饭','咖喱鸡排饭','奶油意面','薯条','烤鸡翅','脆皮肠','鸡米花','洋葱圈','冰可乐','热牛奶','橙汁','柠檬茶','热可可','小蛋糕','冰淇淋','焦糖布丁','奶油泡芙','小松饼'
  ];

  const style=document.createElement('style');
  style.textContent=`
    #homePage{padding:0 0 106px;min-height:100vh;background:linear-gradient(180deg,#fff3bd 0%,#fff7d8 54%,#fff9e6 100%);color:#5b3929;overflow-x:hidden}
    .mh-wrap{padding:18px 14px 18px;max-width:520px;margin:0 auto}

    .mh-head{height:48px;display:flex;align-items:center;justify-content:center;position:relative;margin-bottom:10px}
    .mh-title{position:relative;font-size:27px;font-weight:950;letter-spacing:3px;color:#512d20;line-height:1;white-space:nowrap;text-shadow:0 1px 0 rgba(255,255,255,.8)}
    .mh-title:before{content:'♥';position:absolute;left:-30px;top:-3px;color:#f39a82;font-size:13px;transform:rotate(-12deg)}
    .mh-title:after{content:'✿';position:absolute;right:-29px;bottom:-3px;color:#eea06e;font-size:14px;transform:rotate(10deg)}
    .mh-mini{position:absolute;right:0;top:5px;width:70px;height:38px;border:0;background:rgba(255,255,255,.94);border-radius:21px;box-shadow:0 5px 14px rgba(111,76,37,.09);display:flex;align-items:center;justify-content:center;gap:9px;color:#4e3226;padding:0}
    .mh-mini:before{content:'•••';font-size:16px;letter-spacing:1px;transform:translateY(-2px)}
    .mh-mini:after{content:'';width:17px;height:17px;border:3px solid #4e3226;border-radius:50%;box-sizing:border-box}

    .mh-hero{margin:0 0 13px}
    .mh-viewport{overflow:hidden;border-radius:23px;border:4px solid rgba(255,255,255,.93);box-shadow:0 7px 16px rgba(139,98,36,.13);background:#fff}
    .mh-track{display:flex;transition:transform .36s ease}
    .mh-slide{min-width:100%;height:184px;position:relative;overflow:hidden;background:#dfebff}
    .mh-hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;image-rendering:auto;transform:translateZ(0)}
    .mh-slide.one .mh-hero-bg{object-position:center 28%}
    .mh-slide.two .mh-hero-bg{object-position:center 48%}
    .mh-slide.three .mh-hero-bg{object-position:center 42%}
    .mh-shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(53,44,30,.28) 0%,rgba(66,46,31,.14) 36%,rgba(255,255,255,0) 69%)}
    .mh-copy{position:absolute;z-index:3;left:17px;top:18px;width:53%;color:white;text-align:left}
    .mh-kicker{display:inline-flex;align-items:center;min-height:25px;padding:0 10px;border-radius:999px;background:#f8d756;color:#64452c;font-size:11px;font-weight:900;box-shadow:0 2px 6px rgba(74,49,28,.12)}
    .mh-kicker:before{content:'●';font-size:8px;margin-right:5px}
    .mh-copy h2{margin:12px 0 7px;font-size:25px;line-height:1.12;font-weight:950;letter-spacing:.5px;color:#fff7e8;text-shadow:2px 0 #603929,-2px 0 #603929,0 2px #603929,0 -2px #603929,1px 1px #603929,-1px -1px #603929}
    .mh-copy p{margin:0;font-size:11px;font-weight:800;line-height:1.5;color:#fff9ee;text-shadow:0 1px 3px rgba(52,31,19,.75)}
    .mh-dots{height:26px;display:flex;justify-content:center;align-items:center;gap:10px}
    .mh-dot{border:0;padding:0;width:9px;height:9px;border-radius:50%;background:#dccca4;transition:.2s}.mh-dot.active{width:10px;height:10px;background:#68432f}

    .mh-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:0 0 15px}
    .mh-action{border:3px solid rgba(255,255,255,.9);background:#fffaf0;border-radius:20px;overflow:hidden;padding:0;color:#5a392b;box-shadow:0 6px 13px rgba(125,88,41,.10);text-align:center;min-width:0}
    .mh-action-imgbox{height:101px;background:#f8e39b;overflow:hidden}
    .mh-action img{width:100%;height:100%;object-fit:cover;display:block;image-rendering:auto;transform:translateZ(0)}
    #mhEat img{object-position:center 50%}#mhTake img{object-position:center 43%}#mhRandom img{object-position:center 47%}
    .mh-action-text{padding:10px 3px 11px;background:linear-gradient(180deg,#fffdf8,#fff8e9)}
    .mh-action strong{display:block;font-size:16px;line-height:1.05;font-weight:950;white-space:nowrap;letter-spacing:.5px}
    .mh-action small{display:block;margin-top:6px;color:#9b7b65;font-size:10px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 1px}

    .mh-panel{position:relative;background:rgba(255,255,255,.92);border:2px solid rgba(245,222,163,.83);border-radius:24px;padding:15px 12px 14px;margin:0 0 14px;box-shadow:0 7px 16px rgba(118,80,37,.09)}
    .mh-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin:0 4px 11px}
    .mh-panel h3{margin:0;font-size:18px;line-height:1.2;font-weight:950;letter-spacing:.3px;color:#563729}
    .mh-panel .mh-sub{margin-top:5px;font-size:10px;color:#a3836d}
    .mh-paw{font-size:17px;color:#e99579;margin-top:0}
    .mh-features{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
    .mh-feature{border:0;background:transparent;color:#5b3a2c;padding:0;text-align:center;min-width:0}
    .mh-feature-pic{height:91px;border-radius:16px;overflow:hidden;background:#fce9ab}
    .mh-feature-pic img{width:100%;height:100%;object-fit:cover;display:block;image-rendering:auto;transform:translateZ(0)}
    #mhWish img{object-position:center 38%}
    .mh-feature strong{display:block;margin-top:8px;font-size:14px;line-height:1.05;font-weight:950;white-space:nowrap}
    .mh-feature span{display:block;margin-top:5px;font-size:9px;color:#9f806b;line-height:1.28;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

    .mh-footer-card{position:relative;height:86px;border-radius:21px;overflow:hidden;background:linear-gradient(135deg,#ffd76e,#ffc65d);box-shadow:0 6px 13px rgba(146,97,27,.12)}
    .mh-footer-copy{position:relative;z-index:3;width:58%;height:100%;display:flex;flex-direction:column;justify-content:center;padding-left:18px;box-sizing:border-box}
    .mh-footer-copy strong{display:block;font-size:20px;line-height:1.34;font-weight:950;color:#58352a;letter-spacing:1px}
    .mh-footer-copy p{display:none}
    .mh-footer-pic{position:absolute;right:-3px;top:-19px;width:137px;height:137px;object-fit:cover;object-position:center center;border:0;border-radius:0;background:transparent;image-rendering:auto;transform:translateZ(0)}
    .mh-footer-card:before{content:'';position:absolute;left:0;bottom:0;width:100%;height:22px;background:linear-gradient(90deg,rgba(255,255,255,.15),rgba(255,255,255,.04));opacity:.8}

    #wishlistCard.mh-wish-popup{display:none;margin-top:14px}
    #wishlistCard.mh-wish-popup.open{display:block}
    .mh-toastpick{position:fixed;left:50%;bottom:105px;transform:translateX(-50%);z-index:130;width:min(88%,430px);background:#6c4d39;color:#fff7ea;border-radius:18px;padding:13px 15px;text-align:center;font-size:13px;box-shadow:0 12px 26px rgba(65,45,30,.22);opacity:0;pointer-events:none;transition:.2s}
    .mh-toastpick.show{opacity:1}

    @media(max-width:390px){
      .mh-wrap{padding-left:12px;padding-right:12px}.mh-title{font-size:24px;letter-spacing:2px}.mh-mini{width:64px;height:36px}.mh-slide{height:173px}.mh-copy{left:15px;top:16px;width:56%}.mh-copy h2{font-size:22px}.mh-action-imgbox{height:94px}.mh-action strong{font-size:15px}.mh-action small{font-size:9px}.mh-feature-pic{height:84px}.mh-panel h3{font-size:17px}.mh-footer-copy strong{font-size:18px}
    }
  `;
  document.head.appendChild(style);

  function detectMime(base64){
    const s=(base64||'').replace(/\s+/g,'');
    if(s.startsWith('/9j/')) return 'image/jpeg';
    if(s.startsWith('iVBOR')) return 'image/png';
    if(s.startsWith('R0lGOD')) return 'image/gif';
    if(s.startsWith('UklGR')) return 'image/webp';
    try{
      const head=atob(s.slice(0,96));
      if(head.slice(4,8)==='ftyp'){
        const brand=head.slice(8,24);
        if(brand.includes('avif')||brand.includes('avis')) return 'image/avif';
      }
    }catch(e){}
    return 'image/jpeg';
  }

  function loadAsset(key){
    if(IMG[key]) return Promise.resolve(IMG[key]);
    const path=assetSources[key];
    if(!path) return Promise.resolve('assets/home.webp');
    return fetch(path+'?v='+VERSION,{cache:'no-store'})
      .then(r=>{if(!r.ok) throw new Error('asset '+r.status);return r.text()})
      .then(t=>{
        const clean=t.trim().replace(/\s+/g,'');
        IMG[key]='data:'+detectMime(clean)+';base64,'+clean;
        return IMG[key];
      })
      .catch(()=>{IMG[key]='assets/home.webp';return IMG[key]});
  }

  function setImg(el,key){
    if(!el) return;
    loadAsset(key).then(src=>{if(el && document.body.contains(el)) el.src=src});
  }

  let heroIndex=0,heroTimer=null;
  function setHero(i){
    const track=document.getElementById('mhTrack');
    const dots=[...document.querySelectorAll('.mh-dot')];
    if(!track||!dots.length) return;
    heroIndex=(i+dots.length)%dots.length;
    track.style.transform='translateX(-'+heroIndex*100+'%)';
    dots.forEach((d,j)=>d.classList.toggle('active',j===heroIndex));
  }
  function startHero(){clearInterval(heroTimer);heroTimer=setInterval(()=>setHero(heroIndex+1),3800)}
  function go(page){
    const n=[...document.querySelectorAll('.nav')].find(x=>x.dataset.page===page);
    if(n && typeof window.switchPage==='function') window.switchPage(n);
  }
  function pickThree(){
    const pool=dishes.slice();
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
    return pool.slice(0,3);
  }
  let popTimer;
  function showPick(){
    const t=document.getElementById('mhPickToast');if(!t)return;
    t.textContent='今天就吃：'+pickThree().join(' · ');t.classList.add('show');
    clearTimeout(popTimer);popTimer=setTimeout(()=>t.classList.remove('show'),2600);
  }

  function renderHome(){
    const page=document.getElementById('homePage');if(!page)return;
    page.innerHTML=`
      <div class="mh-wrap">
        <div class="mh-head"><div class="mh-title">仫仫的小食堂</div><button class="mh-mini" type="button" aria-label="更多"></button></div>

        <div class="mh-hero">
          <div class="mh-viewport"><div class="mh-track" id="mhTrack">
            <article class="mh-slide one"><img class="mh-hero-bg" data-img="hero1" alt=""><div class="mh-shade"></div><div class="mh-copy"><span class="mh-kicker">今日营业</span><h2>仫仫的小食堂<br>营业中～</h2><p>今天也要一起好好吃饭呀 ♡</p></div></article>
            <article class="mh-slide two"><img class="mh-hero-bg" data-img="hero2" alt=""><div class="mh-shade"></div><div class="mh-copy"><span class="mh-kicker">今日推荐</span><h2>想吃什么<br>就记下来吧</h2><p>放进我们的想吃清单 ♡</p></div></article>
            <article class="mh-slide three"><img class="mh-hero-bg" data-img="hero3" alt=""><div class="mh-shade"></div><div class="mh-copy"><span class="mh-kicker">随机一下</span><h2>不知道吃什么<br>就交给运气</h2><p>小食堂帮我们决定。</p></div></article>
          </div></div>
          <div class="mh-dots"><button class="mh-dot active" type="button"></button><button class="mh-dot" type="button"></button><button class="mh-dot" type="button"></button></div>
        </div>

        <div class="mh-actions">
          <button class="mh-action" id="mhEat"><div class="mh-action-imgbox"><img data-img="eat" alt=""></div><div class="mh-action-text"><strong>现在吃</strong><small>马上看看吃什么</small></div></button>
          <button class="mh-action" id="mhTake"><div class="mh-action-imgbox"><img data-img="take" alt=""></div><div class="mh-action-text"><strong>带走吃</strong><small>打包带走也美味</small></div></button>
          <button class="mh-action" id="mhRandom"><div class="mh-action-imgbox"><img data-img="random" alt=""></div><div class="mh-action-text"><strong>随机吃</strong><small>交给小食堂决定</small></div></button>
        </div>

        <section class="mh-panel">
          <div class="mh-panel-head"><div><h3>我们最近在忙什么呀 ♡</h3><div class="mh-sub">三个最常用的小入口。</div></div><div class="mh-paw">✿</div></div>
          <div class="mh-features">
            <button class="mh-feature" id="mhWish"><div class="mh-feature-pic"><img data-img="feature" alt=""></div><strong>想吃清单</strong><span>看看我们想吃啥</span></button>
            <button class="mh-feature" id="mhToday"><div class="mh-feature-pic"><img data-img="hero2" alt=""></div><strong>今日推荐</strong><span>看看今天吃什么</span></button>
            <button class="mh-feature" id="mhRecord"><div class="mh-feature-pic"><img data-img="hero1" alt=""></div><strong>吃饭记录</strong><span>记录我们的小幸福</span></button>
          </div>
        </section>

        <section class="mh-footer-card"><div class="mh-footer-copy"><strong>今天也要一起<br>好好吃饭 ♡</strong><p>仫仫的小食堂今天也营业中。</p></div><img class="mh-footer-pic" data-img="footer" alt=""></section>
        <div id="wishlistCard" class="wishlist-card mh-wish-popup"></div>
      </div>
      <div class="mh-toastpick" id="mhPickToast"></div>`;

    document.querySelectorAll('#homePage [data-img]').forEach(el=>setImg(el,el.dataset.img));
    document.querySelectorAll('.mh-dot').forEach((d,i)=>d.addEventListener('click',()=>{setHero(i);startHero()}));
    setHero(0);startHero();

    document.getElementById('mhEat').onclick=()=>{go('menuPage');if(typeof window.setMode==='function')window.setMode('dine')};
    document.getElementById('mhTake').onclick=()=>{go('menuPage');if(typeof window.setMode==='function')window.setMode('pickup')};
    document.getElementById('mhRandom').onclick=showPick;
    document.getElementById('mhToday').onclick=showPick;
    document.getElementById('mhRecord').onclick=()=>go('ordersPage');
    document.getElementById('mhWish').onclick=()=>{
      const card=document.getElementById('wishlistCard');
      if(card){card.classList.toggle('open');if(card.classList.contains('open'))setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'nearest'}),50)}
    };
  }

  const originalSwitchPage=window.switchPage;
  window.switchPage=function(el){
    if(typeof originalSwitchPage==='function') originalSwitchPage(el);
    if(el&&el.dataset&&el.dataset.page==='homePage') renderHome();
  };
  window.renderHome=renderHome;
  renderHome();
})();
