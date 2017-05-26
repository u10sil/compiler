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
import * as Literals from "./Literals"
import { Operator } from "./Operator"
import { Separator } from "./Separator"
import { Whitespace } from "./Whitespace"

export class Lexer implements Utilities.Iterator<Token> {
	private source: Source
	private constructor(reader: IO.Reader, handler: Error.Handler) {
		this.source = new Source(reader, handler)
	}
	next(): Token | undefined {
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
	}
	static create(code: undefined, handler: Error.Handler): undefined
	static create(code: string | IO.Reader, handler: Error.Handler): Utilities.Iterator<Token>
	static create(code: string | IO.Reader | undefined, handler: Error.Handler): Utilities.Iterator<Token> | undefined
	static create(code: string | IO.Reader | undefined, handler: Error.Handler): Utilities.Iterator<Token> | undefined {
		return code == undefined ? undefined : new Lexer(typeof code === "string" ? IO.StringReader.create(code) : code, handler)
	}
	static open(path: string, handler: Error.Handler): Utilities.Iterator<Token> | undefined {
		return Lexer.create(path.slice(-6) == ".syspl" ? IO.FileReader.open(path) : IO.FolderReader.open(path, "syspl"), handler)
	}
}
