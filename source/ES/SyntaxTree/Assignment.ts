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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../../Tokens"
import { Expression } from "./Expression"
import { Identifier } from "./Identifier"
import { ResolvingOperator } from "./ResolvingOperator"
import { UnaryOperator } from "./UnaryOperator"

export class Assignment extends UnaryOperator {
	get class() { return "Assignment" }
	get symbol() { return "=" }
	constructor(readonly left: Identifier | ResolvingOperator, expression: Expression, readonly tokens?: Utilities.Enumerable<Tokens.Substance>) {
		super(expression, tokens)
	}
}
