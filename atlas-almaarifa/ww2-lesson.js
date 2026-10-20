/* The original pedagogical text is rendered verbatim from WW2_SOURCE.
   UI labels and editorial cautions are separate from source content. */
function renderWW2Lesson(resource){
  document.body.classList.add("full-course");
  const T=(n,i)=>WW2_SOURCE[n-1].text[i];
  const orig=t=>`<span class="source-verbatim">${esc(t)}</span>`;
  const slug=s=>s.replace(/ـ/g,"").replace(/\s+/g," ").trim();
  const img=n=>`assets/ww2/s${String(n).padStart(2,"0")}.webp`;

  const notes={
    2:"ملاحظة تحريرية: يحمل الهدف الثالث في الملف عنوان «الهدف الثاني» أيضًا. احتُفظ بالنص كما ورد.",
    7:"ملاحظة تحريرية: تذكر هذه الشريحة «ضم سلوفاكيا 1938»، وتذكر الشريحة 11 «دخول الجيوش النازية براغ» سنة 1939. التسمية والتاريخ يحتاجان إلى مراجعة؛ النصان محفوظان كما وردا.",
    8:"ملاحظة تحريرية: بدأ الاحتلال الإيطالي لليبيا سنة 1911 وانتهت حملة إخضاعها سنة 1931. يحتاج تاريخ «إحتلال ليبيا 1931» إلى توضيح؛ النص محفوظ كما ورد.",
    17:"ملاحظة تحريرية: كانت السويد محايدة، والدولتان اللتان غُزيتا سنة 1940 في شمال أوروبا هما الدانمارك والنرويج. الاسم محفوظ كما ورد في الملف ويحتاج إلى تحقق.",
    32:"ملاحظة تحريرية: الرقم «أكثر من مليوني جندي» يخص على الأرجح مجمل حملة النورماندي وليس يوم الإنزال وحده. يحتاج إلى توضيح؛ النص محفوظ كما ورد.",
    41:"ملاحظة تحريرية: الأرقام منقولة كما وردت، وتقديرات الخسائر تختلف بين المصادر. كتابة «02 مليون» تحتاج على الأرجح إلى تصحيح. الأعمدة تمثل القيم المكتوبة فقط ولا تضيف معطيات.",
    43:"ملاحظة تحريرية: المبلغان «مليار و100 مليون دولار» و«ملياري دولار» لا ينسجمان مع عبارة «مئات المليارات» في الشريحة السابقة. يحتاجان إلى مراجعة المصدر؛ النص محفوظ كما ورد."
  };

  const activity=(label,text)=>`<p class="source-question ww2-activity"><span class="question-icon">${icon("book")}</span><span><b>${orig(label)}</b>${orig(text)}</span></p>`;
  const prose=t=>`<p class="source-prose">${orig(t)}</p>`;
  const attribution=(...ts)=>`<p class="source-reference">${ts.map(orig).join(" · ")}</p>`;
  const figure=(n,caption,extra="")=>`<figure class="evidence-figure"><button class="evidence-zoom" data-image="${img(n)}" data-caption="${esc(caption)}" aria-label="تكبير ${esc(slug(caption))}"><img src="${img(n)}" alt="${esc(slug(caption))}" loading="lazy" width="1000" height="563"><span class="zoom-hint">${icon("search")} تكبير الوثيقة</span></button><figcaption><span>${orig(caption)}</span><small>من الشريحة ${n}</small></figcaption></figure>${extra}`;
  const callouts=list=>list.length?`<ul class="ww2-callouts">${list.map(t=>Array.isArray(t)?`<li><b>${orig(t[1])}</b>${orig(t[0])}</li>`:`<li>${orig(t)}</li>`).join("")}</ul>`:"";
  function bars(rows){
    const max=Math.max(...rows.map(r=>r[1]));
    return `<div class="horizontal-chart" aria-label="تمثيل بصري للأرقام الأصلية">${rows.map(r=>`<div class="h-bar-row side-${r[3]}"><span>${esc(r[0])}</span><div class="h-bar-track"><i style="width:${Math.max(1.5,r[1]/max*100)}%"></i></div><b>${esc(r[2])}</b></div>`).join("")}</div>`;
  }
  function timeline(items){
    return `<ol class="ww2-timeline">${items.map(([date,text])=>`<li><time>${orig(date)}</time><p>${orig(text)}</p></li>`).join("")}</ol>`;
  }

  const docs={
    2:()=>({type:"أهداف التعلّم",title:"أهــــداف التعلــــم",body:`<div class="learning-goals">${[[0,1],[2,3],[5,4]].map(([a,b])=>`<section class="learning-goal"><div><b>${orig(T(2,a))}</b></div><p>${orig(T(2,b))}</p></section>`).join("")}</div>`}),
    3:()=>({type:"مقدمة الدرس",title:"المقدمة",body:`${prose(T(3,2))}${attribution(T(3,3),T(3,4))}<p class="ww2-hook"><b>${orig(T(3,5))}</b> ${orig(T(3,0))} ${orig(T(3,1))}</p>${activity(T(3,6),T(3,7))}`}),
    4:()=>({type:"من وثائق الدرس",title:T(4,4),body:`${prose(T(4,3))}${attribution(T(4,5))}`}),
    5:()=>({type:"من وثائق الدرس",title:T(5,20),body:`<div class="ww2-crises">
      <section><h4>${orig(T(5,5))}</h4><ul><li>${orig(T(5,0))}</li><li>${orig(T(5,1))}</li><li>${orig(T(5,2))}</li><li>${orig(T(5,3)+"\n"+T(5,4))}</li></ul></section>
      <section><h4>${orig(T(5,11))}</h4><ul><li>${orig(T(5,6))}</li><li>${orig(T(5,7))}</li><li>${orig(T(5,8))}</li><li>${orig(T(5,9))}</li><li>${orig(T(5,10))}</li></ul></section>
      <section><h4>${orig(T(5,12))}</h4><ul><li>${orig(T(5,13)+"\n"+T(5,14))}</li><li>${orig(T(5,15)+"\n"+T(5,16))}</li></ul></section></div>`}),
    6:()=>({type:"من وثائق الدرس",title:T(6,3),body:`<div class="ww2-powers">${[6,5,4].map(i=>`<div>${orig(T(6,i))}</div>`).join("")}</div>`}),
    7:()=>({type:"خريطة",title:T(7,23),body:figure(7,T(7,23))+callouts([[T(7,11),T(7,12)],[T(7,5),T(7,6)],[T(7,7),T(7,8)],[T(7,9),T(7,10)]])}),
    8:()=>({type:"خريطة",title:T(8,10),body:figure(8,T(8,10))+callouts([[T(8,5),T(8,6)],[T(8,3),T(8,4)]])}),
    9:()=>({type:"خريطة",title:T(9,6),body:figure(9,T(9,6))}),
    10:()=>({type:"من وثائق الدرس",title:T(10,8),body:timeline([[T(10,1),T(10,0)],[T(10,3),T(10,2)+"\n"+T(10,4)],[T(10,7),T(10,5)+" "+T(10,6)],[T(11,1),T(11,0)],[T(11,2),T(11,3)],[T(11,5),T(11,4)]])}),
    12:()=>({type:"خريطة",title:T(12,13),body:figure(12,T(12,13))+`<p class="ww2-hook"><b>${orig(T(12,10)+" "+T(12,11))}</b> ${orig(T(12,12))}</p>`}),
    13:()=>({type:"من وثائق الدرس",title:T(13,13),body:`<div class="ww2-sides"><section class="axis"><h4>${orig(T(13,6))}</h4><ul><li><b>${orig(T(13,7))}</b>${orig(T(13,1))}</li><li><b>${orig(T(13,8))}</b>${orig(T(13,0))}</li><li><b>${orig(T(13,9))}</b>${orig(T(13,2))}</li></ul></section><section class="allies"><h4>${orig(T(13,14))}</h4><ul><li><b>${orig(T(13,10))}</b>${orig(T(13,4))}</li><li><b>${orig(T(13,11))}</b>${orig(T(13,3))}</li><li><b>${orig(T(13,12))}</b>${orig(T(13,5))}</li></ul></section></div><p class="ww2-hook"><b>${orig(T(13,15))}</b></p>`}),
    14:()=>({type:"من وثائق الدرس",title:T(14,13),body:`${activity(T(14,12),T(14,13))}${timeline([[T(14,0),T(14,4)],[T(14,1),T(14,5)+" "+T(14,6)],[T(14,2),T(14,7)],[T(14,3),T(14,8)]])}<div class="ww2-phases"><span>${orig(T(14,14))}: ${orig(T(14,9))}</span><span>${orig(T(14,15))}: ${orig(T(14,10))}</span><span>${orig(T(14,11))}</span></div>`}),
    17:()=>({type:"خريطة",title:T(17,15),body:figure(17,T(17,15))+callouts([[T(17,10),T(17,9)],[T(17,12),T(17,11)],[T(17,14),T(17,13)]])}),
    18:()=>({type:"خريطة",title:T(18,9),body:figure(18,T(18,9))+callouts([[T(18,12),T(18,11)],[T(18,14),T(18,13)]])}),
    19:()=>({type:"خريطة",title:T(19,9),body:figure(19,T(19,9))+callouts([T(19,11)])}),
    20:()=>({type:"خريطة",title:T(20,10),body:figure(20,T(20,10))+callouts([[T(20,13),T(20,12)]])}),
    21:()=>({type:"خريطة",title:"حصار لينغراد والشتاء الروسي",body:figure(21,"حصار لينغراد والشتاء الروسي")+callouts([T(21,10),T(21,11)])}),
    22:()=>({type:T(22,1),title:T(22,2),body:prose(T(22,0))}),
    26:()=>({type:"خريطة",title:T(26,6),body:figure(26,T(26,6))+callouts([T(26,8),T(26,9),T(26,10)])}),
    28:()=>({type:"خريطة",title:T(28,14),body:figure(28,T(28,14))+callouts([T(28,11),T(28,13),T(28,16),T(28,17)])}),
    29:()=>({type:"خريطة",title:T(29,10),body:figure(29,T(29,10))}),
    30:()=>({type:"خريطة",title:T(30,9),body:figure(30,T(30,9))}),
    31:()=>({type:"خريطة",title:T(31,9),body:figure(31,T(31,9))+callouts([T(31,11)+" "+T(31,12)])}),
    32:()=>({type:T(32,1),title:T(32,3),body:prose(T(32,0))}),
    34:()=>({type:"خريطة",title:T(34,9),body:figure(34,T(34,9))}),
    35:()=>({type:"خريطة",title:T(35,11),body:figure(35,T(35,11))}),
    36:()=>({type:"خريطة",title:T(36,5),body:figure(36,T(36,5))}),
    41:()=>({type:"قراءة المعطيات",title:T(41,8),body:`<div class="ww2-chart-legend"><span class="allies">${orig(T(41,9))}</span><span class="axis">${orig(T(41,7))}</span></div>${bars([["الاتحاد السوفياتي",21000,"21 مليون نسمة","allies"],["ألمانيا",6000,"6 مليون نسمة","axis"],["اليابان",2000,"02 مليون نسمة","axis"],["فرنسا",600,"600 الف نسمة","allies"],["و م أ",290,"290 الف نسمة","allies"],["إيطاليا",280,"280 الف نسمة","axis"],["إنجلترا",231,"231 الف نسمة","allies"]])}`}),
    42:()=>({type:"من وثائق الدرس",title:T(42,6),body:`${prose(T(42,0))}${attribution(T(42,1),T(42,2))}${prose(T(42,3))}${attribution(T(42,4),T(42,5))}${activity(T(42,7),T(42,8))}`}),
    43:()=>({type:"من وثائق الدرس",title:T(43,6),body:`${prose(T(43,0))}${attribution(T(43,1),T(43,2))}${prose(T(43,3))}${attribution(T(43,4),T(43,5))}${activity(T(43,7),T(43,8))}`}),
    44:()=>({type:"خريطة",title:T(44,23),body:figure(44,T(44,23))+callouts([T(44,22)])+activity(T(44,0),T(44,1))})
  };
  [23,24,33,37,38,39].forEach(n=>{const cap=n>=37?T(n,2):T(n,0);docs[n]=()=>({type:"وثيقة مصورة",title:cap,body:figure(n,cap)});});

  const stages=[
    {id:"intro",label:"تقديم الدرس",number:"01",sections:[{id:"goals",label:"أهداف التعلّم",slides:[2]},{id:"hook",label:"المقدمة: ألمانيا بعد فرساي",slides:[3]}]},
    {id:"causes",label:"أسباب الحرب",number:"02",sections:[{id:"indirect",label:"الأسباب غير المباشرة",slides:[4,5,6]},{id:"expansion",label:"توسعات ألمانيا وإيطاليا واليابان",slides:[7,8,9]},{id:"road",label:"الطريق نحو الحرب",slides:[10]},{id:"direct",label:"السبب المباشر",slides:[12]}]},
    {id:"phases",label:"مراحل الحرب",number:"03",sections:[{id:"sides",label:"طرفا الحرب",slides:[13,14]},{id:"phase1",label:"المرحلة الأولى: الاكتساح الألماني",slides:[17,18,19,20,21,22,23,24]},{id:"japan",label:"المرحلة الثانية: اليابان والخطأ الفادح",slides:[26]},{id:"turn",label:"دخول و م أ الحرب وتغيّر موازين القوى",slides:[28,29,30,31,32,33]},{id:"end",label:"نهاية الحرب في أوروبا وآسيا",slides:[34,35,36,37,38,39]}]},
    {id:"results",label:"نتائج الحرب",number:"04",sections:[{id:"human",label:"النتائج البشرية والاجتماعية",slides:[41,42]},{id:"economic",label:"النتائج الاقتصادية",slides:[43]},{id:"map1945",label:"أوروبا سنة 1945",slides:[44]}]}
  ];
  const sectionLead={phase1:T(16,1).replace(/\s+/g," "),japan:T(25,1).replace(/\s+/g," "),turn:T(27,1)+" "+T(27,2)};
  const photoIds=[23,24,33,37,38,39];

  function documentHTML(n,context){
    const d=docs[n]();
    return `<article class="course-document${photoIds.includes(n)?" photo-document":""}" data-source-slide="${n}" id="${context}-doc-${n}"><div class="document-heading"><div><span class="document-type">${d.type}</span><h3>${orig(d.title)}</h3></div><span class="source-page" title="رقم الشريحة الأصلية">${String(n).padStart(2,"0")}</span></div>${notes[n]?`<aside class="editorial-note"><strong>للمراجعة</strong>${esc(notes[n])}</aside>`:""}<div class="document-texts">${d.body}</div></article>`;
  }
  function stageHTML(stage,idx){
    const last=idx===stages.length-1;
    return `<section class="course-panel" id="panel-${stage.id}" role="tabpanel" aria-labelledby="tab-${stage.id}" ${stage.id!=="intro"?"hidden":""}><div class="chapter-layout"><aside class="chapter-sidebar"><span class="eyebrow">مسار الدرس</span><strong>${stage.label}</strong><nav aria-label="فهرس ${stage.label}">${stage.sections.map((s,i)=>`<a href="#section-${s.id}" data-section="${s.id}"><span>0${i+1}</span>${s.label}${icon("arrow")}</a>`).join("")}</nav><div class="sidebar-provenance">${icon("document")}<p>النصوص كما وردت في الملف.<br>الوثائق في عرض جديد.</p></div></aside><div class="chapter-body">${stage.sections.map(section=>`<section class="course-section" id="section-${section.id}"><header class="course-section-head"><span>${stage.number}</span><div><p>${stage.label}</p><h2>${section.label}</h2>${sectionLead[section.id]?`<p class="ww2-lead">${orig(sectionLead[section.id])}</p>`:""}</div></header>${section.slides.map(n=>documentHTML(n,section.id)).join("")}</section>`).join("")}<div class="chapter-bottom"><span>أكملت محور «${stage.label}»</span>${last?`<a class="button primary" href="fiche.html?lesson=ww2">إعداد جذاذة الدرس ${icon("arrow")}</a>`:`<button class="button primary" data-stage-next="${stages[idx+1].id}">المحور التالي ${icon("arrow")}</button>`}</div></div></div></section>`;
  }

  $("#lessonCrumb").textContent="التاريخ";
  $("#lessonContent").innerHTML=`
    <section class="usa-hero"><div class="usa-hero-copy"><div class="usa-meta"><span>التعليم الإعدادي</span><span>التاريخ</span></div><p class="usa-lesson-number">1939 – 1945</p><h1>الحرب العالمية<br>الثانية <span>الأسباب والنتائج</span></h1><p class="usa-subtitle">النصوص الأصلية، وقراءة جديدة للخرائط والوثائق.</p><div class="usa-hero-actions"><a class="button light-button" href="#ww2-intro">ابدأ الدرس ${icon("arrow")}</a><button class="presentation-toggle" id="presentationToggle" aria-pressed="false">${icon("grid")} وضع العرض</button></div><div class="usa-hero-meta"><span>${icon("clock")} ${esc(resource.duration)}</span><span>${icon("document")} 44 شريحة مرجعية</span><span>${icon("book")} 3 أنشطة رئيسية</span></div></div><figure class="usa-hero-photo"><img src="assets/ww2.jpg" alt="إنزال النورماندي: سفن وآليات على الشاطئ سنة 1944" width="900" height="690" fetchpriority="high"><figcaption><span>NORMANDY, 6 JUNE 1944</span><strong>من الأسباب إلى النتائج.</strong></figcaption></figure></section>
    <div class="source-integrity">${icon("check")}<p><strong>أُعيد تصميم طريقة العرض، مع الحفاظ على النصوص.</strong> نُقلت النصوص دون إعادة صياغة. الخرائط عرض مصوَّر للشرائح الأصلية، وتظهر ملاحظات التدقيق منفصلة بلون مميز.</p><a href="#sourcePolicy">تفاصيل المصدر ↓</a></div>
    <nav class="course-tabs" aria-label="محاور الدرس" role="tablist">${stages.map((s,i)=>`<button role="tab" id="tab-${s.id}" aria-controls="panel-${s.id}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-stage="${s.id}"><span>${s.number}</span>${s.label}</button>`).join("")}</nav>
    <div class="course-reading-progress" aria-hidden="true"><i id="courseProgress"></i></div>
    ${stages.map(stageHTML).join("")}
    <section class="source-policy" id="sourcePolicy"><div><p class="eyebrow">أمانة المحتوى</p><h2>الملف هو مرجع النص.</h2><p>حُفظت النصوص والأسئلة وعناوين الأنشطة كما وردت في العرض. أُزيلت أزرار التنقل بين الشرائح (الدخول والرجوع)، وأُعيد توزيع الوثائق على أربعة محاور.</p></div><div><details><summary>ما الذي تغيّر في التصميم؟ <span>+</span></summary><p>أُعيد بناء الخطاطات (الأزمات، طرفا الحرب، الخط الزمني، الخسائر البشرية) بعناصر قابلة للقراءة. أما الخرائط فهي صور مأخوذة من الشرائح، تُكبَّر دون تغيير حدودها أو ألوانها. الصور الفوتوغرافية هي صور الملف الأصلية.</p></details><details><summary>ما الذي لم يُنقل؟ <span>+</span></summary><p>الشريحة 15 فارغة، والشريحة 40 تكرر الشريحة 13 (طرفا الحرب)، وشرائح العناوين 16 و25 و27 صارت عناوين أقسام. حركات الشرائح وتتابع الظهور لا تنتقل إلى الصفحة.</p></details><details><summary>المستوى الدراسي والمرجع <span>+</span></summary><p>المادة: التاريخ. لم يحدّد الملف المستوى ولا مدة الدرس؛ المكتوب في بطاقة الدرس اقتراح يُراجَع. المرجع: عرض «الحرب العالمية الثانية: الأسباب والنتائج 1939 - 1945» المقدم من الأستاذ، ويستشهد بنصوص من «كتاب المنار» و«منار الاجتماعيات» و«الشامل في التاريخ».</p><p class="original-cover-text">${orig(T(1,0)+" — "+T(1,1)+" — "+T(1,2))}</p></details></div></section>
    <dialog id="evidenceDialog" class="evidence-dialog" aria-labelledby="evidenceDialogTitle"><div class="dialog-toolbar"><h2 id="evidenceDialogTitle"></h2><button id="closeEvidence" aria-label="إغلاق الوثيقة">${icon("close")}</button></div><div class="dialog-image"><img id="largeEvidence" alt=""></div><a id="openEvidence" target="_blank" rel="noopener">فتح الصورة بحجمها الكامل</a></dialog>`;

  const tabButtons=$$("[data-stage]"),panels=$$(".course-panel");
  function activate(id,scroll=false){
    if(!stages.some(s=>s.id===id))id="intro";
    panels.forEach(p=>p.hidden=p.id!==`panel-${id}`);
    tabButtons.forEach(b=>{const active=b.dataset.stage===id;b.setAttribute("aria-selected",String(active));b.tabIndex=active?0:-1;});
    if(scroll)$(".course-tabs").scrollIntoView({behavior:"smooth",block:"start"});
    updateProgress();
  }
  function goStage(id){history.pushState(null,"",`#ww2-${id}`);activate(id,true);}
  $(".usa-hero-actions a").addEventListener("click",e=>{e.preventDefault();goStage("intro");});
  tabButtons.forEach((button,i)=>{button.addEventListener("click",()=>goStage(button.dataset.stage));button.addEventListener("keydown",e=>{let next;if(e.key==="ArrowLeft")next=(i+1)%tabButtons.length;else if(e.key==="ArrowRight")next=(i-1+tabButtons.length)%tabButtons.length;else if(e.key==="Home")next=0;else if(e.key==="End")next=tabButtons.length-1;else return;e.preventDefault();tabButtons[next].focus();goStage(tabButtons[next].dataset.stage);});});
  $$("[data-stage-next]").forEach(b=>b.addEventListener("click",()=>goStage(b.dataset.stageNext)));
  $$("[data-section]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();document.getElementById(`section-${a.dataset.section}`).scrollIntoView({behavior:"smooth",block:"start"});}));
  addEventListener("hashchange",()=>{if(location.hash.startsWith("#ww2-"))activate(location.hash.slice(5),true);});
  addEventListener("popstate",()=>activate(location.hash.startsWith("#ww2-")?location.hash.slice(5):"intro"));
  function updateProgress(){const panel=$(".course-panel:not([hidden])");if(!panel)return;const rect=panel.getBoundingClientRect(),distance=Math.max(1,panel.offsetHeight-innerHeight);$("#courseProgress").style.width=`${Math.max(0,Math.min(100,-rect.top/distance*100))}%`;}
  addEventListener("scroll",updateProgress,{passive:true});
  $("#presentationToggle").addEventListener("click",()=>{const on=document.body.classList.toggle("presentation-mode");$("#presentationToggle").setAttribute("aria-pressed",String(on));toast(on?"وضع العرض مفعّل: نص أكبر ومساحة أوسع للوثائق.":"العودة إلى وضع القراءة.");});
  const dialog=$("#evidenceDialog");let opener=null;
  $$("[data-image]").forEach(b=>b.addEventListener("click",()=>{opener=b;$("#evidenceDialogTitle").textContent=slug(b.dataset.caption);$("#largeEvidence").src=b.dataset.image;$("#largeEvidence").alt=slug(b.dataset.caption);$("#openEvidence").href=b.dataset.image;dialog.showModal();}));
  $("#closeEvidence").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener("close",()=>opener?.focus());
  activate(location.hash.startsWith("#ww2-")?location.hash.slice(5):"intro");
}
