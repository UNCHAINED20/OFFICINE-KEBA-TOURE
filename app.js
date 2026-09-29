const products = [
 {id:1,name:"La Roche-Posay Effaclar Gel Moussant",price:8500,old:10000,icon:"🧴",cat:"Parapharmacie",rating:4.8},
 {id:2,name:"Doliprane 1000mg",price:3500,old:0,icon:"💊",cat:"Médicaments",rating:4.7},
 {id:3,name:"Bioderma Sensibio H2O",price:6900,old:0,icon:"🧴",cat:"Beauté & soins",rating:4.9},
 {id:4,name:"CeraVe Crème Hydratante",price:7900,old:0,icon:"🫙",cat:"Parapharmacie",rating:4.8},
 {id:5,name:"Vitamine D3 1000 UI",price:4500,old:0,icon:"💊",cat:"Vitamines",rating:4.6},
 {id:6,name:"Shampooing doux",price:5500,old:6500,icon:"🧴",cat:"Soins cheveux",rating:4.5}
];
let cart = JSON.parse(localStorage.getItem("keba_cart") || "[]");
let currentUser = localStorage.getItem("keba_user") || "";

const app = document.querySelector("#app");
const loginGate = document.querySelector("#loginGate");
const loginForm = document.querySelector("#loginForm");
const userNameInput = document.querySelector("#userName");
const accessCodeInput = document.querySelector("#accessCode");
const loginError = document.querySelector("#loginError");
const userGreeting = document.querySelector("#userGreeting");
const backTop = document.querySelector("#backTop");
const count = document.querySelector("#cartCount");
const search = document.querySelector("#globalSearch");

