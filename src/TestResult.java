public class TestResult {
    private int total;
    private int correct;
    private int incorrect;

    // Constructor to initialize the test result
    public TestResult(int total, int correct, int incorrect) {
        this.total = total;
        this.correct = correct;
        this.incorrect = incorrect;
    }

    // Getter for total test cases
    public int getTotal() {
        return total;
    }

    // Setter for total test cases
    public void setTotal(int total) {
        this.total = total;
    }

    // Getter for correct test cases
    public int getCorrect() {
        return correct;
    }

    // Setter for correct test cases
    public void setCorrect(int correct) {
        this.correct = correct;
    }

    // Getter for incorrect test cases
    public int getIncorrect() {
        return incorrect;
    }

    // Setter for incorrect test cases
    public void setIncorrect(int incorrect) {
        this.incorrect = incorrect;
    }

    // A method to display the test result in a readable format
    @Override
    public String toString() {
        return "TestResult{" +
                "total=" + total +
                ", correct=" + correct +
                ", incorrect=" + incorrect +
                '}';
    }
}
