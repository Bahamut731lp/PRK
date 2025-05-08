# Generated from in_silico.g4 by ANTLR 4.13.2
from antlr4 import *
if "." in __name__:
    from .in_silicoParser import in_silicoParser
else:
    from in_silicoParser import in_silicoParser

# This class defines a complete generic visitor for a parse tree produced by in_silicoParser.

class in_silicoVisitor(ParseTreeVisitor):

    # Visit a parse tree produced by in_silicoParser#program.
    def visitProgram(self, ctx:in_silicoParser.ProgramContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by in_silicoParser#statement.
    def visitStatement(self, ctx:in_silicoParser.StatementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by in_silicoParser#variable_declaration.
    def visitVariable_declaration(self, ctx:in_silicoParser.Variable_declarationContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by in_silicoParser#function_declaration.
    def visitFunction_declaration(self, ctx:in_silicoParser.Function_declarationContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by in_silicoParser#function_call.
    def visitFunction_call(self, ctx:in_silicoParser.Function_callContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by in_silicoParser#print_statement.
    def visitPrint_statement(self, ctx:in_silicoParser.Print_statementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by in_silicoParser#parameters.
    def visitParameters(self, ctx:in_silicoParser.ParametersContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by in_silicoParser#argument_list.
    def visitArgument_list(self, ctx:in_silicoParser.Argument_listContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by in_silicoParser#expression.
    def visitExpression(self, ctx:in_silicoParser.ExpressionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by in_silicoParser#term.
    def visitTerm(self, ctx:in_silicoParser.TermContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by in_silicoParser#factor.
    def visitFactor(self, ctx:in_silicoParser.FactorContext):
        return self.visitChildren(ctx)



del in_silicoParser