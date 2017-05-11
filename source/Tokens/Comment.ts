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
import { Gap } from "./Gap"

export class Comment extends Gap {
	constructor(private content: string, region: Error.Region) {
		super(region)
	}
	getContent() { return this.content }
	static scan(source: Source): Token {
		var result: string;
		switch (source.peek(2)) {
			case "//":
				result = ""
				source.read(2)
				while (source.peek() != "\n" && source.peek() != "\0")
					result += source.read()
				break
			case "/*":
				result = ""
				source.read(2)
				while (source.peek(2) != "*/" && source.peek() != "\0")
					result += source.read()
				source.read(2)
				break
			default:
				result = null
		}
		return result ? new Comment(result, source.mark()) : null
	}
}