function money(n){return n.toLocaleString("fr-FR")+" FCFA"}
function save(){localStorage.setItem("keba_cart",JSON.stringify(cart)); updateCount()}
function updateCount(){count.textContent=cart.reduce((s,x)=>s+x.qty,0)}
function toast(msg){const t=document.querySelector("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function productCard(p){
 return `<article class="product reveal" data-product="${p.id}">
   <button class="favorite-btn" data-favorite="${p.id}" aria-label="Ajouter aux favoris">♡</button>
   <div class="product-img">${p.icon}</div>
   <h3>${p.name}</h3>
   <div class="stars">★★★★★ <span style="color:#777">${p.rating}</span></div>
   <div class="price">${money(p.price)} ${p.old?`<span class="old">${money(p.old)}</span>`:""}</div>
   <button class="btn btn-green" data-add="${p.id}">Ajouter au panier</button>
 </article>`;
}
function add(id){
 const p=products.find(x=>x.id==id);
 const item=cart.find(x=>x.id==id);
 if(item)item.qty++;else cart.push({id,qty:1});
 save();
 const btn=document.querySelector(`[data-add="${id}"]`);
 const card=btn?.closest(".product");
 if(btn && card){
   btn.classList.add("ripple");
   card.classList.add("fly-source","added");
   const oldText=btn.textContent;
   btn.textContent="✓ Ajouté";
   animateToCart(card.querySelector(".product-img"));
   setTimeout(()=>{card.classList.remove("fly-source");btn.classList.remove("ripple");},260);
   setTimeout(()=>{btn.textContent=oldText;card.classList.remove("added");},1300);
 }
 const cartBtn=document.querySelector(".cart-btn");
 cartBtn?.classList.remove("bounce"); void cartBtn?.offsetWidth; cartBtn?.classList.add("bounce");
 count.classList.remove("counter-pop"); void count.offsetWidth; count.classList.add("counter-pop");
 toast(`${p.name} ajouté au panier`);
}
function renderHome(){
 app.innerHTML=`<section class="hero"><div class="hero-copy"><span class="eyebrow">Pharmacie · Parapharmacie · Conseils santé</span><h1>Prenez soin de votre santé au quotidien.</h1><p>Médicaments, parapharmacie, conseils et bien plus encore, au même endroit.</p><button class="btn btn-white" data-route="categories">Découvrir</button></div><div class="hero-art">🌿</div></section>
 <div class="section-head"><h2>Nos meilleures ventes</h2><a href="#categories">Voir tout →</a></div><section class="products">${products.slice(0,4).map(productCard).join("")}</section>
 <section class="advice-banner"><div><h2>Conseils santé</h2><p>Nos experts vous accompagnent au quotidien.</p></div><button class="btn btn-white" data-route="advice">Lire nos articles</button></section>`;
}
function renderCategories(){
 const cats=["Médicaments","Parapharmacie","Beauté & soins","Bébé & maman","Hygiène","Vitamines & compléments","Soins cheveux","Soins visage","Corps & minceur","Santé sexuelle","Matériel médical","Bien-être"];
 app.innerHTML=`<div class="page-title"><h1>Catégories</h1><p>Trouvez rapidement les produits dont vous avez besoin.</p></div><div class="categories">${cats.map((c,i)=>`<button class="category" data-cat="${c}"><div class="cat-icon">${["💊","🧴","💄","👶","🧼","🌿","🧴","✨","🏃","❤️","🩺","🍃"][i]}</div><strong>${c}</strong></button>`).join("")}</div><div class="section-head"><h2>Produits populaires</h2></div><section class="products">${products.map(productCard).join("")}</section>`;
}
function renderSearch(q=""){
 const term=q.trim().toLowerCase(); const found=products.filter(p=>!term||p.name.toLowerCase().includes(term)||p.cat.toLowerCase().includes(term));
 app.innerHTML=`<div class="page-title"><h1>Recherche</h1><p>${term?`Résultats pour « ${q} »`:"Recherchez un produit ou une catégorie."}</p></div><div class="layout"><aside class="filters"><h3>Filtres</h3><label><input type="checkbox"> Médicaments</label><label><input type="checkbox"> Parapharmacie</label><label><input type="checkbox"> Vitamines</label><label><input type="checkbox"> Beauté</label><hr><h4>Prix</h4><label><input type="radio" name="p"> 0 – 5 000 FCFA</label><label><input type="radio" name="p"> 5 000 – 10 000 FCFA</label></aside><section><div class="result-grid">${found.length?found.map(productCard).join(""):`<div class="empty" style="grid-column:1/-1"><h2>Aucun résultat</h2><p>Essayez un autre mot-clé.</p></div>`}</div></section></div>`;
}
function renderProduct(id){
 const p=products.find(x=>x.id==id); if(!p)return renderHome();
 app.innerHTML=`<div class="product-detail"><div class="detail-image">${p.icon}</div><div class="detail"><span class="stock">✓ En stock</span><h1>${p.name}</h1><div class="stars">★★★★★ <span style="color:#777">${p.rating} (124 avis)</span></div><div class="price">${money(p.price)} ${p.old?`<span class="old">${money(p.old)}</span>`:""}</div><p>Produit sélectionné par KÉBA PHAR. Découvrez sa description, ses conseils d'utilisation et les informations essentielles avant votre achat.</p><hr><h3>Description</h3><p>Une solution de qualité pour accompagner votre routine santé et bien-être.</p><div class="qty"><button data-minus>−</button><strong id="qty">1</strong><button data-plus>+</button></div><button class="btn btn-green" data-add="${p.id}" style="width:100%">Ajouter au panier</button></div></div>`;
}
function renderCart(){
 if(!cart.length){app.innerHTML=`<div class="page-title"><h1>Mon panier</h1></div><div class="empty"><div style="font-size:60px">🛒</div><h2>Votre panier est vide</h2><p>Ajoutez des produits pour commencer.</p><button class="btn btn-green" data-route="categories">Découvrir les produits</button></div>`;return}
 const items=cart.map(x=>({...products.find(p=>p.id==x.id),qty:x.qty}));
 const subtotal=items.reduce((s,x)=>s+x.price*x.qty,0);
 app.innerHTML=`<div class="page-title"><h1>Mon panier <small>(${items.reduce((s,x)=>s+x.qty,0)} articles)</small></h1></div><div class="cart-layout"><section>${items.map(x=>`<div class="cart-item"><div class="mini-img">${x.icon}</div><div class="cart-info"><strong>${x.name}</strong><div class="price">${money(x.price)}</div></div><div class="qty"><button data-cart-minus="${x.id}">−</button><strong>${x.qty}</strong><button data-cart-plus="${x.id}">+</button></div><button class="icon-btn" data-remove="${x.id}">✕</button></div>`).join("")}</section><aside class="summary"><h3>Résumé</h3><div class="row"><span>Sous-total</span><b>${money(subtotal)}</b></div><div class="row"><span>Livraison</span><b>${money(1000)}</b></div><div class="row total"><span>Total</span><b>${money(subtotal+1000)}</b></div><button class="btn btn-green" style="width:100%" id="checkout">Commander</button></aside></div>`;
}
function renderAdvice(){
 const cards=[["Comment prendre soin de sa peau au quotidien ?","Beauté & peau"],["Les aliments pour renforcer votre système immunitaire","Nutrition"],["Le rôle de la vitamine D dans votre santé","Santé"]];
 app.innerHTML=`<div class="page-title"><h1>Conseils santé</h1><p>Des informations simples pour mieux prendre soin de vous.</p></div><div class="advice-grid">${cards.map((c,i)=>`<article class="advice-card"><div class="advice-visual">${["🧴","🥗","☀️"][i]}</div><span class="stock">${c[1]}</span><h3>${c[0]}</h3><p>Conseils pratiques préparés pour vous accompagner au quotidien.</p><button class="btn btn-outline">Lire l'article</button></article>`).join("")}</div><section class="advice-banner"><div><h2>Nos experts sont là pour vous conseiller</h2><p>Une question sur un produit ?</p></div><button class="btn btn-white">Poser une question</button></section>`;
}
function renderProfile(){
 app.innerHTML=`<div class="page-title"><h1>Mon profil</h1><p>Gérez vos informations et vos commandes.</p></div><div class="profile"><aside class="profile-card"><div class="avatar">👤</div><h2>Abdoulaye Diarra</h2><p>Client KÉBA PHAR</p><span class="stock">Membre depuis 2026</span></aside><section class="profile-card menu-list">${["Mes commandes","Mes adresses","Mes ordonnances","Mes favoris","Notifications","Aide & contact","Paramètres"].map(x=>`<button>${x}<span style="float:right">›</span></button>`).join("")}</section></div>`;
}
function renderPharmacies(){
 const ps=["Pharmacie du Fleuve","Pharmacie Centrale","Pharmacie des Jeunes","Pharmacie Bamako Santé"];
 app.innerHTML=`<div class="page-title"><h1>Pharmacies proches</h1><p>Retrouvez les pharmacies disponibles autour de vous.</p></div><div class="pharmacy-list">${ps.map((p,i)=>`<article class="pharmacy-card"><div class="pharmacy-icon">📍</div><div style="flex:1"><strong>${p}</strong><p style="font-size:12px;color:#667085">Bamako · ${1.2+i*.6} km</p><span class="stock">Ouverte</span></div><button class="btn btn-outline">Voir</button></article>`).join("")}</div>`;
}
function animateToCart(source){
 if(!source)return;
 const cartEl=document.querySelector(".cart-btn"); if(!cartEl)return;
 const a=source.getBoundingClientRect(), b=cartEl.getBoundingClientRect();
 const ghost=document.createElement("div"); ghost.className="fly-copy"; ghost.textContent="✓";
 ghost.style.left=`${a.left+a.width/2-17}px`; ghost.style.top=`${a.top+a.height/2-17}px`;
 document.body.appendChild(ghost);
 ghost.animate([
   {transform:"translate(0,0) scale(1)",opacity:1},
   {transform:`translate(${b.left-a.left}px,${b.top-a.top}px) scale(.35)`,opacity:.15}
 ],{duration:520,easing:"cubic-bezier(.2,.8,.2,1)"});
 setTimeout(()=>ghost.remove(),540);
}
function showSkeleton(){
 app.innerHTML=`<div class="page-title"><h1>Nos produits</h1><p>Préparation de votre sélection…</p></div>
 <section class="products">${Array.from({length:4},()=>`<div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton skeleton-line"></div><div class="skeleton skeleton-line short"></div><div class="skeleton skeleton-btn"></div></div>`).join("")}</section>`;
}
function reveal(){
 requestAnimationFrame(()=>{
   const els=document.querySelectorAll(".reveal");
   if(!("IntersectionObserver" in window)){els.forEach(x=>x.classList.add("visible"));return}
   const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.08});
   els.forEach(x=>io.observe(x));
 });
}
function updateUser(){
 if(userGreeting) userGreeting.textContent=currentUser?`Bonjour, ${currentUser} 👋`:"";
}
function unlock(){
 loginGate?.classList.add("hidden");
 document.body.classList.remove("is-locked");
 updateUser();
 setTimeout(()=>loginGate?.remove(),420);
}
function lock(){
 if(!document.querySelector("#loginGate")) location.reload();
 else {loginGate.classList.remove("hidden");document.body.classList.add("is-locked")}
}

