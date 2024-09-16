import java.util.List;
import java.util.Map;

public class GPTResponseEvaluator {
    private ChatGPTClient chatGPTClient;

    public GPTResponseEvaluator(String apiKey) {
        // Initialize with any GPT model you prefer to use for evaluation (could be GPT-4, etc.)
        this.chatGPTClient = new ChatGPTClient(apiKey, "gpt-4");
    }

    /**
     * Evaluates the model's response against the correct test case.
     *
     * @param modelResponse The response from the GPT model being evaluated.
     * @param expectedResponse The correct expected response.
     * @return true if the model response is correct, false otherwise.
     */
    public boolean evaluateResponse(String modelResponse, String expectedResponse) {
        // Prepare the prompt for GPT evaluation
        String evaluationPrompt = "I have two responses. Please check if the first response matches the second one.\n\n"
                + "Response 1: " + modelResponse + "\n\n"
                + "Response 2: " + expectedResponse + "\n\n"
                + "Answer with 'correct' or 'incorrect'.";

        // Prepare the message for GPT
        List<Map<String, String>> messages = List.of(
                Map.of("role", "user", "content", evaluationPrompt)
        );

        // Get the response from GPT
        String evaluationResponse = chatGPTClient.getChatGPTResponse(messages);

        // Check if GPT's response contains "correct"
        return evaluationResponse.toLowerCase().contains("correct");
    }
}
