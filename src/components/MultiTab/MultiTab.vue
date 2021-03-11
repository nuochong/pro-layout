<script>
import events from './events'

export default {
  name: 'MultiTab',
  props:{
    i18nRender:{
      type:Function,
      require:true
    },
    layout:{
      type: String,
      require: true
    },
    fixedHeader:{
      type: Boolean,
      require: true
    },
    hasSiderMenu:{
      type: Boolean,
      require: true
    },
    isMobile:{
      type: Boolean,
      require: true
    },
    collapsed:{
      type: Boolean,
      require: true
    },
    siderWidth:{
      type: Number,
      require: true
    },
    multiTabFixed: {
      type: Boolean,
      require: true
    },
    regionalSettingsMenu: {
      type: Boolean,
      require: true
    }
  },
  data () {
    return {
      fullPathList: [],
      pages: [],
      activeKey: '',
      newTabIndex: 0,
      anticonState: true,
      currentFullPath: ''
    }
  },
  created () {
    // bind event
    events.$on('open', val => {
      if (!val) {
        throw new Error(`multi-tab: open tab ${val} err`)
      }
      this.activeKey = val
    }).$on('close', val => {
      if (!val) {
        this.closeThat(this.activeKey)
        return
      }
      this.closeThat(val)
    }).$on('rename', ({ key, name }) => {
      // console.log('rename', key, name)
      try {
        const item = this.pages.find(item => item.path === key)
        item.meta.customTitle = name
        this.$forceUpdate()
      } catch (e) {
      }
    })

    this.pages.push(this.$route)
    this.fullPathList.push(this.$route.fullPath)
    this.selectedLastPath()
  },
  methods: {
    reload () {
      this.anticonState = false
      setTimeout(()=>{
        this.anticonState = true
      },1000)
      events.$emit('reload')
    },
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    remove (targetKey) {
      this.pages = this.pages.filter(page => page.fullPath !== targetKey)
      this.fullPathList = this.fullPathList.filter(path => path !== targetKey)
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!this.fullPathList.includes(this.activeKey)) {
        this.selectedLastPath()
      }
    },
    selectedLastPath () {
      this.activeKey = this.fullPathList[this.fullPathList.length - 1]
    },
    // content menu
    closeThat (e) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (this.fullPathList.length > 1) {
        this.remove(e)
      } else {
        this.$message.info(this.setI18n('app.multitab.this-is-the-last-tag-it-can-t-be-closed'))
      }
    },
    closeLeft (e) {
      const currentIndex = this.fullPathList.indexOf(e)
      if (currentIndex > 0) {
        this.fullPathList.forEach((item, index) => {
          if (index < currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info(this.setI18n('app.multitab.there-is-no-label-on-the-left'))
      }
    },
    closeRight (e) {
      const currentIndex = this.fullPathList.indexOf(e)
      if (currentIndex < (this.fullPathList.length - 1)) {
        this.fullPathList.forEach((item, index) => {
          if (index > currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info(this.setI18n('app.multitab.there-is-no-label-on-the-right'))
      }
    },
    closeAll (e) {
      const currentIndex = this.fullPathList.indexOf(e)
      this.fullPathList.forEach((item, index) => {
        if (index !== currentIndex) {
          this.remove(item)
        }
      })
    },
    closeMenuClick (key, route) {
      this[key](route)
    },
    setI18n(value){
      return this.i18nRender && this.i18nRender(value)
    },
    renderTabPaneMenu (e) {
      return (
        <a-menu {...{ on: { click: ({ key, item, domEvent }) => { this.closeMenuClick(key, e) } } }}>
          <a-menu-item key="closeThat">{ this.setI18n('app.multitab.close-current-label') }</a-menu-item>
          <a-menu-item key="closeRight">{ this.setI18n('app.multitab.close-the-right-side') }</a-menu-item>
          <a-menu-item key="closeLeft">{ this.setI18n('app.multitab.close-the-left-side') }</a-menu-item>
          <a-menu-item key="closeAll">{ this.setI18n('app.multitab.close-all') }</a-menu-item>
        </a-menu>
      )
    },
    // render
    renderTabPane (title, keyPath,anticon = true) {
      const menu = this.renderTabPaneMenu(keyPath)
      return (
        <a-dropdown overlay={menu} trigger={['contextmenu']}>
          <span style={{ userSelect: 'none' }}>
            { this.setI18n(title) }
            { anticon && <a-icon type="reload" class={{'ant-pro-multi-tab-reload-btn':true,'anticon-spin':!this.anticonState}} onClick={()=>{this.reload()}} /> }
          </span>
        </a-dropdown>
      )
    }
  },
  watch: {
    '$route': function (newVal) {
      this.activeKey = newVal.fullPath
      if (this.fullPathList.indexOf(newVal.fullPath) < 0) {
        this.fullPathList.push(newVal.fullPath)
        newVal.meta['anticon'] = true
        this.pages.push(newVal)
      }
    },
    activeKey: function (newPathKey) {
      this.$router.push({ path: newPathKey })
      this.pages.map(item=>{
        console.log('fullPath',item.fullPath)
        console.log('newPathKey',newPathKey)
        if(item.fullPath !== newPathKey){
          item.meta.anticon = false
        }else{
          item.meta.anticon = true
        }
        return item
      })
      this.currentFullPath = newPathKey
    }
  },
  render () {
    const { onEdit, $data: { pages },fixedHeader,hasSiderMenu,isMobile,collapsed,siderWidth,layout,multiTabFixed, regionalSettingsMenu,setI18n } = this
    
    const panes = pages.map(page => {
      return (
        <a-tab-pane
          style={{ height: 0 }}
          tab={this.renderTabPane(page.meta.customTitle || page.meta.title, page.fullPath,page.meta.anticon)}
          key={page.fullPath} closable={pages.length > 1}
        >
        </a-tab-pane>)
    })
    const isTop = layout === 'topmenu'
    // const isMix = layout === 'mixmenu'
    const needSettingWidth = fixedHeader && hasSiderMenu && !isTop && !isMobile && multiTabFixed

    return (
      <div class={{'ant-pro-multi-tab':true,'ant-pro-multi-tab-wrap-fixed':multiTabFixed}} style={{
            'margin': '0px',
            'padding-top': '6px',
            'width': needSettingWidth
                ? `calc(100% - ${collapsed ? 80 : siderWidth}px)`
                : '100%',
      }}>
        <div class="ant-pro-multi-tab-wrapper">
          <a-tabs
            hideAdd
            type={'editable-card'}
            v-model={this.activeKey}
            tabBarStyle={{ background: '#FFF', margin: 0, paddingLeft: '16px', paddingTop: '1px' }}
            {...{ on: { edit: onEdit } }}>
            {panes}
            <a-dropdown trigger={['click']} slot="tabBarExtraContent">
                <a class="ant-dropdown-link ant-pro-multi-tab-dropdown-menu-btn" onClick={e => e.preventDefault()}>
                  <a-icon type="ellipsis" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item key="0">
                    <a href="javascript:;" onClick={()=>{this.closeAll(this.currentFullPath)}}>{setI18n('app.multitab.close-all')}</a>
                  </a-menu-item>
                  <a-menu-item key="1">
                    <a href="javascript:;" onClick={()=>{this.reload()}} >{setI18n('app.multitab.refresh-current-page')}</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
          </a-tabs>
        </div>
      </div>
    )
  }
}
</script>
