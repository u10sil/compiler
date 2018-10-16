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
import { ArgumentDeclaration } from "./ArgumentDeclaration"
import { Expression } from "./Expression"
import { Operator } from "./Operator"

export class LambdaOperator extends Operator {
	get class() { return "LambdaOperator" }
	get symbol() { return "=>" }
	readonly arguments: Utilities.Enumerable<ArgumentDeclaration>
	constructor(
		argumentsEnumerable: Utilities.Enumerable<ArgumentDeclaration>,
		readonly body: Expression, tokens?: Utilities.Enumerable<Tokens.Substance>) {
		super(tokens)
		this.arguments = argumentsEnumerable
	}
	serialize(): { class: string } & any {
		const argumentsArray = this.arguments.map(a => a.serialize()).toArray()
		return {
			...super.serialize(),
			arguments: argumentsArray.length > 0 ? argumentsArray : undefined,
			body: this.body && this.body.serialize(),
		}
	}
}
