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
import { Operator } from "./Operator"
import { Identifier } from "./Identifier"

export class New extends Operator {
	get class(): string { return "New" }
	get symbol(): string { return "new" }
	readonly arguments: Utilities.Enumerable<Expression>
	constructor(readonly name: Identifier, argumentList: Utilities.Enumerable<Expression>, readonly tokens?: Utilities.Enumerable<Tokens.Substance>) {
		super(tokens)
		this.arguments = argumentList
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			arguments: this.arguments.map(argument => argument.serialize()),
		}
	}
}
