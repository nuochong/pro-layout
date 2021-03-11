import './index.less'

import PropTypes from 'ant-design-vue/es/_util/vue-types'
import 'ant-design-vue/es/layout/style'
import Layout from 'ant-design-vue/es/layout'
import { isFun } from '../../utils/util'
import BaseMenu from '../RouteMenu'

import 'ant-design-vue/es/icon/style'
import Icon from 'ant-design-vue/es/icon'

const { Sider } = Layout

export const SiderMenuProps = {
  i18nRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(false),
  mode: PropTypes.string.def('inline'),
  theme: PropTypes.string.def('dark'),
  contentWidth: PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid'),
  collapsible: PropTypes.bool,
  collapsed: PropTypes.bool,
  handleCollapse: PropTypes.func,
  menus: PropTypes.array,
  siderWidth: PropTypes.number.def(256),
  isMobile: PropTypes.bool,
  layout: PropTypes.string.def('inline'),
  fixSiderbar: PropTypes.bool,
  logo: PropTypes.any,
  title: PropTypes.string.def(''),
  splitMenus: PropTypes.bool,
  regionalSettingsMenuHeader: PropTypes.bool,
  // render function or vnode
  menuHeaderRender: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.object, PropTypes.bool]),
  menuRender: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.object, PropTypes.bool]),
}

export const defaultRenderLogo = (h, logo) => {
  if (typeof logo === 'string') {
    return <img src={logo} alt="logo" />
  }
  if (typeof logo === 'function') {
    return logo()
  }
  return h(logo)
}

export const defaultRenderLogoAntTitle = (h, props) => {
  const {
    logo = 'https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg',
    title,
    menuHeaderRender,
    regionalSettingsMenuHeader
  } = props

  if (menuHeaderRender === false || regionalSettingsMenuHeader === false) {
    return null
  }
  const logoDom = defaultRenderLogo(h, logo)
  const titleDom = <h1>{title}</h1>

  if (menuHeaderRender) {
    return isFun(menuHeaderRender)
      && menuHeaderRender(h, logoDom, props.collapsed ? null : titleDom, props)
      || menuHeaderRender
  }
  return (
    <span>
      {logoDom}
      {titleDom}
    </span>
  )
}

const SiderMenu = {
  name: 'SiderMenu',
  model: {
    prop: 'collapsed',
    event: 'collapse'
  },
  props: SiderMenuProps,
  render (h) {
    const {
      collapsible,
      collapsed,
      siderWidth,
      fixSiderbar,
      splitMenus,
      regionalSettingsMenuHeader,
      mode,
      theme,
      menus,
      logo,
      title,
      onMenuHeaderClick = () => null,
      i18nRender,
      menuHeaderRender,
      menuRender,
      layout,
      isMobile
    } = this

    const siderCls = ['ant-pro-sider-menu-sider','ant-pro-sider-fixed']
    if (fixSiderbar) siderCls.push('fix-sider-bar')
    let themeNew = theme
    if (layout === 'mixmenu' && !isMobile) themeNew = 'light'
    if (themeNew === 'light') siderCls.push('light')
    
    // const handleCollapse = (collapsed, type) => {
    //   this.$emit('collapse', collapsed)
    // }

    let menusNew = []
    if(layout === 'mixmenu' && splitMenus){
    // 处理二级以后菜单
    const routes = this.$route.matched.concat()
    const selectedKeys = routes[1].path
    
    menus.map(item=>{
      if(item.path === selectedKeys){
        menusNew = item.children
      }
    })
    }else{
      menusNew = menus
    }

    const headerDom = defaultRenderLogoAntTitle(h, {
      logo, title, menuHeaderRender, collapsed,regionalSettingsMenuHeader
    })

    return (<Sider
      class={siderCls}
      breakpoint={'lg'}
      trigger={null}
      width={siderWidth}
      theme={themeNew}
      collapsible={collapsible}
      collapsed={collapsed}
    >
      {headerDom && (
        <div
          class="ant-pro-sider-menu-logo"
          onClick={onMenuHeaderClick}
          id="logo"
        >
          <router-link to={{ path: '/' }}>
            {headerDom}
          </router-link>
        </div>
      )}
      <div style="flex: 1 1 0%; overflow: hidden auto;">
      {menuRender && (
        isFun(menuRender)
          && menuRender(h, this.$props)
          || menuRender
      ) || (
        <BaseMenu collapsed={collapsed} menus={menusNew} mode={mode} theme={themeNew} i18nRender={i18nRender} layout={layout}/>
      )}
      </div>
      {/* <div class="ant-pro-sider-links">
        <ul role="menu" class="ant-pro-sider-link-menu ant-menu-dark ant-menu-root ant-menu ant-menu-inline">
          <li role="menuitem" class="ant-pro-sider-collapsed-button ant-menu-item" style="padding-left: 16px;">
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          </li>
        </ul>
      </div> */}
    </Sider>)
  }
}

export default SiderMenu
