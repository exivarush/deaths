async function consultarGuild() {
    const guildName = document.getElementById('guildName').value.toLowerCase();
    const response = await fetch(`https://api.tibiadata.com/v4/guild/${encodeURIComponent(guildName)}`);
    const data = await response.json();
    const membros = data.guild.members;
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = '';

    const contadores = {
        'RP': 0,
        'ED': 0,
        'EK': 0,
        'MS': 0
    };

    membros.filter(membro => membro.status === 'online')
        .sort((a, b) => b.level - a.level)
        .forEach(membro => {
            const div = document.createElement('div');
            div.className = `${membro.vocation.replace(' ', '')} bold`;
            div.innerHTML = `<span style="color: ${getVocationColor(membro.vocation)}; font-weight: bold;">${membro.name} - ${membro.level} - ${membro.vocation.replace('Royal Paladin', 'RP').replace('Elder Druid', 'ED').replace('Elite Knight', 'EK').replace('Master Sorcerer', 'MS')}</span>`;
            resultados.appendChild(div);
            contadores[membro.vocation]++;
        });

    document.getElementById('onlineCount').innerHTML = `
        <p>RP: ${contadores['Royal Paladin']}</p>
        <p>ED: ${contadores['Elder Druid']}</p>
        <p>EK: ${contadores['Elite Knight']}</p>
        <p>MS: ${contadores['Master Sorcerer']}</p>
    `;
}

function getVocationColor(vocation) {
    switch (vocation) {
        case 'RP': return 'orange';
        case 'ED': return 'blue';
        case 'EK': return 'black';
        case 'MS': return 'brown';
        default: return 'black';
    }
}

async function filtrarMortes() {
    const levelMin = document.getElementById('levelMin').value;
    const levelMax = document.getElementById('levelMax').value;
    const resultados = document.getElementById('resultados').children;
    const mortes = document.getElementById('mortes');
    mortes.innerHTML = '';

    const contadoresMortes = {
        'RP': 0,
        'ED': 0,
        'EK': 0,
        'MS': 0
    };

    for (let i = 0; i < resultados.length; i++) {
        const membro = resultados[i].textContent.split(' - ');
        const nome = membro[0];
        const level = parseInt(membro[1]);
        const vocacao = membro[2];

        if ((levelMin === '' || level >= levelMin) && (levelMax === '' || level <= levelMax)) {
            const response = await fetch(`https://api.tibiadata.com/v4/character/${encodeURIComponent(nome)}`);
            const data = await response.json();
            const mortesPersonagem = data.character.deaths.filter(morte => new Date(morte.time) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

            mortesPersonagem.forEach(morte => {
                const div = document.createElement('div');
                div.innerHTML = `<span style="color: ${getVocationColor(vocacao)}; font-weight: bold;">${nome} - ${vocacao} - Level ${morte.level} - ${new Date(morte.time).toLocaleString()} - ${morte.reason}</span>`;
                mortes.appendChild(div);
                contadoresMortes[vocacao]++;
                if (!contadoresPorNome[nome]) { contadoresPorNome[nome] = 0; } contadoresPorNome[nome]++;
            });
        }
    }

    const tabelaMortes = document.createElement('table');
    tabelaMortes.innerHTML = `
        <thead>
            <tr>
                <th>Vocação</th>
                <th>Mortes</th>
            </tr>
        </thead>
        <tbody>
            ${Object.keys(contadoresMortes).map(vocacao => `
                <tr>
                    <td>${vocacao}</td>
                    <td>${contadoresMortes[vocacao]}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    mortes.appendChild(tabelaMortes);
    
    const tabelaPorNome = document.createElement('table');
    tabelaPorNome.innerHTML = `
        <thead>
            <tr>
                <th>Nome</th>
                <th>Mortes</th>
            </tr>
        </thead>
        <tbody>
            ${Object.keys(contadoresPorNome).map(nome => `
                <tr>
                    <td>${nome}</td>
                    <td>${contadoresPorNome[nome]}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    mortes.appendChild(tabelaPorNome);
}
