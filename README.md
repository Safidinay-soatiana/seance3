# TP3 — Une liste d'étudiants vivante

**Animation Web · L3 Informatique · ITUniversity**
**Séance 3 — Piloter les animations en JavaScript · Durée : 1 h 20**

---

## Objectifs

L'application fournie **fonctionne déjà** : elle charge une liste d'étudiants en JSON et permet d'en retirer. Mais elle est muette : rien pendant le chargement, rien en cas d'erreur, des lignes qui apparaissent et disparaissent d'un coup.

À la fin de ce TP, vous saurez :

1. afficher un état de chargement (skeleton) pendant un `fetch`, et le retirer **dans tous les cas** ;
2. faire apparaître des données de façon échelonnée, avec un rang fourni par le JavaScript ;
3. retirer un élément **après** son animation de sortie, avec `animationend` ;
4. créer une notification animée avec `element.animate()` et la promesse `finished` ;
5. *(bonus)* resserrer une liste en douceur avec la technique FLIP.

## Démarrage

`fetch` ne fonctionne pas quand on ouvre un fichier directement (adresse en `file://`). Il faut un petit serveur local.

1. Copiez le dossier `starter/` dans votre dépôt Git, sous le nom `seance3/`.
2. Dans un terminal, placez-vous dans ce dossier et lancez :
   ```bash
   php -S localhost:8000
   ```
3. Ouvrez <http://localhost:8000> dans le navigateur.
4. Vous modifiez `app.js` et `style.css`, aux endroits marqués `TODO`. Le HTML et les parties marquées **FOURNI** ne changent pas.

L'appel réseau est volontairement ralenti à 1,5 s (`DELAI_RESEAU`) pour que vous voyiez l'attente. La case « Simuler une erreur réseau » fait échouer l'appel (fichier introuvable, erreur 404).

| Niveau | Contenu | Durée indicative |
|---|---|---|
| 1 | Chargement : skeleton et gestion d'erreur | 25 min |
| 2 | Arrivée échelonnée et suppression animée | 25 min |
| 3 | Notifications avec `animate()` | 20 min |
| Bonus | FLIP : la liste se resserre | 10 min |

---

## Niveau 1 — Le chargement

### Étape 1.1 — Observer

Cliquez sur « Charger les étudiants ». Pendant 1,5 s, rien ne se passe.

> **Question 1.** Que pense un utilisateur pendant ces 1,5 s ? Que risque-t-il de faire ?

### Étape 1.2 — Signaler l'attente

Dans `charger()`, ajoutez la classe `is-loading` sur `zone` **avant** l'appel, et retirez-la **après** l'affichage.

Rien ne change à l'écran pour l'instant : c'est normal, le CSS n'est pas encore écrit (étape 1.5).

### Étape 1.3 — Le cas qui casse

Cochez « Simuler une erreur réseau », puis cliquez sur « Charger ». Ouvrez la console (F12).

> **Question 2.** Que se passe-t-il pour la classe `is-loading` ? Pourquoi ?

### Étape 1.4 — try / catch / finally

Restructurez `charger()` :
- `try` : l'appel et l'affichage ;
- `catch (e)` : pour l'instant, `console.error(e)` (la notification viendra au niveau 3) ;
- `finally` : retirer `is-loading`.

Vérifiez que le cas d'erreur ne laisse plus la zone bloquée en chargement.

### Étape 1.5 — Le skeleton

1. Dans `charger()`, désactivez aussi le bouton pendant le chargement (`btnCharger.disabled = true`, puis `false` dans le `finally`).
2. Dans `style.css`, quand `#zone` a la classe `.is-loading`, affichez `.skeleton` (`display: grid`) et masquez `.liste`.

Vous voyez maintenant des lignes grises à la place des étudiants pendant le chargement.

### Étape 1.6 — Le reflet

Ajoutez un reflet qui traverse chaque ligne grise :
- un pseudo-élément `.sk-ligne::after` avec `content: ""`, `position: absolute` et `inset: 0` ;
- un fond `linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent)` ;
- un départ à `translate: -100% 0`, et une animation `reflet` (1.2 s, infinie) qui l'amène à `translate: 100% 0`.

> 💡 `.sk-ligne` a déjà `position: relative` et `overflow: hidden` : le reflet reste à l'intérieur.

> **Question 3.** Pourquoi un skeleton est-il plus informatif qu'un simple rond qui tourne ?

✅ **Checkpoint niveau 1**
- [ ] Un skeleton avec reflet s'affiche pendant le chargement
- [ ] Le bouton est désactivé pendant le chargement
- [ ] En cas d'erreur, le skeleton disparaît quand même
- [ ] Questions 1 à 3 répondues (en commentaire en haut de `app.js`)

---

## Niveau 2 — Arrivée et suppression

### Étape 2.1 — Le rang, côté JavaScript

Dans `afficher()`, pour chaque ligne :
```js
li.style.setProperty('--i', i);
li.classList.add('is-entering');
```

### Étape 2.2 — L'animation, côté CSS

1. Écrivez `@keyframes entrer` avec seulement un `from` : `opacity: 0` et `translate: 0 12px`.
2. Écrivez `.ligne.is-entering` : animation `entrer` 0.4 s `ease-out` `both`, avec un délai de `calc(min(var(--i), 10) * 60ms)`.

