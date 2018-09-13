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

import { Error, Utilities } from "@cogneco/mend"

import { Token } from "./Token"
import { Gap } from "./Gap"
import { Substance } from "./Substance"
import { Whitespace } from "./Whitespace"

export class GapRemover extends Utilities.Enumerator<Substance> {
	private backend: Utilities.BufferedEnumerator<Token>
	constructor(backend: Utilities.Enumerator<Token>) {
		super(() => {
			const pre: Gap[] = []
			while (this.backend.peek() instanceof Gap) {
				pre.push(this.backend.fetch()!)
			}
			let result: Substance
			if (!(this.backend.peek() instanceof Substance))
				throw new Error.Message(" Missing end of file token.", Error.Level.Recoverable, "lexical", this.backend.peek()!.region)
			result = this.backend.fetch() as Substance
			const post: Gap[] = []
			while (this.backend.peek() instanceof Gap) {
				const next = this.backend.fetch()
				post.push(next!)
				if (next instanceof Whitespace && (next as Whitespace).endsLine) {
					break
				}
			}
			result.pregap = pre
			result.postgap = post
			return result
		})
		this.backend = new Utilities.BufferedEnumerator(backend)
	}
}
