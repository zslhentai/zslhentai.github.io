let cart = {};
let orderMode = 'pickup';

function money(n){ return '¥' + n.toFixed(2); }

function selectCatStatic(index){
  document.querySelectorAll('.cat').forEach((el,i)=>el.classList.toggle('active', i===index));
  document.querySelectorAll('.static-section').forEach((el,i)=>el.style.display = i===index ? 'block' : 'none');
  window.scrollTo({top:0,behavior:'smooth'});
}

function addItem(id, price, name){
  if(!cart[id]) cart[id] = {price:price, name:name, qty:0};
  cart[id].qty += 1;
  renderControl(id);
  updateCart();
}

function changeStaticQty(id, delta){
  if(!cart[id]) return;
  cart[id].qty += delta;
  if(cart[id].qty <= 0) delete cart[id];
  renderControl(id);
  updateCart();
}

function renderControl(id){
  const control = document.getElementById('control_' + id);
  const item = document.getElementById(id);
  const q = cart[id] ? cart[id].qty : 0;
  const price = Number(item.dataset.price);
  const name = item.dataset.name;
  const isSpec = control.dataset.spec === '1';

  if(q > 0){
    control.innerHTML = `
      <div class="qty">
        <button class="minus" data-action="minus" data-id="${id}">−</button>
        <span>${q}</span>
        <button class="plus" data-action="plus" data-id="${id}">+</button>
      </div>`;
  }else{
    const originalSpec = item.querySelector('.spec') !== null || item.dataset.wasSpec === '1';
    item.dataset.wasSpec = originalSpec ? '1' : item.dataset.wasSpec || '0';
    control.innerHTML = item.dataset.wasSpec === '1'
      ? `<button class="spec" data-action="spec" data-id="${id}" data-price="${price}" data-name="${name}">选一下</button>`
      : `<button class="add" data-action="add" data-id="${id}" data-price="${price}" data-name="${name}">+</button>`;
  }
}

let currentSpecItem = null;
let currentSpecSelections = {};

const specConfig = {
  '煎牛排': [
    {name:'熟度', options:['三分熟','五分熟','七分熟','全熟']},
    {name:'酱汁', options:['黑椒汁','蘑菇汁','不加酱']}
  ],
  '小火锅': [
    {name:'辣度', options:['不辣','微辣','中辣']},
    {name:'汤底', options:['番茄','菌菇','麻辣']}
  ],
  '披萨': [
    {name:'口味', options:['芝士','培根','水果']},
    {name:'饼底', options:['薄底','厚底']}
  ],
  '寿喜锅': [
    {name:'口味', options:['标准','少甜']},
    {name:'主食', options:['米饭','乌冬面']}
  ],
  '烤肉拼盘': [
    {name:'口味', options:['原味','孜然','微辣']},
    {name:'蘸料', options:['干碟','芝麻酱','不需要']}
  ]
};

