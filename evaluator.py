from in_silicoVisitor import in_silicoVisitor
from in_silicoParser import in_silicoParser

class EvalVisitor(in_silicoVisitor):
    def __init__(self):
        # Initialize an empty dictionary of variables.
        self.variables = {}

    def visitProgram(self, ctx):
        # Visit root node of in silico program
        # For each statement, we visit and call appropriate visit function
        for statement in ctx.statement():
            self.visit(statement)

    def visitVariable_declaration(self, ctx):
        var_name = ctx.IDENTIFIER().getText()
        value = self.visit(ctx.expression())
        self.variables[var_name] = value
        return value

    def visitExpression(self, ctx):
        result = self.visit(ctx.term(0))
        for i in range(1, len(ctx.term())):
            op = ctx.getChild(2 * i - 1).getText()
            right = self.visit(ctx.term(i))
            if op == '+':
                result += right
            elif op == '-':
                result -= right
        return result

    def visitTerm(self, ctx):
        result = self.visit(ctx.factor(0))
        for i in range(1, len(ctx.factor())):
            op = ctx.getChild(2 * i - 1).getText()
            right = self.visit(ctx.factor(i))
            if op == '*' or op == ':':
                result *= right
            elif op == '/':
                result /= right
        return result

    def visitFactor(self, ctx):
        if ctx.NUMBER():
            return float(ctx.NUMBER().getText())
        if ctx.IDENTIFIER():
            name = ctx.IDENTIFIER().getText()
            return self.variables.get(name, 0)
        if ctx.expression():
            return self.visit(ctx.expression())
        if ctx.SUBTRACTION_OPERATOR():
            return -self.visit(ctx.factor(0))
        if ctx.ADDITION_OPERATOR():
            return +self.visit(ctx.factor(0))
        return self.visitChildren(ctx)
