/* ===== Portfolio – Abdou Salam Diakhate =====
   Chaque fonctionnalité a sa propre fonction. Les appels sont tout en bas. */

const ADRESSE_EMAIL = 'salamoullahi2@gmail.com';
const SANS_ANIMATION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Thème : sombre par défaut, clair au clic
function activerTheme() {
  const bouton = document.getElementById('theme-bouton');
  const racine = document.documentElement;

  bouton.addEventListener('click', function () {
    const estClair = racine.getAttribute('data-theme') === 'light';
    racine.setAttribute('data-theme', estClair ? 'dark' : 'light');
    bouton.textContent = estClair ? 'Mode clair' : 'Mode sombre';
  });
}
// 2. Année actuelle dans le pied de page
function afficherAnnee() {
  document.getElementById('annee').textContent = new Date().getFullYear();
}

// 3. Bouton « Copier l'e-mail »
function activerCopieEmail() {
  const copier = document.getElementById('copier');

  copier.addEventListener('click', function () {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(ADRESSE_EMAIL).then(function () {
        copier.textContent = 'Copié !';
      }).catch(function () {
        copier.textContent = 'Copie impossible';
      });
    } else {
      copier.textContent = 'Copie impossible';
    }
    setTimeout(function () { copier.textContent = 'Copier l’e-mail'; }, 2000);
  });
}

// 4. Formulaire : ouvre l'application mail avec le message déjà écrit
function activerFormulaire() {
  const formulaire = document.getElementById('formulaire');

  formulaire.addEventListener('submit', function (evenement) {
    evenement.preventDefault();

    const nom = formulaire.elements.nom.value.trim();
    const email = formulaire.elements.email.value.trim();
    const message = formulaire.elements.message.value.trim();

    const sujet = 'Message depuis ton portfolio – ' + nom;
    const corps = message + '\n\n' + nom + ' (' + email + ')';

    window.location.href = 'mailto:' + ADRESSE_EMAIL +
      '?subject=' + encodeURIComponent(sujet) +
      '&body=' + encodeURIComponent(corps);
  });
}

