           /* =====================================================
   1. LES PHOTOS
   Chaque nom doit être EXACTEMENT celui du fichier dans le dossier images.
   ===================================================== */
var IMG={
  ban:"images/banniere.jpg",                  // photo de la bannière en haut
  intl:"images/maillot international.jpg",
  club:"images/maillot club.jpg",
  mini:"images/mini-tableau.jpg",
  grand:"images/grand-tableau.jpg",
  otaku:"images/tshirt-otaku.jpg",
  sub:"images/sublimation.jpg",
  flo:"images/maillot flocage.jpg"
};

/* =====================================================
   2. LES PRODUITS DE LA BOUTIQUE
   n = nom, c = catégorie (doit être égale à data-f du bouton filtre),
   s = petite description, i = photo.
   POUR AJOUTER UN PRODUIT : copie une ligne. Mets une virgule à la fin
   de chaque ligne sauf la dernière.
   ===================================================== */
var P=[
 {n:"Maillots internationaux",c:"Maillot",s:"Nigeria, Angleterre, Japon, Pays-Bas, Brésil, Chili",i:IMG.intl},
 {n:"Maillots de clubs",c:"Maillot",s:"Man City, Man United, Bayern, PSG, Liverpool, Chelsea",i:IMG.club},
 {n:"Mini tableaux",c:"Tableau",s:"Lot de tableaux décoratifs, personnalisables",i:IMG.mini},
 {n:"Grand tableau personnalisé",c:"Tableau",s:"Votre photo en grand format",i:IMG.grand},
 {n:"T-shirt otaku",c:"Otaku",s:"Collection manga, coupe oversize",i:IMG.otaku},
 {n:"Impression et sublimation sur t-shirt",c:"Sublimation",s:"Votre design imprimé en couleurs",i:IMG.sub},
 {n:"Flocage sur maillot",c:"Flocage",s:"Nom et numéro de votre choix",i:IMG.flo}
];

/* Met la photo dans la bannière de l'accueil */
document.getElementById("ban").src=IMG.ban;

/* =====================================================
   3. WHATSAPP
   Crée un lien WhatsApp avec un message déjà écrit.
   ===================================================== */
function wa(texte){
  return "https://wa.me/221775864880?text="+encodeURIComponent(texte);
}

/* =====================================================
   4. AFFICHER LES CARTES DE LA BOUTIQUE
   ===================================================== */
var g=document.getElementById("grid");           // la zone où mettre les cartes

function show(filtre){
  g.innerHTML="";                                // vide la zone
  P.filter(function(p){
    return filtre==="all" || p.c===filtre;       // garde les produits du filtre choisi
  }).forEach(function(p,i){
    var d=document.createElement("article");     // crée une carte
    d.className="glass card";
    d.style.animationDelay=(i*60)+"ms";     // les cartes apparaissent l'une après l'autre
    d.innerHTML=
      '<div class="pic"><img loading="lazy" alt="'+p.n+'" src="'+p.i+'"></div>'+
      '<h3>'+p.n+'</h3>'+
      '<small>'+p.s+'</small>'+
      '<a class="btn" target="_blank" rel="noopener" href="'+wa("Bonjour, je suis intéressé par : "+p.n)+'">Demander le prix</a>';
    g.appendChild(d);                            // ajoute la carte dans la page
  });
}
show("all");                                     // au début, affiche tous les produits

/* Clic sur un bouton filtre (Tout, Maillots, Tableaux...) */
document.getElementById("tabs").addEventListener("click",function(e){
  var b=e.target.closest(".tab");
  if(!b) return;
  document.querySelectorAll(".tab").forEach(function(t){
    t.setAttribute("aria-pressed",t===b);    // met en couleur seulement le bouton cliqué
  });
  show(b.dataset.f);                             // affiche les produits de cette catégorie
});

/* =====================================================
   5. AGRANDIR UNE PHOTO AU CLIC
   ===================================================== */
var lb=document.getElementById("lb");            // la fenêtre noire
var lbi=document.getElementById("lbi");          // la photo agrandie

g.addEventListener("click",function(e){
  var m=e.target.closest(".pic img");            // a-t-on cliqué sur une photo ?
  if(m){
    lbi.src=m.src;                               // met cette photo dans la fenêtre
    lb.classList.add("on");                      // affiche la fenêtre
  }
});
lb.onclick=function(){lb.classList.remove("on")};   // clic = fermer
document.addEventListener("keydown",function(e){
  if(e.key==="Escape") lb.classList.remove("on");   // touche Échap = fermer
});

/* =====================================================
   6. CRÉEZ VOTRE FLOCAGE
   ===================================================== */

/* Empêche d'écrire du code dans le champ nom */
function esc(s){
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
}

               /* Forme du maillot vu de dos (le contour) */
var B="M100 28 L52 48 Q30 58 18 100 L10 150 Q8 158 18 162 L52 176 Q60 178 64 170 L70 140 L72 308 Q150 322 228 308 L230 140 L236 170 Q240 178 248 176 L282 162 Q292 158 290 150 L282 100 Q270 58 248 48 L200 28 Q150 58 100 28Z";

          /* Dessine le maillot : c = couleur choisie, txt = nom, num = numéro */
