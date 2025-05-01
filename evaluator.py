from in_silicoVisitor import in_silicoVisitor
from in_silicoParser import in_silicoParser

class EvalVisitor(in_silicoVisitor):
    def __init__(self):
        self.variables = {}
        self.functions = {}

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

    def visitFunction_declaration(self, ctx):
        func_name = ctx.IDENTIFIER().getText()
        # Extract parameter names
        params_ctx = ctx.parameters()
        if params_ctx.argument_list():
            params = [param.getText() for param in params_ctx.argument_list().expression()]
        else:
            params = []

        # Store the function body statements and optional return expression
        # ctx.statement() returns a list of statements inside the block
        statements = ctx.statement()
        return_expr = ctx.expression() if ctx.RETURN_KEYWORD() else None

        # Save the function definition
        self.functions[func_name] = (params, statements, return_expr)

    def visitFunction_call(self, ctx):
        func = ctx.IDENTIFIER()
        func_name = func.getText()

        if func_name not in self.functions:
            token = func.getSymbol()
            raise Exception(f"Function '{func_name}' is not defined (error on line {token.line}:{token.column})")

        params, statements, return_expr = self.functions[func_name]

        args_ctx = ctx.parameters().argument_list()
        if args_ctx:
            # Evaluate each argument expression by visiting it
            args = [self.visit(expr) for expr in args_ctx.expression()]
        else:
            args = []

        if len(args) != len(params):
            raise Exception(f"Function '{func_name}' expects {len(params)} arguments, got {len(args)}")

        old_vars = self.variables.copy()
        for p, a in zip(params, args):
            self.variables[p] = a

        for stmt in statements:
            self.visit(stmt)

        result = self.visit(return_expr) if return_expr else None

        self.variables = old_vars

        return result
