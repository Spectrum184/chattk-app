# Name ChatTK

## Installation

Setting up your own instance is easy

### Requirements

- NodeJS LTS 16.16.0
- Yarn package manager
- MongoDB 5.0(Replica set)

### steps

- Create the file `web/.env` and set the `VITE_API_URL` environment variable
- Create the file `api/.env` and set the following environment variables:
- `DB_URI` - Your mongodb instance's connection string (Optional, defaults to localhost)
- `DB_NAME` - The database name to use (Optional, defaults to `a_chat`)
- `PORT` - The port on which the API will listen on (Optional, defaults to `5000`)
- `TRUST_PROXY` - Set it to a truthy string if the API is behind a proxy (Optional, defaults to `false`)
- `CORS_ALLOWED_DOMAINS` - Set it to the address of the web client (Optional but should be set, otherwise the client wont be able to make requests) [Can have multiple values, separated by space]
- `SESSION_MAX_AGE` - Idle session expiry timeout. (Optional, defaults to `1209600000` or 14 days.) [Should be in milliseconds]
- `LOG_LEVEL` - Log level for pino logger. (Optional, defaults to `info`)
- `DISABLE_REQUEST_LOGGING` - Disables all request logging. (Optional, defaults to `false`)
- `DISABLE_SIGNUP` - Disables user registration. (Optional, defaults no `false`) [Set it to any truthy value.]
- Socketio admin: - `SOCKETIO_ADMIN_USERNAME` - Socket.io admin interface username (Required, if you want to use socket.io admin interface)
- `SOCKETIO_ADMIN_PASSWORD_HASH` - Bcrypt hash representation of a password for socket.io admin interface (Required, if you want to use socket.io admin interface)

          NOTE: ***Both*** values need to be set to enable socket.io admin.

- Run `yarn install` and `yarn build`
- Create database indexes using the script located at [`api/scripts/initDb.mjs`](api/scripts/initDb.mjs)
- Start everything with `yarn start`

## Roadmap

- Setup mongodb replica set: <https://silvae86.github.io/2021/03/04/migrate-mongodb-from-single-to-replicaset/>
