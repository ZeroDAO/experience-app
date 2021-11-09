<template>
  <a-dropdown :trigger="['click']" placement="topRight">
    <a class="ant-dropdown-link" @click="e => e.preventDefault()" :style="{ color: titleColor, fontSize: titleSize }"> {{ i18n.languageName }}<DownOutlined /></a>
    <template v-slot:overlay>
      <a-menu class="dropdown-panel">
        <a-menu-item v-for="(value, key) of LanguageNameList" :key="key" @click="changeLanguage(key)">
          <span :style="{ color: textColor }">{{ LanguageNameList[key] }}</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import { defineComponent } from 'vue'
import { setLang, i18nInstance, LanguageNameList } from '../i18n/index'
import { message } from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  props: {
    titleColor: {
      type: String,
      default: '#8a96d9'
    },
    textColor: {
      type: String,
      default: '#fff'
    },
    titleSize: {
      type: String,
      default: '14px'
    }
  },
  components: {
    DownOutlined
  },
  setup() {
    const { i18n } = i18nInstance
    const changeLanguage = e => {
      const lang = e
      setLang(lang).then(result => {
        if (result === lang) {
          message.success(`${i18n.value['Current Language:']} ${i18n.value.languageName}`)
        }
      })
    }
    return {
      LanguageNameList,
      changeLanguage,
      i18n
    }
  }
})
</script>
