(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav=document.getElementById('nav'), top=document.getElementById('top');
  let lastY=0,scrollFrame=0;
  const hero=document.querySelector('.hero'),about=document.querySelector('.about-photo img'),quote=document.querySelector('.quote blockquote');
  const onScroll=()=>{if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;const y=scrollY;nav.classList.toggle('scrolled',y>40);if(!nav.contains(document.activeElement)&&!document.getElementById('menuMobile').classList.contains('open')){if(y>500&&y>lastY+4)nav.classList.add('hide');else if(y<lastY-4||y<500)nav.classList.remove('hide');}top.classList.toggle('show',y>700);lastY=y;if(!reduced){if(hero){const p=Math.min(1,y/hero.offsetHeight);hero.style.setProperty('--hero-fade',String(1-p*.85));hero.style.setProperty('--hero-shift',p*90+'px');}if(about){const r=about.parentElement.getBoundingClientRect();about.style.transform='translateY('+((innerHeight-r.top)/(innerHeight+r.height)*-8)+'%) scale(1.08)';}if(quote){const r=quote.getBoundingClientRect();quote.style.translate='0 '+((innerHeight-r.top)/(innerHeight+r.height)*35)+'px';}}});};
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  top.addEventListener('click',()=>scrollTo({top:0,behavior:reduced?'instant':'smooth'}));
  const burger=document.getElementById('burger'),menu=document.getElementById('menuMobile');
  function toggleMenu(open){menu.classList.toggle('open',open);burger.classList.toggle('open',open);burger.setAttribute('aria-expanded',String(open));burger.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');menu.inert=!open;if(open)menu.querySelector('a')?.focus();else burger.focus();}
  burger.addEventListener('click',()=>toggleMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
  nav.addEventListener('focusin',()=>nav.classList.remove('hide'));
  if(!reduced && 'IntersectionObserver' in window){document.documentElement.classList.add('motion');const io=new IntersectionObserver(entries=>entries.forEach(e=>{e.target.classList.toggle('in',e.isIntersecting);}),{threshold:0.12});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));}
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.getElementById(a.hash.slice(1));if(target){e.preventDefault();target.scrollIntoView({behavior:reduced?'instant':'smooth'});}}));
  const slides=[...document.querySelectorAll('.hero .slide')];let currentSlide=0;
  if(slides.length>1&&!reduced)setInterval(()=>{if(document.hidden)return;slides[currentSlide].classList.remove('active');currentSlide=(currentSlide+1)%slides.length;slides[currentSlide].classList.add('active');const credit=document.querySelector('.hero-credit');if(credit)credit.textContent='© '+slides[currentSlide].dataset.credit;},6000);
  const dot=document.querySelector('.cursor-dot'),ring=document.querySelector('.cursor-ring');
  if(!reduced&&matchMedia('(hover:hover) and (pointer:fine)').matches&&dot&&ring){let mx=-100,my=-100,rx=-100,ry=-100,frame=0;const move=()=>{rx+=(mx-rx)*.16;ry+=(my-ry)*.16;dot.style.transform=`translate(${mx-3}px,${my-3}px)`;const half=ring.classList.contains('grow')?40:19;ring.style.transform=`translate(${rx-half}px,${ry-half}px)`;frame=requestAnimationFrame(move);};document.addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;document.documentElement.classList.add('custom-cursor');if(!frame)move();});document.documentElement.addEventListener('pointerleave',()=>{document.documentElement.classList.remove('custom-cursor');cancelAnimationFrame(frame);frame=0;});document.querySelectorAll('a,button,.card').forEach(el=>{el.addEventListener('pointerenter',()=>ring.classList.add('grow'));el.addEventListener('pointerleave',()=>ring.classList.remove('grow'));});}
  const track=document.getElementById('marqueeTrack');if(track&&!reduced){track.innerHTML+=track.innerHTML;}
  const cards=[...document.querySelectorAll('#grid .card')];
  const empty=document.getElementById('galleryEmpty');
  document.querySelectorAll('#filters button').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('#filters button').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    cards.forEach(card=>card.classList.toggle('hide',button.dataset.filter!=='all'&&!card.dataset.cat.split(' ').includes(button.dataset.filter)));
    if(empty){empty.hidden=cards.some(c=>!c.classList.contains('hide'));if(cards.length)empty.textContent='Aucune photographie dans cet univers pour le moment.';}
  }));
  const lb=document.getElementById('lightbox'),img=lb.querySelector('img'),cap=lb.querySelector('.cap');let visible=[],index=0,opener=null;
  function show(){const card=visible[index];if(!card)return;const source=card.querySelector('img');img.src=card.dataset.large||source.src;img.alt=source.alt;cap.textContent=card.querySelector('h3').textContent+' — © '+card.dataset.credit+' · '+(index+1)+' / '+visible.length;}
  function open(card){visible=cards.filter(c=>!c.classList.contains('hide'));index=visible.indexOf(card);if(index<0)return;opener=document.activeElement;show();lb.inert=false;lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';lb.querySelector('.close').focus();}
  function close(){lb.classList.remove('open');lb.setAttribute('aria-hidden','true');lb.inert=true;document.body.style.overflow='';opener?.focus();}
  function step(dir){if(!visible.length)return;index=(index+dir+visible.length)%visible.length;show();}
  cards.forEach(card=>{card.addEventListener('click',()=>open(card));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(card);}});});
  lb.querySelector('.close').addEventListener('click',close);lb.querySelector('.prev').addEventListener('click',()=>step(-1));lb.querySelector('.next').addEventListener('click',()=>step(1));lb.addEventListener('click',e=>{if(e.target===lb)close();});
  addEventListener('keydown',e=>{
    if(lb.classList.contains('open')){if(e.key==='Escape')close();if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);if(e.key==='Tab'){const list=[...lb.querySelectorAll('button')];const n=list.indexOf(document.activeElement);e.preventDefault();list[(n+(e.shiftKey?list.length-1:1))%list.length].focus();}}
    else if(menu.classList.contains('open')){if(e.key==='Escape')toggleMenu(false);if(e.key==='Tab'){const list=[burger,...menu.querySelectorAll('a')],n=list.indexOf(document.activeElement);e.preventDefault();list[(n+(e.shiftKey?list.length-1:1))%list.length].focus();}}
  });
  let touch=null;img.addEventListener('pointerdown',e=>{if(e.isPrimary&&(window.visualViewport?.scale||1)<=1.05)touch={x:e.clientX,y:e.clientY};});img.addEventListener('pointerup',e=>{if(!touch)return;const x=e.clientX-touch.x,y=e.clientY-touch.y;touch=null;if(Math.abs(x)>55&&Math.abs(x)>Math.abs(y)*1.5)step(x<0?1:-1);});img.addEventListener('pointercancel',()=>{touch=null;});
  const form=document.getElementById('contactForm');if(form)form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const values=new FormData(form);const subject=values.get('subject')||'Projet photographique';const body=values.get('body')+'\n\n'+values.get('name')+'\n'+values.get('email');location.href='mailto:'+form.dataset.email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);document.getElementById('contactStatus').textContent='Votre message est préparé. Envoyez-le depuis votre logiciel de messagerie.';});
})();
