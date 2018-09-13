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
import { SymbolDeclaration } from "./SymbolDeclaration"
import { ArgumentDeclaration } from "./ArgumentDeclaration"
import { Statement } from "./Statement"
import * as Type from "./Type"

export class FunctionDeclaration extends SymbolDeclaration {
	get class() { return "FunctionDeclaration" }
	constructor(symbol: string, readonly argumentList: Utilities.Enumerable<ArgumentDeclaration>, returnType: Type.Expression, readonly statements: Utilities.Enumerable<Statement>, tokens?: Utilities.Enumerable<Tokens.Substance>) {
		super(symbol, returnType, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			arguments: this.argumentList.map(a => a.serialize()).toArray(),
			statements: this.statements.map(s => s.serialize()).toArray(),
		}
	}
}
