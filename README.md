# Web3 Mini App with Turnkey
## Execution
### Set the frontend service `./frontend`
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
	
## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
