const Color = {
  antd: {
    primary: '#00a971',
    link: '#00a971',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    fontSizeBase: '14px',
    headingColor: 'rgba(0, 0, 0, 0.85)',
    textColor: 'rgba(0, 0, 0, 0.65)',
    textColorSecondary: 'rgba(0, 0, 0, 0.45)',
    disabledColor: 'rgba(0, 0, 0, 0.25)',
    borderRadiusBase: '2px',
    borderColorBase: '#d9d9d9',
    boxShadowBase: '0 2px 8px rgba(0, 0, 0, 0.15);'
  }
}

type ColorType = typeof Color

export { Color, ColorType }
