const model = new Model({
	database: new MySql({
		connection: new Url("mysql://user:password@server.domain.tld/database"),
		tables: {
			users: {
				columns: {
					id: {
						type: "number",
						indexed: true,
					},
					name: {
						type: "string",
					},
				},
			},
		},
	}),
	service: new Rest({
		listen: new Url("https://0.0.0.0:80/api"),
		root: new Resource({
			users: new Collection({
				create: data => data,
				read: id => false,
				update: (id, data) => data,
				delete: id => false,
			}),
		}),
	}),
})
