import './index.less'

import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { triggerEvent, inBrowser, isFun } from '../../utils/util'
import { defaultRenderLogo } from '../SiderMenu/SiderMenu'
import menu,{toggle,renderCollapsedButton} from '../../mixins/menu'

export const GlobalHeaderProps = {
  collapsed: PropTypes.bool,
  handleCollapse: PropTypes.func,
  isMobile: PropTypes.bool.def(false),
  fixedHeader: PropTypes.bool.def(false),
  logo: PropTypes.any,
  menuRender: PropTypes.any,
  collapsedButtonRender: PropTypes.any,
  headerContentRender: PropTypes.any,
  rightContentRender: PropTypes.any,
}

const GlobalHeader = {
  name: 'GlobalHeader',
  props: GlobalHeaderProps,
  mixins:[menu],
  render (h) {
    const { isMobile, logo, rightContentRender, headerContentRender } = this.$props

    const headerCls = 'ant-pro-global-header'

    return (
      <div class={headerCls}>
        {isMobile && (
          <a class={`${headerCls}-logo`} key="logo" href={'/'}>
            {defaultRenderLogo(h, logo)}
          </a>
        )}
        {renderCollapsedButton(h,this,'header')}
        {headerContentRender && (
          <div class={`${headerCls}-content`}>
            {isFun(headerContentRender) && headerContentRender(h, this.$props) || headerContentRender}
          </div>
        )}
        {isFun(rightContentRender) && rightContentRender(h, this.$props) || rightContentRender}
      </div>
    )
  },
}

export default GlobalHeader
