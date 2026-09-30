(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav=document.getElementById('nav'), top=document.getElementById('top');
  const onScroll=()=>{nav.classList.toggle('scrolled',scrollY>40);top.classList.toggle('show',scrollY>700);};
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  top.addEventListener('click',()=>scrollTo({top:0,behavior:reduced?'instant':'smooth'}));
  const burger=document.getElementById('burger'),menu=document.getElementById('menuMobile');
  function toggleMenu(open){menu.classList.toggle('open',open);burger.classList.toggle('open',open);burger.setAttribute('aria-expanded',String(open));burger.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');menu.inert=!open;if(open)menu.querySelector('a')?.focus();else burger.focus();}
  burger.addEventListener('click',()=>toggleMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
  if(!reduced && 'IntersectionObserver' in window){document.documentElement.classList.add('motion');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:0.05});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));}
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
