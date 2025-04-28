# Generated from in_silico.g4 by ANTLR 4.13.2
from antlr4 import *
if "." in __name__:
    from .in_silicoParser import in_silicoParser
else:
    from in_silicoParser import in_silicoParser

# This class defines a complete listener for a parse tree produced by in_silicoParser.
class in_silicoListener(ParseTreeListener):

    # Enter a parse tree produced by in_silicoParser#program.
    def enterProgram(self, ctx:in_silicoParser.ProgramContext):
        pass

    # Exit a parse tree produced by in_silicoParser#program.
    def exitProgram(self, ctx:in_silicoParser.ProgramContext):
        pass


    # Enter a parse tree produced by in_silicoParser#statement.
    def enterStatement(self, ctx:in_silicoParser.StatementContext):
        pass

    # Exit a parse tree produced by in_silicoParser#statement.
    def exitStatement(self, ctx:in_silicoParser.StatementContext):
        pass


    # Enter a parse tree produced by in_silicoParser#variable_declaration.
    def enterVariable_declaration(self, ctx:in_silicoParser.Variable_declarationContext):
        pass

    # Exit a parse tree produced by in_silicoParser#variable_declaration.
    def exitVariable_declaration(self, ctx:in_silicoParser.Variable_declarationContext):
        pass


    # Enter a parse tree produced by in_silicoParser#function_declaration.
    def enterFunction_declaration(self, ctx:in_silicoParser.Function_declarationContext):
        pass

    # Exit a parse tree produced by in_silicoParser#function_declaration.
    def exitFunction_declaration(self, ctx:in_silicoParser.Function_declarationContext):
        pass


    # Enter a parse tree produced by in_silicoParser#function_call.
    def enterFunction_call(self, ctx:in_silicoParser.Function_callContext):
        pass

    # Exit a parse tree produced by in_silicoParser#function_call.
    def exitFunction_call(self, ctx:in_silicoParser.Function_callContext):
        pass


    # Enter a parse tree produced by in_silicoParser#print_statement.
    def enterPrint_statement(self, ctx:in_silicoParser.Print_statementContext):
        pass

    # Exit a parse tree produced by in_silicoParser#print_statement.
    def exitPrint_statement(self, ctx:in_silicoParser.Print_statementContext):
        pass


    # Enter a parse tree produced by in_silicoParser#parameters.
    def enterParameters(self, ctx:in_silicoParser.ParametersContext):
        pass

    # Exit a parse tree produced by in_silicoParser#parameters.
    def exitParameters(self, ctx:in_silicoParser.ParametersContext):
        pass


    # Enter a parse tree produced by in_silicoParser#argument_list.
    def enterArgument_list(self, ctx:in_silicoParser.Argument_listContext):
        pass

    # Exit a parse tree produced by in_silicoParser#argument_list.
    def exitArgument_list(self, ctx:in_silicoParser.Argument_listContext):
        pass


    # Enter a parse tree produced by in_silicoParser#expression.
    def enterExpression(self, ctx:in_silicoParser.ExpressionContext):
        pass

    # Exit a parse tree produced by in_silicoParser#expression.
    def exitExpression(self, ctx:in_silicoParser.ExpressionContext):
        pass


    # Enter a parse tree produced by in_silicoParser#term.
    def enterTerm(self, ctx:in_silicoParser.TermContext):
        pass

    # Exit a parse tree produced by in_silicoParser#term.
    def exitTerm(self, ctx:in_silicoParser.TermContext):
        pass


    # Enter a parse tree produced by in_silicoParser#factor.
    def enterFactor(self, ctx:in_silicoParser.FactorContext):
        pass

    # Exit a parse tree produced by in_silicoParser#factor.
    def exitFactor(self, ctx:in_silicoParser.FactorContext):
        pass



del in_silicoParser