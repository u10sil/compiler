// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
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

import { Error } from "@cogneco/mend"

export type Region = Error.Region

export abstract class Token {
	readonly region: Region | undefined
	constructor(region?: Region) { this.region = region }
	abstract serialize(): { class: string } & any
	toString() {
		return this.region ? this.region.toString() : ""
	}
	isSeparator(symbol?: string): boolean {
		return false
	}
	isIdentifier(name?: string): boolean {
		return false
	}
	isOperator(symbol?: string | ((symbol: string) => boolean)): boolean {
		return false
	}
	isWhitespace(content?: string): boolean {
		return false
	}
	isLiteral(): boolean {
		return false
	}
}
