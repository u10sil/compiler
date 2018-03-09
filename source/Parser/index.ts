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

import { Error, Uri, Utilities } from "@cogneco/mend"
import * as Module from "./Module"
import * as SyntaxTree from "../SyntaxTree"
import { Source } from "./Source"
import * as Tokens from "../Tokens"

function createParser(tokens: Utilities.Enumerator<Tokens.Substance>, handler: Error.Handler): Utilities.Enumerator<SyntaxTree.Module> {
	const source = new Source(tokens, handler)
	return new Utilities.Enumerator(() => Module.parse(source))
}
export function create(tokens: undefined, handler: Error.Handler): undefined
export function create(tokens: Utilities.Enumerator<Tokens.Token> | string, handler: Error.Handler): Utilities.Enumerator<SyntaxTree.Module>
export function create(tokens: Utilities.Enumerator<Tokens.Token> | string | undefined, handler: Error.Handler): Utilities.Enumerator<SyntaxTree.Module> | undefined
export function create(tokens: string | Utilities.Enumerator<Tokens.Token> | undefined, handler: Error.Handler): Utilities.Enumerator<SyntaxTree.Module> | undefined {
	return tokens == undefined ? undefined : createParser(new Tokens.GapRemover(typeof tokens === "string" ? Tokens.Lexer.create(tokens, handler) : tokens), handler)
}
export function open(resource: Uri.Locator | undefined, handler: Error.Handler): Utilities.Enumerator<SyntaxTree.Module> | undefined {
	return resource ? create(Tokens.Lexer.open(resource, handler), handler) : undefined
}
export function parseFirst(tokens: string | Utilities.Enumerator<Tokens.Token>, handler: Error.Handler): SyntaxTree.Statement | undefined {
		const parser = create(tokens, handler)
		let module: SyntaxTree.Module | undefined
		let statements: Utilities.Enumerable<SyntaxTree.Statement>
		return parser != undefined && (module = parser.fetch()) && (statements = module.statements) ? statements.first : undefined
}

import "./Literal"
import "./Type"
import "./Block"
import "./ClassDeclaration"
import "./Expression"
import "./FunctionCall"
import "./FunctionDeclaration"
import "./Identifier"
import "./InfixOperator"
import "./PostfixOperator"
import "./PrefixOperator"
import "./Tuple"
import "./VariableDeclaration"
