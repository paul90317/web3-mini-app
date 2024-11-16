# Web3 Mini App with Turnkey
## Execution
### Build the frontend service `./frontend`
1. Build the configuration file `src/config.ts`:
	```typescript
	interface Config {
		WALLET_URL: string;
		BOT_NAME: string;
	}

	const config: Config = {
		WALLET_URL: 'http://127.0.0.1:3000',
		BOT_NAME: 'web3mini9bot'
	};

	export default config;
	```
2. Build and run the frontend:
	```bash
	npm install
	npm run dev
	```
	The service listens on port 80
### Build the wallet service `./wallet`
1. Set the configuration file `.env`:
	```env
	# Turnkey Organization
	PRIVATE_KEY=
	PUBLIC_KEY=
	ORG_ID=

	# RPC provider URL for Sepolia network
	RPC_PROVIDER_URL=https://sepolia.infura.io/v3/<your token>

	# Telegram Bot Token for authentication
	BOT_TOKEN=

	# Secret key for JWT
	SECRET_KEY=Any password that is secure enough
	```
	Follow [the Turnkey documentation](https://docs.turnkey.com/getting-started/quickstart) to obtain your organization ID and API key pair.  


2. Build and run the wallet service:
	```bash
	npm test
	```
	The service listens on port 3000
### Set Telegram OAuth domain
Follow [Telegram Login Widget](https://core.telegram.org/widgets/login) to set domain with [Telegram BotFather](https://t.me/BotFather)