function openSpec(id, price, name){
  currentSpecItem = {id, price, name};
  currentSpecSelections = {};
  document.getElementById('specDishName').textContent = name;
  const groups = specConfig[name] || [{name:'份量',options:['标准份','多一点','少一点']}];
  let out = '';
  groups.forEach(function(group, gi){
    currentSpecSelections[group.name] = group.options[0];
    out += '<div class="spec-title">'+group.name+'</div><div class="spec-options">';
    group.options.forEach(function(opt, oi){
      out += '<button class="spec-option '+(oi===0?'active':'')+'" onclick="chooseSpec(this,\''+
        group.name.replace(/'/g,"\\'")+'\',\''+opt.replace(/'/g,"\\'")+'\')">'+opt+'</button>';
    });
    out += '</div>';
  });
  document.getElementById('specContent').innerHTML = out;
  document.getElementById('specmask').classList.add('show');
}

function chooseSpec(btn, group, value){
  currentSpecSelections[group] = value;
  const box = btn.parentElement;
  box.querySelectorAll('.spec-option').forEach(function(x){x.classList.remove('active')});
  btn.classList.add('active');
}

function closeSpec(){
  document.getElementById('specmask').classList.remove('show');
}

function confirmSpec(){
  if(!currentSpecItem) return;
  const specText = Object.entries(currentSpecSelections).map(function(x){return x[0]+'：'+x[1]}).join(' · ');
  const id = currentSpecItem.id;
  if(!cart[id]) cart[id] = {price:currentSpecItem.price, name:currentSpecItem.name, qty:0, spec:specText};
  cart[id].qty += 1;
  cart[id].spec = specText;
  renderControl(id);
  updateCart();
  closeSpec();
  toast('已加入 '+currentSpecItem.name+' · '+specText);
}

function updateCart(){
  const entries = Object.values(cart);
  const count = entries.reduce((s,x)=>s+x.qty,0);
  const total = entries.reduce((s,x)=>s+x.qty*x.price,0);
  document.getElementById('count').textContent=count;
  document.getElementById('total').textContent=money(total);
  document.getElementById('hint').textContent=count ? `今天点了 ${count} 样` : '今天还没点菜';
  document.getElementById('checkout').disabled=!count;
  if(document.getElementById('mask').classList.contains('show')) renderCartList();
}

function renderCartList(){
  const entries = Object.entries(cart);
  const list = document.getElementById('cartList');
  if(!entries.length){
    list.innerHTML='<div style="padding:28px 0;text-align:center;color:#b08f71">还没选今天吃什么</div>';
  }else{
    list.innerHTML=entries.map(([id,x])=>`
      <div class="cart-item">
        <div class="left">
          <b>${x.name}</b>
          <span>${x.spec ? x.spec + ' · ' : ''}${money(x.price)}</span>
        </div>
        <div class="qty">
          <button class="minus" data-action="minus" data-id="${id}">−</button>
          <span>${x.qty}</span>
          <button class="plus" data-action="plus" data-id="${id}">+</button>
        </div>
      </div>`).join('');
  }
  const total = entries.reduce((s,[id,x])=>s+x.qty*x.price,0);
  document.getElementById('sheetTotal').textContent=money(total);
}

function openCart(){
  if(!Object.keys(cart).length){ toast('先挑点今天想吃的吧'); return; }
  renderCartList();
  document.getElementById('mask').classList.add('show');
}
function closeCart(){ document.getElementById('mask').classList.remove('show'); }

function clearCart(){
  const ids = Object.keys(cart);
  cart = {};
  ids.forEach(renderControl);
  updateCart();
  renderCartList();
  toast('今天想吃的已经清空');
}

function submitOrder(){
  const count = Object.values(cart).reduce((s,x)=>s+x.qty,0);
  if(!count) return;
  closeCart();
  toast(`已经记下啦 · ${orderMode==='pickup'?'带走吃':'现在吃'}`);
}

function setMode(mode){
  orderMode=mode;
  document.getElementById('dineBtn').classList.toggle('active',mode==='dine');
  document.getElementById('pickupBtn').classList.toggle('active',mode==='pickup');
  toast(mode==='dine'?'今天就在这里吃':'今天打包带走');
}

function switchPage(el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(el.dataset.page).classList.add('active');
  document.querySelectorAll('.nav').forEach(n=>n.classList.remove('active'));
  el.classList.add('active');
  const showCart = el.dataset.page==='menuPage';
  document.getElementById('cartbar').style.display = showCart ? 'flex' : 'none';
  window.scrollTo(0,0);
}

function fakeSearch(){ toast('搜索功能下一版再加'); }

let toastTimer;
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),1600);
}

document.querySelectorAll('.static-control').forEach(control=>{
  if(control.querySelector('.spec')) control.parentElement.parentElement.parentElement.dataset.wasSpec = '1';
});

document.addEventListener('click', function(e){
  const btn = e.target.closest('[data-action]');
  if(!btn) return;

  const action = btn.dataset.action;

  if(action === 'add'){
    addItem(btn.dataset.id, Number(btn.dataset.price), btn.dataset.name);
    return;
  }

  if(action === 'spec'){
    openSpec(btn.dataset.id, Number(btn.dataset.price), btn.dataset.name);
    return;
  }

  if(action === 'plus'){
    changeStaticQty(btn.dataset.id, 1);
    return;
  }

  if(action === 'minus'){
    changeStaticQty(btn.dataset.id, -1);
    return;
  }

  if(action === 'cat'){
    selectCatStatic(Number(btn.dataset.cat));
    return;
  }
});

updateCart();