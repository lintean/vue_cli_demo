import Vue from 'vue'
import Router from 'vue-router'
import EntitySearch from '@/components/EntitySearch'
import EntityDetail from '@/components/EntityDetail'
import EntityNetwork from '@/components/EntityNetwork'
import ImageView from '@/components/ImageView'

Vue.use(Router)

//这里是路由中心，在这里可以把不同的组件路由在一起
export default new Router({
	//基础路由路径
  base: '/entitysearch', 
  routes: [
		{
			//路由路径，访问http://主机:端口/entitysearch/EntitySearch就可以访问到
			path: '/EntitySearch',
			//路由的组件名称
			name: 'EntitySearch',
			//路由的组件
			component: EntitySearch
		},
    {
      path: '/EntityDetail',
      name: 'EntityDetail',
      component: EntityDetail
    },
    {
      path: '/EntityNetwork',
      name: 'EntityNetwork',
      component: EntityNetwork
    },
    {
      path: '/ImageView',
      name: 'ImageView',
      component: ImageView
    }
  ]
})
