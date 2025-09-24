import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../components/WelcomeView.vue'
import BloodGlucoseView from '../components/BloodGlucoseView.vue'
import BloodPressureView from '../components/BloodPressureView.vue'
import HeartRateView from '../components/HeartRateView.vue'
import UsersView from '../components/UsersView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'WelcomeView',
      component: WelcomeView,
    },
    {
      path: '/users',
      name: 'UsersView',
      component: UsersView,
    },
    {
      path: '/bloodglucose',
      name: 'BloodGlucoseView',
      component: BloodGlucoseView,
    },
        {
      path: '/bloodpressure',
      name: 'BloodPressureView',
      component: BloodPressureView,
    },
        {
      path: '/heartrate',
      name: 'HeartRateView',
      component: HeartRateView,
    },
  ],
})

export default router
