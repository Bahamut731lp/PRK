import sys
import pytest
from main import main
from antlr4 import InputStream

@pytest.mark.parametrize(
    ['file', 'expected'],
    [
        ("./src_tests/1.in-silico", True),
        ("./src_tests/2.in-silico", True),
        ("./src_tests/3.in-silico", True),
        ("./src_tests/4.in-silico", False),
        ("./src_tests/5.in-silico", False),
        ("./src_tests/6.in-silico", False)
    ]
)
def test_sources(file: str, expected: bool):
    # Arrange
    with open(file, 'r') as file:
        input_stream = InputStream(file.read())

    # Act
    with pytest.raises(SystemExit) as pytest_wrapped_e:
        sys.exit(main(input_stream))
    
    wasSuccessfull = pytest_wrapped_e.value.code == 0;    

    # Assert
    assert wasSuccessfull is expected