// 5. Les sections apparaissent quand elles entrent dans l'écran
function activerApparitionAuDefilement() {
  const sections = document.querySelectorAll('.bloc');

  const observateur = new IntersectionObserver(function (elements) {
    elements.forEach(function (element) {
      if (element.isIntersecting) {
        element.target.classList.add('visible');
        observateur.unobserve(element.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(function (section) {
    section.classList.add('cache');
    observateur.observe(section);
  });
}

// 6. Machine à écrire : le métier s'écrit, s'efface, puis change
function activerMachineAEcrire() {
  const mot = document.getElementById('mot');
  const metiers = ['Développeur Front-end', 'Créateur de sites responsive', 'Passionné de web'];
  if (SANS_ANIMATION) return;

  let numero = 0;
  let lettres = 0;
  let efface = false;

  function taper() {
    const texte = metiers[numero];
    lettres = lettres + (efface ? -1 : 1);
    mot.textContent = texte.slice(0, lettres);

    let delai = efface ? 35 : 75;
    if (!efface && lettres === texte.length) {
      efface = true;
      delai = 1500;                       // pause quand le mot est écrit
    } else if (efface && lettres === 0) {
      efface = false;
      numero = (numero + 1) % metiers.length;
      delai = 400;
    }
    setTimeout(taper, delai);
  }

  mot.textContent = '';
  setTimeout(taper, 900);
}

// 7. Compteurs : les chiffres montent de 0 jusqu'à leur valeur
function activerCompteurs() {
  const compteurs = document.querySelectorAll('[data-cible]');

  function compter(element) {
    const cible = Number(element.dataset.cible);
    const suffixe = element.dataset.suffixe || '';
    const debut = performance.now();

    function pas(maintenant) {
      const avancee = Math.min((maintenant - debut) / 1600, 1);
      const adouci = 1 - Math.pow(1 - avancee, 3);
      element.textContent = Math.round(cible * adouci) + suffixe;
      if (avancee < 1) requestAnimationFrame(pas);
    }
    requestAnimationFrame(pas);
  }

  const observateur = new IntersectionObserver(function (elements) {
    elements.forEach(function (element) {
      if (element.isIntersecting) {
        compter(element.target);
        observateur.unobserve(element.target);
      }
    });
  }, { threshold: 0.5 });

  compteurs.forEach(function (element) {
    if (SANS_ANIMATION) {
      element.textContent = element.dataset.cible + (element.dataset.suffixe || '');
    } else {
      observateur.observe(element);
    }
  });
}
// 8. Particules reliées entre elles, qui réagissent à la souris
function activerParticules() {
  const canvas = document.getElementById('particules');
  if (SANS_ANIMATION) { canvas.remove(); return; }

  const ctx = canvas.getContext('2d');
  const souris = { x: null, y: null };
  let largeur, hauteur, points = [];

  function dimensionner() {
    largeur = canvas.width = window.innerWidth;
    hauteur = canvas.height = window.innerHeight;
    const nombre = Math.min(70, Math.floor(largeur * hauteur / 18000));
    points = [];
    for (let i = 0; i < nombre; i++) {
      points.push({
        x: Math.random() * largeur, y: Math.random() * hauteur,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5
      });
    }
  }
function dessiner() {
    const couleur = getComputedStyle(document.documentElement).getPropertyValue('--particule').trim();
    ctx.clearRect(0, 0, largeur, hauteur);

    points.forEach(function (p, i) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > largeur) p.vx *= -1;
      if (p.y < 0 || p.y > hauteur) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + couleur + ', 0.8)';
      ctx.fill();

      // Lignes entre particules proches (et avec la souris)
      const voisins = points.slice(i + 1).concat(souris.x === null ? [] : [souris]);
      voisins.forEach(function (q) {
        const distance = Math.hypot(p.x - q.x, p.y - q.y);
        const portee = q === souris ? 170 : 130;
        if (distance < portee) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(' + couleur + ', ' + (1 - distance / portee) * 0.4 + ')';
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(dessiner);
  }

  window.addEventListener('resize', dimensionner);
  window.addEventListener('mousemove', function (e) { souris.x = e.clientX; souris.y = e.clientY; });
  dimensionner();
  dessiner();
}
// 9. Lueur qui suit la souris
function activerLueurSouris() {
  const lueur = document.querySelector('.lueur');
  window.addEventListener('mousemove', function (e) {
    lueur.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
    lueur.style.opacity = 1;
  });
}

// 10. Cartes de projets : effet 3D qui suit la souris
function activerInclinaison() {
  if (SANS_ANIMATION || !window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('.projet').forEach(function (carte) {
    carte.addEventListener('mousemove', function (e) {
      const zone = carte.getBoundingClientRect();
      const x = (e.clientX - zone.left) / zone.width - 0.5;
      const y = (e.clientY - zone.top) / zone.height - 0.5;
      carte.style.transform = 'perspective(800px) rotateY(' + x * 12 + 'deg) rotateX(' + -y * 12 + 'deg) translateY(-6px)';
    });
    carte.addEventListener('mouseleave', function () {
      carte.style.transform = '';
    });
  });
}

// 11. Barre de progression de lecture en haut de l'écran
function activerBarreProgression() {
  const barre = document.querySelector('.progression');
  window.addEventListener('scroll', function () {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    barre.style.width = (window.scrollY / total) * 100 + '%';
  });
}

// On lance tout
activerTheme();
afficherAnnee();
activerCopieEmail();
activerFormulaire();
activerApparitionAuDefilement();
activerMachineAEcrire();
activerCompteurs();
activerParticules();
activerLueurSouris();
activerInclinaison();
activerBarreProgression();