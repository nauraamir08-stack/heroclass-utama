const sections={
 members:['/anggota/','#member-list','Belum ada anggota. Tambahkan nama dan foto melalui halaman admin.'],
 leaders:['/pengurus/','#leader-list','Belum ada pengurus. Isi jabatan saat menambahkan anggota di halaman admin.'],
 schedule:['/jadwal/','#schedule-list','Jadwal kuliah belum ditambahkan.'],
 gallery:['/galeri/','#gallery-list','Album masih kosong. Foto kegiatan bisa ditambahkan melalui halaman admin.']
};
const API=(window.HEROCLASS_API_URL||'https://profil-kelas-kita-shev4.beatopiaa.chatgpt.site').replace(/\/$/,'');
function el(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text)node.textContent=text;return node}
function photo(source,name){const img=el('img','profile-photo');img.src=API+'/media/'+encodeURIComponent(source);img.alt='Foto profil '+name;img.loading='lazy';return img}
function empty(target,message){target.replaceChildren(el('div','empty',message))}
function personCard(item){const card=el('article','profile-card');if(item.photo)card.append(photo(item.photo,item.name));else card.append(el('span','profile-initial',(item.name||'H').slice(0,1).toUpperCase()));const meta=el('div','profile-meta');meta.append(el('h3','',item.name));if(item.role)meta.append(el('p','profile-role',item.role));card.append(meta);return card}
function scheduleCard(item){const card=el('article','schedule-card');const time=el('strong','schedule-time',item.start+'–'+item.end);const info=el('div','schedule-info');info.append(el('h3','',item.course));info.append(el('p','',item.room?'Ruang '+item.room:'Mata kuliah'));card.append(el('span','schedule-day',item.day),time,info);return card}
function galleryCard(item){const card=el('article','gallery-card');const image=el('img','gallery-photo');image.src=API+'/media/'+encodeURIComponent(item.photo);image.alt=item.title;image.loading='lazy';const body=el('div','gallery-copy');body.append(el('h3','',item.title));if(item.caption)body.append(el('p','',item.caption));if(item.date)body.append(el('time','',item.date));card.append(image,body);return card}
async function loadProfile(){for(const key of Object.keys(sections)){const [path,,message]=sections[key];if(location.pathname.replace(/\/$/,'')!==path.replace(/\/$/,''))continue;const target=document.querySelector(sections[key][1]);if(target)empty(target,'Memuat data…')}
 try{const response=await fetch(API+'/api/public',{cache:'no-store'});if(!response.ok)throw new Error('API');const data=await response.json();
  const render=(path,selector,items,create,message)=>{if(location.pathname.replace(/\/$/,'')!==path.replace(/\/$/,''))return;const target=document.querySelector(selector);if(!target)return;if(!items.length){empty(target,message);return}target.replaceChildren(...items.map(create))};
  render('/anggota/','#member-list',data.members.filter(x=>!x.role),personCard,sections.members[2]);render('/pengurus/','#leader-list',data.members.filter(x=>x.role),personCard,sections.leaders[2]);render('/jadwal/','#schedule-list',data.schedule,scheduleCard,sections.schedule[2]);render('/galeri/','#gallery-list',data.gallery,galleryCard,sections.gallery[2]);
 }catch{const key=Object.keys(sections).find(k=>location.pathname.replace(/\/$/,'')===sections[k][0].replace(/\/$/,''));const target=key&&document.querySelector(sections[key][1]);if(target)empty(target,'Data belum dapat dimuat. Coba buka kembali beberapa saat lagi.')}
}
document.addEventListener('DOMContentLoaded',loadProfile);

