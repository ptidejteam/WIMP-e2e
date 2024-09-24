import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Main {

    private static Map<String, String> cache = new HashMap<>();  // Cache to store responses

    public static void main(String[] args) {
        // File path where the prompt is stored
        String[] files = new String[]{"usc1-sample.txt"};  // Update with the correct file path
        String[] models = new String[]{"gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"};
        String apiKey = "put_your_own_key"; // Use a valid API key

        // Number of iterations
        int maxIterations = 1;

        // Create a folder for refined prompts if it doesn't exist
        String promptFolderPath = "prompts";
        File promptFolder = new File(promptFolderPath);
        if (!promptFolder.exists()) {
            promptFolder.mkdir();  // Create the folder if it doesn't exist
        }

        for (String file : files) {
            PromptReader promptReader = new PromptReader(file);

            // Read the prompt
            String initialPrompt = promptReader.readPrompt();
            if (initialPrompt != null) {
                System.out.println("Initial Prompt: " + initialPrompt);
                generateAndRefineResponses(apiKey, models, initialPrompt, maxIterations, promptFolderPath, file);
            } else {
                System.out.println("Failed to read prompt from file.");
            }
        }
    }

    private static void generateAndRefineResponses(String apiKey, String[] models, String initialPrompt, int maxIterations, String promptFolderPath, String file) {
        String currentPrompt = initialPrompt;
        int iteration = 0;
        int previousTestCaseCount = 0; // Track the number of test cases in previous responses

        // List to track iteration metrics
        List<IterationMetrics> iterationMetricsList = new ArrayList<>();

        while (iteration < maxIterations) {
            // Generate cache key from prompt
            String cacheKey = generateCacheKey(currentPrompt);

            // Check if the response is already cached
            String response = cache.get(cacheKey);
            if (response == null) {
                // Prepare the message in the expected format
                List<Map<String, String>> messages = List.of(
                        Map.of("role", "user", "content", currentPrompt)
                );

                // Capture the start time
                long startTime = System.currentTimeMillis();

                // Generate responses for each model
                for (String model : models) {
                    ChatGPTClient chatGPTClient = new ChatGPTClient(apiKey, model);

                    // Fetch response from GPT API
                    response = chatGPTClient.getChatGPTResponse(messages);

                    // Capture the end time
                    long endTime = System.currentTimeMillis();
                    long timeSpent = endTime - startTime;

                    // Add execution time to the response
                    response += "\nTime Spent = " + timeSpent + "ms";

                    // Store the response in the cache
                    cache.put(cacheKey, response);

                    // Print the response and time spent
                    System.out.println("Response for model " + model + " - iteration " + (iteration + 1) + ": " + response);

                    // Save the response to a file after each iteration
                    saveResponseToFile(response, model, file, iteration);
                }
            }

            // Extract test case count from the response
            int currentTestCaseCount = extractTestCaseCount(response);

            // Track iteration metrics
            iterationMetricsList.add(new IterationMetrics(iteration + 1, response, extractTimeSpent(response), currentTestCaseCount));

            // Update the previous test case count and refine the prompt using GPT-4o
            previousTestCaseCount = currentTestCaseCount;
            currentPrompt = refinePromptWithGPT4o(currentPrompt, response, apiKey);

            // Save the refined prompt to the prompts folder
            saveRefinedPrompt(currentPrompt, promptFolderPath, iteration ,file);

            iteration++;
        }

        // Print recapitulatory table
        printRecapitulatoryTable(iterationMetricsList);
    }

    // Method to save the response to a file after each iteration
    private static void saveResponseToFile(String response, String model, String file, int iteration) {
        // Create a folder for the model
        String modelFolderPath = model + "_responses";
        File modelFolder = new File(modelFolderPath);
        if (!modelFolder.exists()) {
            modelFolder.mkdir();  // Create the folder if it doesn't exist
        }

        // Save the response to a file in the model's folder
        try {
            String fileNameWithoutExtension = file.substring(0, file.lastIndexOf('.'));
            // Format for the current date and time
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
            String currentTime = sdf.format(new Date());
            // File path for saving the response
            String filePath = modelFolderPath + "/" + fileNameWithoutExtension + "_" + iteration + "_" + currentTime + "_response.txt";

            FileWriter writer = new FileWriter(filePath);
            writer.write(response);
            writer.close();
            System.out.println("Response saved to " + filePath);
        } catch (IOException e) {
            System.out.println("An error occurred while saving the response.");
            e.printStackTrace();
        }
    }

    // Method to save the refined prompt to the 'prompts' folder
    private static void saveRefinedPrompt(String prompt, String promptFolderPath, int iteration , String file) {
        try {
            // Format the file name with the iteration number and timestamp
            String fileNameWithoutExtension = file.substring(0, file.lastIndexOf('.'));
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
            String currentTime = sdf.format(new Date());
            String fileName = promptFolderPath + "/"+ fileNameWithoutExtension +"_refined_prompt_" + iteration + "_" + currentTime + ".txt";

            // Write the prompt to the file
            FileWriter writer = new FileWriter(fileName);
            writer.write(prompt);
            writer.close();

            System.out.println("Refined prompt saved to " + fileName);
        } catch (IOException e) {
            System.out.println("An error occurred while saving the refined prompt.");
            e.printStackTrace();
        }
    }

    // Method to evaluate the response based on test case count and iterations
    private static boolean evaluateResponse(int previousTestCaseCount, int currentTestCaseCount) {
        // Check if the increase in test cases is within the allowed limit
        return (currentTestCaseCount - previousTestCaseCount >= 8) ;
    }

    // Method to extract the number of test cases from the response
    private static int extractTestCaseCount(String response) {
        int payloadCount = 0;

        // Updated pattern to capture JSON blocks inside ```json sections
        String jsonPattern = "```json(.*?)```";

        // Remove newlines and collapse spaces in the response to handle multi-line JSON properly
        response = response.replaceAll("\\n", " ").replaceAll("\\s+", " ");

        Pattern pattern = Pattern.compile(jsonPattern, Pattern.DOTALL);
        Matcher matcher = pattern.matcher(response);

        // Loop through all matches (JSON blocks)
        while (matcher.find()) {
            String jsonBlock = matcher.group(1).trim(); // Extract content between ```json ... ```

            try {
                // Try to parse the matched JSON block
                JSONObject jsonObject = new JSONObject(jsonBlock);

                // Check if the JSON object contains the "TC_ID" field
                if (jsonObject.has("\"TC_ID\"")) {
                    payloadCount++;
                }

            } catch (JSONException e) {
                // If parsing fails, skip the block
                continue;
            }
        }

        return payloadCount;
    }

    // Method to refine the prompt based on the response using GPT-4o
    private static String refinePromptWithGPT4o(String prompt, String response, String apiKey) {
        // Use GPT-4o model for refinement
        ChatGPTClient chatGPTClient = new ChatGPTClient(apiKey, "gpt-4o");
        String gptRefinementPrompt = """
        Please refine the original prompt based on the given response to achieve more results. Make the enhanced prompt clearer, more precise, and structured to elicit a comprehensive, high-quality response. Return only the improved version of the original prompt and include all the details from previous prompts.
        
        
        Original Prompt: %s
        Response: %s
        
        Please refine the prompt and please keep all details from the previous Original prompt:
        """.formatted(prompt, response);

        // Fetch refinement from GPT API
        List<Map<String, String>> refinementMessages = List.of(
                Map.of("role", "user", "content", gptRefinementPrompt)
        );
        String refinementResponse = chatGPTClient.getChatGPTResponse(refinementMessages);

        // Assuming the GPT response gives a refined prompt directly
        return refinementResponse.trim();
    }

    // Method to generate a cache key from the prompt
    private static String generateCacheKey(String prompt) {
        return Integer.toHexString(prompt.hashCode());
    }

    // Method to print the recapitulatory table
    private static void printRecapitulatoryTable(List<IterationMetrics> iterationMetricsList) {
        System.out.println("\nRecapitulatory Table:");
        System.out.printf("%-10s %-15s %-15s %-15s%n", "Iteration", "Time Spent (ms)", "Payload Count", "Total Payloads");

        int totalPayloads = 0;

        for (IterationMetrics metrics : iterationMetricsList) {
            totalPayloads += metrics.getPayloadCount();
            System.out.printf("%-10d %-15d %-15d %-15d%n", metrics.getIteration(), metrics.getTimeSpent(), metrics.getPayloadCount(), totalPayloads);
        }
    }

    // Class to store iteration metrics
    private static class IterationMetrics {
        private final int iteration;
        private final String response;
        private final long timeSpent;
        private final int payloadCount;

        public IterationMetrics(int iteration, String response, long timeSpent, int payloadCount) {
            this.iteration = iteration;
            this.response = response;
            this.timeSpent = timeSpent;
            this.payloadCount = payloadCount;
        }

        public int getIteration() {
            return iteration;
        }

        public long getTimeSpent() {
            return timeSpent;
        }

        public int getPayloadCount() {
            return payloadCount;
        }
    }

    // Method to extract time spent from the response
    private static long extractTimeSpent(String response) {
        // Extract time spent from response
        String timeSpentPattern = "Time Spent = (\\d+)ms";
        Pattern pattern = Pattern.compile(timeSpentPattern);
        Matcher matcher = pattern.matcher(response);

        if (matcher.find()) {
            return Long.parseLong(matcher.group(1));
        }

        return 0; // Default to 0 if time spent is not found
    }
}
