import com.t4a.annotations.Predict;
import com.t4a.api.JavaMethodAction;


@Predict(actionName = "BuildMyTestCase", description = "", groupName = "buildTestCases", groupDescription = "This is test cases")

public class TestCaseAction implements JavaMethodAction {
    public TestCase BuildMyTestCase(TestCase tc){
        return tc;
    }
}