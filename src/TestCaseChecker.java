import java.util.List;
import java.util.Map;

public class TestCaseChecker {
    private GPTResponseEvaluator evaluator;

    public TestCaseChecker(String apiKey) {
        this.evaluator = new GPTResponseEvaluator(apiKey);
    }

    /**
     * Checks the model's response against a list of test cases.
     *
     * @param modelResponse The response from the model being tested.
     * @param testCaseFile The file containing the expected test cases.
     * @return TestResult object containing the total, correct, and incorrect counts.
     */
    public TestResult checkResponse(String modelResponse, String testCaseFile) {
        // Simulate reading expected responses from the test case file (this should be actual file reading logic)
        List<String> expectedResponses = List.of("expected response 1", "expected response 2", "expected response 3");

        int total = expectedResponses.size();
        int correct = 0;

        // For each expected response, evaluate the model's response using GPT
        for (String expectedResponse : expectedResponses) {
            boolean isCorrect = evaluator.evaluateResponse(modelResponse, expectedResponse);
            if (isCorrect) {
                correct++;
            }
        }

        int incorrect = total - correct;

        return new TestResult(total, correct, incorrect);
    }
}
