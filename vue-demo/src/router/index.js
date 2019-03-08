import Vue from 'vue'
import Router from 'vue-router'
import EntityDetail from '@/components/EntityDetail'
import EntityNetwork from '@/components/EntityNetwork'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/EntityDetail',
      name: 'EntityDetail',
      component: EntityDetail
    },
		{
		  path: '/EntityNetwork',
		  name: 'EntityNetwork',
		  component: EntityNetwork
		}
  ]
})
