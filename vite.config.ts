/// <reference types="node" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer'],
      globals: {
        Buffer: true,
        global: true,
        process: false
      },
      protocolImports: false
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      crypto: path.resolve(__dirname, './src/shims/identusCrypto.ts'),
      path: path.resolve(__dirname, './src/shims/identusPath.ts'),
      url: path.resolve(__dirname, './src/shims/identusUrl.ts')
    }
  },
  server: {
    proxy: {
      '/mediator': {
        target: 'http://localhost:8081',
        rewrite: (requestPath) => requestPath.replace(/^\/mediator/, '')
      },
      '/didcomm': {
        target: 'http://localhost:8080'
      },
      '/cloud-agent': {
        target: 'http://localhost:8080'
      }
    }
  }
})
