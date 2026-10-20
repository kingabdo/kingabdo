const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const icon = name => `<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const esc = value => String(value ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const page = document.body.dataset.page;
/* Some hosts drop the query string between pages, so links also carry their parameter
   in the hash (#id-usa) and in session storage. */
const routeKeys = {"lesson.html":"id","fiche.html":"lesson"};
function routeParam(name){
  const q=new URLSearchParams(location.search).get(name);if(q)return q;
  const m=location.hash.match(new RegExp(`^#${name}-([\\w-]+)$`));if(m)return m[1];
  try{return sessionStorage.getItem("atlas-route:"+name)||"";}catch(e){return "";}
}
document.addEventListener("click",e=>{
  const a=e.target.closest?.("a[href]");if(!a)return;
  let u;try{u=new URL(a.getAttribute("href"),location.href);}catch(err){return;}
  const key=routeKeys[u.pathname.split("/").pop()];if(!key)return;
  try{const v=u.searchParams.get(key);v?sessionStorage.setItem("atlas-route:"+key,v):sessionStorage.removeItem("atlas-route:"+key);}catch(err){}
},true);
const lessonHref = id => `lesson.html?id=${id}#id-${id}`;
const ficheHref = id => `fiche.html?lesson=${id}#lesson-${id}`;
const brand = `<a class="brand" href="index.html" aria-label="أطلس المعرفة · تسنيم — الرئيسية"><span class="brand-mark">${icon("compass")}</span><span><strong>أطلس المعرفة</strong><small>تسنيم</small></span></a>`;
$("#siteHeader").innerHTML = `<div class="header-inner container">${brand}<nav class="nav-links" id="mainNav" aria-label="القائمة الرئيسية"><a href="index.html" ${page==="home"?'aria-current="page"':""}>الرئيسية</a><a href="lessons.html" ${["library","lesson"].includes(page)?'aria-current="page"':""}>مكتبة الدروس</a><a href="index.html#services" ${["fiche","schedule"].includes(page)?'aria-current="page"':""}>أدوات الأستاذ</a><a href="index.html#about">عن أطلس</a></nav><a class="button primary header-cta" href="fiche.html">حضّر درسك ${icon("arrow")}</a><button class="menu-toggle" id="menuToggle" aria-label="فتح القائمة" aria-controls="mainNav" aria-expanded="false">${icon("menu")}</button></div>`;
$("#siteFooter").innerHTML = `<div class="container"><div class="footer-main"><div>${brand}<p>مساحة للتاريخ والجغرافيا في التعليم المغربي.<br>المعرفة في سياقها، والتحضير بين يدي الأستاذ.</p></div><div class="footer-links"><h3>استكشف أطلس</h3><a href="index.html">الرئيسية</a><a href="lessons.html">مكتبة الدروس</a><a href="index.html#about">عن المنصة</a><a href="index.html#faq">أسئلة شائعة</a></div><div class="footer-links"><h3>مساحة الأستاذ</h3><a href="fiche.html">إعداد الجذاذة</a><a href="schedule.html">التوزيع الزمني</a><span>الحفظ على هذا المتصفح فقط</span><span>الوثائق قابلة للطباعة بصيغة PDF</span></div></div><div class="footer-bottom"><span class="footer-note">© ${new Date().getFullYear()} أطلس المعرفة · موارد ومسودات تربوية تحتاج مراجعة الأستاذ قبل اعتمادها.</span><details class="credits"><summary>مصادر الصور والخط</summary><div><a href="https://www.pexels.com/photo/scenic-view-of-atlas-mountains-in-morocco-37684102/" target="_blank" rel="noopener">الأطلس — Pierre Matile / Pexels</a><a href="https://www.pexels.com/photo/lush-green-forest-canopy-in-sunlight-33235130/" target="_blank" rel="noopener">الغابة — Diego Girón / Pexels</a><a href="https://unsplash.com/photos/old-faded-map-with-two-world-projections-and-floral-borders-lXcebNC9YAA" target="_blank" rel="noopener">الخريطة التاريخية — Smithsonian / Unsplash</a><a href="https://unsplash.com/photos/city-skyline-across-body-of-water-during-sunset-CppeXMnPnlw" target="_blank" rel="noopener">نيويورك — Clay Banks / Unsplash</a><a href="https://www.pexels.com/photo/aerial-view-of-containers-and-machinery-in-a-port-24244232/" target="_blank" rel="noopener">الميناء — Pexels</a><a href="https://www.pexels.com/photo/european-union-flag-waving-against-modern-building-33401027/" target="_blank" rel="noopener">علم الاتحاد الأوروبي — Pexels</a><a href="https://www.pexels.com/photo/ballot-box-with-person-casting-a-vote-7103191/" target="_blank" rel="noopener">الاقتراع — Pexels</a><a href="https://github.com/IBM/plex" target="_blank" rel="noopener">IBM Plex Sans Arabic · OFL</a><span>صور الأغلفة توضيحية، وليست وثائق تعليمية أصلية.</span></div></details></div></div>`;
const menu=$("#menuToggle"), nav=$("#mainNav");
function closeMenu(){nav.classList.remove("open");menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","فتح القائمة");}
menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"إغلاق القائمة":"فتح القائمة");});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open")){closeMenu();menu.focus();}});
document.addEventListener("click",e=>{if(!$("#siteHeader").contains(e.target))closeMenu();});
$$("a",nav).forEach(a=>a.addEventListener("click",closeMenu));
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),3400);}
function lessonCard(r){return `<a href="${lessonHref(r.id)}" class="lesson-card" data-lesson="${r.id}"><div class="lesson-card-image"><img src="assets/${r.image}" alt="${r.alt}" width="600" height="400" loading="lazy"><span class="subject-badge">${r.type}${r.fullLesson?" · درس كامل":""}</span></div><div class="lesson-card-body"><span class="card-level">${icon("book")}${r.level}${r.term?" · "+r.term:""}</span><h3>${r.title}</h3><p>${r.description}</p><div class="card-bottom"><span>${icon("clock")}${r.duration}${r.fullLesson?"":" · مقترح"}</span><b>استكشف الدرس ${icon("arrow")}</b></div></div></a>`;}
function setFilterState(buttons,key,value){buttons.forEach(b=>{const active=b.dataset[key]===value;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});}
if(page==="home"){
  const homeFilters=$$("[data-home-filter]");
  function renderFeatured(filter="all"){$("#featuredLessons").innerHTML=resources.filter(r=>filter==="all"||r.category===filter).slice(0,3).map(lessonCard).join("");setFilterState(homeFilters,"homeFilter",filter);}
  homeFilters.forEach(b=>b.addEventListener("click",()=>renderFeatured(b.dataset.homeFilter)));renderFeatured();
  // Preserve old entry links while keeping editing off the landing page.
  if(location.hash==="#studio")location.replace("fiche.html");
  else if(location.hash==="#library")location.replace("lessons.html");
}
if(page==="library"){
  let selected="all";const filters=$$("[data-filter]");
  const normalize=s=>s.toLowerCase().replace(/[\u064b-\u065f\u0670\u0640]/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي");
  const gradeOption=document.createElement("option");gradeOption.value="الثالثة إعدادي";gradeOption.textContent="الثالثة إعدادي";$("#levelFilter").append(gradeOption);
  const notice=$(".resource-notice p");notice.innerHTML="<strong>عن المحتوى المتاح</strong>درس الولايات المتحدة الأمريكية متاح بمحتوى الملف المرفق، ونصوصه الأصلية ووثائقه المعاد تنظيمها. بقية الموارد بطاقات تقديم ومسارات تحضير وليست عروضًا كاملة.";
  function filterLibrary(){const query=normalize($("#resourceSearch").value.trim()),level=$("#levelFilter").value;const matches=resources.filter(r=>(selected==="all"||r.category===selected)&&(level==="all"||r.level===level||r.cycle===level)&&normalize(`${r.title} ${r.type} ${r.description} ${r.level} ${r.cycle||""}`).includes(query));$("#libraryGrid").innerHTML=matches.map(lessonCard).join("");$("#resultCount").textContent=`${matches.length} من ${resources.length} دروس` ;$("#emptyState").hidden=matches.length>0;setFilterState(filters,"filter",selected);}
  filters.forEach(b=>b.addEventListener("click",()=>{selected=b.dataset.filter;filterLibrary();}));
  $("#resourceSearch").addEventListener("input",filterLibrary);$("#levelFilter").addEventListener("change",filterLibrary);$("#searchForm").addEventListener("submit",e=>{e.preventDefault();filterLibrary();});
  $("#clearFilters").addEventListener("click",()=>{selected="all";$("#resourceSearch").value="";$("#levelFilter").value="all";filterLibrary();$("#resourceSearch").focus();});filterLibrary();
}
if(page==="lesson"){
  const showLesson=id=>{
  const r=resources.find(r=>r.id===id);
  if(!r){
    $("#lessonCrumb").textContent="اختر درسًا";
    $("#lessonContent").innerHTML=`<div class="empty-state"><h1>اختر درسًا لعرضه.</h1><p>انقر على أحد الدروس ليُفتح هنا مباشرة.</p></div><div class="lesson-grid lesson-picker">${resources.map(lessonCard).join("")}</div>`;
    $(".related-section").hidden=true;
    $$(".lesson-picker [data-lesson]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();history.replaceState(null,"",`#id-${a.dataset.lesson}`);showLesson(a.dataset.lesson);scrollTo(0,0);}));
  }
  else{
    $(".related-section").hidden=false;
    document.title=`${r.title} — أطلس المعرفة · تسنيم`;$("#lessonCrumb").textContent=r.type;
    $("#lessonContent").innerHTML=`<section class="lesson-hero"><div><div class="lesson-meta"><span class="inline-badge">${r.type}</span><span>${r.level}</span><span>${r.duration} · مقترح</span></div><h1>${r.title}</h1><p>${r.description}</p><a class="button primary" href="${ficheHref(r.id)}">حضّر جذاذة هذا الدرس ${icon("arrow")}</a></div><figure class="lesson-cover"><img src="assets/${r.image}" alt="${r.alt}" width="900" height="600"><figcaption>صورة توضيحية للموضوع</figcaption></figure></section><div class="lesson-layout"><aside class="lesson-sidebar"><h3>في هذا الدرس</h3><nav aria-label="محتويات الدرس"><a href="#problem"><span>01</span>الإشكالية</a><a href="#objectives"><span>02</span>أهداف التعلّم</a><a href="#learning"><span>03</span>مسار الأنشطة</a><a href="#assessment"><span>04</span>التقويم</a></nav></aside><article class="lesson-body"><section id="problem"><p class="eyebrow">نقطة الانطلاق</p><h2>سؤال يفتح الدرس.</h2><div class="question-box">${r.problem}</div></section><section id="objectives"><h2>ما الذي نبنيه مع المتعلّم؟</h2><ul class="objectives-list">${r.objectives.map(o=>`<li>${icon("check")}${o}</li>`).join("")}</ul></section><section id="learning"><h2>من الملاحظة إلى التركيب.</h2>${r.steps.map((s,i)=>`<div class="learning-step"><span>0${i+1}</span><div><h3>${s[0]}</h3><p>${s[1]}</p></div></div>`).join("")}</section><section id="assessment"><h2>أسئلة لقياس الفهم.</h2><ol class="assessment-list">${r.questions.map(q=>`<li>${q}</li>`).join("")}</ol></section><div class="lesson-action"><div><h3>حوّل هذا المسار إلى جذاذتك.</h3><p>ستجد الإشكالية والأهداف والأنشطة جاهزة للتعديل.</p></div><a class="button light-button compact" href="${ficheHref(r.id)}">إعداد الجذاذة ${icon("arrow")}</a></div><aside class="resource-notice"><p>بطاقة تقديم تربوية مستلهمة من عنوان المورد المرجعي، وليست عرض الدرس الأصلي كاملاً. انتقِ الوثائق المناسبة وتحقق من معطياتها قبل تقديمها داخل القسم.</p></aside></article></div>`;
    if(r.fullLesson)(r.id==="ww2"?renderWW2Lesson:renderUSALesson)(r);
    $("#relatedLessons").innerHTML=resources.filter(x=>x.id!==r.id).slice(0,3).map(lessonCard).join("");
  }
  };
  showLesson(routeParam("id"));
}
