# Documentation de Wysiii

Wysiii est une bibliothèque JavaScript légère et extensible pour créer des éditeurs WYSIWYG (What You See Is What You Get) à partir de simples champs de texte HTML.

## Table des matières

1. [Installation](#installation)
2. [Utilisation de base](#utilisation-de-base)
3. [Configuration](#configuration)
4. [Internationalisation](#internationalisation)
5. [Système de plugins](#système-de-plugins)
6. [API](#api)
7. [Exemples](#exemples)
8. [Personnalisation](#personnalisation)

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
<input type="text" class="wysiii" data-wysiii-buttons='["bold", "italic", "link", "image", "table"]'>
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
- `table`: Insérer un tableau

### Palette de couleurs

Utilisez l'attribut `data-wysiii-colors` pour définir une palette de couleurs :

```html
<input type="text" class="wysiii" data-wysiii-colors="#000000,#FF0000,#00FF00,#0000FF">
```

## Internationalisation

Wysiii supporte maintenant plusieurs langues. Pour changer la langue, passez l'option `lang` lors de l'initialisation :

```javascript
const wysiii = new Wysiii(inputElement, { lang: 'en' });
```

Langues actuellement supportées : 'fr' (français) et 'en' (anglais).

## Système de plugins

Wysiii inclut maintenant un système de plugins pour étendre ses fonctionnalités.

### Création d'un plugin

```javascript
const myPlugin = {
    init(wysiii) {
        console.log('Mon plugin est initialisé');
    },
    beforeExecCommand(command, value) {
        console.log(`Commande sur le point d'être exécutée: ${command}`);
    },
    afterExecCommand(command, value) {
        console.log(`Commande exécutée: ${command}`);
    }
};
```

### Enregistrement d'un plugin

```javascript
const wysiii = new Wysiii(inputElement);
wysiii.pluginManager.register('monPlugin', myPlugin);
wysiii.initPlugins();
```

## API

La classe `Wysiii` expose les méthodes suivantes :

### `constructor(inputElement, options = {})`

Crée une nouvelle instance de Wysiii pour l'élément input spécifié.

### `parseOptions()`

Analyse les options configurées via les attributs de données.

### `t(key)`

Traduit une clé selon la langue actuelle.

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

### `insertTable()`

Insère un tableau dans l'éditeur.

### `undo()` et `redo()`

Annule ou rétablit la dernière action.

### `showLinkMenu(linkElement, x, y)`

Affiche un menu contextuel pour gérer un lien.

### `editLink(linkElement)` et `deleteLink(linkElement)`

Modifie ou supprime un lien existant.

### `initPlugins()`

Initialise les plugins enregistrés.

## Exemples

### Éditeur simple avec options par défaut

```html
<input type="text" class="wysiii" name="content">
```

### Éditeur personnalisé avec boutons spécifiques, palette de couleurs et langue anglaise

```html
<input type="text" class="wysiii" name="content" 
       data-wysiii-buttons='["bold", "italic", "link", "image", "table"]'
       data-wysiii-colors="#000000,#FF0000,#00FF00,#0000FF">
<script>
document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('input.wysiii');
    const wysiii = new Wysiii(input, { lang: 'en' });
    wysiii.initPlugins();
});
</script>
```

## Personnalisation

Vous pouvez personnaliser l'apparence de Wysiii en modifiant le fichier CSS. Les principales classes CSS sont :

- `.wysiii-container`: Conteneur principal de l'éditeur
- `.wysiii-toolbar`: Barre d'outils
- `.wysiii-editor`: Zone d'édition
- `.wysiii-link-menu`: Menu contextuel des liens

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

Pour toute question supplémentaire ou assistance, n'hésitez pas à contacter le support ou à consulter le dépôt du projet.