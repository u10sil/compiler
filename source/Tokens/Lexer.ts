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

import { Error, IO, Uri, Utilities } from "@cogneco/mend"

import { Source } from "./Source"
import { Token } from "./Token"
import { Comment } from "./Comment"
import { EndOfFile } from "./EndOfFile"
import { Identifier } from "./Identifier"
import * as Literals from "./Literals"
import { Operator } from "./Operator"
import { Separator } from "./Separator"
import { Whitespace } from "./Whitespace"

export class Lexer extends Utilities.Enumerator<Token> {
	private source: Source
	private constructor(reader: IO.Reader, handler: Error.Handler) {
		super(() => {
			const result = EndOfFile.scan(this.source) ||
				Whitespace.scan(this.source) ||
				Comment.scan(this.source) ||
				Operator.scan(this.source) ||
				Separator.scan(this.source) ||
				Literals.String.scan(this.source) ||
				Literals.Number.scan(this.source) ||
				Literals.Character.scan(this.source) ||
				Identifier.scan(this.source)
			if (!result)
				this.source.raise("[Lexer]: Unrecognized token: " + this.source.peek())
			return result
		})
		this.source = new Source(reader, handler)
	}
	static create(code: undefined, handler: Error.Handler): undefined
	static create(code: string | IO.Reader, handler: Error.Handler): Utilities.Enumerator<Token>
	static create(code: string | IO.Reader | undefined, handler: Error.Handler): Utilities.Enumerator<Token> | undefined
	static create(code: string | IO.Reader | undefined, handler: Error.Handler): Utilities.Enumerator<Token> | undefined {
		return code == undefined ? undefined : new Lexer(typeof code === "string" ? IO.StringReader.create(code) : code, handler)
	}
	static open(resource: Uri.Locator, handler: Error.Handler): Utilities.Enumerator<Token> | undefined {
		return Lexer.create(IO.Reader.open(resource), handler)
	}
}
