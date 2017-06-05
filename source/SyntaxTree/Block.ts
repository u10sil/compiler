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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../Tokens"
import { Statement } from "./Statement"
import { Expression } from "./Expression"
import * as Type from "./Type"

export class Block extends Expression {
	get precedence(): number {
		return Number.MAX_VALUE
	}
	get statements(): Utilities.Iterator<Statement> {
		return new Utilities.ArrayIterator(this.statementsArray)
	}
	constructor(private statementsArray: Statement[], tokens: () => Utilities.Iterator<Tokens.Substance>) {
		super(Block.typeOfLast(statementsArray), tokens)
	}
	serialize(): { class: string } & any {
		return {
			class: "block",
			statements: this.statementsArray.length > 0 ? this.statementsArray.map(s => s.serialize()) : undefined,
		}
	}
	private static typeOfLast(statements: Statement[]): Type.Expression | undefined {
		const last = statements[statements.length - 1]
		return last instanceof Expression ? last.type : undefined
	}
}
