import debounce from 'lodash/debounce'
import { triggerEvent, inBrowser, isFun } from '../utils/util'

import 'ant-design-vue/es/icon/style'
import Icon from 'ant-design-vue/es/icon'

export const toggle = (that) => {
  const { collapsed, handleCollapse } = that.$props
  if (handleCollapse) handleCollapse(!collapsed)
  that.triggerResizeEvent()
}
const defaultRenderCollapsedButton = (h, collapsed) => (
  <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
)

export const renderCollapsedButton = (h, that, type = 'header') => {
  const {
    collapsed,
    collapsedButtonRender = defaultRenderCollapsedButton,
    menuRender
  } = that.$props

  const icon = isFun(collapsedButtonRender) && collapsedButtonRender(h, collapsed) || collapsedButtonRender
  const headerIcon = <span class="ant-pro-global-header-trigger" onClick={() => { toggle(that) }}>
    {icon}
  </span>
  if (collapsedButtonRender !== false && menuRender !== false) {
    return type === 'header' ? headerIcon : icon
  }
  return null
}

const menu = {
  methods: {
    triggerResizeEvent: debounce(() => {
      inBrowser && triggerEvent(window, 'resize')
    })
  },
  beforeDestroy() {
    this.triggerResizeEvent.cancel && this.triggerResizeEvent.cancel()
  }
}

export default menu