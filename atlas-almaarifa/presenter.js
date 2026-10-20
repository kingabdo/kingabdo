/* PowerPoint-style presenter shared by the full lessons.
   A slide is {theme, band, kind:"cover"|"divider"|"content", title, html}. The canvas is a fixed
   1600×900 stage scaled to the window. Elements with .pz-step reveal one at a time. */
const Presenter=(()=>{
  const W=1600,H=900;
  let root,canvas,slides=[],index=0,lessonTitle="",lastFocus=null,touchX=null;
  const q=s=>root.querySelector(s);

  function build(){
    root=document.createElement("div");
    root.className="pz";root.hidden=true;
    root.setAttribute("role","dialog");root.setAttribute("aria-modal","true");root.setAttribute("aria-label","عرض الدرس");
    root.innerHTML=`<div class="pz-viewport"><div class="pz-canvas" aria-live="polite"></div></div>
      <div class="pz-bar">
        <div class="pz-bar-group">
          <button class="pz-btn" data-pz="exit" title="إنهاء العرض (Esc)">${icon("close")}<span>إنهاء</span></button>
          <button class="pz-btn" data-pz="grid" title="كل الشرائح (G)">${icon("grid")}<span>الشرائح</span></button>
          <button class="pz-btn" data-pz="full" title="ملء الشاشة (F)">${icon("search")}<span>ملء الشاشة</span></button>
        </div>
        <div class="pz-progress" aria-hidden="true"><i></i></div>
        <div class="pz-bar-group">
          <button class="pz-btn pz-reveal" data-pz="reveal" title="إظهار الجواب التالي (A)">${icon("check")}<span>إظهار الجواب</span></button>
          <span class="pz-count"></span>
          <button class="pz-btn pz-nav" data-pz="prev" aria-label="الشريحة السابقة">${icon("arrow")}</button>
          <button class="pz-btn pz-nav pz-next" data-pz="next" aria-label="الشريحة التالية">${icon("arrow")}</button>
        </div>
      </div>
      <div class="pz-grid" hidden><div class="pz-grid-head"><strong>كل الشرائح</strong><button class="pz-btn" data-pz="grid-close" aria-label="إغلاق">${icon("close")}</button></div><ol></ol></div>`;
    document.body.appendChild(root);
    canvas=q(".pz-canvas");
    root.addEventListener("click",e=>{
      const b=e.target.closest("[data-pz]");
      if(b){({exit:close,grid:toggleGrid,"grid-close":toggleGrid,full:fullscreen,reveal,prev:()=>go(index-1),next:()=>go(index+1)})[b.dataset.pz]();return;}
      const g=e.target.closest("[data-goto]");if(g){toggleGrid(false);go(+g.dataset.goto);return;}
      const t=e.target.closest(".pz-step-toggle");if(t){t.closest(".pz-step").classList.toggle("shown");updateReveal();}
    });
    addEventListener("keydown",onKey);
    addEventListener("resize",fit);
    const vp=q(".pz-viewport");
    vp.addEventListener("touchstart",e=>{touchX=e.touches[0].clientX;},{passive:true});
    vp.addEventListener("touchend",e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;touchX=null;if(Math.abs(dx)<60)return;go(dx>0?index+1:index-1);},{passive:true});
    document.addEventListener("fullscreenchange",()=>q('[data-pz="full"] span').textContent=document.fullscreenElement?"الخروج من ملء الشاشة":"ملء الشاشة");
  }
  function onKey(e){
    if(root.hidden||e.target.closest?.("textarea,input"))return;
    const grid=!q(".pz-grid").hidden;
    if(e.key==="Escape"){e.preventDefault();grid?toggleGrid(false):close();return;}
    if(grid)return;
    if([" ","PageDown","ArrowLeft","ArrowDown","Enter"].includes(e.key)){e.preventDefault();go(index+1);}
    else if(["PageUp","ArrowRight","ArrowUp","Backspace"].includes(e.key)){e.preventDefault();go(index-1);}
    else if(e.key==="Home"){e.preventDefault();go(0);}
    else if(e.key==="End"){e.preventDefault();go(slides.length-1);}
    else if(e.code==="KeyA"){e.preventDefault();reveal();}
    else if(e.code==="KeyF"){e.preventDefault();fullscreen();}
    else if(e.code==="KeyG"){e.preventDefault();toggleGrid();}
  }
  function slideHTML(s,i){
    const chrome=s.kind==="content";
    return `<section class="pz-slide theme-${s.theme||"base"} kind-${s.kind||"content"}">${chrome?`<header class="pz-band"><span>${s.band||""}</span><span class="pz-brand">أطلس المعرفة · تسنيم</span></header>`:""}<div class="pz-body">${s.html}</div>${chrome?`<footer class="pz-foot"><span>${esc(lessonTitle)}</span><span>${i+1} / ${slides.length}</span></footer>`:""}</section>`;
  }
  function render(){
    canvas.innerHTML=slideHTML(slides[index],index);
    canvas.querySelectorAll(".pz-fit").forEach(shrink);
    canvas.querySelectorAll(".pz-zoom").forEach(zoomFit);
    q(".pz-count").textContent=`${index+1} / ${slides.length}`;
    q(".pz-progress i").style.width=`${(index+1)/slides.length*100}%`;
    q('[data-pz="prev"]').disabled=index===0;
    q('[data-pz="next"]').disabled=index===slides.length-1;
    updateReveal();
    fit();
  }
  function shrink(el){
    let size=parseFloat(getComputedStyle(el).fontSize),min=parseFloat(el.dataset.min||17);
    while(el.scrollHeight>el.clientHeight+2&&size>min){size-=1;el.style.fontSize=size+"px";}
    el.classList.toggle("scroll",el.scrollHeight>el.clientHeight+2);
  }
  function zoomFit(el){
    let z=parseFloat(el.dataset.max||1.7);el.style.zoom=z;
    while(el.scrollHeight>el.clientHeight+2&&z>1.15){z=Math.round((z-.1)*100)/100;el.style.zoom=z;}
    el.classList.toggle("scroll",el.scrollHeight>el.clientHeight+2);
  }
  function fit(){
    if(root.hidden)return;
    const vp=q(".pz-viewport"),s=Math.min(vp.clientWidth/W,vp.clientHeight/H);
    canvas.style.transform=`translate(-50%,-50%) scale(${s})`;
  }
  function updateReveal(){
    const steps=[...canvas.querySelectorAll(".pz-step")],btn=q('[data-pz="reveal"]');
    btn.hidden=!steps.length;
    const left=steps.filter(s=>!s.classList.contains("shown")).length;
    btn.querySelector("span").textContent=left?`إظهار الجواب (${left})`:"إخفاء الأجوبة";
  }
  function reveal(){
    const steps=[...canvas.querySelectorAll(".pz-step")];if(!steps.length)return;
    const next=steps.find(s=>!s.classList.contains("shown"));
    if(next)next.classList.add("shown");else steps.forEach(s=>s.classList.remove("shown"));
    updateReveal();
  }
  function go(i){if(i<0||i>=slides.length||i===index&&canvas.innerHTML)return;index=i;render();}
  function toggleGrid(force){
    const g=q(".pz-grid"),open=typeof force==="boolean"?force:g.hidden;
    if(open){g.querySelector("ol").innerHTML=slides.map((s,i)=>`<li><button data-goto="${i}" class="theme-${s.theme||"base"}${i===index?" current":""}"><span>${i+1}</span>${esc(s.title||"")}</button></li>`).join("");}
    g.hidden=!open;
    if(open)g.querySelector(".current")?.focus();
  }
  function fullscreen(){
    if(document.fullscreenElement){document.exitFullscreen?.();return;}
    const p=root.requestFullscreen?.();
    if(!p){toast("ملء الشاشة غير متاح هنا؛ العرض يملأ النافذة.");return;}
    p.catch(()=>toast("ملء الشاشة غير متاح هنا؛ العرض يملأ النافذة."));
  }
  function open({title,slides:list,start=0}){
    if(!root)build();
    lessonTitle=title;slides=list;index=Math.max(0,Math.min(start,list.length-1));
    lastFocus=document.activeElement;
    root.hidden=false;document.documentElement.classList.add("pz-open");
    canvas.innerHTML="";render();
    q('[data-pz="next"]').focus();
  }
  function close(){
    if(document.fullscreenElement)document.exitFullscreen?.();
    root.hidden=true;toggleGrid(false);document.documentElement.classList.remove("pz-open");
    lastFocus?.focus?.();
  }
  return {open,close};
})();
