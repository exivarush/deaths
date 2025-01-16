async function consultarGuild() {
    const guildName = document.getElementById('guildName').value.toLowerCase();
    const levelMin = document.getElementById('levelMin').value;
    const vocation = document.getElementById('vocation').value;
    const offlineOnly = document.getElementById('offlineOnly').checked;
    const response = await fetch(`https://api.tibiadata.com/v4/guild/${encodeURIComponent(guildName)}`);
    const data = await response.json();
    const membros = data.guild.members;
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = '';

    const membrosFiltrados = membros.filter(membro => 
        (levelMin === '' || membro.level >= parseInt(levelMin)) &&
        (vocation === '' || membro.vocation.toLowerCase().replace(' ', '') === vocation.toLowerCase().replace(' ', '')) &&
        (offlineOnly ? membro.status === 'offline' : true)
    ).sort((a, b) => b.level - a.level);

    const contador = {
        RP: 0,
        ED: 0,
        EK: 0,
        MS: 0
    };

    for (const membro of membrosFiltrados) {
        const response = await fetch(`https://api.tibiadata.com/v4/character/${encodeURIComponent(membro.name)}`);
        const data = await response.json();
        const mortesPersonagem = data.character.deaths.filter(morte => new Date(morte.time) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

        for (const morte of mortesPersonagem) {
            const div = document.createElement('div');
            div.className = `membro-info ${membro.vocation.replace(' ', '')}`;
            div.innerHTML = `<span style="color: ${getVocationColor(membro.vocation)}; font-weight: bold;">${membro.name} - ${membro.vocation.replace('Royal Paladin', 'RP').replace('Elder Druid', 'ED').replace('Elite Knight', 'EK').replace('Master Sorcerer', 'MS')} - Level ${morte.level} - ${new Date(morte.time).toLocaleString()} - ${morte.reason}</span>`;
            resultados.appendChild(div);

            // Incrementa o contador da vocação
            const vocacaoAbreviada = membro.vocation.replace('Royal Paladin', 'RP').replace('Elder Druid', 'ED').replace('Elite Knight', 'EK').replace('Master Sorcerer', 'MS');
            contador[vocacaoAbreviada]++;
        }
    }

    // Exibe o contador de cada vocação
    for (const [vocacao, count] of Object.entries(contador)) {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${vocacao}:</strong> ${count}`;
        resultados.appendChild(div);
    }
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
