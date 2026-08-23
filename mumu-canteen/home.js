(function(){
  const VERSION='202608232305';
  const IMG={};
  const FALLBACK='assets/home.webp';
  const assetSources={
    hero1:'home-assets/hero-main.jpg',
    hero2:'home-assets/hero-wish.jpg',
    hero3:'home-assets/hero-random.jpg',
    eat:'home-assets/action-eat.jpg',
    take:'home-assets/action-take.jpg',
    random:'home-assets/action-random.jpg',
    feature:'home-assets/feature-wishlist.jpg',
    footer:'home-assets/feature-record.jpg'
  };

  const dishes=[
    '黑椒牛肉饭','番茄鸡蛋面','家常炒饭','咖喱鸡排饭','奶油意面','薯条','烤鸡翅','脆皮肠','鸡米花','洋葱圈','冰可乐','热牛奶','橙汁','柠檬茶','热可可','小蛋糕','冰淇淋','焦糖布丁','奶油泡芙','小松饼'
  ];

  const style=document.createElement('style');
  style.textContent=`
    #homePage{padding:0 0 106px;min-height:100vh;background:radial-gradient(circle at 12% 7%,rgba(255,255,255,.72) 0 7%,transparent 22%),linear-gradient(180deg,#fff0ad 0%,#fff6d1 44%,#fff9e8 100%);color:#553324;overflow-x:hidden}
    .mh-wrap{padding:17px 13px 22px;max-width:520px;margin:0 auto}

    .mh-head{height:54px;display:flex;align-items:center;justify-content:center;position:relative;margin-bottom:9px}
    .mh-title{position:relative;font-size:28px;font-weight:950;letter-spacing:3.5px;color:#4f2d21;line-height:1;white-space:nowrap;text-shadow:0 2px 0 rgba(255,255,255,.72)}
    .mh-title:before{content:'♥';position:absolute;left:-31px;top:-4px;color:#f58f7b;font-size:15px;transform:rotate(-12deg)}
    .mh-title:after{content:'✿';position:absolute;right:-30px;bottom:-4px;color:#ee9b61;font-size:16px;transform:rotate(10deg)}

    .mh-hero{margin:0 0 12px}
    .mh-viewport{overflow:hidden;border-radius:25px;border:4px solid #fff;box-shadow:0 9px 22px rgba(132,87,30,.15);background:#fff}
    .mh-track{display:flex;transition:transform .42s cubic-bezier(.22,.75,.28,1)}
    .mh-slide{min-width:100%;height:202px;position:relative;overflow:hidden;background:#dff1ff}
    .mh-hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;image-rendering:auto;transform:translateZ(0)}
    .mh-slide.one .mh-hero-bg{object-position:center 58%}
    .mh-slide.two .mh-hero-bg{object-position:center 49%}
    .mh-slide.three .mh-hero-bg{object-position:center 48%}
    .mh-shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(61,37,29,.34) 0%,rgba(69,44,31,.15) 43%,rgba(255,255,255,0) 72%)}
    .mh-copy{position:absolute;z-index:3;left:17px;top:19px;width:56%;color:white;text-align:left}
    .mh-kicker{display:inline-flex;align-items:center;min-height:27px;padding:0 11px;border-radius:999px;background:#ffd75a;color:#5f422b;font-size:11px;font-weight:950;box-shadow:0 3px 8px rgba(74,49,28,.15)}
    .mh-kicker:before{content:'●';font-size:8px;margin-right:6px}
    .mh-copy h2{margin:13px 0 8px;font-size:26px;line-height:1.14;font-weight:950;letter-spacing:.6px;color:#fff9eb;text-shadow:2px 0 #5d382b,-2px 0 #5d382b,0 2px #5d382b,0 -2px #5d382b,1px 1px #5d382b,-1px -1px #5d382b}
    .mh-copy p{margin:0;font-size:11px;font-weight:900;line-height:1.55;color:#fffdf4;text-shadow:0 1px 4px rgba(52,31,19,.82)}
    .mh-dots{height:28px;display:flex;justify-content:center;align-items:center;gap:11px}
    .mh-dot{border:0;padding:0;width:9px;height:9px;border-radius:50%;background:#d7c69e;transition:.22s}.mh-dot.active{width:11px;height:11px;background:#653c2c}

    .mh-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:0 0 17px}
    .mh-action{border:4px solid rgba(255,255,255,.96);background:#fffdf8;border-radius:23px;overflow:hidden;padding:0;color:#533123;box-shadow:0 8px 17px rgba(131,84,28,.12);text-align:center;min-width:0;transition:transform .16s ease,box-shadow .16s ease}
    .mh-action:active{transform:translateY(2px) scale(.985);box-shadow:0 4px 9px rgba(131,84,28,.11)}
    .mh-action-imgbox{height:113px;background:#f8e39b;overflow:hidden}
    .mh-action img{width:100%;height:100%;object-fit:cover;display:block;image-rendering:auto;transform:translateZ(0)}
    #mhEat img{object-position:center 48%}#mhTake img{object-position:center 48%}#mhRandom img{object-position:center 45%}
    .mh-action-text{padding:11px 3px 12px;background:linear-gradient(180deg,#fffefa,#fff8e9)}
    .mh-action strong{display:block;font-size:17px;line-height:1.05;font-weight:950;white-space:nowrap;letter-spacing:.6px}
    .mh-action small{display:block;margin-top:7px;color:#92715e;font-size:10px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 2px}

    .mh-panel{position:relative;background:rgba(255,255,255,.94);border:2px solid rgba(245,216,151,.88);border-radius:26px;padding:17px 12px 16px;margin:0 0 16px;box-shadow:0 9px 19px rgba(118,80,37,.10)}
    .mh-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin:0 5px 15px}
    .mh-panel h3{position:relative;margin:0;padding-bottom:9px;font-size:19px;line-height:1.2;font-weight:950;letter-spacing:.35px;color:#513023}
    .mh-panel h3:after{content:'';position:absolute;left:0;bottom:0;width:142px;border-bottom:2px dashed #efbf53}
    .mh-paw{font-size:19px;color:#ed9175;margin-top:0}
    .mh-features{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
    .mh-feature{border:0;background:transparent;color:#5b3a2c;padding:0;text-align:center;min-width:0}
    .mh-feature-pic{height:101px;border-radius:18px;overflow:hidden;background:#fce9ab;box-shadow:inset 0 0 0 1px rgba(91,56,38,.04)}
    .mh-feature-pic img{width:100%;height:100%;object-fit:cover;display:block;image-rendering:auto;transform:translateZ(0)}
    #mhWish img{object-position:center 45%}#mhToday img{object-position:center 49%}#mhRecord img{object-position:center 48%}
    .mh-feature strong{display:block;margin-top:9px;font-size:15px;line-height:1.05;font-weight:950;white-space:nowrap}
    .mh-feature span{display:block;margin-top:6px;font-size:9px;color:#94725f;line-height:1.28;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

    .mh-footer-card{position:relative;height:136px;border:3px solid rgba(255,255,255,.82);border-radius:25px;overflow:hidden;background:radial-gradient(circle at 48% 14%,rgba(255,255,255,.52),transparent 34%),linear-gradient(180deg,#ffe38b 0%,#ffd167 100%);box-shadow:0 9px 19px rgba(146,97,27,.14);isolation:isolate}
    .mh-footer-card:before{content:'';position:absolute;z-index:1;left:0;right:0;bottom:0;height:47px;background-color:#ffd66f;background-image:linear-gradient(45deg,rgba(255,255,255,.32) 25%,transparent 25%,transparent 75%,rgba(255,255,255,.32) 75%),linear-gradient(45deg,rgba(255,255,255,.32) 25%,transparent 25%,transparent 75%,rgba(255,255,255,.32) 75%);background-size:24px 24px;background-position:0 0,12px 12px;border-top:1px solid rgba(189,118,35,.08)}
    .mh-footer-card:after{content:'♡';position:absolute;z-index:4;right:13px;top:10px;color:#ee8d73;font-size:17px;font-weight:900;transform:rotate(12deg)}
    .mh-footer-copy{position:absolute;z-index:5;left:87px;top:20px;width:194px;text-align:center;box-sizing:border-box;transform:rotate(-1deg)}
    .mh-footer-copy small{display:inline-block;margin-bottom:4px;color:#9b6849;font-size:9px;font-weight:850;letter-spacing:.5px}
    .mh-footer-copy strong{display:block;font-size:19px;line-height:1.36;font-weight:900;color:#513023;letter-spacing:.35px;text-shadow:0 1px 0 rgba(255,255,255,.52)}
    .mh-footer-copy strong span{color:#e77e67;font-size:17px;margin-left:3px}
    .mh-footer-pic{position:absolute;z-index:2;right:-8px;bottom:-27px;width:151px;height:151px;object-fit:cover;object-position:center 49%;border:0;background:transparent;image-rendering:auto;transform:translateZ(0);mix-blend-mode:multiply;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 22%);mask-image:linear-gradient(90deg,transparent 0,#000 22%)}
    .mh-footer-vase{position:absolute;z-index:4;left:15px;bottom:31px;width:41px;height:56px}
    .mh-footer-vase i{position:absolute;font-style:normal;font-size:17px;line-height:1}.mh-footer-vase i:nth-child(1){left:1px;top:4px;color:#f08e79;transform:rotate(-15deg)}.mh-footer-vase i:nth-child(2){left:15px;top:-2px;color:#fff9e8;font-size:18px}.mh-footer-vase i:nth-child(3){right:0;top:8px;color:#f3af4f;transform:rotate(14deg)}
    .mh-footer-vase b{position:absolute;left:10px;bottom:0;width:25px;height:30px;border-radius:6px 6px 10px 10px;background:linear-gradient(90deg,#aadac9,#d7f0e7 52%,#98cfbe);box-shadow:inset 0 -4px 0 rgba(84,145,126,.12)}
    .mh-footer-vase b:before{content:'';position:absolute;left:6px;top:-21px;width:1px;height:23px;background:#6da773;box-shadow:8px 1px 0 #6da773,14px -2px 0 #6da773}
    .mh-footer-pudding{position:absolute;z-index:5;left:48px;bottom:17px;width:45px;height:27px;border-radius:7px 7px 13px 13px;background:linear-gradient(180deg,#ffd66d,#f4b648);box-shadow:0 3px 0 #fff7dc,0 6px 7px rgba(115,72,30,.13)}
    .mh-footer-pudding:before{content:'';position:absolute;left:3px;right:3px;top:-5px;height:10px;border-radius:50%;background:#c66b38;box-shadow:inset 0 2px 0 rgba(255,255,255,.18)}
    .mh-footer-pudding:after{content:'•';position:absolute;left:17px;top:2px;color:#633b2d;font-size:16px;letter-spacing:5px;text-shadow:8px 0 #633b2d}
    .mh-footer-cutlery{position:absolute;z-index:5;right:9px;bottom:9px;color:#735040;font-size:23px;letter-spacing:1px;transform:rotate(-7deg);filter:grayscale(1)}
    .mh-footer-snack{position:absolute;z-index:4;left:103px;bottom:13px;width:35px;height:12px;border-radius:50%;background:#fff8e4;box-shadow:0 2px 0 rgba(139,83,33,.14)}
    .mh-footer-snack:before{content:'';position:absolute;left:10px;top:-12px;width:17px;height:16px;border-radius:10px 10px 5px 5px;background:#f49b64;box-shadow:inset 0 3px 0 #ffe7a4}

    #wishlistCard.mh-wish-popup{display:none;margin-top:14px}
    #wishlistCard.mh-wish-popup.open{display:block}
    .mh-toastpick{position:fixed;left:50%;bottom:105px;transform:translateX(-50%);z-index:130;width:min(88%,430px);background:#6c4d39;color:#fff7ea;border-radius:18px;padding:13px 15px;text-align:center;font-size:13px;box-shadow:0 12px 26px rgba(65,45,30,.22);opacity:0;pointer-events:none;transition:.2s}
    .mh-toastpick.show{opacity:1}

    @media(max-width:390px){
      .mh-wrap{padding-left:12px;padding-right:12px}.mh-title{font-size:25px;letter-spacing:2.5px}.mh-slide{height:187px}.mh-copy{left:15px;top:16px;width:59%}.mh-copy h2{font-size:23px}.mh-action-imgbox{height:104px}.mh-action strong{font-size:16px}.mh-action small{font-size:9px}.mh-feature-pic{height:92px}.mh-panel h3{font-size:18px}.mh-footer-copy{left:80px;width:184px}.mh-footer-copy strong{font-size:18px}.mh-footer-pic{right:-14px;width:145px;height:145px}.mh-footer-vase{left:11px}.mh-footer-pudding{left:42px}.mh-footer-snack{left:94px}
    }
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
      .then(src=>{if(el && document.body.contains(el)) el.src=src})
      .catch(()=>{if(el && document.body.contains(el)) el.src=fallback});
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
        <div class="mh-head"><div class="mh-title">仫仫的小食堂</div></div>

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
          <div class="mh-panel-head"><div><h3>我们最近在忙什么呀 ♡</h3></div><div class="mh-paw">✿</div></div>
          <div class="mh-features">
            <button class="mh-feature" id="mhWish"><div class="mh-feature-pic"><img data-img="feature" alt=""></div><strong>想吃清单</strong><span>看看我们想吃啥</span></button>
            <button class="mh-feature" id="mhToday"><div class="mh-feature-pic"><img data-img="hero2" alt=""></div><strong>今日推荐</strong><span>看看今天吃什么</span></button>
            <button class="mh-feature" id="mhRecord"><div class="mh-feature-pic"><img data-img="footer" alt=""></div><strong>吃饭记录</strong><span>记录我们的小幸福</span></button>
          </div>
        </section>

        <section class="mh-footer-card">
          <div class="mh-footer-vase" aria-hidden="true"><i>✿</i><i>✿</i><i>✿</i><b></b></div>
          <div class="mh-footer-pudding" aria-hidden="true"></div>
          <div class="mh-footer-snack" aria-hidden="true"></div>
          <div class="mh-footer-copy"><small>我们的小饭桌</small><strong>今天也要一起<br>好好吃饭 <span>♡</span></strong></div>
          <img class="mh-footer-pic" data-img="footer" alt="布丁狗在小饭桌旁准备吃饭">
          <div class="mh-footer-cutlery" aria-hidden="true">🍴</div>
        </section>
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
