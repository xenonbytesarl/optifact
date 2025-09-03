# Logo texte blanc

Objectif: Dupliquer `public/assets/images/logo.png` et convertir uniquement le texte (noir) en blanc.

## Génération automatique (recommandée)
Prérequis: [ImageMagick](https://imagemagick.org) installé (`magick` ou `convert`).

Commande:

```bash
npm run logo:generate:white
```

Cela crée `public/assets/images/logo-text-white.png` en remplaçant le noir (±10% de tolérance) par du blanc, en conservant la transparence.

Ajustements possibles:
- Si certaines zones restent sombres: augmentez la tolérance à 12–15%.
- Si trop de zones changent: baissez à 5%.

Utilisation côté app: la topbar et l’en‑tête de la sidebar utilisent automatiquement `logo-text-white.png` en mode sombre. Si le fichier est absent, le logo clair est utilisé comme repli.

## Génération manuelle (Photoshop/GIMP)
Voir la procédure décrite préalablement: Sélection par couleur du texte noir → remplissage blanc → export PNG (transparence).
