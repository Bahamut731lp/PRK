import Diagnostics from './DiagnosticsManager';

export default class ControlSequenceManager {

	keywords = {
		FUNC_DECLAR: /(drop)\s+(bombs)\s+(we)/g,
		RETURN_KEYWORD: /(back)\s+(with)\s+(a)\s+(track)\s+(called)/g
	};

	constructor() {

	}

	parse(line: string, index: number) {
		const diagnostics = new Diagnostics();

		if (this.isFunctionDeclarationError(line)) {
			diagnostics.error(
				index,
				line.indexOf("drop"),
				line.indexOf("we") + 2,
				`Function declaration contains unnecessary whitespaces.`
			);

			return diagnostics.get();
		}

		if (this.isReturnKeywordError(line)) {
			diagnostics.error(
				index,
				line.indexOf("back"),
				line.indexOf("with") + 2,
				`Return keyword contains unnecessary whitespaces.`
			);
		}


		return diagnostics.get();
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