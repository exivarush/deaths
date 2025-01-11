       const forbiddenGuilds = [
            "Honbraland Encore",
            "Ourobra Encore",
            "Rasteibra Encore",
        ];

        async function searchGuild() {
            const guildName = document.getElementById("guildName").value;
            const resultList = document.getElementById("resultList");
            resultList.innerHTML = "";
            let onlineCount = 0;

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
                    const sortedMembers = data.guild.members.sort((a, b) => b.level - a.level);

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

                    sortedMembers.forEach(member => {
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
                        const vocationAbbreviation = vocationMap[member.vocation];
                        vocationCount[vocationAbbreviation]++;

                        const li = document.createElement("li");
                        if (member.status === "online") {
                            if (member.level > 250) {
                                switch (vocationAbbreviation) {
                                    case "RP":
                                        li.innerHTML = `<span style="color: orange; font-weight: bold;">Name: ${member.name} | ${vocationAbbreviation} - LVL: ${member.level}</span>`;
                                        break;
                                    case "MS":
                                        li.innerHTML = `<span style="color: red; font-weight: bold;">Name: ${member.name} | ${vocationAbbreviation} - LVL: ${member.level}</span>`;
                                        break;
                                    case "ED":
                                        li.innerHTML = `<span style="color: green; font-weight: bold;">Name: ${member.name} | ${vocationAbbreviation} - LVL: ${member.level}</span>`;
                                        break;
                                    case "EK":
                                        li.innerHTML = `<span style="color: black; font-weight: bold;">Name: ${member.name} | ${vocationAbbreviation} - LVL: ${member.level}</span>`;
                                        break;
                                    default:
                                        li.textContent = `Name: ${member.name} | ${vocationAbbreviation} - LVL: ${member.level}`;
                                }
                            } else {
                                li.textContent = `Name: ${member.name} | ${vocationAbbreviation} - LVL: ${member.level}`;
                            }
                            onlineCount++;
                            resultList.appendChild(li);
                            const onlineCountElement = document.getElementById("onlineCount");
                            onlineCountElement.textContent = `${onlineCount} membros online`;
                        }
                    });

                    const vocationList = document.createElement("ul");
                    for (const [vocation, count] of Object.entries(vocationCount)) {
                        const li = document.createElement("li");
                        li.textContent = `${vocation}: ${count}`;
                        switch (vocation) {
                            case "RP":
                                li.style.color = "orange";
                                break;
                            case "MS":
                                li.style.color = "red";
                                break;
                            case "ED":
                                li.style.color = "green";
                                break;
                            case "EK":
                                li.style.color = "black";
                                break;
                            default:
                                li.style.color = "gray";
                        }
                        vocationList.appendChild(li);
                    }
                    resultList.appendChild(vocationList);
                } else {
                    resultList.innerHTML = "<li>Nenhum membro encontrado.</li>";
                }
            } catch (error) {
                console.error("Erro:", error);
                alert(
                    "Não foi possível buscar os dados. Verifique o console para mais detalhes."
                );
            }
        }

        async function fetchAndFilterMembers() {
            const guildName = document.getElementById("guildName").value;
            const minLevel = document.getElementById("minLevel").value;
            const vocation = document.getElementById("vocation").value;

            const apiUrl = `https://api.tibiadata.com/v4/guild/${encodeURIComponent(guildName)}`; // Replace with your API URL
            let response = await fetch(apiUrl);
            if (!response.ok) {
                alert("Erro ao buscar dados da API.");
                return;
            }

            const data = await response.json();

            const filteredMembers = data.guild.members.filter((member) => {
                const meetsLevel = !minLevel || member.level >= parseInt(minLevel);
                const meetsVocation =
                    !vocation || member.vocation.toLowerCase() === vocation.toLowerCase();
                return (
                    member.status.toLowerCase() === "online" && meetsLevel && meetsVocation
                );
            });

            const vocationCount = {
                "Royal Paladin": 0,
                "Master Sorcerer": 0,
                "Elder Druid": 0,
                "Elite Knight": 0,
                Knight: 0,
                Sorcerer: 0,
                Druid: 0,
                Paladin: 0,
                None: 0,
            };

            const resultList = document.getElementById("resultList");
            resultList.innerHTML = "";

            if (filteredMembers.length === 0) {
                resultList.innerHTML =
                    "<li>Nenhum membro encontrado com os critérios.</li>";
            } else {
                filteredMembers.forEach((member) => {
                    const li = document.createElement("li");
                    if (member.level > 250) {
                        switch (member.vocation) {
                            case "Royal Paladin":
                                li.innerHTML = `<span style="color: orange; font-weight: bold;">${member.name} - Level: ${member.level}, Vocação: ${member.vocation}</span>`;
                                break;
                            case "Master Sorcerer":
                                li.innerHTML = `<span style="color: red; font-weight: bold;">${member.name} - Level: ${member.level}, Vocação: ${member.vocation}</span>`;
                                break;
                            case "Elder Druid":
                                li.innerHTML = `<span style="color: green; font-weight: bold;">${member.name} - Level: ${member.level}, Vocação: ${member.vocation}</span>`;
                                break;
                            case "Elite Knight":
                                li.innerHTML = `<span style="color: black; font-weight: bold;">${member.name} - Level: ${member.level}, Vocação: ${member.vocation}</span>`;
                                break;
                            default:
                                li.textContent = `${member.name} - Level: ${member.level}, Vocação: ${member.vocation}`;
                        }
                    } else {
                        li.textContent = `${member.name} - Level: ${member.level}, Vocação: ${member.vocation}`;
                    }
                    resultList.appendChild(li);
                    vocationCount[member.vocation]++;
                });

                const vocationList = document.createElement("ul");
                for (const [vocation, count] of Object.entries(vocationCount)) {
                    const li = document.createElement("li");
                    li.textContent = `${vocation}: ${count}`;
                    switch (vocation) {
                        case "Royal Paladin":
                            li.style.color = "orange";
                            break;
                        case "Master Sorcerer":
                            li.style.color = "Brown";
                            break;
                        case "Elder Druid":
                            li.style.color = "Blue";
                            break;
                        case "Elite Knight":
                            li.style.color = "black";
                            break;
                        default:
                            li.style.color = "gray";
                    }
                    vocationList.appendChild(li);
                }
                resultList.appendChild(vocationList);
            }
        }

        function fetchDeaths(member, deathsDiv) {
            if (member.level > 250) {
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

        function
