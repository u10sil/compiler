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

import { Error } from "@cogneco/mend"

export abstract class Token {
	constructor(readonly region: Error.Region) { }
	toString() {
		return this.region.toString()
	}
	isSeparator(symbol?: string): boolean {
		return false
	}
	isIdentifier(name?: string): boolean {
		return false
	}
	isOperator(symbol?: string): boolean {
		return false
	}
	isWhitespace(content?: string): boolean {
		return false
	}
	isLiteral(): boolean {
		return false
	}
}
