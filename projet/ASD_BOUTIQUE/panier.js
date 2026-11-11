// ===== OUTILS =====

const CLE_PANIER = "asd-panier";
const NUMERO_WHATSAPP = "221775864880";

function lirePanier() {
  try {
    return JSON.parse(localStorage.getItem(CLE_PANIER)) || [];
  } catch (erreur) {
    return [];
  }
}

function sauvegarderPanier(panier) {
  localStorage.setItem(CLE_PANIER, JSON.stringify(panier));
}

function formaterPrix(nombre) {
  return nombre.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " FCFA";
}

// ===== COMPTEUR DANS LE MENU =====

function majCompteur() {
  const lien = document.getElementById("lien-panier");
  if (!lien) return;

  const total = lirePanier().reduce(function (somme, article) {
    return somme + article.quantite;
  }, 0);

  lien.textContent = total > 0 ? "Panier (" + total + ")" : "Panier";
}

// ===== PAGE DE DETAIL : AJOUTER AU PANIER =====

function initialiserAjout() {
  const formulaire = document.getElementById("form-ajout");
  const produit = document.querySelector("main[data-nom]");
  if (!formulaire || !produit) return;

  formulaire.addEventListener("submit", function (evenement) {
    evenement.preventDefault();

    const nom = produit.dataset.nom;
    const prix = Number(produit.dataset.prix);
    const taille = document.getElementById("taille").value;
    const quantite = Number(document.getElementById("quantite").value);

    if (quantite < 1) return;

    const panier = lirePanier();
    const existant = panier.find(function (article) {
      return article.nom === nom && article.taille === taille;
    });

    if (existant) {
      existant.quantite += quantite;
    } else {
      panier.push({ nom: nom, taille: taille, quantite: quantite, prix: prix });
    }

    sauvegarderPanier(panier);
    majCompteur();

    const message = document.getElementById("message-ajout");
    if (message) {
      message.textContent = "Ajouté au panier : " + nom + " (taille " + taille + ", x" + quantite + ")";
    }
  });
}

// ===== PAGE PANIER : AFFICHER LE PANIER =====

function afficherPanier() {
  const corps = document.getElementById("panier-corps");
  if (!corps) return;

  const totalCellule = document.getElementById("panier-total");
  const boutonValider = document.getElementById("valider");
  const messageVide = document.getElementById("panier-vide");
  const panier = lirePanier();

  corps.innerHTML = "";

  if (panier.length === 0) {
    messageVide.hidden = false;
    boutonValider.hidden = true;
    totalCellule.textContent = formaterPrix(0);
    return;
  }

  messageVide.hidden = true;
  boutonValider.hidden = false;

  let totalCommande = 0;
  let texteWhatsapp = "Bonjour ASD Sportwear, je veux commander :\n";

  panier.forEach(function (article, index) {
    const totalLigne = article.prix * article.quantite;
    totalCommande += totalLigne;
    texteWhatsapp += "- " + article.nom + " (taille " + article.taille + ") x" + article.quantite + " = " + formaterPrix(totalLigne) + "\n";

    const ligne = document.createElement("tr");
    const valeurs = [
      article.nom,
      article.taille,
      article.quantite,
      formaterPrix(article.prix),
      formaterPrix(totalLigne)
    ];

    valeurs.forEach(function (valeur) {
      const cellule = document.createElement("td");
      cellule.textContent = valeur;
      ligne.appendChild(cellule);
    });

    const celluleAction = document.createElement("td");
    const boutonSupprimer = document.createElement("button");
    boutonSupprimer.type = "button";
    boutonSupprimer.className = "supprimer";
    boutonSupprimer.textContent = "Supprimer";
    boutonSupprimer.addEventListener("click", function () {
      const nouveauPanier = lirePanier();
      nouveauPanier.splice(index, 1);
      sauvegarderPanier(nouveauPanier);
      majCompteur();
      afficherPanier();
    });
    celluleAction.appendChild(boutonSupprimer);
    ligne.appendChild(celluleAction);

    corps.appendChild(ligne);
  });

  texteWhatsapp += "\nTotal : " + formaterPrix(totalCommande);

  totalCellule.textContent = formaterPrix(totalCommande);
  boutonValider.href = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(texteWhatsapp);
}

// ===== DEMARRAGE =====

majCompteur();
initialiserAjout();
afficherPanier();