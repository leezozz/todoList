import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(
        /<title>(.*?)<\/title>/,
        '<title>ToDoList</title>'
      )
    }
  }
}
export default defineConfig({
  plugins: [
    vue(),
    htmlPlugin(),
  ],
  server: {
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      },
      {
        find: 'store',
        replacement: path.resolve(__dirname, 'src/store')
      },
      {
        find: 'comps',
        replacement: path.resolve(__dirname, 'src/components')
      }
    ]
  }
})
