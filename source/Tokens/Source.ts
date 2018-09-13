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

import { IO, Error } from "@cogneco/mend"

export class Source extends IO.BufferedReader implements Error.Handler {
	constructor(reader: IO.Reader, private handler: Error.Handler) {
		super(reader)
	}
	raise(message: string | Error.Message, level: Error.Level = Error.Level.Critical, type = "lexical", region?: Error.Region): void {
		if (typeof message == "string") {
			if (!region) {
				region = this.region
			}
			message = new Error.Message(message as string, level, type, region)
		}
		this.handler.raise(message)
	}
}
