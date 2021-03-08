import './Header.less'

import 'ant-design-vue/es/layout/style'
import Layout from 'ant-design-vue/es/layout'

import PropTypes from 'ant-design-vue/es/_util/vue-types'
import BaseMenu from './components/RouteMenu/BaseMenu'
import { defaultRenderLogoAntTitle, SiderMenuProps } from './components/SiderMenu/SiderMenu'
import GlobalHeader, { GlobalHeaderProps } from './components/GlobalHeader'
import NavHeader, { NavHeaderProps } from './components/NavHeader'
import { VueFragment } from './components'
import { isFun } from './utils/util'

const { Header } = Layout

export const HeaderViewProps = {
  ...NavHeaderProps,
  ...GlobalHeaderProps,
  ...SiderMenuProps,
  isMobile: PropTypes.bool.def(false),
  collapsed: PropTypes.bool,
  logo: PropTypes.any,
  hasSiderMenu: PropTypes.bool,
  autoHideHeader: PropTypes.bool,
  menuRender: PropTypes.any,
  headerRender: PropTypes.any,
  rightContentRender: PropTypes.any,
  visible: PropTypes.bool.def(true),
}


const renderContent = (h, props) => {
  const isTop = props.layout === 'topmenu'
  const isMix = props.layout === 'mixmenu'
  
  const maxWidth = 1200 - 280 - 120
  const contentWidth = props.contentWidth === 'Fixed'
  const baseCls = 'ant-pro-top-nav-header'
  const { logo, title, theme, isMobile, headerRender, rightContentRender, menuRender, menuHeaderRender } = props
  const rightContentProps = { theme, isTop, isMobile }
  let defaultDom = <GlobalHeader {...{ props: props }} />
  if(isMix && !isMobile){
    defaultDom = ( <div class={[baseCls, theme]}>
        <div class={[`${baseCls}-main`]}>
          {menuHeaderRender && (
            <div class={`${baseCls}-main-left`}>
              <div class={`${baseCls}-logo`} key="logo" id="logo">
                {defaultRenderLogoAntTitle(h, { logo, title, menuHeaderRender })}
              </div>
            </div>
          )}
          <div class={`${baseCls}-menu`} style={{ maxWidth: `${maxWidth}px`, flex: 1 }}>
            <NavHeader {...{ props: props }} />
          </div>
          {isFun(rightContentRender) && rightContentRender(h, rightContentProps) || rightContentRender}
        </div>
      </div>
      )
  }else if (isTop && !isMobile) {
    defaultDom = (
      <div class={[baseCls, theme]}>
        <div class={[`${baseCls}-main`, contentWidth ? 'wide' : '']}>
          {menuHeaderRender && (
            <div class={`${baseCls}-left`}>
              <div class={`${baseCls}-logo`} key="logo" id="logo">
                {defaultRenderLogoAntTitle(h, { logo, title, menuHeaderRender })}
              </div>
            </div>
          )}
          <div class={`${baseCls}-menu`} style={{ maxWidth: `${maxWidth}px`, flex: 1 }}>
            {menuRender && (isFun(menuRender) && menuRender(h, props) || menuRender) || (<BaseMenu {...{ props: props }} />) }
          </div>
          {isFun(rightContentRender) && rightContentRender(h, rightContentProps) || rightContentRender}
        </div>
      </div>
    )
  }
  if (headerRender) {
    return headerRender(h, props)
  }
  return defaultDom
}

const HeaderView = {
  name: 'HeaderView',
  props: HeaderViewProps,
  render (h) {
    const {
      visible,
      isMobile,
      layout,
      collapsed,
      siderWidth,
      fixedHeader,
      autoHideHeader,
      hasSiderMenu,
      menus
    } = this.$props
    const props = this.$props
    const isTop = layout === 'topmenu'
    const isMix = layout === 'mixmenu'

    // mix-fix-header
    const needSettingWidth = fixedHeader && hasSiderMenu && !isTop && !isMobile && !isMix

    const isFixedHeader = isMix ? true : fixedHeader
    const className = {
      'ant-pro-fixed-header': isFixedHeader,
      'ant-pro-top-menu': isTop,
      'ant-pro-mix-menu': isMix
    }
    const zIndex = layout === 'mixmenu' ? 99 : 9

    // 没有 <></> 暂时代替写法
    return (
      visible ? (
        <VueFragment>
          { isFixedHeader && <Header />}
          <Header
            style={{
              padding: 0,
              width: needSettingWidth
                ? `calc(100% - ${collapsed ? 80 : siderWidth}px)`
                : '100%',
              zIndex: zIndex,
              right: isFixedHeader ? 0 : undefined
            }}
            class={className}
          >
            {renderContent(h, props)}
          </Header>
        </VueFragment>
      ) : null
    )
  }
}

export default HeaderView
