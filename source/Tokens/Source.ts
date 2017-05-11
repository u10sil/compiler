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

import { IO, Error, Unit } from "@cogneco/mend"

export class Source extends IO.BufferedReader implements Error.Handler {
	constructor(reader: IO.Reader, private errorHandler: Error.Handler) {
		super(reader)
	}
	raise(message: string | Error.Message, level: Error.Level = Error.Level.Critical, type: Error.Type = Error.Type.Lexical, region?: Error.Region): void {
		if (typeof message == "string") {
			if (!region) {
				region = this.getRegion()
			}
			message = new Error.Message(<string>message, level, type, region)
		}
		console.log(message.toString())
	}
}
