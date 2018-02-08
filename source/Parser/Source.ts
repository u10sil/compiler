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

import { Error, Utilities } from "@cogneco/mend"
import * as Tokens from "../Tokens"

export class Source extends Utilities.Iterator<Tokens.Substance> implements Error.Handler {
	private tokens: Utilities.BufferedIterator<Tokens.Substance>
	private lastTokens: Tokens.Substance[] = []
	constructor(tokens: Utilities.Iterator<Tokens.Substance>, private errorHandler: Error.Handler) {
		super(() => {
			const result = this.tokens.next()
			if (result)
				this.lastTokens.push(result)
			return result
		})
		if (!(tokens instanceof Utilities.BufferedIterator))
			tokens = new Utilities.BufferedIterator(tokens)
		this.tokens = tokens as Utilities.BufferedIterator<Tokens.Substance>
	}
	clone(): Source {
		return new Source(this.tokens, this.errorHandler)
	}
	peek(position: number = 0): Tokens.Substance | undefined {
		return this.tokens.peek(position)
	}
	mark(): () => Utilities.Iterator<Tokens.Substance> {
		const result = this.lastTokens
		this.lastTokens = []
		return () => new Utilities.ArrayIterator(result)
	}
	raise(message: string | Error.Message, level: Error.Level = Error.Level.Critical, type = "gramatical", region?: Error.Region): void {
		if (typeof message == "string") {
			if (!region)
				region = this.peek()!.region
			message = new Error.Message(message as string, level, type, region)
		}
		this.errorHandler.raise(message as Error.Message)
	}
}
