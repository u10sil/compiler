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

import { Source } from "../Source"
import * as Statement from "../Statement"
import * as SyntaxTree from "../../SyntaxTree"

const typeParsers: ((source: Source) => SyntaxTree.Type.Expression | undefined)[] = []
function addParser(parser: (source: Source) => SyntaxTree.Type.Expression | undefined) {
	typeParsers.push(parser)
}
function tryParse(source: Source): SyntaxTree.Type.Expression | undefined {
	return source.peek()!.isSeparator(":") && source.next() ? parse(source) : undefined
}
function parse(source: Source): SyntaxTree.Type.Expression | undefined {
	let result: SyntaxTree.Type.Expression | undefined
	if (typeParsers.length > 0) {
		let i = 0
		do
			result = typeParsers[i++](source.clone())
		while (!result && i < typeParsers.length)
	}
	return result
}
import * as Identifier from "./Identifier"
import * as Name from "./Name"
import "./Tuple"
export {
	Identifier,
	Name,
	addParser,
	tryParse,
	parse,
}
Statement.addParser(parse, 20)
