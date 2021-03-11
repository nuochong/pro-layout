import PropTypes from 'ant-design-vue/es/_util/vue-types'

import 'ant-design-vue/es/layout/style'
import Layout from 'ant-design-vue/es/layout'
import ConfigProvider from 'ant-design-vue/es/config-provider'
import GridContent from './components/GridContent'
import events from './components/MultiTab/events'
const { Content } = Layout

const WrapContentProps = {
  isChildrenLayout: PropTypes.bool,
  location: PropTypes.any,
  contentHeight: PropTypes.number,
  contentWidth: PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid'),
}

const WrapContent = {
  name: 'WrapContent',
  props: WrapContentProps,
  data(){
    return {
      isRouterAlive:true
    }
  },
  mounted(){
    events.$on('reload',()=>{
      this.isRouterAlive = false
      this.$nextTick( ()=> {
        this.isRouterAlive = true
      })
    })
  },
  render (h) {
    const {
      isChildrenLayout,
      contentWidth
    } = this.$props
    return (
      this.isRouterAlive && <Content>
        <ConfigProvider
          getPopupContainer={(el, dialogContext) => {
            if (isChildrenLayout) {
              return el.parentNode()
            }
            return document.body
          }}
        >
          <div class="ant-pro-basicLayout-children-content-wrap">
            <GridContent contentWidth={contentWidth}>{this.$slots.default}</GridContent>
          </div>
        </ConfigProvider>
      </Content>
    )
  }
}

export default WrapContent
