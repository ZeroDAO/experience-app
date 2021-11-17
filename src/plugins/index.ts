import { createApp } from 'vue'

/**
 * @description Load all Plugins
 * @param  {ReturnType<typeofcreateApp>} app
 */
export function loadAllPlugins(app: ReturnType<typeof createApp>) {
  const files = require.context('.', true, /\.ts$/)
  files.keys().forEach(key => {
    if (typeof files(key).default === 'function') {
      if (key !== './index.ts') files(key).default(app)
    }
  })
}
