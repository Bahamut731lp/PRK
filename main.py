from antlr4 import *
from in_silicoLexer import in_silicoLexer
from in_silicoParser import in_silicoParser
from evaluator import EvalVisitor

def main():
    code = """
    @banger {
      set x on 5 + 3 * 2
    }
    """

    input_stream = InputStream(code)
    lexer = in_silicoLexer(input_stream)
    stream = CommonTokenStream(lexer)
    parser = in_silicoParser(stream)
    tree = parser.program()

    visitor = EvalVisitor()
    visitor.visit(tree)

    print(visitor.variables)  # should show {'x': 11.0}

if __name__ == '__main__':
    main()
