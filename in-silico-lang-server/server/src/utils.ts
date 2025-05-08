export function getTokenByPosition(line: string, position: number) {
    const tokens = [...line.match(/\w+/g) ?? []];
    let length = 0;
    let match = "";

	// Najdeme, který token odpovídá pozici kurzoru
	for (const token of tokens) {
		length = line.indexOf(token) + token.length;

		if (position < length) {
			match = token;
			break;
		}
	}

    return match

}