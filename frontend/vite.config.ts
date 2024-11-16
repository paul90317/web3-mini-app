import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import config from './src/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 80,
    proxy: {
      '/api': {
        target: config.WALLET_URL, // 後端服務地址
        changeOrigin: true,             // 確保跨域請求頭的來源被修改為目標 URL
        rewrite: (path) => path.replace(/^\/api/, ''), // 將 `/api` 去掉
      },
    },
  },
})
