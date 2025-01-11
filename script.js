 async function searchGuild() {
            const guildName = document.getElementById('guildName').value;
            const response = await fetch(`https://api.tibiadata.com/v4/guild/${encodeURIComponent(guildName)}`);
            const data = await response.json();
            displayGuildInfo(data.character);
        }

        function displayGuildInfo(character) {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            const sortedData = [character].sort((a, b) => b.level - a.level);

            sortedData.forEach(char => {
                const { name, level, vocation, deaths } = char;

                let vocationShort = vocation;
                if (vocation === "Master Sorcerer") {
                    vocationShort = "MS";
                } else if (vocation === "Royal Paladin") {
                    vocationShort = "RP";
                } else if (vocation === "Elder Druid") {
                    vocationShort = "ED";
                } else if (vocation === "Elite Knight") {
                    vocationShort = "EK";
                }

                let nameColor = "black";
                if (level > 250) {
                    if (vocationShort === "ED") {
                        nameColor = "blue";
                    } else if (vocationShort === "MS") {
                        nameColor = "brown";
                    } else if (vocationShort === "RP") {
                        nameColor = "orange";
                    } else if (vocationShort === "EK") {
                        nameColor = "black";
                    }
                }

                const charDiv = document.createElement('div');
                charDiv.innerHTML = `<strong>Nome:</strong> <span style="color: ${nameColor};">${name}</span> <br> 
                                     <strong>Level:</strong> ${level} <br> 
                                     <strong>Vocation:</strong> ${vocationShort} <br>
                                     <strong>Guild:</strong> ${char.guild ? char.guild.name : 'N/A'} <br>
                                     <strong>Deaths:</strong> ${deaths.map(death => `${death.reason}`).join(', ')}`;
                resultsDiv.appendChild(charDiv);
            });
        }
