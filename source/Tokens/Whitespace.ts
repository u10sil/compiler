// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
//
// This file is part of U10sil.
//
// U10sil is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// U10sil is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with U10sil.  If not, see <http://www.gnu.org/licenses/>.
//

import { Error } from "@cogneco/mend"
import { Source } from "./Source"
import { Token } from "./Token"
import { Gap } from "./Gap"

export class Whitespace extends Gap {
	constructor(readonly endsLine: boolean, region: Error.Region) {
		super(region)
	}
	serialize(): { class: string } & any {
		return {
			class: "whitespace",
			endsLine: this.endsLine,
		}
	}
	static scan(source: Source): Token | undefined {
		let result: Token | undefined
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
		return !content || !!this.region && content == this.region.content
	}
	private static isWhitespace(character: string | undefined) {
		return character === "\n" || character === "\r" || character === "\t" || character === " "
	}
}
