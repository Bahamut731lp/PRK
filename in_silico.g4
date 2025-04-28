grammar in_silico;

//Lexer rules
fragment DIGIT: [0-9];
fragment LETTER: [a-z]|[A-Z];

PROGRAM_START: '@banger';
VARIABLE_KEYWORD: 'set';
ASSIGNMENT_KEYWORD: 'on' | '=';
FUNCTION_KEYWORD: 'drop bombs we';
RETURN_KEYWORD: 'back with a track called';
PRINT_KEYWORD: 'soaking through';

BLOCK_START: '{';
BLOCK_END: '}';
ARGUMENT_LIST_START: '(';
ARGUMENT_LIST_END: ')';
ARGUMENT_LIST_SEPARATOR: ',';

ADDITION_OPERATOR: '+';
SUBTRACTION_OPERATOR: '-';
MULTIPLICATION_OPERATOR: '*';
DIVISION_OPERATOR: ':' | '/';

NUMBER: DIGIT+ ('.' DIGIT+)?;
WHITESPACE: (' ' | '\t') -> skip;
NEWLINE: ('\r'? '\n' | '\r')+ -> skip;
IDENTIFIER: LETTER (LETTER| DIGIT)*;

//Parser rules
program: PROGRAM_START BLOCK_START statement* BLOCK_END EOF;
statement: variable_declaration | function_declaration | function_call | print_statement;

variable_declaration: VARIABLE_KEYWORD IDENTIFIER ASSIGNMENT_KEYWORD expression;
function_declaration: FUNCTION_KEYWORD IDENTIFIER parameters BLOCK_START statement* (RETURN_KEYWORD expression)? BLOCK_END;
function_call: IDENTIFIER parameters;
print_statement: PRINT_KEYWORD ('!'expression);

parameters: ARGUMENT_LIST_START argument_list? ARGUMENT_LIST_END;
argument_list: expression (ARGUMENT_LIST_SEPARATOR expression)*;

expression: term ((ADDITION_OPERATOR | SUBTRACTION_OPERATOR) term)*;
term: factor ((MULTIPLICATION_OPERATOR | DIVISION_OPERATOR) factor)*;
factor: NUMBER | '(' expression ')' | (SUBTRACTION_OPERATOR | ADDITION_OPERATOR) factor | IDENTIFIER | function_call;