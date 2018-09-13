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

export class Comment extends Gap {
	constructor(readonly content: string, readonly isBlock: boolean, region: Error.Region) {
		super(region)
	}
	serialize(): { class: string } & any {
		return {
			class: "comment",
			content: this.content,
			isBlock: this.isBlock || undefined,
		}
	}
	static scan(source: Source): Token | undefined {
		let result: string | undefined
		let isBlock = false
		switch (source.peek(2)) {
			case "//":
				result = ""
				source.read(2)
				while (source.peek() != "\n" && source.peek() != "\0" && source.peek() != undefined)
					result += source.read()
				break
			case "/*":
				result = ""
				source.read(2)
				while (source.peek(2) != "*/" && source.peek() != "\0")
					result += source.read()
				source.read(2)
				isBlock = true
				break
			default:
		}
		return result != undefined ? new Comment(result, isBlock, source.mark()) : undefined
	}
}
