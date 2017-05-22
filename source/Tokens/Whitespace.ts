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
import { Source } from "./Source"
import { Token } from "./Token"
import { Gap } from "./Gap"

export class Whitespace extends Gap {
	constructor(private endsLine: boolean, region: Error.Region) {
		super(region)
	}
	getEndsLine(): boolean { return this.endsLine }
	static scan(source: Source): Token {
		var result: Token = null
		if (Whitespace.isWhitespace(source.peek())) {
			do {
				switch (source.peek()) {
					case "\n":
						source.read()
						result = new Whitespace(true, source.mark())
						break
					case "\r":
					case "\t":
					case " ":
						source.read()
						continue
					default:
						result = new Whitespace(false, source.mark())
						break
				}
			} while (!result)
		}
		return result
	}
	isWhitespace(content?: string): boolean {
		return !content || content == this.getRegion().content
	}
	private static isWhitespace(character: string) {
		return character === "\n" || character === "\r" || character === "\t" || character === " "
	}
}
