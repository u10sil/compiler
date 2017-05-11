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

import { Utilities } from "@cogneco/mend"

import { Token } from "./Token"
import { Gap } from "./Gap"
import { Substance } from "./Substance"
import { Whitespace } from "./Whitespace"

export class GapRemover implements Utilities.Iterator<Substance> {
	private backend: Utilities.BufferedIterator<Token>
	constructor(backend: Utilities.Iterator<Token>) {
		this.backend = new Utilities.BufferedIterator(backend)
	}
	next(): Substance {
		var pre: Gap[] = []
		while (this.backend.peek() instanceof Gap) {
			pre.push(this.backend.next())
		}
		var result: Substance
		if (!(this.backend.peek() instanceof Substance))
			throw "Lexical Error: Missing end of file token."
		result = <Substance>this.backend.next()
		var post: Gap[] = []
		while (this.backend.peek() instanceof Gap) {
			var next = this.backend.next()
			post.push(next)
			if (next instanceof Whitespace && (<Whitespace>next).getEndsLine()) {
				break
			}
		}
		result.setPregap(pre)
		result.setPostgap(post)
		return result
	}
}
