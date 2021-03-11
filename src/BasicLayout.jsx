import './BasicLayout.less'

import PropTypes from 'ant-design-vue/es/_util/vue-types'

import 'ant-design-vue/es/layout/style'
import Layout from 'ant-design-vue/es/layout'

import { ContainerQuery } from 'vue-container-query'
import { SiderMenuWrapper, GlobalFooter } from './components'
import { contentWidthCheck, getComponentFromProp, isFun } from './utils/util'
import { SiderMenuProps } from './components/SiderMenu'
import HeaderView, { HeaderViewProps } from './Header'
import WrapContent from './WrapContent'
import ConfigProvider from './components/ConfigProvider'
import PageHeaderWrapper from './components/PageHeaderWrapper'

export const BasicLayoutProps = {
  ...SiderMenuProps,
  ...HeaderViewProps,
  contentWidth: PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid'),
  // contentWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).def('Fluid'),
  locale: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).def('en-US'),
  breadcrumbRender: PropTypes.func,
  disableMobile: PropTypes.bool.def(false),
  mediaQuery: PropTypes.object.def({}),
  handleMediaQuery: PropTypes.func,
  footerRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(undefined),
  multiTab: PropTypes.bool.def(false),
  splitMenus: PropTypes.bool.def(true),
  footer: PropTypes.bool.def(true),
  regionalSettingsMenu: PropTypes.bool.def(true),
  regionalSettingsMenuHeader: PropTypes.bool.def(true),
  regionalSettingsHeader: PropTypes.bool.def(true),
  multiTabFixed: PropTypes.bool.def(false),
  transitionName: PropTypes.oneOf(['null', 'slideUpload', 'slideRight','fadeIn','zoom']).def('null'),
}

const MediaQueryEnum = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599
  },
  'screen-xxl': {
    minWidth: 1600
  }
}

const getPaddingLeft = (
  hasLeftPadding,
  collapsed = undefined,
  siderWidth
) => {
  if (hasLeftPadding) {
    return collapsed ? 80 : siderWidth
  }
  return 0
}

const headerRender = (h, props) => {
  if (props.headerRender === false) {
    return null
  }
  return <HeaderView { ...{ props } } />
}

const defaultI18nRender = (key) => key

const BasicLayout = {
  name: 'BasicLayout',
  functional: true,
  props: BasicLayoutProps,
  render (h, content) {
    const { props, children } = content
    const {
      layout,
      // theme,
      isMobile,
      collapsed,
      mediaQuery,
      handleMediaQuery,
      handleCollapse,
      siderWidth,
      fixSiderbar,
      splitMenus,
      footer,
      regionalSettingsMenu,
      multiTab,
      regionalSettingsMenuHeader,
      regionalSettingsHeader,
      transitionName,
      i18nRender = defaultI18nRender,
      fixedHeader,
      multiTabFixed
    } = props

    const footerRender = getComponentFromProp(content, 'footerRender')
    const rightContentRender = getComponentFromProp(content, 'rightContentRender')
    const collapsedButtonRender = getComponentFromProp(content, 'collapsedButtonRender')
    const menuHeaderRender = getComponentFromProp(content, 'menuHeaderRender')
    const breadcrumbRender = getComponentFromProp(content, 'breadcrumbRender')
    const headerContentRender = getComponentFromProp(content, 'headerContentRender')
    const menuRender = getComponentFromProp(content, 'menuRender')

    const isTopMenu = layout === 'topmenu'
    const hasSiderMenu = !isTopMenu
    // If it is a fix menu, calculate padding
    // don't need padding in phone mode
    const hasLeftPadding = fixSiderbar && !isTopMenu && !isMobile
    const cdProps = {
      ...props,
      hasSiderMenu,
      footerRender,
      menuHeaderRender,
      rightContentRender,
      collapsedButtonRender,
      breadcrumbRender,
      headerContentRender,
      menuRender
    }

    console.log('cdProps',props)
    const contentWidthNew = layout === 'mixmenu' ? 'Fluid' : props.contentWidth
    return (
      <ConfigProvider i18nRender={i18nRender} contentWidth={contentWidthNew} breadcrumbRender={breadcrumbRender}>
        <ContainerQuery query={MediaQueryEnum} onChange={handleMediaQuery}>
          <Layout class={{
            'ant-pro-basicLayout': true,
            'ant-pro-topmenu': isTopMenu,
            ...mediaQuery
          }}>
            { regionalSettingsMenu && <SiderMenuWrapper
              { ...{ props: cdProps } }
              collapsed={collapsed}
              onCollapse={handleCollapse}
            /> }
            <Layout 
            class={[layout]} style={{
              paddingLeft: hasSiderMenu
                ? `${getPaddingLeft(!!hasLeftPadding, collapsed, siderWidth)}px`
                : undefined,
              minHeight: '100vh'
            }}>
              {regionalSettingsHeader && headerRender(h, {
                ...cdProps,
                mode: 'horizontal',
              })}
              { multiTabFixed && <div class="ant-pro-multi-tab-fixed"></div> }
              { multiTab && <multi-tab i18nRender={i18nRender} layout={layout} 
              fixedHeader={fixedHeader} hasSiderMenu={hasSiderMenu} isMobile={isMobile}
              collapsed={collapsed} siderWidth={siderWidth} multiTabFixed={multiTabFixed} regionalSettingsMenu={regionalSettingsMenu}></multi-tab> }
              { <WrapContent class="ant-pro-basicLayout-content" contentWidth={contentWidthNew} >
                {children}
              </WrapContent>}
              { footer && footerRender !== false && (
                <Layout.Footer>
                  { isFun(footerRender) && footerRender(h) || footerRender }
                </Layout.Footer>
                ) || null
              }
            </Layout>
          </Layout>
        </ContainerQuery>
      </ConfigProvider>
    )
  }
}

BasicLayout.install = function (Vue) {
  Vue.component(PageHeaderWrapper.name, PageHeaderWrapper)
  Vue.component('PageContainer', PageHeaderWrapper)
  Vue.component('ProLayout', BasicLayout)
}

export default BasicLayout
