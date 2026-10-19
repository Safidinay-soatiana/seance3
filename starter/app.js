/* =========================================================
   TP3 — Une liste d'étudiants vivante
   Les parties marquées FOURNI fonctionnent déjà : ne pas les modifier.
   Vous améliorez les fonctions marquées TODO.
   ========================================================= */

const API_URL = 'data/etudiants.json';   // dans votre projet : l'URL de votre contrôleur CI4
const DELAI_RESEAU = 1500;               // simule un réseau lent (en ms)

const zone = document.getElementById('zone');
const liste = document.getElementById('liste');
const compteur = document.getElementById('compteur');
const btnCharger = document.getElementById('btn-charger');
const caseErreur = document.getElementById('simuler-erreur');
const toasts = document.getElementById('toasts');

/* ---------------------------------------------------------
   OUTILS FOURNIS
   --------------------------------------------------------- */
const attendre = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function apiGetEtudiants() {
  await attendre(DELAI_RESEAU);
  const url = caseErreur.checked ? 'data/introuvable.json' : API_URL;
  const rep = await fetch(url);
  if (!rep.ok) throw new Error('HTTP ' + rep.status);
  return rep.json();
}

function majCompteur() {
  const n = liste.children.length;
  compteur.textContent = n === 0 ? 'Aucun étudiant' : `${n} étudiant${n > 1 ? 's' : ''}`;
}

function creerLigne(etu) {
  const li = document.createElement('li');
  li.className = 'ligne';
  li.dataset.id = etu.id;
  const initiales = etu.nom.split(' ').map((m) => m[0]).join('').slice(0, 2);
  li.innerHTML = `
    <span class="avatar"></span>
    <div><strong></strong><span class="option"></span></div>
    <button class="btn-retirer" type="button">Retirer</button>`;
  li.querySelector('.avatar').textContent = initiales;
  li.querySelector('strong').textContent = etu.nom;
  li.querySelector('.option').textContent = etu.option;
  li.querySelector('.btn-retirer').setAttribute('aria-label', `Retirer ${etu.nom}`);
  return li;
}

/* ---------------------------------------------------------
   NIVEAU 1 — CHARGER
   Version actuelle : fonctionne, mais rien ne se passe pendant
   l'attente, et une erreur réseau n'est pas gérée.
   --------------------------------------------------------- */
async function charger() {
  // TODO 1.2 : ajouter la classe is-loading sur zone
  btnCharger.addEventListener('click', () => {
    zone.classList.toggle('is-loading');
  });


  // TODO 1.4 : try / catch / finally (voir l'énoncé)
  // TODO 1.5 : désactiver le bouton pendant le chargement
  const etudiants = await apiGetEtudiants();
  afficher(etudiants);
  // TODO 3.2 : toasts de succès et d'erreur
}

/* ---------------------------------------------------------
   NIVEAU 2 — AFFICHER ET RETIRER
   --------------------------------------------------------- */
function afficher(etudiants) {
  liste.innerHTML = '';
  etudiants.forEach((etu, i) => {
    const li = creerLigne(etu);
    // TODO 2.1 : donner le rang i à la variable CSS --i, et ajouter la classe is-entering
    liste.append(li);
  });
  majCompteur();
}

function retirer(li) {
  // TODO 2.6 : ignorer un deuxième clic pendant la sortie
  // TODO 2.3 : ajouter is-removing, et ne retirer l'élément qu'à la fin de l'animation
  li.remove();
  majCompteur();
  // TODO 3.2 : toast de confirmation
}

/* ---------------------------------------------------------
   NIVEAU 3 — TOAST
   Version actuelle : le message ne s'affiche que dans la console.
   --------------------------------------------------------- */
async function toast(message, type = 'succes') {
  console.log(`[${type}] ${message}`);
  // TODO 3.1 : créer le toast, l'animer avec animate(), attendre, le faire sortir, le retirer
}

/* ---------------------------------------------------------
   BONUS — FLIP
   --------------------------------------------------------- */
function retirerFLIP(li) {
  // TODO B : voir l'énoncé
  retirer(li);
}

/* ---------------------------------------------------------
   BRANCHEMENTS (fournis)
   --------------------------------------------------------- */
btnCharger.addEventListener('click', charger);

liste.addEventListener('click', (e) => {
  const bouton = e.target.closest('.btn-retirer');
  if (!bouton) return;
  retirer(bouton.closest('.ligne'));   // bonus : remplacer par retirerFLIP(...)
});