// Login demo: name + code KEBA. Prevent the form from reloading the page.
loginForm?.addEventListener("submit", (e)=>{
 e.preventDefault();
 const name=(userNameInput?.value || "").trim();
 const code=(accessCodeInput?.value || "").trim().toUpperCase();
 if(name.length < 2){
   if(loginError) loginError.textContent="Veuillez entrer votre nom (au moins 2 caractères).";
   userNameInput?.focus();
   return;
 }
 if(code !== "KEBA21){
   if(loginError) loginError.textContent="Code d'accès incorrect. Utilisez KEBA21.";
   accessCodeInput?.focus();
   return;
 }
 if(loginError) loginError.textContent="";
 currentUser=name;
 localStorage.setItem("keba_user", currentUser);
 unlock();
 location.hash = "home";
 route();
});

document.querySelector("#showCode")?.addEventListener("click", ()=>{
 if(!accessCodeInput) return;
 const visible=accessCodeInput.type === "text";
 accessCodeInput.type=visible ? "password" : "text";
});

function route(){
 if(!currentUser){document.body.classList.add("is-locked");return}
 const hash=location.hash.replace("#","")||"home";
 if(hash.startsWith("product/")) return renderProduct(Number(hash.split("/")[1]));
 if(hash==="categories"){
   showSkeleton();
   setTimeout(()=>{renderCategories();reveal()},260);
   return;
 }
 if(hash==="search")return renderSearch(search.value);
 if(hash==="cart")return renderCart();
 if(hash==="advice")return renderAdvice();
 if(hash==="profile")return renderProfile();
 if(hash==="pharmacies")return renderPharmacies();
 renderHome(); reveal();
}
document.addEventListener("click",e=>{
 const r=e.target.closest("[data-route]");
 if(r){e.preventDefault();location.hash=r.dataset.route;return}

 const addBtn=e.target.closest("[data-add]");
 if(addBtn){add(Number(addBtn.dataset.add));return}

 const cat=e.target.closest("[data-cat]");
 if(cat){search.value=cat.dataset.cat;location.hash="search";return}

 const fav=e.target.closest("[data-favorite]");
 if(fav){
   fav.classList.toggle("active");
   fav.textContent=fav.classList.contains("active")?"♥":"♡";
   toast(fav.classList.contains("active")?"Ajouté aux favoris":"Retiré des favoris");
   return;
 }

 const rem=e.target.closest("[data-remove]");
 if(rem){
   const item=rem.closest(".cart-item");
   item?.classList.add("delete-anim");
   setTimeout(()=>{cart=cart.filter(x=>x.id!=rem.dataset.remove);save();route()},320);
   return;
 }

 const plus=e.target.closest("[data-cart-plus]");
 if(plus){const x=cart.find(x=>x.id==plus.dataset.cartPlus);x.qty++;save();route();return}

 const minus=e.target.closest("[data-cart-minus]");
 if(minus){const x=cart.find(x=>x.id==minus.dataset.cartMinus);x.qty=Math.max(0,x.qty-1);cart=cart.filter(x=>x.qty);save();route();return}

 if(e.target.id==="checkout"){toast("✓ Votre demande a été enregistrée.");}

 const btn=e.target.closest(".btn");
 if(btn){btn.classList.remove("ripple");void btn.offsetWidth;btn.classList.add("ripple")}

 if(e.target.id==="backTop"){window.scrollTo({top:0,behavior:"smooth"});}
});
search.addEventListener("keydown",e=>{if(e.key==="Enter"){location.hash="search";route()}});
window.addEventListener("hashchange",route);
updateCount(); route();
