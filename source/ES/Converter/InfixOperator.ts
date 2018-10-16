// Copyright (C) 2018  Simon Mika <simon@mika.se>
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

import * as SyntaxTree from "../../SyntaxTree"
import * as ES from "../SyntaxTree"
import { addConverter } from "./Converter"

addConverter<SyntaxTree.InfixOperator>("infixOperator",
	(converter, node) => {
		let result: ES.Node | undefined
		switch (node.symbol) {
			case "=":
				if (node.left.class == "identifier")
					result = new ES.Assignment((node.left as SyntaxTree.Identifier).name, converter.convert(node.right), node.tokens)
				else
					converter.handler.raise("Left hand of expression must be \"identifier\" and not \"" + node.class + "\" when converting to ES.")
				break
			case ".":
				result = new ES.ResolvingOperator(converter.convert(node.left), converter.convert(node.right), node.tokens)
				break
			case "*":
				result = new ES.InfixOperator(node.symbol, node.precedence, node.associativity, converter.convert(node.left), converter.convert(node.right), node.tokens)
				break
			default:
				converter.handler.raise("Unable to convert \"" + node.class + "\" to ES.")
				break
		}
		return result || new ES.Identifier("ERROR")
	},
)
