const forbiddenGuilds = [
            "Honbraland Encore",
            "Ourobra Encore",
            "Rasteibra Encore",
        ];

        async function searchGuild() 
            {
            const guildName = document.getElementById("guildName").value;
            const resultList = document.getElementById("resultList");
            resultList.innerHTML = "";

            if (!guildName) {
                alert("Por favor, digite o nome da guild!");
                return;
            } else if (forbiddenGuilds.includes(guildName)) {
                alert(`A guild "${guildName}" não pode ser buscada.`);
                return;
            }

            try {
                const response = await fetch(
                    `https://api.tibiadata.com/v4/guild/${encodeURIComponent(guildName)}`
                );

                if (!response.ok) {
                    throw new Error("Erro ao buscar dados da API");
                }

                const data = await response.json();
                if (data.guild && data.guild.members && data.guild.members.length > 0) {
                    processMembers(data.guild.members);
                } else {
                    resultList.innerHTML = "<li>Nenhum membro encontrado.</li>";
                }
            } catch (error) {
                console.error("Erro:", error);
                alert("Não foi possível buscar os dados. Verifique o console para mais detalhes.");
            }
        }

        function processMembers(members) {
            const resultList = document.getElementById("resultList");
            const onlineCountElement = document.getElementById("onlineCount");
            const minLevel = parseInt(document.getElementById("minLevel").value) || 0;
            const vocationFilter = document.getElementById("vocation").value;

            const sortedMembers = members.sort((a, b) => b.level - a.level);
            const vocationCount = {
                EK: 0,
                MS: 0,
                ED: 0,
                RP: 0,
                K: 0,
                S: 0,
                D: 0,
                P: 0,
                N: 0,
            };

            let onlineCount = 0;

            sortedMembers.forEach(member => {
                const vocationAbbreviation = getVocationAbbreviation(member.vocation);
                vocationCount[vocationAbbreviation]++;

                if (member.status === "online" && member.level >= minLevel && (!vocationFilter || member.vocation.toLowerCase() === vocationFilter.toLowerCase())) {
                    const li = document.createElement("li");
                    li.innerHTML = getMemberHTML(member, vocationAbbreviation);
                    fetchDeaths(member, li);
                    resultList.appendChild(li);
                    onlineCount++;
                }
            });

            onlineCountElement.textContent = `${onlineCount} membros online`;
            resultList.appendChild(createVocationList(vocationCount));
        }

        function getVocationAbbreviation(vocation) {
            const vocationMap = {
                Knight: "K",
                "Elite Knight": "EK",
                Sorcerer: "S",
                "Master Sorcerer": "MS",
                Druid: "D",
                "Elder Druid": "ED",
                Paladin: "P",
                "Royal Paladin": "RP",
                None: "N",
            };
            return vocationMap[vocation] || vocation;
        }

        function getMemberHTML(member, vocationAbbreviation) {
            const colorMap = {
                RP: "orange",
                MS: "red",
                ED: "green",
                EK: "black",
            };
            const color = member.level > 250 ? colorMap[vocationAbbreviation] || "gray" : "black";
            return `<span style="color: ${color}; font-weight: bold;">Name: ${member.name} | ${vocationAbbreviation} - LVL: ${member.level}</span>`;
        }

        async function searchDeaths(level, vocation) { const apiUrl = `https://api.tibiadata.com/v4/characters/deaths?level=${level}&vocation=${vocation}`; 
            try { const response = await fetch(apiUrl); if (!response.ok) { throw new Error("Erro ao buscar dados da API"); } 
            const data = await response.json(); console.log(data); 
             } catch (error) { console.error("Erro:", error); alert("Não foi possível buscar os dados. Verifique o console para mais detalhes."); 
                             } 
            }
            function processMembers(members) {
    const resultList = document.getElementById("resultList");

    members.forEach(member => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `Name: ${member.name} | Level: ${member.level}`;
        resultList.appendChild(listItem);

        fetchDeaths(member, listItem); // Passando `listItem` como argumento para `fetchDeaths`
    });
}

function fetchDeaths(member, listItem) {
    if (member.level > 250) {
        const deathsDiv = document.createElement("ul");
        listItem.appendChild(deathsDiv);

        // Simulando dados de mortes
        const deaths = [
            { reason: "killed by a dragon", time: "2025-01-10T12:30:00Z" },
            { reason: "killed by a troll", time: "2025-01-09T09:15:00Z" }
        ];

        const now = new Date();
        const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        const recentDeaths = deaths.filter(death => new Date(death.time) >= twoDaysAgo);
                function processMembers(members) {
    const resultList = document.getElementById("resultList");

    members.forEach(member => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `Name: ${member.name} | Level: ${member.level}`;
        resultList.appendChild(listItem);

        fetchDeaths(member, listItem); // Passando `listItem` como argumento para `fetchDeaths`
    });
}
function fetchDeaths(member, listItem) {
    if (member.level > 250) {
        const deathsDiv = document.createElement("ul");
        listItem.appendChild(deathsDiv);

        const now = new Date();
        const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
        const recentDeaths = member.deaths.filter(death => new Date(death.time) >= twoDaysAgo);

        if (recentDeaths.length > 0) {
            recentDeaths.forEach(death => {
                const deathItem = document.createElement("li");
                deathItem.innerHTML = `Motivo: ${death.reason}`;
                deathsDiv.appendChild(deathItem);
            });
        } else {
            const noDeathItem = document.createElement("li");
            noDeathItem.textContent = "Nenhuma morte nas últimas 48 horas";
            deathsDiv.appendChild(noDeathItem);
        }
    }
}

function createVocationList(vocationCount) {
    const colorMap = {
        RP: "orange",
        MS: "red",
        ED: "green",
        EK: "black",
        default: "gray",
    };
    const vocationList = document.createElement("ul");

    for (const [vocation, count] of Object.entries(vocationCount)) {
        const li = document.createElement("li");
        li.textContent = `${vocation}: ${count}`;
        li.style.color = colorMap[vocation] || colorMap.default;
        vocationList.appendChild(li);
    }
    return vocationList;}
