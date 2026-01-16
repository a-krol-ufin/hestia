import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import Navbar from '../components/Navbar.vue'
import Hero from '../components/Hero.vue'
import FeaturesSection from '../components/FeaturesSection.vue'
import Footer from '../components/Footer.vue'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      content: {
        hero: {
          headline: 'Your Home, Harmonized.',
        },
      },
    },
    pl: {
      content: {
        hero: {
          headline: 'Twój dom w pełnej harmonii.',
        },
      },
    },
  },
})

describe('App', () => {
  it('renders properly', () => {
    const pinia = createPinia()
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, i18n],
      },
    })
    expect(wrapper.findComponent(Navbar).exists()).toBe(true)
    expect(wrapper.findComponent(Hero).exists()).toBe(true)
    expect(wrapper.findComponent(FeaturesSection).exists()).toBe(true)
    expect(wrapper.findComponent(Footer).exists()).toBe(true)
    expect(wrapper.text()).toContain('Your Home, Harmonized.')
  })
})
