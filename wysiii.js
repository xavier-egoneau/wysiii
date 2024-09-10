// Système d'internationalisation
const i18n = {
    fr: {
        bold: 'Gras',
        italic: 'Italique',
        underline: 'Souligné',
        strikethrough: 'Barré',
        list: 'Liste à puces',
        orderedList: 'Liste numérotée',
        link: 'Insérer un lien',
        image: 'Insérer une image',
        code: 'Afficher le code source',
        table: 'Insérer un tableau',
        fontSize: 'Taille de police',
        selectFontSize: 'Sélectionner la taille de police',
        paragraphStyle: 'Style de paragraphe',
        selectParagraphStyle: 'Sélectionner le style de paragraphe',
        paragraph: 'Paragraphe',
        heading1: 'Titre 1',
        heading2: 'Titre 2',
        heading3: 'Titre 3',
        quote: 'Citation',
        editLink: 'Modifier le lien',
        deleteLink: 'Supprimer le lien',
        openInNewTab: 'Ouvrir dans un nouvel onglet',
        enterNewUrl: 'Entrez la nouvelle URL :',
        textColor: 'Couleur du texte'
    },
    en: {
        bold: 'Bold',
        italic: 'Italic',
        underline: 'Underline',
        strikethrough: 'Strikethrough',
        list: 'Bullet list',
        orderedList: 'Numbered list',
        link: 'Insert link',
        image: 'Insert image',
        code: 'View source code',
        table: 'Insert table',
        fontSize: 'Font size',
        selectFontSize: 'Select font size',
        paragraphStyle: 'Paragraph style',
        selectParagraphStyle: 'Select paragraph style',
        paragraph: 'Paragraph',
        heading1: 'Heading 1',
        heading2: 'Heading 2',
        heading3: 'Heading 3',
        quote: 'Quote',
        editLink: 'Edit link',
        deleteLink: 'Delete link',
        openInNewTab: 'Open in new tab',
        enterNewUrl: 'Enter new URL:',
        textColor: 'Text color'
    }
};

class WysiiiPluginManager {
    constructor(wysiii) {
        this.wysiii = wysiii;
        this.plugins = {};
    }

    register(name, plugin) {
        this.plugins[name] = plugin;
    }

    init() {
        for (const plugin of Object.values(this.plugins)) {
            if (typeof plugin.init === 'function') {
                plugin.init(this.wysiii);
            }
        }
    }

    exec(hookName, ...args) {
        for (const plugin of Object.values(this.plugins)) {
            if (typeof plugin[hookName] === 'function') {
                plugin[hookName](...args);
            }
        }
    }
}

class Wysiii {
    constructor(inputElement, options = {}) {
        this.input = inputElement;
        this.lang = options.lang || 'fr';
        this.options = this.parseOptions();
        this.pluginManager = new WysiiiPluginManager(this);
        this.history = [];
        this.historyIndex = -1;
        this.createEditor();
        this.attachEventListeners();
    }

    parseOptions() {
        return {
            buttons: this.input.dataset.wysiiiButtons ? JSON.parse(this.input.dataset.wysiiiButtons) : ['bold', 'italic', 'underline'],
            colors: this.input.dataset.wysiiiColors ? this.input.dataset.wysiiiColors.split(',') : []
        };
    }

    t(key) {
        return i18n[this.lang][key] || key;
    }

    createEditor() {
        this.container = document.createElement('div');
        this.container.className = 'wysiii-container';
        this.input.parentNode.insertBefore(this.container, this.input.nextSibling);
        this.input.style.display = 'none';

        this.toolbar = document.createElement('div');
        this.toolbar.className = 'wysiii-toolbar';
        this.toolbar.setAttribute('role', 'toolbar');
        this.toolbar.setAttribute('aria-label', 'Options de formatage');
        
        const buttonConfig = {
            bold: { icon: 'fa-solid fa-bold', label: this.t('bold') },
            italic: { icon: 'fa-solid fa-italic', label: this.t('italic') },
            underline: { icon: 'fa-solid fa-underline', label: this.t('underline') },
            strikethrough: { icon: 'fa-solid fa-strikethrough', label: this.t('strikethrough') },
            list: { icon: 'fa-solid fa-list-ul', label: this.t('list') },
            orderedList: { icon: 'fa-solid fa-list-ol', label: this.t('orderedList') },
            link: { icon: 'fa-solid fa-link', label: this.t('link') },
            image: { icon: 'fa-solid fa-image', label: this.t('image') },
            code: { icon: 'fa-solid fa-code', label: this.t('code') },
            table: { icon: 'fa-solid fa-table', label: this.t('table') }
        };

        this.options.buttons.forEach(buttonName => {
            const button = buttonConfig[buttonName];
            if (button) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.innerHTML = `<i class="${button.icon}" aria-hidden="true"></i><span class="sr-only">${button.label}</span>`;
                btn.title = button.label;
                btn.setAttribute('aria-label', button.label);
                btn.dataset.command = buttonName;
                this.toolbar.appendChild(btn);
            }
        });

