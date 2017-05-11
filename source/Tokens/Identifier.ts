// Copyright (C) 2017  Simon Mika <simon@mika.se>
//
// This file is part of SysPL.
//
// SysPL is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// SysPL is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with SysPL.  If not, see <http://www.gnu.org/licenses/>.
//

import { Error } from "@cogneco/mend"
import { Source } from "./Source"
import { Token } from "./Token"
import { Substance } from "./Substance"

export class Identifier extends Substance {
	constructor(private name: string, region: Error.Region) {
		super(region)
	}
	getName(): string {
		return this.name
	}
	isIdentifier(name: string = null): boolean {
		return !name || name == this.name
	}
	static scan(source: Source): Token {
		var result: string = ""
		if (Identifier.isValidFirstCharacter(source.peek())) {
			do {
				result += source.read()
			} while (Identifier.isValidWithinCharacter(source.peek()))
		}
		return result ? new Identifier(result, source.mark()) : null
	}
	private static isValidFirstCharacter(character: string): boolean {
		return character >= "A" && character <= "Z" || character >= "a" && character <= "z" || character == "_"
	}
	private static isValidWithinCharacter(character: string): boolean {
		return Identifier.isValidFirstCharacter(character) || character >= "0" && character <= "9"
	}
}
