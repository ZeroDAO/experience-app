import { Alert, Result, Progress, Steps, Typography, InputNumber, Modal, Radio, Layout, Avatar, Button, Card, Row, Col, Tag, Tabs, Form, Input, ConfigProvider, Select, DatePicker, Dropdown, Menu, Divider, Badge, BackTop, Carousel, Statistic, Spin, List, Descriptions } from 'ant-design-vue'

/**
 * @description 手动注册 antd-vue 组件,达到按需加载目的
 * @description Automatically register components under Button, such as Button.Group
 * @param {ReturnType<typeof createApp>} app
 * @returns void
 */
export default function loadComponent(app: any) {
  app.use(Button)
  app.use(Result)
  app.use(Alert)
  app.use(Steps)
  app.use(Progress)
  app.use(Typography)
  app.use(Modal)
  app.use(Radio)
  app.use(Card)
  app.use(Layout)
  app.use(InputNumber)
  app.use(Row)
  app.use(Col)
  app.use(Tag)
  app.use(Tabs)
  app.use(Form)
  app.use(Input)
  app.use(Dropdown)
  app.use(Menu)
  app.use(Divider)
  app.use(ConfigProvider)
  app.use(Select)
  app.use(DatePicker)
  app.use(BackTop)
  app.use(Badge)
  app.use(Carousel)
  app.use(Statistic)
  app.use(Spin)
  app.use(Avatar)
  app.use(List)
  app.use(Descriptions)
}
