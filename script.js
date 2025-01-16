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
    (levelMin === '' || membro.level >= levelMin) &&
    (vocation === '' || membro.vocation.replace(' ', '') === vocation) &&
    (offlineOnly ? membro.status === 'offline' : membro.status === 'online')).sort((a, b) => b.level - a.level);

    for (const membro of membrosFiltrados) {
        const response = await fetch(`https://api.tibiadata.com/v4/character/${encodeURIComponent(membro.name)}`);
        const data = await response.json();
        const mortesPersonagem = data.character.deaths.filter(morte => new Date(morte.time) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

        for (const morte of mortesPersonagem) {
            const div = document.createElement('div');
            div.className = membro.vocation.replace(' ', '');
            div.innerHTML = `<span style="color: ${getVocationColor(membro.vocation)}; font-weight: bold;">${membro.name} - ${membro.vocation.replace('Royal Paladin', 'RP').replace('Elder Druid', 'ED').replace('Elite Knight', 'EK').replace('Master Sorcerer', 'MS')} - Level ${morte.level} - ${new Date(morte.time).toLocaleString()} - ${morte.reason}</span>`;
            resultados.appendChild(div);
        }
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

