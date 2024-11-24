# Web3 Mini App with Turnkey
## Execution

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

    # Telegram Bot Name
    NEXT_PUBLIC_BOT_NAME=

	# Secret key for JWT
	SECRET_KEY=<Any password that is secure enough>
	```
	Follow [the Turnkey documentation](https://docs.turnkey.com/getting-started/quickstart) to obtain your organization ID and API key pair.  
2. Build and run the frontend:
	```bash
	npm install .
	npm run dev
	```

### Set Telegram OAuth domain
Follow [Telegram Login Widget](https://core.telegram.org/widgets/login) to set domain with [Telegram BotFather](https://t.me/BotFather)

## Reference
* [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
* [Telegram Login Widget](https://core.telegram.org/widgets/login)
* [Turnkey documentation](https://docs.turnkey.com/getting-started/quickstart)
* [How to Build a Onchain Telegram Mini App](https://youtu.be/ojUSPOwbpWo?si=U4mriokMMMQVD-2_)
* [Next.js Document](https://nextjs.org/)
* Turnkey Demo Telegram Mini App: [github.com](https://github.com/tkhq/demo-telegram-mini-app), [t.me](https://t.me/TurnkeyDemoAppBot)