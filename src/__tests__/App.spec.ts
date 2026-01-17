import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import Navbar from '../components/Navbar.vue'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      content: {
        navbar: {
          links: {
            home: { label: 'Home' },
            features: { label: 'Features' },
            about: { label: 'About' },
            contact: { label: 'Contact' },
          },
          user: {
            login: 'Login',
            logout: 'Logout',
            loggedAs: 'Logged as',
          },
        },
      },
    },
  },
})

describe('Navbar', () => {
  it('renders properly with navigation links', () => {
    const pinia = createPinia()
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/login', component: { template: '<div>Login</div>' } },
      ],
    })

    const wrapper = mount(Navbar, {
      global: {
        plugins: [pinia, i18n, router],
      },
    })

    expect(wrapper.text()).toContain('Hestia')
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Features')
    expect(wrapper.text()).toContain('About')
    expect(wrapper.text()).toContain('Contact')
  })

  it('shows language switcher with PL and EN options', () => {
    const pinia = createPinia()
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
    })

    const wrapper = mount(Navbar, {
      global: {
        plugins: [pinia, i18n, router],
      },
    })

    expect(wrapper.text()).toContain('PL')
    expect(wrapper.text()).toContain('EN')
  })
})
