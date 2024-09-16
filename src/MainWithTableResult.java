import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

// Import Tools4AI Optimizer class (adjust import path according to your package structure)
import com.t4a.annotations.Prompt;
import com.t4a.predict.OpenAIPromptTransformer;

public class MainWithTableResult {
    public static void main(String[] args) {
        // File path where the prompt is stored
        String[] files = new String[]{"usc1-initial.txt", "usc2.txt", "usc3.txt"};  // Test case files
        String[] models = new String[]{"gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"};
        String apiKey = "sk-e63IzFtX0i3Ll6mnwsjHQEK06j24Fw--GT1vE29W1cT3BlbkFJWvFftkDoDy-3bIS6hKrGeNXXiUafaCQRU8Mm2zkGYA"; // Use a valid API key

        // Number of iterations
        int NofIt = 3;

        // Table to hold test results
        String[][] resultTable = new String[models.length * NofIt][9]; // 9 columns for each iteration

        int tableIndex = 0; // Index to store the current row in the table

        for (int i = 0; i < NofIt; i++) {
            for (String file : files) {
                PromptReader promptReader = new PromptReader(file);

                // Read the prompt
                String prompt = promptReader.readPrompt();
                if (prompt != null) {
                    System.out.println("Prompt: " + prompt);

                    for (String model : models) {
                        ChatGPTClient chatGPTClient = new ChatGPTClient(apiKey, model);

                        // Prepare the message in the expected format
                        List<Map<String, String>> messages = List.of(
                                Map.of("role", "user", "content", prompt)
                        );

                        // Capture the start time
                        long startTime = System.currentTimeMillis();

                        // Simulating the response retrieval process
                        String response = chatGPTClient.getChatGPTResponse(messages);

                        // Capture the end time
                        long endTime = System.currentTimeMillis();
                        long timeSpent = endTime - startTime;

                        // Store the time spent in the table
                        resultTable[tableIndex][8] = String.valueOf(timeSpent); // Execution Time column

                        // Check the response using TestCaseChecker
                        TestCaseChecker checker = new TestCaseChecker(apiKey);
                        TestResult testResult = checker.checkResponse(response, file);

                        // Fill in the table with test results
                        resultTable[tableIndex][0] = model + " Iteration " + (i + 1);
                        resultTable[tableIndex][1] = String.valueOf(testResult.getTotal());     // Total test cases
                        resultTable[tableIndex][2] = String.valueOf(testResult.getCorrect());   // Correct test cases
                        resultTable[tableIndex][3] = String.valueOf(testResult.getIncorrect()); // Incorrect test cases

                        // Save the response to a file in the model's folder
                        try {
                            String fileNameWithoutExtension = file.substring(0, file.lastIndexOf('.'));
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd_HHmmss");
                            String currentTime = sdf.format(new Date());
                            String modelFolderPath = model + "_responses";
                            File modelFolder = new File(modelFolderPath);
                            if (!modelFolder.exists()) {
                                modelFolder.mkdir();  // Create the folder if it doesn't exist
                            }

                            String filePath = modelFolderPath + "/" + fileNameWithoutExtension + "_" + currentTime + "_response.txt";
                            FileWriter writer = new FileWriter(filePath);
                            writer.write(response);
                            writer.close();
                            System.out.println("Response saved to " + filePath);
                        } catch (IOException e) {
                            System.out.println("An error occurred while saving the response.");
                            e.printStackTrace();
                        }

                        tableIndex++; // Move to the next row for the next model and iteration
                    }

                } else {
                    System.out.println("Failed to read prompt from file.");
                }
            }
        }

        // Print the table or save to a file
        printResultTable(resultTable);
    }

    // Method to print the result table
    public static void printResultTable(String[][] table) {
        System.out.println("Model\t\tTotal\tCorrect\tIncorrect\tExecution Time (ms)");
        for (String[] row : table) {
            System.out.println(String.join("\t", row));
        }
    }
}
