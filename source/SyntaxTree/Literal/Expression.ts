// Copyright (C) 2017  Simon Mika <simon@mika.se>
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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../../Tokens"
import * as Type from "../Type"
import { Expression as Base } from "../Expression"
import { Node } from "../Node"

export abstract class Expression extends Base {
	get precedence() { return Number.MAX_VALUE }
	constructor(type: Type.Expression | undefined, tokens?: Utilities.Iterable<Tokens.Substance> | Node) {
		super(type, tokens)
	}
}
