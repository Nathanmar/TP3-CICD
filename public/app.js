document.addEventListener('DOMContentLoaded', () => {
    const fieldsContainer = document.getElementById('fields-container');
    const addFieldBtn = document.getElementById('add-field-btn');
    const generateBtn = document.getElementById('generate-btn');
    const resultDisplay = document.getElementById('result-display');
    const copyBtn = document.getElementById('copy-btn');
    const countInput = document.getElementById('count');

    // Default fields
    const defaultFields = [
        { name: 'id', type: 'uuid' },
        { name: 'fullName', type: 'name' },
        { name: 'age', type: 'number' }
    ];

    const createFieldRow = (name = '', type = 'string') => {
        const row = document.createElement('div');
        row.className = 'field-row';

        row.innerHTML = `
            <input type="text" placeholder="Nom du champ" value="${name}" class="field-name">
            <select class="field-type">
                <option value="string" ${type === 'string' ? 'selected' : ''}>Texte</option>
                <option value="number" ${type === 'number' ? 'selected' : ''}>Nombre</option>
                <option value="uuid" ${type === 'uuid' ? 'selected' : ''}>UUID</option>
                <option value="name" ${type === 'name' ? 'selected' : ''}>Nom Complet</option>
            </select>
            <button class="remove-btn">&times;</button>
        `;

        row.querySelector('.remove-btn').addEventListener('click', () => {
            row.remove();
        });

        return row;
    };

    // Initialize with default fields
    defaultFields.forEach(f => {
        fieldsContainer.appendChild(createFieldRow(f.name, f.type));
    });

    addFieldBtn.addEventListener('click', () => {
        fieldsContainer.appendChild(createFieldRow());
    });

    generateBtn.addEventListener('click', async () => {
        const rows = document.querySelectorAll('.field-row');
        const schema = {};

        rows.forEach(row => {
            const name = row.querySelector('.field-name').value.trim();
            const type = row.querySelector('.field-type').value;
            if (name) {
                schema[name] = type;
            }
        });

        const count = parseInt(countInput.value) || 10;

        generateBtn.textContent = 'Génération...';
        generateBtn.disabled = true;

        try {
            const response = await fetch('/api/mock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schema, count })
            });

            const data = await response.json();

            if (response.ok) {
                resultDisplay.textContent = JSON.stringify(data, null, 2);
            } else {
                resultDisplay.textContent = `Erreur: ${data.error || 'Une erreur est survenue'}`;
            }
        } catch (error) {
            resultDisplay.textContent = `Erreur réseau: ${error.message}`;
        } finally {
            generateBtn.textContent = 'Générer les données';
            generateBtn.disabled = false;
        }
    });

    copyBtn.addEventListener('click', () => {
        const text = resultDisplay.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copié !';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    });
});
