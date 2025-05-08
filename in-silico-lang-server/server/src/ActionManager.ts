import { CodeAction, CodeActionKind, CodeActionParams, Diagnostic } from "vscode-languageserver";
import { ErrorType } from "./DefinitionManager";

export default class ActionManager {
    actions: CodeAction[];
    params: CodeActionParams;

    constructor(params: CodeActionParams) {
        this.actions = [];
        this.params = params;
    }

    get() {
        return this.actions;
    }

    handle(diagnostic: Diagnostic) {
        const generators: Record<number, CallableFunction> = {
            [ErrorType.FUNCTION_DECLARATION_SYNTAX_ERROR]: this.handleFunctionDeclarationSyntaxError,
            [ErrorType.RETURN_SYNTAX_ERROR]: this.handleReturnSyntaxError,
            [ErrorType.PROGRAM_NOT_DEFINED]: this.handleBangerSyntaxError
        } as const;

        if (diagnostic.code != undefined && diagnostic.code in generators) {
            generators[Number(diagnostic.code)].bind(this)(diagnostic);
        }
    }

    handleFunctionDeclarationSyntaxError(diagnostic: Diagnostic) {
        this.actions.push({
            title: "Replace with correct function declaration",
            kind: CodeActionKind.RefactorRewrite,
            edit: {
                changes: {
                    [this.params.textDocument.uri]: [
                        {
                            newText: "drop bombs we",
                            range: diagnostic.range
                        }
                    ]
                }
            }
        });
    }

    handleReturnSyntaxError(diagnostic: Diagnostic) {
        this.actions.push({
            title: "Replace with correct return keyphrase",
            kind: CodeActionKind.RefactorRewrite,
            edit: {
                changes: {
                    [this.params.textDocument.uri]: [
                        {
                            newText: "back with a track called",
                            range: diagnostic.range
                        }
                    ]
                }
            }
        });
    }

    handleBangerSyntaxError(diagnostic: Diagnostic) {
        this.actions.push({
            title: "Add @banger declaration",
            kind: CodeActionKind.QuickFix,
            edit: {
                changes: {
                    [this.params.textDocument.uri]: [
                        {
                            newText: "@banger",
                            range: diagnostic.range
                        }
                    ]
                }
            }
        });
    }

}