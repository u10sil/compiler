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

import { Error, Utilities, IO } from "@cogneco/mend"

import { Source } from "./Source"
import { Token } from "./Token"
import { Comment } from "./Comment"
import { EndOfFile } from "./EndOfFile"
import { Identifier } from "./Identifier"
import { Literal } from "./Literal"
import * as Literals from "./Literals"
import { Operator } from "./Operator"
import { Separator } from "./Separator"
import { Whitespace } from "./Whitespace"

export class Lexer implements Utilities.Iterator<Token> {
	private source: Source
	constructor(reader: IO.Reader, private errorHandler: Error.Handler) {
		this.source = new Source(reader, errorHandler)
	}
	next(): Token {
		let result: Token
		if (!this.source)
			result = undefined
		else if (!(
			(result = EndOfFile.scan(this.source)) ||
			(result = Whitespace.scan(this.source)) ||
			(result = Comment.scan(this.source)) ||
			(result = Operator.scan(this.source)) ||
			(result = Separator.scan(this.source)) ||
			(result = Literals.String.scan(this.source)) ||
			(result = Literals.Number.scan(this.source)) ||
			(result = Literals.Character.scan(this.source)) ||
			(result = Identifier.scan(this.source)) ||
			false
		))
			this.source.raise("[Lexer]: Unrecognized token: " + this.source.peek())
		return result
	}
}
