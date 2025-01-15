const forbiddenGuilds = [
            "Honbraland Encore",
            "Ourobra Encore",
            "Rasteibra Encore",
        ];
async function fetchGuildData() {
    const guildName = document.getElementById('guildName').value;
    const response = await fetch(`https://api.tibiadata.com/v4/guild/${encodeURIComponent(guildName)}`);
    const data = await response.json();
    const members = data.guild.members;
    const onlineMembers = members.filter(member => member.status === 'online');
    const tableBody = document.querySelector('#guildTable tbody');
    tableBody.innerHTML = '';

    onlineMembers.sort((a, b) => b.level - a.level).forEach(member => {
        const row = document.createElement('tr');
        row.classList.add(getVocationClass(member.vocation));
        row.innerHTML = `
            <td>${member.name}</td>
            <td><strong>${getVocationAbbreviation(member.vocation)}</strong></td>
            <td>${member.level}</td>
            <td>${member.status}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('onlineCount').innerText = `Total de vocações online: ${onlineMembers.length}`;
}

function getVocationClass(vocation) {
    switch (vocation) {
        case 'Royal Paladin': return 'RP';
        case 'Elder Druid': return 'ED';
        case 'Elite Knight': return 'EK';
        case 'Master Sorcerer': return 'MS';
        default: return '';
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
