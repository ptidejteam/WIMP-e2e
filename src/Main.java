// The main application class to orchestrate everything
public class Main {
    public static void main(String[] args) {
        // File path where the prompt is stored
        String filePath = "prompt.txt";  // Update with the correct file path
        String apiKey = "sk-e63IzFtX0i3Ll6mnwsjHQEK06j24Fw--GT1vE29W1cT3BlbkFJWvFftkDoDy-3bIS6hKrGeNXXiUafaCQRU8Mm2zkGYA";
        // Create objects
        PromptReader promptReader = new PromptReader(filePath);
        ChatGPTClient chatGPTClient = new ChatGPTClient(apiKey, "gpt-4o-mini");

        // Read the prompt
        String prompt = promptReader.readPrompt();
        if (prompt != null) {
            System.out.println("Prompt: " + prompt);

            // Get and print the response from ChatGPT
            String response = chatGPTClient.getChatGPTResponse(prompt);
            System.out.println("Response: " + response);
        } else {
            System.out.println("Failed to read prompt from file.");
        }
    }
}