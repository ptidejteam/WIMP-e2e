import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class TestGen {
    public static String chatGPT(String message) {
        String url = "https://api.openai.com/v1/chat/completions";
        String apiKey = "sk-e63IzFtX0i3Ll6mnwsjHQEK06j24Fw--GT1vE29W1cT3BlbkFJWvFftkDoDy-3bIS6hKrGeNXXiUafaCQRU8Mm2zkGYA";
        String model = "gpt-4o-mini";
        try {
            URL obj = new URL(url);
            HttpURLConnection con = (HttpURLConnection) obj.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Authorization", "Bearer " + apiKey);
            con.setRequestProperty("Content-Type", "application/json");
            String body = "{\"model\":\"" + model + "\", \"messages\":[{\"role\":\"user\", \"content\":\"" + message + "\"}]}";
            con.setDoOutput(true);

            OutputStreamWriter writer = new OutputStreamWriter(con.getOutputStream());
            writer.write(body);
            writer.flush();
            writer.close();

            // Check the response code
            int responseCode = con.getResponseCode();
            if (responseCode != HttpURLConnection.HTTP_OK) {
                System.out.println("HTTP error code: " + responseCode);
                BufferedReader errorReader = new BufferedReader(new InputStreamReader(con.getErrorStream()));
                String errorLine;
                StringBuffer errorResponse = new StringBuffer();
                while ((errorLine = errorReader.readLine()) != null) {
                    errorResponse.append(errorLine);
                }
                errorReader.close();
                return "HTTP error: " + responseCode + " - " + errorResponse.toString();
            }

            // Get the response
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
            String content = jsonObject
                    .getAsJsonArray("choices")
                    .get(0)
                    .getAsJsonObject()
                    .getAsJsonObject("message")
                    .get("content")
                    .getAsString();
            return content;
        } catch (IOException e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    public static String readPromptFromFile(String filePath) {
        StringBuilder prompt = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                prompt.append(line).append("\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
        return prompt.toString().trim(); // Trim to remove any trailing newlines
    }

    public static void main(String[] args) {
        // Specify the path to the file containing the prompt
        String filePath = "prompt.txt"; // Update with your file's path
        String prompt = readPromptFromFile(filePath);

        if (prompt != null) {
            System.out.println("Prompt: " + prompt);
            System.out.println(chatGPT(prompt));
        } else {
            System.out.println("Failed to read prompt from file.");
        }
    }
}
