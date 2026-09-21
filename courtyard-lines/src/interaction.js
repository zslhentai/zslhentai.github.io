import * as THREE from '../vendor/three.module.min.js';

const easeOutCubic=t=>1-Math.pow(1-t,3);

export function createInteractionController({camera,element,invalidate,onHint}){
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  const reduceMotion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const pickables=[],byObject=new WeakMap(),entries=new Map(),animations=new Set();
  let pressed=null,hovered=null;

  function pick(event){
    const rect=element.getBoundingClientRect();
    pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(pointer,camera);
    const hit=raycaster.intersectObjects(pickables,true).find(item=>byObject.has(item.object));
    return hit?byObject.get(hit.object):null;
  }
  function setHovered(next){
    if(next===hovered)return;
    hovered?.onHover?.(false);hovered=next;hovered?.onHover?.(true);
    element.style.cursor=hovered?'pointer':'';
    onHint?.(hovered?(typeof hovered.hint==='function'?hovered.hint(hovered.state):hovered.hint):'');invalidate();
  }
  function animate(duration,update,complete){
    if(reduceMotion){update(1);complete?.();invalidate();return;}
    const item={start:performance.now(),duration,update,complete};animations.add(item);update(0);invalidate();
  }
  function registerInteraction({id,object,hitAreas=[],initialState=false,hint='',apply,onHover}){
    const dataKey='interaction'+id.replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());
    const entry={id,object,state:initialState,hint,apply,onHover};entries.set(id,entry);element.dataset[dataKey]=initialState?'on':'off';
    for(const root of [object,...hitAreas])root.traverse(child=>{if(child.isMesh){pickables.push(child);byObject.set(child,entry);}});
    entry.setState=(value,{animated=true}={})=>{entry.state=Boolean(value);element.dataset[dataKey]=entry.state?'on':'off';apply(entry.state,{animate:animated?animate:null});
      if(hovered===entry)onHint?.(typeof entry.hint==='function'?entry.hint(entry.state):entry.hint);invalidate();};
    entry.toggle=()=>entry.setState(!entry.state);
    apply(entry.state,{animate:null});return entry;
  }
  function pointerDown(event){
    if(pressed){pressed.cancelled=true;return;}
    pressed={id:event.pointerId,x:event.clientX,y:event.clientY,moved:0,cancelled:false};
  }
  function pointerMove(event){
    if(pressed&&pressed.id===event.pointerId){
      pressed.moved=Math.max(pressed.moved,Math.hypot(event.clientX-pressed.x,event.clientY-pressed.y));
    }else if(event.pointerType==='mouse'&&event.buttons===0)setHovered(pick(event));
  }
  function pointerUp(event){
    if(!pressed||pressed.id!==event.pointerId)return;
    const threshold=event.pointerType==='mouse'?7:12;
    if(!pressed.cancelled&&pressed.moved<=threshold)pick(event)?.toggle();
    pressed=null;
  }
  element.addEventListener('pointerdown',pointerDown,{passive:true});
  element.addEventListener('pointermove',pointerMove,{passive:true});
  element.addEventListener('pointerup',pointerUp,{passive:true});
  element.addEventListener('pointercancel',()=>{pressed=null;},{passive:true});
  element.addEventListener('pointerleave',()=>setHovered(null),{passive:true});

  return {
    registerInteraction,
    setState(id,value,options){entries.get(id)?.setState(value,options);},
    update(now){
      if(!animations.size)return false;
      for(const item of [...animations]){
        const progress=Math.min(1,(now-item.start)/item.duration);item.update(easeOutCubic(progress));
        if(progress===1){animations.delete(item);item.complete?.();}
      }
      return true;
    },
    getState(id){return entries.get(id)?.state;},
  };
}
