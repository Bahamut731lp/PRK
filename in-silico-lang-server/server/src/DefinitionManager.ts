import { CompletionItemKind, Diagnostic, Location, SignatureInformation } from 'vscode-languageserver/node';
import Diagnostics from './DiagnosticsManager';

export interface SymbolDefinition {
	name: string;
	type: CompletionItemKind;
	signature?: SignatureInformation;
	location: Location;
}

export enum ErrorType {
    PROGRAM_NOT_DEFINED,
    FUNCTION_DECLARATION_SYNTAX_ERROR,
    RETURN_SYNTAX_ERROR,
    FUNCTION_NOT_DEFINED,
    VARIABLE_NOT_DEFINED
}

export default class DefinitionManager {
    public definitions: Map<string, SymbolDefinition>;
    public uri: string;

    constructor(uri: string) {
        this.definitions = new Map();
        this.uri = uri;
    }

    parse(line: string, index: number): Diagnostic[] {
		const diagnostics = new Diagnostics();

		const fnDeclaration = this.isFunctionDeclaration(line);
        const fnCall = this.isFunctionCall(line);
		const varDeclaration = this.isVariableDeclaration(line);

		if (fnDeclaration) {
			const paramsMatch = line.match(/\(([^)]*)\)/);
			const params = paramsMatch ? paramsMatch[1].split(',').map(param => param.trim()) : [];

			this.definitions.set(fnDeclaration, {
				name: fnDeclaration,
				type: CompletionItemKind.Function,
				signature: {
					label: `${fnDeclaration}(${params.join(', ')})`,
					parameters: params.map(param => ({ label: param }))
				},
				location: {
					uri: this.uri,
					range: {
						start: { line: index, character: line.indexOf(fnDeclaration) || 0 },
						end: { line: index, character: (line.indexOf(fnDeclaration) || 0) + fnDeclaration.length }
					}
				}
			});
		}

		if (varDeclaration) {
			this.definitions.set(varDeclaration, {
				name: varDeclaration,
				type: CompletionItemKind.Variable,
				location: {
					uri: this.uri,
					range: {
						start: { line: index, character: line.indexOf(varDeclaration) || 0 },
						end: { line: index, character: (line.indexOf(varDeclaration) || 0) + varDeclaration.length }
					}
				}
			});
		}

		if (fnCall && !this.definitions.has(fnCall)) {
			diagnostics.error(
                ErrorType.FUNCTION_NOT_DEFINED,
                `Function "${fnCall}" is not defined.`,
                {
                    line: index,
                    start: line.indexOf(fnCall),
                    end: line.indexOf(fnCall) + fnCall.length,
                }
            );
		}

		return diagnostics.get();
	}

    isFunctionDeclaration(line: string) {
        return line.match(/(?<=drop bombs we\s+)[^\s]+(?=\([^)]*\))/g)?.at(0) ?? null;
    }

    isFunctionCall(line: string) {
        return line.match(/[^\s]+(?=\([^)]*\))/g)?.at(0) ?? null;
    }

	isVariableDeclaration(line: string) {
		const declaration = line.match(/set\s+\w+/g)?.at(0) ?? null;
		if (!declaration) {return "";}

		return declaration.split(/\s+/).at(-1);		
	}
}