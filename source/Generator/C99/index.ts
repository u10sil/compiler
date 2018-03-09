// Copyright (C) 2018  Simon Mika <simon@mika.se>
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
import * as SyntaxTree from "../../SyntaxTree"
import * as Tokens from "../../Tokens"
import { Generator } from "./Generator"
import { Node } from "./Node"

export async function generate(node: Node | Node[] | Utilities.Enumerator<Node>, resource: Uri.Locator, handler: Error.Handler): Promise<boolean> {
	const generator = await Generator.create(resource, handler)
	return generator && await generator.generate(node) && await generator.close()
}

import "./Literal"
import "./Type"
import "./ArgumentDeclaration"
import "./Assigment"
import "./Declaration"
import "./Expression"
import "./ExpressionStatement"
import "./FunctionCall"
import "./FunctionDeclaration"
import "./Identifier"
import "./Module"
import "./ReturnStatement"
import "./Statement"
import "./SymbolDeclaration"
import "./VariableDeclaration"
