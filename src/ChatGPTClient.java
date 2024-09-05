import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

// Handles communication with the OpenAI API
class ChatGPTClient {
    private String apiKey;
    private String model;

    public ChatGPTClient(String apiKey, String model) {
        this.apiKey = apiKey;
        this.model = model;
    }

    public String getChatGPTResponse(String message) {
        String url = "https://api.openai.com/v1/chat/completions";
        try {
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Authorization", "Bearer " + this.apiKey);
            con.setRequestProperty("Content-Type", "application/json");
            String body = "{\"model\":\"" + this.model + "\", \"messages\":[{\"role\":\"user\", \"content\":\"" + message + "\"}]}";
            con.setDoOutput(true);

            OutputStreamWriter writer = new OutputStreamWriter(con.getOutputStream());
            writer.write(body);
            writer.flush();
            writer.close();

            // Check the response code
            int responseCode = con.getResponseCode();
            if (responseCode != HttpURLConnection.HTTP_OK) {
                System.out.println("HTTP error code: " + responseCode);
                return handleErrorResponse(con);
            }

            // Get and parse the response
            return parseResponse(con);
        } catch (IOException e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    private String handleErrorResponse(HttpURLConnection con) throws IOException {
        BufferedReader errorReader = new BufferedReader(new InputStreamReader(con.getErrorStream()));
        String errorLine;
        StringBuffer errorResponse = new StringBuffer();
        while ((errorLine = errorReader.readLine()) != null) {
            errorResponse.append(errorLine);
        }
        errorReader.close();
        return "HTTP error: " + con.getResponseCode() + " - " + errorResponse.toString();
    }

    private String parseResponse(HttpURLConnection con) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();
        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();
        Gson gson = new Gson();
        JsonObject jsonObject = JsonParser.parseString(response.toString()).getAsJsonObject();

        // Navigate to the content field
        return jsonObject.getAsJsonArray("choices")
                .get(0)
                .getAsJsonObject()
                .getAsJsonObject("message")
                .get("content")
                .getAsString();
    }
}