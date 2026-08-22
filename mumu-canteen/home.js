(function(){
  const VERSION='202608230225';
  const IMG={};
  const assetNames={
    hero1:'hero1',hero2:'hero2',hero3:'hero3',eat:'eat',take:'take',random:'random',feature:'feature',footer:'footer'
  };

  const dishes=[
    '黑椒牛肉饭','番茄鸡蛋面','家常炒饭','咖喱鸡排饭','奶油意面','薯条','烤鸡翅','脆皮肠','鸡米花','洋葱圈','冰可乐','热牛奶','橙汁','柠檬茶','热可可','小蛋糕','冰淇淋','焦糖布丁','奶油泡芙','小松饼'
  ];

  const style=document.createElement('style');
  style.textContent=`
    #homePage{padding:0 0 110px;background:linear-gradient(180deg,#fff8d9 0%,#fffdf5 100%);min-height:100vh;color:#654832}
    .mh-wrap{padding:14px 14px 22px}
    .mh-head{display:flex;align-items:center;justify-content:center;position:relative;padding:5px 4px 14px}
    .mh-title{font-size:26px;font-weight:900;letter-spacing:2px;color:#5b3b2c;text-shadow:0 1px 0 #fff}
    .mh-title:before,.mh-title:after{content:'♡';font-size:15px;color:#ec9d85;margin:0 7px;vertical-align:5px}
    .mh-mini{position:absolute;right:0;top:0;height:38px;padding:0 13px;border:1px solid #f1dfb3;background:rgba(255,255,255,.82);border-radius:20px;color:#6d503b;font-weight:900;font-size:18px;box-shadow:0 5px 12px rgba(117,84,47,.06)}

    .mh-hero{position:relative;margin-bottom:13px}
    .mh-viewport{overflow:hidden;border-radius:28px;border:3px solid rgba(255,255,255,.88);box-shadow:0 11px 22px rgba(142,103,45,.12)}
    .mh-track{display:flex;transition:transform .38s ease}
    .mh-slide{min-width:100%;height:255px;position:relative;overflow:hidden;box-sizing:border-box;padding:20px 18px}
    .mh-slide.one{background:linear-gradient(135deg,#88d8fa 0%,#b8eaff 45%,#fff1a5 100%)}
    .mh-slide.two{background:linear-gradient(135deg,#ffd9e8 0%,#fff0bd 58%,#e7f6c8 100%)}
    .mh-slide.three{background:linear-gradient(135deg,#c9efff 0%,#dff7ff 50%,#fff4bd 100%)}
    .mh-copy{position:relative;z-index:3;width:56%}
    .mh-kicker{display:inline-flex;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.78);font-size:11px;font-weight:900;color:#6b513e;box-shadow:0 3px 8px rgba(100,70,40,.06)}
    .mh-copy h2{margin:16px 0 8px;font-size:26px;line-height:1.18;color:#5a3c2d;letter-spacing:.5px}
    .mh-copy p{margin:0;font-size:12px;line-height:1.65;color:#856b58}
    .mh-hero-img{position:absolute;right:10px;bottom:8px;width:138px;height:138px;object-fit:cover;border-radius:28px;box-shadow:0 10px 22px rgba(81,60,42,.12);border:4px solid rgba(255,255,255,.72);background:#fff4b8}
    .mh-dots{display:flex;justify-content:center;gap:8px;margin-top:10px}
    .mh-dot{border:0;padding:0;width:8px;height:8px;border-radius:10px;background:#dfc780}.mh-dot.active{width:24px;background:#8a6248}

    .mh-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0}
    .mh-action{border:1px solid #ecd9a4;background:#fffdf6;border-radius:22px;overflow:hidden;padding:0;color:#664832;box-shadow:0 8px 18px rgba(123,89,43,.07);text-align:center}
    .mh-action-imgbox{height:112px;background:#fff0b4;overflow:hidden}
    .mh-action img{width:100%;height:100%;object-fit:cover;display:block}
    .mh-action-text{padding:12px 5px 13px}
    .mh-action strong{display:block;font-size:16px;line-height:1.15;white-space:nowrap}
    .mh-action small{display:block;margin-top:6px;color:#a98b73;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

    .mh-panel{background:rgba(255,255,255,.82);border:1px solid #efdfb9;border-radius:25px;padding:16px;margin:0 0 14px;box-shadow:0 8px 19px rgba(116,83,45,.06)}
    .mh-panel-head{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;margin-bottom:12px}
    .mh-panel h3{margin:0;font-size:19px;color:#604331}.mh-panel .mh-sub{margin-top:4px;font-size:11px;color:#a78a72}
    .mh-paw{font-size:18px;color:#df9b79}
    .mh-features{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
    .mh-feature{border:0;background:transparent;color:#644733;padding:0;text-align:center}
    .mh-feature-pic{height:104px;border-radius:18px;overflow:hidden;background:#fff0bf;border:1px solid #efdfb9}
    .mh-feature-pic img{width:100%;height:100%;object-fit:cover;display:block}
    .mh-feature strong{display:block;margin-top:9px;font-size:14px;white-space:nowrap}
    .mh-feature span{display:block;margin-top:5px;font-size:10px;color:#a98d76;line-height:1.35}

    .mh-footer-card{display:flex;align-items:center;justify-content:space-between;gap:12px;border-radius:24px;overflow:hidden;background:linear-gradient(135deg,#ffd66d,#ffc85b);padding:15px 14px;box-shadow:0 9px 19px rgba(168,121,31,.12)}
    .mh-footer-copy{min-width:0;flex:1}.mh-footer-copy strong{display:block;font-size:20px;line-height:1.35;color:#60412f}.mh-footer-copy p{margin:5px 0 0;font-size:11px;color:#80614b}
    .mh-footer-pic{width:108px;height:88px;object-fit:cover;border-radius:20px;border:3px solid rgba(255,255,255,.55);background:#fff1a9}

    #wishlistCard.mh-wish-popup{display:none;margin-top:14px}
    #wishlistCard.mh-wish-popup.open{display:block}
    .mh-toastpick{position:fixed;left:50%;bottom:105px;transform:translateX(-50%);z-index:130;width:min(88%,430px);background:#6c4d39;color:#fff7ea;border-radius:18px;padding:13px 15px;text-align:center;font-size:13px;box-shadow:0 12px 26px rgba(65,45,30,.22);opacity:0;pointer-events:none;transition:.2s}
    .mh-toastpick.show{opacity:1}
    @media(max-width:390px){.mh-title{font-size:23px}.mh-slide{height:238px}.mh-copy h2{font-size:23px}.mh-hero-img{width:122px;height:122px}.mh-action-imgbox{height:102px}.mh-action strong{font-size:15px}.mh-feature-pic{height:94px}}
  `;
  document.head.appendChild(style);

  function loadAsset(key){
    if(IMG[key]) return Promise.resolve(IMG[key]);
    return fetch('preview-assets/'+assetNames[key]+'.b64?v='+VERSION,{cache:'no-store'})
      .then(r=>r.text())
      .then(t=>{IMG[key]='data:image/jpeg;base64,'+t.trim();return IMG[key];})
      .catch(()=>{IMG[key]='assets/home.webp';return IMG[key];});
  }

  function setImg(el,key){
    if(!el) return;
    loadAsset(key).then(src=>{if(el && document.body.contains(el)) el.src=src;});
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
  function startHero(){
    clearInterval(heroTimer);
    heroTimer=setInterval(()=>setHero(heroIndex+1),3800);
  }
  function go(page){
    const n=[...document.querySelectorAll('.nav')].find(x=>x.dataset.page===page);
    if(n && typeof window.switchPage==='function') window.switchPage(n);
  }
  function pickThree(){
    const pool=dishes.slice();
    for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
    return pool.slice(0,3);
  }
  let popTimer;
  function showPick(){
    const t=document.getElementById('mhPickToast');
    if(!t) return;
    t.textContent='今天就吃：'+pickThree().join(' · ');
    t.classList.add('show');
    clearTimeout(popTimer);popTimer=setTimeout(()=>t.classList.remove('show'),2600);
  }

  function renderHome(){
    const page=document.getElementById('homePage');
    if(!page) return;
    page.innerHTML=`
      <div class="mh-wrap">
        <div class="mh-head"><div class="mh-title">仫仫的小食堂</div><button class="mh-mini" type="button">•••</button></div>

        <div class="mh-hero">
          <div class="mh-viewport"><div class="mh-track" id="mhTrack">
            <article class="mh-slide one"><div class="mh-copy"><span class="mh-kicker">今日营业</span><h2>仫仫的小食堂<br>营业中～</h2><p>今天也要一起好好吃饭呀 ♡</p></div><img class="mh-hero-img" data-img="hero1" alt=""></article>
            <article class="mh-slide two"><div class="mh-copy"><span class="mh-kicker">今日小心情</span><h2>想吃什么<br>就记下来吧</h2><p>不用马上决定，先放进我们的想吃清单。</p></div><img class="mh-hero-img" data-img="hero2" alt=""></article>
            <article class="mh-slide three"><div class="mh-copy"><span class="mh-kicker">今天不纠结</span><h2>不知道吃什么<br>就交给运气</h2><p>点一下随机吃，小食堂帮我们决定。</p></div><img class="mh-hero-img" data-img="hero3" alt=""></article>
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
            <button class="mh-feature" id="mhWish"><div class="mh-feature-pic"><img data-img="feature" alt=""></div><strong>想吃清单</strong><span>看看最近想吃啥</span></button>
            <button class="mh-feature" id="mhToday"><div class="mh-feature-pic"><img src="assets/home.webp" alt=""></div><strong>今日推荐</strong><span>看看今天吃什么</span></button>
            <button class="mh-feature" id="mhRecord"><div class="mh-feature-pic"><img src="assets/record.webp" alt=""></div><strong>吃饭记录</strong><span>记录我们的小幸福</span></button>
          </div>
        </section>

        <section class="mh-footer-card"><div class="mh-footer-copy"><strong>今天也要一起<br>好好吃饭 ♡</strong><p>仫仫的小食堂今天也营业中。</p></div><img class="mh-footer-pic" data-img="footer" alt=""></section>
        <div id="wishlistCard" class="wishlist-card mh-wish-popup"></div>
      </div>
      <div class="mh-toastpick" id="mhPickToast"></div>`;

    document.querySelectorAll('[data-img]').forEach(el=>setImg(el,el.dataset.img));
    document.querySelectorAll('.mh-dot').forEach((d,i)=>d.addEventListener('click',()=>{setHero(i);startHero();}));
    setHero(0);startHero();

    document.getElementById('mhEat').onclick=()=>{go('menuPage');if(typeof window.setMode==='function')window.setMode('dine');};
    document.getElementById('mhTake').onclick=()=>{go('menuPage');if(typeof window.setMode==='function')window.setMode('pickup');};
    document.getElementById('mhRandom').onclick=showPick;
    document.getElementById('mhToday').onclick=showPick;
    document.getElementById('mhRecord').onclick=()=>go('ordersPage');
    document.getElementById('mhWish').onclick=()=>{
      const card=document.getElementById('wishlistCard');
      if(card){card.classList.toggle('open');if(card.classList.contains('open'))setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'nearest'}),50);}
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