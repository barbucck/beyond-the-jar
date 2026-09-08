'use strict';

// Isolated visual prototype. All changes live in memory and reset on reload.
const icons = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  ticket: '<path d="M4 4h16v5a3 3 0 0 0 0 6v5H4v-5a3 3 0 0 0 0-6z"/><path d="M14 5v2m0 4v2m0 4v2"/>',
  chart: '<path d="M4 20V10m8 10V4m8 16v-7"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13"/><path d="M12 8H7a3 3 0 1 1 3-3zm0 0h5a3 3 0 1 0-3-3z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>', check: '<path d="m5 12 4 4L19 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.arrow}</svg>`;
document.querySelectorAll('[data-icon]').forEach(node => node.insertAdjacentHTML('afterbegin', icon(node.dataset.icon)));
const categories = [
  { id:'exploration', name:'Exploration', color:'green', completed:10 },
  { id:'unusual', name:'Insolite', color:'red', completed:3 },
  { id:'yellow', name:'Catégorie jaune', color:'yellow', completed:2 },
  { id:'blue', name:'Catégorie bleue', color:'blue', completed:2 },
  { id:'orange', name:'Catégorie orange', color:'orange', completed:1 }
];
const missions = [
  {id:1,title:'Découvrir un sentier inconnu',category:'exploration',difficulty:4,date:'2026-08-24',notes:'Prendre le temps de regarder autour de soi. Le chemin compte autant que la destination.',done:false},
  {id:2,title:'Dire oui à quelque chose d’inattendu',category:'unusual',difficulty:3,date:'2026-08-25',notes:'Sortir un peu de mes habitudes, même pour une toute petite chose.',done:false},
  {id:3,title:'Prendre une heure rien que pour soi',category:'blue',difficulty:2,date:'2026-08-26',notes:'Une heure sans notifications, sans obligation. Juste pour moi.',done:false}
];
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateLabel = date => new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',year:'numeric'}).format(new Date(`${date}T12:00:00`));
const colorStyle = category => `--accent:var(--${category.color});--pastel:var(--${category.color}-soft)`;
// Calendar-day arithmetic avoids daylight-saving and UTC date shifts.
function localToday(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function calendarDay(value){const [year,month,day]=value.split('-').map(Number);return Date.UTC(year,month-1,day)/86400000;}
function missionAge(m){return Math.max(0,calendarDay(m.done?m.completedDate:localToday())-calendarDay(m.date));}
function ageBadge(m){
 const days=missionAge(m);
 const level=m.done?'finished':days>=30?'old':days>=14?'maturing':'recent';
 const label=m.done?(days===0?'Accomplie le jour même':`Accomplie en ${days} jour${days>1?'s':''}`):(days===0?'Révélée aujourd’hui':`Depuis ${days} jour${days>1?'s':''}`);
 return `<span class="age-badge age-${level}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${label}</span>`;
}
document.querySelector('.page-header .date').textContent=new Intl.DateTimeFormat('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());
let expanded = false;
let statusFilter = 'active';
let categoryFilter = 'all';
// Representative examples from the 18 already counted completed missions.
missions.push(
 {id:101,title:'Voir le soleil se lever',category:'exploration',difficulty:3,date:'2026-08-10',completedDate:'2026-08-16',notes:'Un départ très matinal, et une vue qui en valait la peine.',done:true},
 {id:102,title:'Goûter un plat totalement inconnu',category:'unusual',difficulty:2,date:'2026-08-15',completedDate:'2026-08-20',notes:'Une belle découverte à partager.',done:true},
 {id:103,title:'Passer une soirée sans écran',category:'blue',difficulty:2,date:'2026-08-20',completedDate:'2026-08-23',notes:'Un livre, de la musique et du calme.',done:true}
);
$('#mission-grid').insertAdjacentHTML('beforebegin', `<div class="mission-filters"><div class="status-filters" role="group" aria-label="Statut des missions"><button data-status="active" aria-pressed="true">En cours</button><button data-status="done" aria-pressed="false">Accomplies</button><button data-status="all" aria-pressed="false">Toutes</button></div><label class="category-filter" for="mission-category-filter">Catégorie<select id="mission-category-filter"><option value="all">Toutes les catégories</option>${categories.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></label></div><p id="filter-summary" class="filter-summary" role="status"></p>`);
document.querySelectorAll('[data-status]').forEach(button=>button.onclick=()=>{statusFilter=button.dataset.status;render();$('#mission-grid').scrollLeft=0;});
$('#mission-category-filter').onchange=event=>{categoryFilter=event.target.value;render();$('#mission-grid').scrollLeft=0;};
let reward = {name:'', redeemed:false};
let toastTimer;
function toast(message){ $('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4000); }
function render(){
  const active=missions.filter(m=>(statusFilter==='all'||(statusFilter==='done'?m.done:!m.done))&&(categoryFilter==='all'||m.category===categoryFilter)).sort((a,b)=>a.date.localeCompare(b.date)||a.id-b.id);
  document.querySelectorAll('[data-status]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.status===statusFilter)));
  $('#missions-title').innerHTML=`${statusFilter==='active'?'Missions en cours':statusFilter==='done'?'Missions accomplies':'Vos missions'} <span class="count" id="active-count"></span>`;
  $('#filter-summary').textContent=`${active.length} mission${active.length===1?'':'s'} affichée${active.length===1?'':'s'} · Plus anciennes d’abord${statusFilter==='active'?'':' · Extrait de l’historique fictif'}`;
  $('#empty-state').textContent='Aucune mission ne correspond à ces filtres. Essayez une autre catégorie ou un autre statut.';
  const total=categories.reduce((sum,c)=>sum+c.completed,0);
  $('#completed-count').textContent=total;$('#percent').textContent=`${Math.round(total/150*100)} %`;
  $('#global-progress').value=total;$('#global-progress').textContent=`${total} sur 150`;
  $('#active-count').textContent=active.length;$('#empty-state').hidden=active.length>0;
  $('#show-all').textContent=expanded?'Réduire':`Voir les ${active.length} ↗`;$('#show-all').hidden=active.length<2;
  $('#mission-grid').classList.toggle('expanded',expanded);
  $('#mission-grid').innerHTML=active.map(m=>{
    const c=categories.find(c=>c.id===m.category);
    return `<button class="mission-card ${m.done?'completed-card':''}" style="${colorStyle(c)}" data-mission="${m.id}" aria-label="Ouvrir la mission : ${escapeHTML(m.title)}"><span class="mission-top"><span class="category-tag">${c.name.toUpperCase()}</span><span class="difficulty" role="img" aria-label="Difficulté : ${m.difficulty} sur 5">${'★'.repeat(m.difficulty)}${'☆'.repeat(5-m.difficulty)}</span></span><span class="mission-title">${escapeHTML(m.title)}</span>${ageBadge(m)}<span class="mission-date">${m.done?'Accomplie le '+dateLabel(m.completedDate):'Révélée le '+dateLabel(m.date)}</span><span class="mission-bottom"><span>${m.done?icon('check'):'<span class="status-dot"></span>'}${m.done?'Accomplie':'En cours'}</span>${icon('arrow')}</span></button>`;
  }).join('');
  $('#category-list').innerHTML=categories.map(c=>{
    return `<div class="category-progress" style="${colorStyle(c)}"><div class="category-row"><span class="category-name"><span class="category-dot"></span>${c.name}</span><div class="milestone-track"><progress max="30" value="${c.completed}" aria-label="${c.name} : ${c.completed} missions accomplies sur 30"></progress><span class="milestone-marker first" aria-hidden="true"></span><span class="milestone-marker second" aria-hidden="true"></span></div><strong>${c.completed} / 30</strong></div></div>`;
  }).join('');
  const upcoming=categories.map(c=>({name:c.name,next:[10,20,30].find(n=>n>c.completed),completed:c.completed})).filter(c=>c.next);
  const distance=Math.min(...upcoming.map(c=>c.next-c.completed));
  const closest=upcoming.filter(c=>c.next-c.completed===distance);
  $('#closest-reward').innerHTML=closest.length?`${icon('gift')}<span><span class="closest-label">${closest.length>1?'Prochaines récompenses':'Prochaine récompense'}</span><strong>${closest.map(c=>c.name).join(' et ')}</strong> — encore ${distance} mission${distance>1?'s':''}${closest.length>1?' dans chacune de ces catégories':''}.</span>`:'Tous les paliers de récompense sont atteints.';

}
$('#mission-grid').addEventListener('click',event=>{
  const button=event.target.closest('[data-mission]');if(!button)return;
  const m=missions.find(m=>m.id===Number(button.dataset.mission));const c=categories.find(c=>c.id===m.category);
  $('#mission-detail').innerHTML=`<span class="category-tag" style="${colorStyle(c)}">${c.name.toUpperCase()}</span><h2 id="mission-dialog-title">${escapeHTML(m.title)}</h2><div class="detail-meta"><span class="difficulty" style="color:var(--${c.color})" aria-label="Difficulté : ${m.difficulty} sur 5">${'★'.repeat(m.difficulty)}${'☆'.repeat(5-m.difficulty)}</span><span class="subtle">Révélée le ${dateLabel(m.date)}</span></div>${ageBadge(m)}<p class="detail-notes">${escapeHTML(m.notes||'Aucune note pour le moment.')}</p><button class="primary" id="complete-mission">${icon('check')}Marquer comme accomplie</button><p class="form-note">Simulation : aucune donnée réelle ne sera enregistrée.</p>`;
  if(m.done){$('#complete-mission').remove();$('#mission-detail').insertAdjacentHTML('beforeend',`<p class="completion-date">Accomplie le ${dateLabel(m.completedDate)}</p>`);}
  else $('#complete-mission').onclick=()=>{m.done=true;m.completedDate=localToday();c.completed++;$('#mission-dialog').close();render();$('#missions-title').tabIndex=-1;$('#missions-title').focus();toast('Une aventure de plus à votre actif. Bravo !');};
  $('#mission-dialog').showModal();
});
$('#show-all').onclick=()=>{expanded=!expanded;render();};
$('#category').innerHTML=categories.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
$('#add-button').onclick=()=>{$('#add-form').reset();$('#reveal-date').value=localToday();$('#reveal-date').max=localToday();$('#add-dialog').showModal();$('#title').focus();};
$('#title').oninput=()=>$('#title').setCustomValidity('');
$('#add-form').onsubmit=event=>{
  event.preventDefault();const form=new FormData(event.target);const title=form.get('title').trim();
  if(!title){$('#title').setCustomValidity('Saisissez un intitulé.');$('#title').reportValidity();return;}
  const c=categories.find(c=>c.id===form.get('category'));
  if(c.completed+missions.filter(m=>m.category===c.id&&!m.done).length>=30){toast('Les 30 missions de cette catégorie sont déjà révélées.');return;}
  missions.unshift({id:Date.now(),title,category:c.id,difficulty:Number(form.get('difficulty')),date:form.get('date'),notes:form.get('notes').trim(),done:false});
  $('#add-dialog').close();statusFilter='active';categoryFilter='all';$('#mission-category-filter').value='all';render();toast('Mission ajoutée à votre aventure.');
};
function openReward(){
  $('#reward-dialog .dialog-intro').textContent=reward.name?'Cette récompense a été tirée dans la jarre. Elle reste acquise.':'Le contenu reste une surprise jusqu’au tirage physique. Après avoir tiré le papier, notez ce qu’il vous réserve.';
  $('#reward-form').hidden=Boolean(reward.name);$('#reward-result').hidden=!reward.name;
  if(reward.name){$('#reward-dialog-title').textContent=reward.redeemed?'Un bonheur savouré':'Votre récompense est acquise';$('#reward-result').innerHTML=`<p class="detail-notes">${escapeHTML(reward.name)}</p>${reward.redeemed?'<p class="form-note">Récompense utilisée. Ce souvenir vous appartient.</p>':'<button class="primary" id="redeem-reward">Marquer comme utilisée</button>'}`;if(!reward.redeemed)$('#redeem-reward').onclick=()=>{reward.redeemed=true;reward.usedDate=localToday();updateReward();openReward();toast('Récompense marquée comme utilisée.');};}
  if(!$('#reward-dialog').open)$('#reward-dialog').showModal();
}
function updateReward(){
  const obtained=reward.name?1:0;
  $('#reward-total').innerHTML=`<strong>${obtained} / 15</strong> récompense${obtained===1?'':'s'} obtenue${obtained===1?'':'s'}`;const card=$('#reward-button');card.querySelector('.badge').textContent=reward.redeemed?'RÉCOMPENSE UTILISÉE':'RÉCOMPENSE ACQUISE';card.querySelector('strong').textContent=reward.name;card.querySelector('.reward-copy>span:last-child').textContent=reward.redeemed?'Un petit bonheur savouré.':'À savourer quand vous le souhaitez.';}
$('#reward-button').onclick=openReward;
$('#reward-name').oninput=()=>$('#reward-name').setCustomValidity('');
$('#reward-form').onsubmit=event=>{event.preventDefault();const name=$('#reward-name').value.trim();if(!name){$('#reward-name').setCustomValidity('Indiquez votre récompense.');$('#reward-name').reportValidity();return;}reward.name=name;reward.drawnDate=localToday();updateReward();openReward();toast('Votre récompense est acquise.');};
for(const id of ['about-button','menu-button'])$(`#${id}`).onclick=()=>$('#about-dialog').showModal();
document.querySelectorAll('[data-close]').forEach(button=>button.onclick=()=>button.closest('dialog').close());
document.querySelectorAll('.navigation a').forEach(link=>link.onclick=()=>{document.querySelectorAll('.navigation a').forEach(a=>a.removeAttribute('aria-current'));link.setAttribute('aria-current','page');if(link.hash==='#missions'){expanded=true;render();}});
$('#reset-button').onclick=()=>location.reload();
render();

const carousel = $('#mission-grid');
carousel.insertAdjacentHTML('afterend', `<div class="carousel-controls"><p aria-live="polite" id="carousel-position"></p><div><button class="previous" aria-label="Mission précédente" aria-controls="mission-grid">${icon('arrow')}</button><button class="next" aria-label="Mission suivante" aria-controls="mission-grid">${icon('arrow')}</button></div></div>`);
const carouselControls = $('.carousel-controls');
function updateCarousel(){
  const cards=[...carousel.children];
  carouselControls.hidden=cards.length<2||expanded;
  if(!cards.length)return;
  const left=carousel.getBoundingClientRect().left;
  let index=0;
  cards.forEach((card,i)=>{if(Math.abs(card.getBoundingClientRect().left-left)<Math.abs(cards[index].getBoundingClientRect().left-left))index=i;});
  $('#carousel-position').textContent=`${index+1} / ${cards.length} missions`;
  carouselControls.querySelector('.previous').disabled=carousel.scrollLeft<2;
  carouselControls.querySelector('.next').disabled=carousel.scrollLeft>=carousel.scrollWidth-carousel.clientWidth-2;
}
function moveCarousel(direction){
  const cards=[...carousel.children];
  const left=carousel.getBoundingClientRect().left;
  let index=cards.reduce((best,card,i)=>Math.abs(card.getBoundingClientRect().left-left)<Math.abs(cards[best].getBoundingClientRect().left-left)?i:best,0);
  const target=cards[Math.max(0,Math.min(cards.length-1,index+direction))];
  if(target)carousel.scrollBy({left:target.getBoundingClientRect().left-left-2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
carouselControls.querySelector('.previous').onclick=()=>moveCarousel(-1);
carouselControls.querySelector('.next').onclick=()=>moveCarousel(1);
carousel.addEventListener('scroll',updateCarousel,{passive:true});
window.addEventListener('resize',updateCarousel);
new MutationObserver(()=>requestAnimationFrame(updateCarousel)).observe(carousel,{childList:true,attributes:true,attributeFilter:['class']});
updateCarousel();

// Reward history shares the existing demo reward; no invented unlocked milestones.
let rewardStatusFilter='available';
function renderRewardHistory(){
 const status=reward.redeemed?'used':reward.name?'drawn':'available';
 document.querySelectorAll('[data-reward-status]').forEach(button=>{const selected=button.dataset.rewardStatus===rewardStatusFilter;button.setAttribute('aria-pressed',String(selected));});
 const matches=status===rewardStatusFilter;
 $('#reward-history-count').textContent=`${matches?1:0} récompense${matches?'':'s'}`;
 const empty={available:'Aucune récompense à tirer pour le moment. Les prochains paliers vous attendent.',drawn:'Aucune récompense en attente d’utilisation. Enregistrez d’abord votre tirage.',used:'Vous n’avez pas encore utilisé de récompense. Elles seront conservées ici après utilisation.'};
 $('#reward-history-list').innerHTML=matches?`<article class="history-reward"><span class="badge">EXPLORATION · PALIER 10</span><h3>${escapeHTML(reward.name||'Une surprise à découvrir')}</h3><p>${status==='available'?'Disponible · contenu inconnu avant le tirage':status==='drawn'?'À utiliser':'✓ Utilisée'}</p>${reward.drawnDate?`<p>Tirée le ${dateLabel(reward.drawnDate)}</p>`:''}${reward.usedDate?`<p>Utilisée le ${dateLabel(reward.usedDate)}</p>`:''}<button class="primary" id="open-history-reward">${status==='available'?'Enregistrer le tirage':status==='drawn'?'Voir et utiliser':'Voir le souvenir'}</button></article>`:`<p class="empty">${empty[rewardStatusFilter]}</p>`;
 if(matches)$('#open-history-reward').onclick=()=>{$('#rewards-history').close();openReward();};
}
function openRewardHistory(){rewardStatusFilter=reward.redeemed?'used':reward.name?'drawn':'available';renderRewardHistory();$('#rewards-history').showModal();}
$('#all-rewards').onclick=openRewardHistory;
document.querySelector('.navigation a[href="#recompenses"]').addEventListener('click',event=>{event.preventDefault();openRewardHistory();});
document.querySelectorAll('[data-reward-status]').forEach(button=>button.onclick=()=>{rewardStatusFilter=button.dataset.rewardStatus;renderRewardHistory();});