        // Ajout du sélecteur de taille de police
        const fontSizeSelect = document.createElement('select');
        fontSizeSelect.title = this.t('fontSize');
        fontSizeSelect.setAttribute('aria-label', this.t('selectFontSize'));
        fontSizeSelect.dataset.command = 'fontSize';
        [1, 2, 3, 4, 5, 6, 7].forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            fontSizeSelect.appendChild(option);
        });
        this.toolbar.appendChild(fontSizeSelect);

        // Ajout du sélecteur de style de paragraphe
        const formatSelect = document.createElement('select');
        formatSelect.title = this.t('paragraphStyle');
        formatSelect.setAttribute('aria-label', this.t('selectParagraphStyle'));
        formatSelect.dataset.command = 'formatBlock';
        const formats = [
            { value: 'p', label: this.t('paragraph') },
            { value: 'h1', label: this.t('heading1') },
            { value: 'h2', label: this.t('heading2') },
            { value: 'h3', label: this.t('heading3') },
            { value: 'blockquote', label: this.t('quote') }
        ];
        formats.forEach(format => {
            const option = document.createElement('option');
            option.value = format.value;
            option.textContent = format.label;
            formatSelect.appendChild(option);
        });
        this.toolbar.appendChild(formatSelect);

        if (this.options.colors.length > 0) {
            const colorSelect = document.createElement('select');
            colorSelect.title = this.t('textColor');
            colorSelect.setAttribute('aria-label', this.t('textColor'));
            colorSelect.dataset.command = 'foreColor';
            this.options.colors.forEach(color => {
                const option = document.createElement('option');
                option.value = color;
                option.style.backgroundColor = color;
                option.textContent = this.getColorName(color);
                colorSelect.appendChild(option);
            });
            this.toolbar.appendChild(colorSelect);
        }

        this.editor = document.createElement('div');
        this.editor.className = 'wysiii-editor';
        this.editor.setAttribute('role', 'textbox');
        this.editor.setAttribute('aria-multiline', 'true');
        this.editor.setAttribute('aria-label', 'Zone d\'édition de texte');
        this.editor.contentEditable = true;
        this.editor.innerHTML = this.input.value || '<p>Commencez à écrire ici...</p>';

        // Ajouter des instructions pour les lecteurs d'écran
        const instructions = document.createElement('p');
        instructions.className = 'sr-only';
        instructions.textContent = "Utilisez les touches de flèches pour naviguer dans le texte. Ctrl+B pour mettre en gras, Ctrl+I pour l'italique, Ctrl+U pour souligner.";
        this.container.appendChild(instructions);

        this.container.appendChild(this.toolbar);
        this.container.appendChild(this.editor);

        this.updateInputValue();
    }

    attachEventListeners() {
        this.toolbar.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button) {
                const command = button.dataset.command;
                if (command === 'link') {
                    const url = prompt(this.t('enterNewUrl'));
                    if (url) this.execCommand('createLink', url);
                } else if (command === 'image') {
                    const url = prompt(this.t('enterNewUrl'));
                    if (url) this.execCommand('insertImage', url);
                } else if (command === 'code') {
                    this.toggleSource();
                } else if (command === 'table') {
                    this.insertTable();
                } else {
                    this.execCommand(command);
                }
                this.updateInputValue();
            }
        });

        this.toolbar.addEventListener('change', (e) => {
            if (e.target.tagName === 'SELECT') {
                this.execCommand(e.target.dataset.command, e.target.value);
                this.updateInputValue();
            }
        });

        this.editor.addEventListener('input', () => {
            this.updateInputValue();
        });

        this.editor.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                document.execCommand('insertParagraph', false);
                e.preventDefault();
                this.updateInputValue();
            }

            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        this.execCommand('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        this.execCommand('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        this.execCommand('underline');
                        break;
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                }
            }
        });

        this.editor.addEventListener('focus', () => {
            this.announceForScreenReader('Vous êtes maintenant dans l\'éditeur de texte enrichi.');
        });

        this.editor.addEventListener('contextmenu', (e) => {
            const linkElement = e.target.closest('a');
            if (linkElement) {
                e.preventDefault();
                this.showLinkMenu(linkElement, e.pageX, e.pageY);
            }
        });
    }

    execCommand(command, value = null) {
        this.pluginManager.exec('beforeExecCommand', command, value);
        document.execCommand(command, false, value);
        this.pluginManager.exec('afterExecCommand', command, value);
        this.editor.focus();
    }

    toggleSource() {
        if (this.editor.contentEditable === 'true') {
            this.editor.textContent = this.editor.innerHTML;
            this.editor.contentEditable = 'false';
        } else {
            this.editor.innerHTML = this.editor.textContent;
            this.editor.contentEditable = 'true';
        }
        this.updateInputValue();
    }

    updateInputValue() {
        this.input.value = this.editor.innerHTML;
        this.saveToHistory();
    }

    getColorName(hexColor) {
        const colors = {
            '#000000': 'Noir',
            '#FF0000': 'Rouge',
            '#00FF00': 'Vert',
            '#0000FF': 'Bleu',
            '#FFFF00': 'Jaune',
            '#FF00FF': 'Magenta',
            '#00FFFF': 'Cyan'
        };
        return colors[hexColor.toUpperCase()] || hexColor;
    }

    insertTable() {
        const rows = prompt('Nombre de lignes:', '3');
        const cols = prompt('Nombre de colonnes:', '3');
        if (rows && cols) {
            let table = '<table border="1"><tbody>';
            for (let i = 0; i < rows; i++) {
                table += '<tr>';
                for (let j = 0; j < cols; j++) {
                    table += '<td>Cell</td>';
                }
                table += '</tr>';
            }
            table += '</tbody></table>';
            this.execCommand('insertHTML', table);
        }
    }

    saveToHistory() {
        this.historyIndex++;
        this.history = this.history.slice(0, this.historyIndex);
        this.history.push(this.editor.innerHTML);
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.editor.innerHTML = this.history[this.historyIndex];
            this.updateInputValue();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.editor.innerHTML = this.history[this.historyIndex];
            this.updateInputValue();
        }
    }



    announceForScreenReader(message) {
        const announcement = document.createElement('p');
        announcement.className = 'sr-only';
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    showLinkMenu(linkElement, x, y) {
        const menu = document.createElement('div');
        menu.className = 'wysiii-link-menu';
        menu.style.position = 'absolute';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        const editButton = document.createElement('button');
        editButton.textContent = this.t('editLink');
        editButton.addEventListener('click', () => this.editLink(linkElement));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = this.t('deleteLink');
        deleteButton.addEventListener('click', () => this.deleteLink(linkElement));

        const newTabCheckbox = document.createElement('input');
        newTabCheckbox.type = 'checkbox';
        newTabCheckbox.id = 'newTabCheckbox';
        newTabCheckbox.checked = linkElement.target === '_blank';
        newTabCheckbox.addEventListener('change', (e) => {
            linkElement.target = e.target.checked ? '_blank' : '';
        });

        const newTabLabel = document.createElement('label');
        newTabLabel.htmlFor = 'newTabCheckbox';
        newTabLabel.textContent = this.t('openInNewTab');

        menu.appendChild(editButton);
        menu.appendChild(deleteButton);
        menu.appendChild(newTabCheckbox);
        menu.appendChild(newTabLabel);

        document.body.appendChild(menu);

        const closeMenu = () => {
            document.body.removeChild(menu);
            document.removeEventListener('click', closeMenu);
        };

        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 0);
    }

    editLink(linkElement) {
        const newUrl = prompt(this.t('enterNewUrl'), linkElement.href);
        if (newUrl) {
            linkElement.href = newUrl;
        }
    }

    deleteLink(linkElement) {
        const textNode = document.createTextNode(linkElement.textContent);
        linkElement.parentNode.replaceChild(textNode, linkElement);
    }

    initPlugins() {
        this.pluginManager.init();
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
const inputs = document.querySelectorAll('input.wysiii[type="text"]');
inputs.forEach(input => {
    const wysiii = new Wysiii(input);
    wysiii.initPlugins();
});
});

// Exemple d'utilisation d'un plugin
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

// Vous pouvez enregistrer le plugin comme ceci:
// const wysiii = new Wysiii(inputElement);
// wysiii.pluginManager.register('monPlugin', myPlugin);
// wysiii.initPlugins();