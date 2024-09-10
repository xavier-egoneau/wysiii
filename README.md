# Documentation de Wysiii

Wysiii est une bibliothèque JavaScript légère pour créer des éditeurs WYSIWYG (What You See Is What You Get) à partir de simples champs de texte HTML.

## Table des matières

1. [Installation](#installation)
2. [Utilisation de base](#utilisation-de-base)
3. [Configuration](#configuration)
4. [API](#api)
5. [Exemples](#exemples)
6. [Personnalisation](#personnalisation)

## Installation

1. Téléchargez les fichiers `wysiii.js` et `wysiii.css`.
2. Incluez ces fichiers dans votre page HTML :

```html
<link rel="stylesheet" href="path/to/wysiii.css">
<script src="path/to/wysiii.js"></script>
```

3. Assurez-vous d'inclure également Font Awesome pour les icônes :

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

## Utilisation de base

Pour transformer un champ de texte en éditeur Wysiii, ajoutez simplement la classe `wysiii` à un élément `<input type="text">` :

```html
<input type="text" class="wysiii" name="content">
```

L'initialisation se fait automatiquement lors du chargement de la page.

## Configuration

Vous pouvez personnaliser chaque instance de Wysiii en utilisant des attributs de données :

### Boutons de la barre d'outils

Utilisez l'attribut `data-wysiii-buttons` pour spécifier les boutons à afficher :

```html
<input type="text" class="wysiii" data-wysiii-buttons='["bold", "italic", "link"]'>
```

Boutons disponibles :
- `bold`: Gras
- `italic`: Italique
- `underline`: Souligné
- `strikethrough`: Barré
- `list`: Liste à puces
- `orderedList`: Liste numérotée
- `link`: Insérer un lien
- `image`: Insérer une image
- `code`: Afficher le code source

### Palette de couleurs

Utilisez l'attribut `data-wysiii-colors` pour définir une palette de couleurs :

```html
<input type="text" class="wysiii" data-wysiii-colors="#000000,#FF0000,#00FF00,#0000FF">
```

## API

La classe `Wysiii` expose les méthodes suivantes :

### `constructor(inputElement)`

Crée une nouvelle instance de Wysiii pour l'élément input spécifié.

### `parseOptions()`

Analyse les options configurées via les attributs de données.

### `createEditor()`

Crée l'interface de l'éditeur WYSIWYG.

### `attachEventListeners()`

Attache les écouteurs d'événements nécessaires.

### `execCommand(command, value = null)`

Exécute une commande d'édition.

### `toggleSource()`

Bascule entre l'affichage du contenu formaté et du code source HTML.

### `updateInputValue()`

Met à jour la valeur de l'input caché avec le contenu de l'éditeur.

### `getContent()`

Retourne le contenu HTML de l'éditeur.

### `setContent(html)`

Définit le contenu HTML de l'éditeur.

## Exemples

### Éditeur simple avec options par défaut

```html
<input type="text" class="wysiii" name="content">
```

### Éditeur personnalisé avec boutons spécifiques et palette de couleurs

```html
<input type="text" class="wysiii" name="content" 
       data-wysiii-buttons='["bold", "italic", "link", "image"]'
       data-wysiii-colors="#000000,#FF0000,#00FF00,#0000FF">
```

## Personnalisation

Vous pouvez personnaliser l'apparence de Wysiii en modifiant le fichier CSS. Les principales classes CSS sont :

- `.wysiii-container`: Conteneur principal de l'éditeur
- `.wysiii-toolbar`: Barre d'outils
- `.wysiii-editor`: Zone d'édition

Exemple de personnalisation :

```css
.wysiii-container {
    border: 2px solid #007bff;
    border-radius: 8px;
}

.wysiii-toolbar button:hover {
    background-color: #e9ecef;
}
```

---

