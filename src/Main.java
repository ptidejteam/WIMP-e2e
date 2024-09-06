import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.Map;

// Import Tools4AI Optimizer class (adjust import path according to your package structure)
import com.t4a.annotations.Prompt;
import com.t4a.predict.OpenAIPromptTransformer;
// The main application class to orchestrate everything
    public class Main {
        public static void main(String[] args) {
            // File path where the prompt is stored
            String[] files =  new String[] { "usc1.txt" , "usc2.txt","usc3.txt"};  // Update with the correct file path
            String apiKey = "sk-e63IzFtX0i3Ll6mnwsjHQEK06j24Fw--GT1vE29W1cT3BlbkFJWvFftkDoDy-3bIS6hKrGeNXXiUafaCQRU8Mm2zkGYA";
            // Create objects

            for (String file: files
                 ) {
                PromptReader promptReader = new PromptReader(file);
                ChatGPTClient chatGPTClient = new ChatGPTClient(apiKey, "gpt-4o-mini");

                // Read the prompt
                String prompt = promptReader.readPrompt();
                if (prompt != null) {
                    System.out.println("Prompt: " + prompt);
                    // Optimize the prompt using Tools4AI
                    System.out.println("Optimized Prompt: " + prompt);

                    // Prepare the message in the expected format
                    List<Map<String, String>> messages = List.of(
                            Map.of("role", "user", "content", prompt)
                    );

                    // Get and print the response from ChatGPT
                    String response = chatGPTClient.getChatGPTResponse(messages);
                    System.out.println("Response: " + response);
                    // Save response to a file
                    try {
                        String fileNameWithoutExtension = file.substring(0, file.lastIndexOf('.'));

                        FileWriter writer = new FileWriter( fileNameWithoutExtension+"_response.txt");
                        writer.write(response);
                        writer.close();
                        System.out.println("Response saved to chatgpt_response.txt");
                    } catch (IOException e) {
                        System.out.println("An error occurred while saving the response.");
                        e.printStackTrace();
                    }


                } else {
                    System.out.println("Failed to read prompt from file.");
                }

            }

        }
    // Method to optimize the prompt using Tools4AI
    // Method to optimize the prompt using Tools4AI


}
