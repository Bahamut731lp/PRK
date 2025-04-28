import sys
import argparse
import pathlib

from antlr4 import *
from in_silicoLexer import in_silicoLexer
from in_silicoParser import in_silicoParser
from evaluator import EvalVisitor

def main():
    parser = argparse.ArgumentParser(description='Parse and evaluate In Silico code.')
    parser.add_argument("file", help='Path to the input source file')
    args = parser.parse_args()

    if not pathlib.Path(args.file).exists():
        print(f"Error: File '{args.file}' does not exist.")
        sys.exit(1)

    # Read input from file
    with open(args.file, 'r') as file:
        input_stream = InputStream(file.read())

    lexer = in_silicoLexer(input_stream)
    stream = CommonTokenStream(lexer)
    parser = in_silicoParser(stream)
    tree = parser.program()

    visitor = EvalVisitor()
    visitor.visit(tree)

    print(visitor.variables)  # should show {'x': 11.0}

if __name__ == '__main__':
    main()
