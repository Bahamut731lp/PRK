import logging
import sys
import argparse
import pathlib

from antlr4 import *
from src.syntaxerrorhandler import SyntaxErrorListener
from src.in_silicoLexer import in_silicoLexer
from src.in_silicoParser import in_silicoParser
from src.evaluator import EvalVisitor

def main(input_stream: str):
    lexer = in_silicoLexer(input_stream)
    stream = CommonTokenStream(lexer)
    parser = in_silicoParser(stream)

    error_listener = SyntaxErrorListener()
    parser.removeErrorListeners() 
    parser.addErrorListener(error_listener)

    tree = parser.program()
    
    # Check for syntax errors
    if error_listener.errors:
        for error in error_listener.errors:
            logging.error(error)
        return 1

    visitor = EvalVisitor()

    # Handle semantic errors
    try:
        visitor.visit(tree)
    except Exception as err:
        logging.error(err)
        return 1
        
    print(visitor.variables)  # should show {'x': 11.0}
    return 0


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Parse and evaluate In Silico code.')
    parser.add_argument("file", help='Path to the input source file')
    args = parser.parse_args()

    if not pathlib.Path(args.file).exists():
        print(f"Error: File '{args.file}' does not exist.")
        sys.exit(1)

    # Read input from file
    with open(args.file, 'r') as file:
        input_stream = InputStream(file.read())

    code = main(input_stream)
    sys.exit(code)
