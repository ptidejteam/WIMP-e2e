import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

// Handles reading the prompt from a file
class PromptReader {
    private String filePath;

    public PromptReader(String filePath) {
        this.filePath = filePath;
    }

    public String readPrompt() {
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
}