function jerseyBack(c,txt,num){
  var a=c[1];                    // couleur du maillot
  var t=c[2];                    // couleur des lettres, du col et des poignets
  var s=txt.length>9?16:txt.length>6?20:25;   // taille du nom : plus petit si le nom est long
  return '<svg viewBox="0 0 300 340" role="img" aria-label="Maillot floqué">'+
   /* effets : ombres, texture du tissu, ombre des lettres */
   '<defs><clipPath id="jb"><path d="'+B+'"/></clipPath>'+
   '<linearGradient id="jg" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset=".25" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".12"/><stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></linearGradient>'+
   '<pattern id="jm" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r=".7" fill="#000" opacity=".13"/><circle cx="3.7" cy="3.7" r=".7" fill="#000" opacity=".13"/></pattern>'+
   '<filter id="js"><feDropShadow dx="0" dy="1.5" stdDeviation="1.1" flood-color="#000" flood-opacity=".4"/></filter></defs>'+
   /* le corps du maillot, les bandes sur les côtés, les épaules */
   '<g clip-path="url(#jb)"><rect width="300" height="340" fill="'+a+'"/>'+
   '<rect x="72" y="120" width="18" height="210" fill="#000" opacity=".1"/><rect x="210" y="120" width="18" height="210" fill="#000" opacity=".1"/>'+
   '<path d="M100 28 L52 48 Q40 54 32 76 L120 68 Q150 76 180 68 L268 76 Q260 54 248 48 L200 28 Q150 58 100 28Z" fill="#000" opacity=".1"/>'+
   /* les poignets des manches et le bas du maillot */
   '<path d="M10 150 L64 170 L70 155 L16 135Z" fill="'+t+'"/><path d="M290 150 L236 170 L230 155 L284 135Z" fill="'+t+'"/><path d="M72 294 Q150 308 228 294 L228 312 Q150 326 72 312Z" fill="'+t+'"/>'+
   /* texture du tissu, plis et lumière */
   '<rect width="300" height="340" fill="url(#jm)"/>'+
   '<path d="M112 80 Q104 190 114 312" stroke="#fff" stroke-opacity=".09" stroke-width="12" fill="none"/>'+
   '<path d="M190 90 Q198 200 188 312" stroke="#000" stroke-opacity=".08" stroke-width="14" fill="none"/>'+
   '<rect width="300" height="340" fill="url(#jg)"/></g>'+
   /* coutures, col, étiquette et contour */
   '<path d="M64 60 Q76 110 70 140" fill="none" stroke="rgba(0,0,0,.3)" stroke-dasharray="3 2"/><path d="M236 60 Q224 110 230 140" fill="none" stroke="rgba(0,0,0,.3)" stroke-dasharray="3 2"/>'+
   '<path d="M100 28 Q150 58 200 28 L194 38 Q150 68 106 38Z" fill="'+t+'"/>'+
   '<rect x="141" y="50" width="18" height="9" rx="1.5" fill="#fff" opacity=".85"/>'+
   '<path d="'+B+'" fill="none" stroke="rgba(0,0,0,.5)" stroke-width="1.6"/>'+
   /* le NOM et le NUMÉRO */
   '<text x="150" y="104" text-anchor="middle" font-family="Oswald,Impact,sans-serif" font-weight="700" font-size="'+s+'" letter-spacing="2" fill="'+t+'" filter="url(#js)">'+txt+'</text>'+
   '<text x="150" y="196" text-anchor="middle" font-family="Oswald,Impact,sans-serif" font-weight="700" font-size="104" fill="'+t+'" filter="url(#js)">'+num+'</text>'+
   '</svg>';
}
/* Couleurs de maillot proposées : [nom, couleur du maillot, couleur des lettres]
   Pour en ajouter une : copie une ligne et change les codes de couleur. */
var C=[
 ["Blanc","#f2f2f2","#111111"],
 ["Noir","#16181d","#ffffff"],
 ["Rouge","#c8102e","#ffffff"],
 ["Bleu","#0b3d91","#ffffff"],
 ["Jaune","#ffd100","#111111"],
 ["Vert","#0a8f3f","#ffffff"]
];
var cur=C[3];                                    // couleur choisie au départ : Bleu

var nm=document.getElementById("nm");            // champ du nom
var no=document.getElementById("no");            // champ du numéro
var fv=document.getElementById("fv");            // zone du dessin du maillot
var fl=document.getElementById("fl");            // bouton "Commander ce flocage"

/* Met à jour le maillot et le lien WhatsApp à chaque changement */
function upd(){
  var n=(nm.value||"NOM").toUpperCase();         // nom en majuscules
  var u=no.value||"00";                          // numéro
  fv.innerHTML=jerseyBack(cur,esc(n),esc(u));    // redessine le maillot
  fl.href=wa("Bonjour, je veux un flocage sur maillot "+cur[0].toLowerCase()+" : "+n+" numéro "+u);
}
nm.oninput=no.oninput=upd;                       // met à jour quand le client écrit

/* Crée les ronds de couleur */
var sw=document.getElementById("sw");
C.forEach(function(c){
  var b=document.createElement("button");
  b.type="button";
  b.title=c[0];
  b.setAttribute("aria-label",c[0]);
  b.style.background=c[1];
  b.className=(c===cur)?"on":"";
  b.onclick=function(){
    cur=c;                                       // retient la couleur choisie
    sw.querySelectorAll("button").forEach(function(x){x.className=""});
    b.className="on";                            // entoure le rond choisi
    upd();                                       // redessine le maillot
  };
  sw.appendChild(b);
});
upd();                                           // dessine le maillot au chargement

/* =====================================================
   7. APPARITION AU DÉFILEMENT
   Les éléments avec la classe "rv" apparaissent quand on arrive dessus.
   ===================================================== */
var io=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      e.target.classList.add("in");              // déclenche l'animation
      io.unobserve(e.target);                    // une seule fois
    }
  });
},{threshold:.15});
document.querySelectorAll(".rv").forEach(function(el,i){
  el.style.transitionDelay=(i%4)*90+"ms";    // petit décalage entre les éléments
  io.observe(el);
});