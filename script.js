async function consultarGuild() {
    const guildName = document.getElementById('guildName').value.toLowerCase();
    const response = await fetch(`https://api.tibiadata.com/v4/guild/${encodeURIComponent(guildName)}`);
    const data = await response.json();
    const membros = data.guild.members;
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = '';

    const contadores = {
        'Royal Paladin': 0,
        'Elder Druid': 0,
        'Elite Knight': 0,
        'Master Sorcerer': 0
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
        <p>Royal Paladin: ${contadores['Royal Paladin']}</p>
        <p>Elder Druid: ${contadores['Elder Druid']}</p>
        <p>Elite Knight: ${contadores['Elite Knight']}</p>
        <p>Master Sorcerer: ${contadores['Master Sorcerer']}</p>
    `;
}

function getVocationColor(vocation) {
    switch (vocation) {
        case 'Royal Paladin': return 'orange';
        case 'Elder Druid': return 'blue';
        case 'Elite Knight': return 'black';
        case 'Master Sorcerer': return 'brown';
        default: return 'black';
    }
}

async function filtrarMortes() {
    const levelMin = document.getElementById('levelMin').value;
    const levelMax = document.getElementById('levelMax').value;
    const vocation = document.getElementById('vocation').value;
    const resultados = document.getElementById('resultados').children;
    const mortes = document.getElementById('mortes');
    mortes.innerHTML = '';

    const contadoresMortes = {};

    for (let i = 0; i < resultados.length; i++) {
        const membro = resultados[i].textContent.split(' - ');
        const nome = membro[0];
        const level = parseInt(membro[1]);
        const vocacao = membro[2];

        if ((levelMin === '' || level >= levelMin) && (levelMax === '' || level <= levelMax) && (vocation === '' || vocacao === vocation)) {
            const response = await fetch(`https://api.tibiadata.com/v4/character/${encodeURIComponent(nome)}`);
            const data = await response.json();
            const mortesPersonagem = data.character.deaths.filter(morte => new Date(morte.time) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

            mortesPersonagem.forEach(morte => {
                const div = document.createElement('div');
                div.innerHTML = `<span style="color: ${getVocationColor(vocacao)}; font-weight: bold;">${nome} - Level ${morte.level} - ${morte.reason}</span>`;
                mortes.appendChild(div);

                if (!contadoresMortes[nome]) {
                    contadoresMortes[nome] = 0;
                }
                contadoresMortes[nome]++;
            });
        }
    }

    const tabelaMortes = document.createElement('table');
    tabelaMortes.innerHTML = `
        <thead>
            <tr>
                <th>Personagem</th>
                <th>Mortes</th>
            </tr>
        </thead>
        <tbody>
            ${Object.keys(contadoresMortes).map(nome => `
                <tr>
                    <td>${nome}</td>
                    <td>${contadoresMortes[nome]}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    mortes.appendChild(tabelaMortes);
}
}

function getVocationAbbreviation(vocation) {
    switch (vocation) {
        case 'Royal Paladin': return 'RP';
        case 'Elder Druid': return 'ED';
        case 'Elite Knight': return 'EK';
        case 'Master Sorcerer': return 'MS';
        default: return '';
    }
}
