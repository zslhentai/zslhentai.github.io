(function(){
  const VERSION='202608251300';
  const IMG={};
  const FALLBACK='assets/home.webp';
  const assetSources={
    hero1:'home-assets-v2/hero-main.webp',
    hero2:'home-assets-v2/hero-secondary.webp',
    eat:'home-assets-v2/card-now.webp',
    take:'home-assets-v2/card-take.webp',
    random:'home-assets-v2/card-random.webp',
    feature:'home-assets-v2/feature-wishlist.webp',
    recommend:'home-assets-v2/feature-recommend.webp',
    record:'home-assets-v2/feature-record.webp',
    footer:'home-assets-v2/footer-banner.webp'
  };

  const dishes=[
    '黑椒牛肉饭','番茄鸡蛋面','家常炒饭','咖喱鸡排饭','奶油意面','薯条','烤鸡翅','脆皮肠','鸡米花','洋葱圈','冰可乐','热牛奶','橙汁','柠檬茶','热可可','小蛋糕','冰淇淋','焦糖布丁','奶油泡芙','小松饼'
  ];

  const style=document.createElement('style');
  style.textContent=`
    @font-face{font-family:"Mumu KuaiLe";src:url("home-assets/zcool-kuaile-subset.ttf") format("truetype");font-style:normal;font-weight:400;font-display:swap}
    #homePage{min-height:100vh;padding:0 0 96px;background:linear-gradient(180deg,#fff0b9,#fff9e8);color:#583426;overflow-x:hidden}
    .mh-wrap{width:min(100%,440px);min-height:calc(100vh - 96px);margin:0 auto;padding:10px 14px 24px;box-sizing:border-box}
    .mh-display{font-family:"Mumu KuaiLe","KaiTi","STKaiti",cursive;font-weight:400}

    .mh-head{display:flex;align-items:center;justify-content:center;gap:12px;min-height:54px;margin-bottom:8px;color:#713714}
    .mh-title{margin:0;text-align:center;font-size:29px;font-weight:400;line-height:1;letter-spacing:2px}
    .mh-brand-mark{position:relative;color:#f88b7d;font-family:"Microsoft YaHei",sans-serif;font-size:17px;line-height:1;transform:rotate(-9deg)}
    .mh-brand-mark:after{content:'·';position:absolute;color:#f5a83b;font-size:18px}
    .mh-brand-mark:first-child:after{right:-8px;bottom:-7px}
    .mh-brand-mark:last-child{color:#f5a83b;transform:rotate(8deg)}
    .mh-brand-mark:last-child:after{left:-8px;top:-9px;color:#f88b7d}

    .mh-hero{margin-bottom:18px}
    .mh-viewport{position:relative;overflow:hidden;aspect-ratio:30/13;border:3px solid rgba(255,255,255,.96);border-radius:20px;background:#cdeeff;box-shadow:0 7px 10px rgba(102,65,30,.13)}
    .mh-track{display:flex;width:100%;height:100%;transition:transform .45s ease}
    .mh-slide{position:relative;min-width:100%;height:100%}
    .mh-slide>img{display:block;width:100%;height:100%;object-fit:cover;image-rendering:auto}
    .mh-copy{position:absolute;left:18px;top:42%;z-index:2;width:42%;transform:translateY(-50%);color:#fff;text-align:left;text-shadow:1px 1px 0 #604032,-1px 1px 0 #604032,1px -1px 0 #604032,-1px -1px 0 #604032}
    .mh-kicker{display:inline-block;margin-bottom:6px;padding:4px 8px;border-radius:999px;background:#ffd45f;color:#5c402e;text-shadow:none;font-size:10px;line-height:1;font-weight:400;letter-spacing:1px}
    .mh-copy h2{margin:0;font-size:21px;font-weight:400;line-height:1.12;letter-spacing:.5px}
    .mh-copy p{margin:5px 0 0;font-size:10px;line-height:1.2;letter-spacing:.2px;white-space:nowrap}
    .mh-dots{display:flex;justify-content:center;gap:8px;padding-top:9px}
    .mh-dot{width:9px;height:9px;padding:0;border:0;border-radius:50%;background:#d9cdb5;cursor:pointer;transition:background .2s,transform .2s}
    .mh-dot.active{background:#744026;transform:scale(1.12)}

    .mh-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-bottom:20px}
    .mh-action{min-width:0;overflow:hidden;padding:0;border:3px solid rgba(255,255,255,.96);border-radius:20px;background:#fffdf8;color:#583426;text-align:center;box-shadow:0 6px 14px rgba(131,84,28,.11);transition:transform .16s ease,box-shadow .16s ease}
    .mh-action:active{transform:translateY(2px) scale(.985);box-shadow:0 4px 9px rgba(131,84,28,.11)}
    .mh-action-imgbox{aspect-ratio:5/4;overflow:hidden;background:#f8e39b}
    .mh-action img{display:block;width:100%;height:100%;object-fit:cover;image-rendering:auto}
    .mh-action-text{padding:9px 2px 9px;background:linear-gradient(180deg,#fffefa,#fff8e9)}
    .mh-action strong{display:block;font-size:18px;font-weight:400;line-height:1;letter-spacing:1px;white-space:nowrap}
    .mh-action small{display:block;margin-top:4px;color:#92715e;font-size:9px;line-height:1.15;letter-spacing:.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

    .mh-panel{margin-bottom:20px;padding:14px 11px;border:2px solid rgba(245,216,151,.85);border-radius:24px;background:rgba(255,255,255,.94);box-shadow:0 7px 16px rgba(118,80,37,.09)}
    .mh-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin:0 0 12px}
    .mh-panel h3{margin:0;padding-bottom:8px;border-bottom:2px dashed #efbf53;font-size:20px;font-weight:400;line-height:1.1;letter-spacing:.5px}
    .mh-paw{position:relative;width:19px;height:18px;margin:1px 3px 0 0;transform:rotate(12deg)}
    .mh-paw:before{content:'';position:absolute;left:5px;bottom:1px;width:10px;height:8px;border-radius:55% 55% 48% 48%;background:#ed9175}
    .mh-paw:after{content:'';position:absolute;left:1px;top:3px;width:5px;height:6px;border-radius:50%;background:#ed9175;box-shadow:6px -3px 0 #ed9175,12px 0 0 #ed9175}
    .mh-features{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
    .mh-feature{min-width:0;padding:0;border:0;background:transparent;color:#583426;text-align:center}
    .mh-feature-pic{overflow:hidden;aspect-ratio:4/3;border-radius:15px;background:#fce9ab}
    .mh-feature img{display:block;width:100%;height:100%;object-fit:cover;image-rendering:auto}
    .mh-feature strong{display:block;margin-top:7px;font-size:15px;font-weight:400;line-height:1;letter-spacing:.3px;white-space:nowrap}
    .mh-feature span{display:block;margin-top:3px;color:#92715e;font-size:9px;line-height:1.2;letter-spacing:.1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

    .mh-footer-card{position:relative;overflow:hidden;border:3px solid rgba(255,255,255,.9);border-radius:22px;background:#ffe39a;box-shadow:0 7px 16px rgba(146,97,27,.12)}
    .mh-footer-card img{display:block;width:100%;height:auto;image-rendering:auto}
    .mh-footer-copy{position:absolute;left:25%;top:49%;width:35%;transform:translate(-50%,-50%) rotate(-1deg);text-align:center}
    .mh-footer-copy strong{display:block;font-size:18px;font-weight:400;line-height:1.25;letter-spacing:.6px;text-shadow:0 1px 0 rgba(255,255,255,.8)}

    #wishlistCard.mh-wish-popup{display:none;margin-top:14px}
    #wishlistCard.mh-wish-popup.open{display:block}
    .mh-toastpick{position:fixed;left:50%;bottom:105px;z-index:130;width:min(88%,430px);padding:13px 15px;border-radius:18px;background:#6c4d39;color:#fff7ea;text-align:center;font-size:13px;box-shadow:0 12px 26px rgba(65,45,30,.22);opacity:0;pointer-events:none;transform:translateX(-50%);transition:.2s}
    .mh-toastpick.show{opacity:1}

    @media(max-width:360px){.mh-wrap{padding-left:10px;padding-right:10px}.mh-actions,.mh-features{gap:6px}.mh-title{font-size:27px}.mh-copy{left:14px}.mh-copy h2{font-size:19px}.mh-action strong{font-size:16px}.mh-footer-copy strong{font-size:16px}}
  `;
  document.head.appendChild(style);

  function verifyImage(src){
    return new Promise((resolve,reject)=>{
      const image=new Image();
      const confirm=()=>image.naturalWidth&&image.naturalHeight?resolve(src):reject(new Error('empty image'));
      image.onload=()=>typeof image.decode==='function'?image.decode().then(confirm,reject):confirm();
      image.onerror=()=>reject(new Error('image decode failed'));
      image.src=src;
    });
  }

  function loadAsset(key){
    if(IMG[key]) return IMG[key];
    const path=assetSources[key];
    const fallback=FALLBACK+'?v='+VERSION;
    IMG[key]=path
      ? verifyImage(path+'?v='+VERSION).catch(()=>verifyImage(fallback))
      : verifyImage(fallback);
    return IMG[key];
  }

  function setImg(el,key){
    if(!el) return;
    const fallback=FALLBACK+'?v='+VERSION;
    el.onerror=()=>{el.onerror=null;el.src=fallback};
    loadAsset(key)
      .then(src=>{if(el&&document.body.contains(el)) el.src=src})
      .catch(()=>{if(el) el.src=fallback});
  }

  let heroIndex=0,heroTimer=null;
  function setHero(i){
    const track=document.getElementById('mhTrack');
    const dots=[...document.querySelectorAll('.mh-dot')];
    if(!track||!dots.length) return;
    heroIndex=(i+dots.length)%dots.length;
    track.style.transform='translateX(-'+heroIndex*100+'%)';
    dots.forEach((dot,index)=>{
      dot.classList.toggle('active',index===heroIndex);
      if(index===heroIndex) dot.setAttribute('aria-current','true');
      else dot.removeAttribute('aria-current');
    });
  }

  function startHero(){
    clearInterval(heroTimer);
    heroTimer=setInterval(()=>setHero(heroIndex+1),4500);
  }

  function go(page){
    const nav=[...document.querySelectorAll('.nav')].find(item=>item.dataset.page===page);
    if(nav&&typeof window.switchPage==='function') window.switchPage(nav);
  }

  function pickThree(){
    const pool=dishes.slice();
    for(let i=pool.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [pool[i],pool[j]]=[pool[j],pool[i]];
    }
    return pool.slice(0,3);
  }

  let popTimer;
  function showPick(){
    const toast=document.getElementById('mhPickToast');
    if(!toast) return;
    toast.textContent='今天就吃：'+pickThree().join(' · ');
    toast.classList.add('show');
    clearTimeout(popTimer);
    popTimer=setTimeout(()=>toast.classList.remove('show'),2600);
  }

  function renderHome(){
    const page=document.getElementById('homePage');
    if(!page) return;
    page.innerHTML=`
      <div class="mh-wrap">
        <header class="mh-head">
          <span class="mh-brand-mark" aria-hidden="true">♥</span>
          <h1 class="mh-title mh-display">仫仫的小食堂</h1>
          <span class="mh-brand-mark" aria-hidden="true">✿</span>
        </header>

        <section class="mh-hero" aria-label="首页主视觉轮播">
          <div class="mh-viewport"><div class="mh-track" id="mhTrack">
            <article class="mh-slide">
              <img data-img="hero1" alt="蓝色雪景中的布丁狗和小伙伴们">
              <div class="mh-copy"><span class="mh-kicker">今日营业</span><h2 class="mh-display">仫仫的小食堂<br>营业中～</h2><p>今天也要一起好好吃饭呀 ♡</p></div>
            </article>
            <article class="mh-slide">
              <img data-img="hero2" alt="在雪地里滑雪的布丁狗">
              <div class="mh-copy"><span class="mh-kicker">出去玩啦</span><h2 class="mh-display">今天想去哪儿<br>一起吃饭？</h2></div>
            </article>
          </div></div>
          <div class="mh-dots" aria-label="切换主视觉">
            <button class="mh-dot active" type="button" aria-label="显示第一张主视觉" aria-current="true"></button>
            <button class="mh-dot" type="button" aria-label="显示第二张主视觉"></button>
          </div>
        </section>

        <section class="mh-actions" aria-label="今天怎么吃">
          <button class="mh-action" id="mhEat" type="button"><div class="mh-action-imgbox"><img data-img="eat" alt="秋日毛线帽场景"></div><div class="mh-action-text"><strong class="mh-display">现在吃</strong><small>马上看看吃什么</small></div></button>
          <button class="mh-action" id="mhTake" type="button"><div class="mh-action-imgbox"><img data-img="take" alt="打包野餐场景"></div><div class="mh-action-text"><strong class="mh-display">带走吃</strong><small>打包带走也美味</small></div></button>
          <button class="mh-action" id="mhRandom" type="button"><div class="mh-action-imgbox"><img data-img="random" alt="水下随机冒险场景"></div><div class="mh-action-text"><strong class="mh-display">随机吃</strong><small>交给小食堂决定</small></div></button>
        </section>

        <section class="mh-panel">
          <div class="mh-panel-head"><h3 class="mh-display">我们最近在忙什么呀 ♡</h3><div class="mh-paw" aria-hidden="true"></div></div>
          <div class="mh-features">
            <button class="mh-feature" id="mhWish" type="button"><div class="mh-feature-pic"><img data-img="feature" alt="在手账中记录想吃食物"></div><strong class="mh-display">想吃清单</strong><span>看看我们想吃啥</span></button>
            <button class="mh-feature" id="mhToday" type="button"><div class="mh-feature-pic"><img data-img="recommend" alt="温暖餐桌上的今日布丁"></div><strong class="mh-display">今日推荐</strong><span>看看今天吃什么</span></button>
            <button class="mh-feature" id="mhRecord" type="button"><div class="mh-feature-pic"><img data-img="record" alt="记录一起吃饭的回忆"></div><strong class="mh-display">吃饭记录</strong><span>记录我们的小幸福</span></button>
          </div>
        </section>

        <section class="mh-footer-card" aria-label="今天也要一起好好吃饭">
          <img data-img="footer" alt="胡萝卜装布丁狗和温暖的小饭桌">
          <div class="mh-footer-copy"><strong class="mh-display">今天也要一起<br>好好吃饭 ♡</strong></div>
        </section>
        <div id="wishlistCard" class="wishlist-card mh-wish-popup"></div>
      </div>
      <div class="mh-toastpick" id="mhPickToast"></div>`;

    document.querySelectorAll('#homePage [data-img]').forEach(el=>setImg(el,el.dataset.img));
    document.querySelectorAll('.mh-dot').forEach((dot,index)=>dot.addEventListener('click',()=>{setHero(index);startHero()}));
    setHero(0);
    startHero();

    document.getElementById('mhEat').onclick=()=>{go('menuPage');if(typeof window.setMode==='function') window.setMode('dine')};
    document.getElementById('mhTake').onclick=()=>{go('menuPage');if(typeof window.setMode==='function') window.setMode('pickup')};
    document.getElementById('mhRandom').onclick=showPick;
    document.getElementById('mhToday').onclick=showPick;
    document.getElementById('mhRecord').onclick=()=>go('ordersPage');
    document.getElementById('mhWish').onclick=()=>{
      const card=document.getElementById('wishlistCard');
      if(card){
        card.classList.toggle('open');
        if(card.classList.contains('open')) setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'nearest'}),50);
      }
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
