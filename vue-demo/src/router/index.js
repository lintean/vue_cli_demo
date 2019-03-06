import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import EntitySearch from '@/components/EntitySearch'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/EntitySearch',
      name: 'EntitySearch',
      component: EntitySearch
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