> **Question 4.** À quoi sert `min(var(--i), 10)` ? Imaginez une liste de 200 étudiants.

Cliquez plusieurs fois sur « Charger ».

> **Question 5.** Les lignes s'animent à chaque chargement, sans la fonction `restart()` du TP2. Pourquoi ?

### Étape 2.3 — Retirer après l'animation

Dans `retirer(li)`, remplacez la suppression immédiate :
1. ajoutez la classe `is-removing` ;
2. écoutez `animationend` sur `li`, avec l'option `{ once: true }` ;
3. dans l'écouteur : `li.remove()` puis `majCompteur()`.

### Étape 2.4 — L'animation de sortie

Écrivez `@keyframes sortir` (vers `translate: 40px 0` et `opacity: 0`) et la règle `.ligne.is-removing` : 0.3 s, `ease-in`, `forwards`, avec `pointer-events: none`.

> **Question 6.** Pourquoi `ease-in` pour la sortie, alors qu'on a choisi `ease-out` pour l'entrée ?

### Étape 2.5 — Expérience : supprimer trop tôt

Temporairement, appelez `li.remove()` **juste après** avoir ajouté la classe, sans attendre `animationend`. Que voyez-vous ? Remettez la bonne version.

### Étape 2.6 — Le double clic

Cliquez très vite deux fois sur le même bouton « Retirer ». Pour éviter de lancer deux suppressions, ajoutez au début de `retirer()` :
```js
if (li.classList.contains('is-removing')) return;
```

✅ **Checkpoint niveau 2**
- [ ] Les lignes apparaissent l'une après l'autre
- [ ] Une ligne retirée glisse et disparaît **avant** d'être supprimée du DOM
- [ ] Le compteur se met à jour après la sortie
- [ ] Questions 4 à 6 répondues

---

## Niveau 3 — Les notifications

### Étape 3.1 — La fonction toast()

Réécrivez `toast(message, type)` avec la Web Animations API :

1. créez une `div`, avec les classes `toast` et `toast--` + type (`succes` ou `erreur`), et le message en `textContent` ;
2. ajoutez-la dans `toasts` ;
3. définissez les étapes d'entrée :
   ```js
   const etapes = [
     { opacity: 0, translate: '0 20px' },
     { opacity: 1, translate: '0 0' }
   ];
   ```
4. jouez l'entrée et attendez sa fin :
   ```js
   await el.animate(etapes, { duration: 300, easing: 'ease-out', fill: 'both' }).finished;
   ```
5. attendez 3 secondes avec `await attendre(3000)` ;
6. jouez **les mêmes étapes à l'envers** (option `direction: 'reverse'`, 250 ms, `ease-in`), attendez la fin, puis retirez l'élément.

### Étape 3.2 — Brancher les toasts

- Succès du chargement : « 8 étudiants chargés » (utilisez la longueur du tableau).
- Échec : « Chargement impossible. Réessayez. », type `erreur`.
- Après un retrait : « *Nom* retiré de la liste ». Récupérez le nom **avant** de supprimer la ligne.

> **Question 7.** Pourquoi `await ... .finished` plutôt qu'un `setTimeout` de 300 ms ?

✅ **Checkpoint niveau 3**
- [ ] Un toast apparaît, reste 3 s, puis disparaît, pour chaque cas
- [ ] Plusieurs toasts peuvent s'empiler
- [ ] Question 7 répondue

---

## Bonus — FLIP : la liste se resserre

Quand une ligne est retirée, les lignes en dessous **sautent** pour combler le vide. La technique FLIP les fait glisser :

1. **First** : avant la suppression, mémorisez la position verticale de chaque autre ligne (`getBoundingClientRect().top`) ;
2. **Last** : supprimez la ligne ; les autres se placent à leur nouvelle position ;
3. **Invert** : pour chaque ligne, calculez l'écart `dy = ancienne position − nouvelle position` ;
4. **Play** : animez chaque ligne de `translate: 0 ${dy}px` vers `translate: 0 0` avec `animate()` (250 ms).

Écrivez `retirerFLIP(li)`, puis, dans les branchements en bas de `app.js`, remplacez l'appel à `retirer(...)` par `retirerFLIP(...)`.

> **Question 8.** Pourquoi l'œil ne voit-il pas le « saut » de l'étape 2 ?

---

## Livrable

- Dossier `seance3/` dans votre dépôt Git.
- Réponses aux questions **en commentaire** en haut de `app.js`.

```bash
git add seance3/
git commit -m "Séance 3 : animations pilotées en JavaScript"
git push
```

## Vers votre projet

Dans votre application CodeIgniter 4, remplacez `API_URL` par l'URL d'un contrôleur qui renvoie du JSON, et supprimez le délai simulé. Les fonctions `charger()`, `toast()` et `retirer()` sont réutilisables presque telles quelles : c'est la base du projet de la séance 5.

## Pour aller plus loin

- MDN — Événement `animationend` : <https://developer.mozilla.org/fr/docs/Web/API/Element/animationend_event>
- MDN — `Element.animate()` : <https://developer.mozilla.org/fr/docs/Web/API/Element/animate>
- MDN — `Animation.finished` : <https://developer.mozilla.org/fr/docs/Web/API/Animation/finished>
