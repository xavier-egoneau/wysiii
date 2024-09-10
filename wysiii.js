class Wysiii {
    constructor(inputElement) {
        this.input = inputElement;
        this.options = this.parseOptions();
        this.createEditor();
        this.attachEventListeners();
    }

    parseOptions() {
        return {
            buttons: this.input.dataset.wysiiiButtons ? JSON.parse(this.input.dataset.wysiiiButtons) : ['bold', 'italic', 'underline'],
            colors: this.input.dataset.wysiiiColors ? this.input.dataset.wysiiiColors.split(',') : []
        };
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
            bold: { icon: 'fa-solid fa-bold', label: 'Mettre en gras' },
            italic: { icon: 'fa-solid fa-italic', label: 'Mettre en italique' },
            underline: { icon: 'fa-solid fa-underline', label: 'Souligner' },
            strikethrough: { icon: 'fa-solid fa-strikethrough', label: 'Barrer' },
            list: { icon: 'fa-solid fa-list-ul', label: 'Insérer une liste à puces' },
            orderedList: { icon: 'fa-solid fa-list-ol', label: 'Insérer une liste numérotée' },
            link: { icon: 'fa-solid fa-link', label: 'Insérer un lien' },
            image: { icon: 'fa-solid fa-image', label: 'Insérer une image' },
            code: { icon: 'fa-solid fa-code', label: 'Afficher le code source' }
        };

        this.options.buttons.forEach(buttonName => {
            const button = buttonConfig[buttonName];
            if (button) {
                const btn = document.createElement('button');
                btn.type = 'button'; // Correction du bug : définir explicitement le type du bouton
                btn.innerHTML = `<i class="${button.icon}" aria-hidden="true"></i><span class="sr-only">${button.label}</span>`;
                btn.title = button.label;
                btn.setAttribute('aria-label', button.label);
                btn.dataset.command = buttonName;
                this.toolbar.appendChild(btn);
            }
        });

        if (this.options.colors.length > 0) {
            const colorSelect = document.createElement('select');
            colorSelect.title = 'Couleur du texte';
            colorSelect.setAttribute('aria-label', 'Sélectionner la couleur du texte');
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
                    const url = prompt('Entrez l\'URL du lien :');
                    if (url) this.execCommand('createLink', url);
                } else if (command === 'image') {
                    const url = prompt('Entrez l\'URL de l\'image :');
                    if (url) this.execCommand('insertImage', url);
                } else if (command === 'code') {
                    this.toggleSource();
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
        });
    }

    execCommand(command, value = null) {
        document.execCommand(command, false, value);
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
}

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input.wysiii[type="text"]');
    inputs.forEach(input => new Wysiii(input));
});