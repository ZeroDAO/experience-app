import { kebabCase } from 'lodash'
import { createApp } from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { StaticConfig } from '@/config/app'
// iconfont: 2x.antdv.com/components/icon-cn/#components-icon-demo-use-iconfont.cn
const IconFont: any = createFromIconfontCN({
  scriptUrl: StaticConfig.IconfontURL
})

/**
 * @description Automatically register components under . /src/components/global as a global component
 * @param {vue} app Current application examples
 * @returns {void} void
 */
export function registeGlobalComponent(app: ReturnType<typeof createApp>): void {
  const files = require.context('./global', true, /\.(vue|ts)$/)
  files.keys().forEach(key => {
    const config = files(key)
    const name = kebabCase(key.replace(/^\.\//, '').replace(/\.\w+$/, ''))
    app.component(name, config.default || config)
  })

  // Global Registration iconfont
  app.component('IconFont', IconFont)
}
