/* ==========================================
   ACAPAJ - JAVASCRIPT
   Integração n8n - Caminhada Amarela
========================================== */
// NAVBAR SCROLL
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });
}

// MENU MOBILE
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
function updateMenuIcon() {
  if (!menuBtn || !menu) return;
  const open = menu.classList.contains("active");
  menuBtn.innerHTML =
    `<i class="icon fa-solid ${open ? "fa-xmark" : "fa-bars"}"></i>`;
}
if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("active");
    updateMenuIcon();
  });

  document.querySelectorAll("#menu a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      updateMenuIcon();
    });
  });
}

// DARK MODE
const themeToggle = document.getElementById("theme-toggle");
function updateThemeIcon(){
  if(!themeToggle) return;
  const dark =
  document.documentElement.classList.contains("dark");
  themeToggle.innerHTML =
  `<i class="icon fa-solid ${dark ? "fa-sun":"fa-moon"}"></i>`;
}

if(themeToggle){
  updateThemeIcon();
  themeToggle.addEventListener("click",()=>{
    const dark =
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      dark ? "dark" : "light"
    );
    updateThemeIcon();
  });
}

// MAPA CAMINHADA AMARELA
const EVENT_ROUTE = {
  origin:{
    lat:-25.9431,
    lng:32.5764
  },
  destination:{
    lat:-25.9658,
    lng:32.5879
  }
};

function embedMap(route){
  return `
  https://www.google.com/maps?saddr=
  ${route.origin.lat},${route.origin.lng}
  &daddr=
  ${route.destination.lat},${route.destination.lng}
  &dirflg=w&output=embed
  `.replace(/\s/g,"");
}
function externalMap(route){
  return `
  https://www.google.com/maps/dir/?api=1
  &origin=${route.origin.lat},${route.origin.lng}
  &destination=${route.destination.lat},${route.destination.lng}
  &travelmode=walking
  `.replace(/\s/g,"");
}

const mapModal =
document.getElementById("map-modal");
const mapIframe =
document.getElementById("map-iframe");
const mapExternalLink =
document.getElementById("map-external-link");
const mapButtons = [
  document.getElementById("open-map"),
  document.getElementById("open-map-preview")
].filter(Boolean);

let mapLoaded = false;
function openMap(){
  if(!mapModal) return;
  if(!mapLoaded && mapIframe){
    mapIframe.src =
    embedMap(EVENT_ROUTE);
    mapLoaded = true;
  }
  if(mapExternalLink){
    mapExternalLink.href =
    externalMap(EVENT_ROUTE);
  }
  mapModal.classList.add("active");
  mapModal.setAttribute(
    "aria-hidden",
    "false"
  );
  document.body.style.overflow="hidden";
}
function closeMap(){
  if(!mapModal) return;
  mapModal.classList.remove("active");
  mapModal.setAttribute(
    "aria-hidden",
    "true"
  );
  document.body.style.overflow="";
}

mapButtons.forEach(btn=>{
  btn.addEventListener(
    "click",
    openMap
  );
});

document.querySelectorAll("[data-close-map]")
.forEach(btn=>{
  btn.addEventListener(
    "click",
    closeMap
  );
});

document.addEventListener(
"keydown",
e=>{
  if(
    e.key==="Escape" &&
    mapModal?.classList.contains("active")
  ){
    closeMap();
 }
});

// ANIMAÇÕES
const animated =
document.querySelectorAll(
".card, .impact-card, .value-item, .highlights div, .gallery img, .partner-logo, .testimonial"
);
const observer =
new IntersectionObserver(entries=>{
entries.forEach(entry=>{
  if(entry.isIntersecting){
    entry.target.classList.add("show");
    observer.unobserve(entry.target);
  }
});
},{threshold:.15});
animated.forEach(el=>{
observer.observe(el);
});

// CONTADORES
const counters =
document.querySelectorAll(".impact-card h3");
const stats =
document.querySelector(".stats");
let started=false;
if(stats && counters.length){
new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting && !started){
started=true;
counters.forEach(counter=>{
const value =
counter.innerText.trim();
const target =
parseInt(
value.replace(/\D/g,"")
);
const prefix =
value.startsWith("+")
? "+"
: "";
let current=0;
const step =
Math.ceil(target/60);
function count(){
current += step;
if(current < target){
counter.innerHTML =
prefix + current;
requestAnimationFrame(count);
}else{
counter.innerHTML =
prefix + target;
}
}
count();
});
}
});
},{threshold:.5})
.observe(stats);
}

// FORMULÁRIO CAMINHADA AMARELA
const N8N_WEBHOOK =
"https://n8n.mozwikn8n.shop/webhook-test/15adf0fc-1546-404c-a325-1200e8cc04c2";
const eventForm =
document.getElementById("event-form");
const eventHint =
document.getElementById("event-form-hint");
if(eventForm){
eventForm.addEventListener("submit", async e=>{
e.preventDefault();
const data =
new FormData(eventForm);
const nome =
data.get("nome").trim();
const email =
data.get("email").trim();
const codigoPais =
data.get("codigo_pais");
const numero =
data.get("telefone").trim();

if(nome.length < 2){
eventHint.textContent =
"Indique o seu nome.";
eventHint.className =
"form-hint error";
return;
}

if(!codigoPais){
eventHint.textContent =
"Seleccione o código do país.";
eventHint.className =
"form-hint error";
return;
}

if(numero.length < 8){
eventHint.textContent =
"Indique um número de telefone válido.";
eventHint.className =
"form-hint error";
return;
}

const telefone =
`${codigoPais} ${numero}`;
try{
const response =
await fetch(
N8N_WEBHOOK,
{

method:"POST",
headers:{
"Content-Type":
"application/json"
},
body:JSON.stringify({
tipo:"caminhada-amarela",
nome,
email,
telefone,
origem:
"site-acapaj"
})
});

if(!response.ok)
throw new Error();
eventHint.textContent =
"Inscrição recebida. Vemo-nos na Caminhada Amarela!";
eventHint.className =
"form-hint success";
eventForm.reset();
}catch(error){
eventHint.textContent =
"Não foi possível enviar agora.";
eventHint.className =
"form-hint error";
}
});
}