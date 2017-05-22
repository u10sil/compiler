// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
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
import { Source } from "../Source"
import { Token } from "../Token"
import { Literal } from "../Literal"

export class Character extends Literal {
	constructor(readonly value: string, region: Error.Region) {
		super(region)
	}
	static scan(source: Source): Token {
		var result: string
		if (source.peek() == "'") {
			source.read()
			result = ""
			// Should we loop on this, that is, should we let the
			// parser handle multi-character char literals?
			while (source.peek() != "'") {
				if (source.peek() == "\\") {
					switch (source.peek(2)) {
						case "\\0":	result += "\0"; break
						case "\\\\": result += "\\"; break
						case "\\\"": result += "\""; break
						case "\\n":	result += "\n"; break
						case "\\r":	result += "\r"; break
						default: source.raise("Unrecognized escape sequence: \"" + source.peek(2) + "\""); break
					}
					source.read(2)
				} else
					result += source.read()
			}
			source.read() // Consume last '
		}
		return result || result == "" ? new Character(result, source.mark()) : null
	}
}
