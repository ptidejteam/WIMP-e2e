import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    // Method to get the response from ChatGPT
    public String getChatGPTResponse(List<Map<String, String>> messages) {
        String url = "https://api.openai.com/v1/chat/completions";
        try {
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Authorization", "Bearer " + this.apiKey);
            con.setRequestProperty("Content-Type", "application/json");

            // Use Jackson ObjectMapper to create the JSON body
            ObjectMapper objectMapper = new ObjectMapper();
            String body = objectMapper.writeValueAsString(Map.of(
                    "model", this.model,
                    "messages", messages
            ));

            con.setDoOutput(true);
            try (OutputStream os = con.getOutputStream()) {
                byte[] input = body.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

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