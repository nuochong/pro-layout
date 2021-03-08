import './index.less'

import debounce from 'lodash/debounce'
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { triggerEvent, inBrowser, isFun } from '../../utils/util'
import 'ant-design-vue/es/icon/style'
import Icon from 'ant-design-vue/es/icon'
import { defaultRenderLogo } from '../SiderMenu/SiderMenu'
import {renderMenuItem} from '../RouteMenu/BaseMenu'

export const NavHeaderProps = {
  collapsed: PropTypes.bool,
  handleCollapse: PropTypes.func,
  isMobile: PropTypes.bool.def(false),
  fixedHeader: PropTypes.bool.def(false),
  logo: PropTypes.any,
  menuRender: PropTypes.any,
  collapsedButtonRender: PropTypes.any,
  headerContentRender: PropTypes.any,
  rightContentRender: PropTypes.any,
  menus:PropTypes.array,
  i18nRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(false),

}

const NavHeader = {
  name: 'NavHeader',
  props: NavHeaderProps,
  render (h) {
    const { isMobile, logo, rightContentRender, headerContentRender,i18nRender } = this.$props

    // 一级菜单名称
    const getFirstLevel = (value) =>{
      let temp = [].concat(value).map(item => {
        let content = {}
        for (let it in item) {
          if (it !== 'children') {
            content[it] = item[it]
          }
        }
        return content
      })
      return temp
    }

    const onClick  = ({ item, key, keyPath })=>{
      console.log('点击了一级菜单',item, key, keyPath)
    }

    const onSelect = ({ item, key, selectedKeys })=>{
      console.log('选择了一级菜单',item, key, selectedKeys)
      this.$router.push({path:key})
    }

    const onOpenChange = (openKeys)=>{
      console.log('触发了一级菜单',openKeys)
      
    }

    const dynamicProps = {
      // props: {
      //   mode: this.mode,
      //   theme: this.theme,
      //   openKeys: this.openKeys,
      //   selectedKeys: this.selectedKeys
      // },
      on: {
        openChange: onOpenChange,
        select: onSelect,
        click:onClick
      }
    }

    const menuItem = this.menus.map(item => {
      // return <a-menu-item key={item.path}>{item.name}</a-menu-item>
      return  renderMenuItem(h,item,i18nRender)
    })

    return (
      <a-menu
        theme="dark"
        mode="horizontal"
        default-selected-keys={['2']}
        style={{ lineHeight: '64px' }}
        {...dynamicProps}
      >
        {menuItem}
      </a-menu>
    )
  },
  methods: {
    triggerResizeEvent: debounce(() => {
      inBrowser && triggerEvent(window, 'resize')
    })
  },
  beforeDestroy () {
    this.triggerResizeEvent.cancel && this.triggerResizeEvent.cancel()
  }
}

export default NavHeader
