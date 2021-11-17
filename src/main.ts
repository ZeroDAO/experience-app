import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { AppConfig } from '@/config/app'

import { loadAllPlugins } from '@/plugins'
import { registeGlobalComponent } from '@/components/index'

import '@/i18n/index'
import './styles/antd.less'

const app: ReturnType<typeof createApp> = createApp(App)
app.config.globalProperties = AppConfig

/** load all Plugins */
loadAllPlugins(app)
registeGlobalComponent(app)

app
  .use(store)
  .use(router)
  .mount('#app')
