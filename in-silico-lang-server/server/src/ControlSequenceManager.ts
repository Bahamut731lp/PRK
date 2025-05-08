import Diagnostics from './DiagnosticsManager';
import { ErrorType } from './DefinitionManager';

export default class ControlSequenceManager {

	keywords = {
		FUNC_DECLAR: /(drop)\s+(bombs)\s+(we)/g,
		RETURN_KEYWORD: /(back)\s+(with)\s+(a)\s+(track)\s+(called)/g
	};

	constructor() {

	}

	parse(line: string, index: number) {
		const diagnostics = new Diagnostics();

		if (index == 0 && this.isProgramDeclarationError(line)) {
			diagnostics.error(
				ErrorType.PROGRAM_NOT_DEFINED,
				`Program must start with @banger declaration followed by block of statements.`,
				{
					line: index,
					start: 0,
					end: line.indexOf("{") || line.length 
				}
			);

			return diagnostics.get();
		}

		if (this.isFunctionDeclarationError(line)) {
			diagnostics.error(
				ErrorType.FUNCTION_DECLARATION_SYNTAX_ERROR,
				`Additional whitespaces in function declaration are not allowed.`,
				{
					line: index,
					start: line.indexOf("drop"),
					end: line.indexOf("we") + 2  
				}
			);

			return diagnostics.get();
		}

		if (this.isReturnKeywordError(line)) {
			diagnostics.error(
				ErrorType.RETURN_SYNTAX_ERROR,
				`Additional whitespaces in return keyphrase are not allowed.`,
				{
					line: index,
					start: line.indexOf("back"),
					end: line.indexOf("called") + 6
				}
			);
		}


		return diagnostics.get();
	}

	isProgramDeclarationError(line: string) {
		return !line.trim().startsWith("@banger")
	}
	
	isFunctionDeclarationError(line: string) {
		const result = line.match(this.keywords.FUNC_DECLAR);
		
		if (!result) {return null;}
		
		const match = result.at(0);
		if (!match) {return null;}

		if (match.split(/\s/g).length > 3) {return true;}
		return false;
	}

	isReturnKeywordError(line: string) {
		const result = line.match(this.keywords.RETURN_KEYWORD);
		if (!result) {return null;}
		
		const match = result.at(0);
		if (!match) {return null;}

		if (match.split(/\s/g).length > 5) {return true;}
		return false;
	};

}