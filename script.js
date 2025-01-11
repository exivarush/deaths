import javax.swing.*;
import java.awt.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;
import org.json.JSONArray;
import org.json.JSONObject;

public class GuildSearchApp {
    private static JTextField guildNameField;
    private static JTextArea resultsArea;

    public static void main(String[] args) {
        JFrame frame = new JFrame("Pesquisa de Guild");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(400, 600);

        guildNameField = new JTextField(20);
        JButton searchButton = new JButton("Pesquisar");
        resultsArea = new JTextArea();
        resultsArea.setEditable(false);

        searchButton.addActionListener(e -> searchGuild());

        JPanel panel = new JPanel();
        panel.add(new JLabel("Nome da Guild:"));
        panel.add(guildNameField);
        panel.add(searchButton);

        frame.getContentPane().add(panel, BorderLayout.NORTH);
        frame.getContentPane().add(new JScrollPane(resultsArea), BorderLayout.CENTER);

        frame.setVisible(true);
    }

    private static void searchGuild() {
        String guildName = guildNameField.getText();
        String apiUrl = "https://api.tibiadata.com/v4/guild/" + guildName; // Substitua pela URL real da API

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .build();

        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(GuildSearchApp::parseResponse)
                .join();
    }

    private static Void parseResponse(String responseBody) {
        JSONObject json = new JSONObject(responseBody);
        JSONObject character = json.getJSONObject("character");
        JSONArray deaths = character.getJSONArray("deaths");

        List<JSONObject> sortedCharacters = new ArrayList<>();
        sortedCharacters.add(character);

        sortedCharacters.sort((a, b) -> b.getInt("level") - a.getInt("level"));

        resultsArea.setText("");
        for (JSONObject charInfo : sortedCharacters) {
            String name = charInfo.getString("name");
            int level = charInfo.getInt("level");
            String vocation = charInfo.getString("vocation");
            JSONArray charDeaths = charInfo.getJSONArray("deaths");

            String vocationShort = switch (vocation) {
                case "Master Sorcerer" -> "MS";
                case "Royal Paladin" -> "RP";
                case "Elder Druid" -> "ED";
                case "Elite Knight" -> "EK";
                default -> vocation;
            };

            String nameColor = "black";
            if (level > 250) {
                nameColor = switch (vocationShort) {
                    case "ED" -> "blue";
                    case "MS" -> "brown";
                    case "RP" -> "orange";
                    case "EK" -> "black";
                    default -> "black";
                };
            }

            resultsArea.append("<html><strong>Nome:</strong> <span style='color: " + nameColor + ";'>" + name + "</span><br>");
            resultsArea.append("<strong>Level:</strong> " + level + "<br>");
            resultsArea.append("<strong>Vocation:</strong> " + vocationShort + "<br>");
            resultsArea.append("<strong>Guild:</strong> " + (charInfo.getJSONObject("guild").has("name") ? charInfo.getJSONObject("guild").getString("name") : "N/A") + "<br>");
            resultsArea.append("<strong>Deaths:</strong> ");

            for (int i = 0; i < charDeaths.length(); i++) {
                JSONObject death = charDeaths.getJSONObject(i);
                resultsArea.append(death.getString("reason"));
                if (i < charDeaths.length() - 1) {
                    resultsArea.append(", ");
                }
            }
            resultsArea.append("<br><br></html>");
        }
        return null;
    }
}
