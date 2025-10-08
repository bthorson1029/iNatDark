(function () {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('export').addEventListener('click', async () => {
            const s = await window.__inatStorage.getSettings();
            const blob = new Blob([JSON.stringify(s, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'inat-dark-settings.json'; a.click();
            URL.revokeObjectURL(url);
        });


        document.getElementById('import').addEventListener('click', async () => {
            const f = document.getElementById('importFile').files[0];
            if (!f) return alert('Choose a JSON file first.');
            const text = await f.text();
            try {
                const json = JSON.parse(text);
                await window.__inatStorage.setSettings(json);
                alert('Settings imported.');
            } catch (e) {
                alert('Invalid JSON.');
            }
        });
    });
})();