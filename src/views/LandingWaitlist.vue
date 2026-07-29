<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import {
  CursorArrowRaysIcon,
  DocumentTextIcon,
  StarIcon,
  UserGroupIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

type WaitlistRole = 'Talent' | 'Agent/Agency'

interface WaitlistContent {
  waitlistTitle: string
  buttonText: string
  badge: string
  heading: string
  description: string
  benefits: string[]
}

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSecsqb_dhjv4uMIFD374sOkoO0dVDWf-0VSLHRqR52-XTagkw/formResponse'

const GOOGLE_FORM_FIELDS = {
  firstName: 'entry.1289327921',
  lastName: 'entry.1555893372',
  email: 'entry.518145700',
  role: 'entry.955340884'
} as const

const selectedRole = ref<WaitlistRole>('Talent')

const firstName = ref('')
const lastName = ref('')
const email = ref('')

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

let messageTimer: ReturnType<typeof setTimeout> | undefined

const currentYear = new Date().getFullYear()

const pageContent = computed<WaitlistContent>(() => {
  if (selectedRole.value === 'Talent') {
    return {
      waitlistTitle: 'SECURE YOUR SPOT — TALENT WAITLIST',
      buttonText: 'Secure my spot on the waitlist',
      badge: 'FOR TALENT',
      heading: 'Your career deserves a real stage.',
      description:
        'Move beyond scattered WhatsApp groups. Build a professional profile and put your talent in front of production houses, agencies, and casting professionals.',
      benefits: [
        'A searchable professional profile with reels and credits',
        'Direct applications to casting opportunities',
        'Free profile creation'
      ]
    }
  }

  return {
    waitlistTitle: 'SECURE YOUR SPOT — AGENCY WAITLIST',
    buttonText: 'Join the agency waitlist',
    badge: 'FOR AGENCIES & PRODUCTION HOUSES',
    heading: 'Find the right talent in hours, not weeks.',
    description:
      'Replace scattered chats with a searchable talent database built for the African entertainment industry.',
    benefits: [
      'Post casting calls and receive applications',
      'Search talent by skills, experience, and location',
      'Verification for eligible production houses and agencies',
      'Create an account free and pay only for selected promotions'
    ]
  }
})

const howItWorksCards = [
  {
    title: 'Build your profile',
    description:
      'Upload headshots, video reels, credits, and skills. Your profile becomes your casting CV — always available and searchable.',
    tag: 'TALENT',
    icon: UserIcon,
    iconBg: 'bg-[#EAF2FF]',
    iconColor: 'text-[#2563EB]',
    tagClass: 'border-[#FCD9A7] bg-[#FFF8EB] text-[#D97706]'
  },
  {
    title: 'Create your professional account',
    description:
      'Register as a production house, talent agency, or casting agent and create a credible presence on CastHall.',
    tag: 'AGENCY / PRODUCTION',
    icon: UserGroupIcon,
    iconBg: 'bg-[#EAF2FF]',
    iconColor: 'text-[#2563EB]',
    tagClass: 'border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]'
  },
  {
    title: 'Browse and apply',
    description:
      'Discover open casting calls by role, location, compensation, and project category, then apply directly through the platform.',
    tag: 'TALENT',
    icon: CursorArrowRaysIcon,
    iconBg: 'bg-[#FFF4E5]',
    iconColor: 'text-[#F97316]',
    tagClass: 'border-[#FCD9A7] bg-[#FFF8EB] text-[#D97706]'
  },
  {
    title: 'Post casting opportunities',
    description:
      'Publish detailed casting calls and organise applications without relying on fragmented messages and inboxes.',
    tag: 'AGENCY / PRODUCTION',
    icon: DocumentTextIcon,
    iconBg: 'bg-[#FFF4E5]',
    iconColor: 'text-[#F97316]',
    tagClass: 'border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]'
  },
  {
    title: 'Get discovered',
    description:
      'Maintain a professional profile that casting directors, agencies, and production houses can discover when searching for talent.',
    tag: 'TALENT',
    icon: StarIcon,
    iconBg: 'bg-[#F3E8FF]',
    iconColor: 'text-[#9333EA]',
    tagClass: 'border-[#FCD9A7] bg-[#FFF8EB] text-[#D97706]'
  },
  {
    title: 'Cast with confidence',
    description:
      'Review relevant talent profiles and applications in one organised platform designed for entertainment professionals.',
    tag: 'AGENCY / PRODUCTION',
    icon: UserGroupIcon,
    iconBg: 'bg-[#F3E8FF]',
    iconColor: 'text-[#9333EA]',
    tagClass: 'border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]'
  }
]

const faqItems = [
  {
    question: 'Is CastHall free to join?',
    answer:
      'Yes. Talent can join the waitlist and create a profile for free when the platform launches.'
  },
  {
    question: 'When does the platform launch?',
    answer: 'CastHall is currently planned for public launch in October 2026.'
  },
  {
    question: 'Who can create a talent profile?',
    answer:
      'Actors, models, voice artists, presenters, dancers, singers, and other entertainment professionals will be able to create profiles.'
  },
  {
    question: 'Who can post casting opportunities?',
    answer:
      'Production houses, casting professionals, talent agencies, and eligible industry organisations will be able to publish casting opportunities.'
  },
  {
    question: 'How will organisations be verified?',
    answer:
      'Eligible production houses and agencies will complete a verification process before receiving a verified status on CastHall.'
  }
]

const socialLinks = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com/casthallafrica?s=21'
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/casthallafrica?igsh=YzdoNjM4azdhNDN0'
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@casthallofficial'
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/casthall-africa/'
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@casthallafrica'
  }
]

const clearMessages = () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (messageTimer) {
    clearTimeout(messageTimer)
    messageTimer = undefined
  }
}

const scheduleMessageClear = () => {
  if (messageTimer) {
    clearTimeout(messageTimer)
  }

  messageTimer = setTimeout(() => {
    successMessage.value = ''
    errorMessage.value = ''
  }, 6000)
}

const resetForm = () => {
  firstName.value = ''
  lastName.value = ''
  email.value = ''
}

const submitWaitlist = async () => {
  clearMessages()

  const normalizedFirstName = firstName.value.trim()
  const normalizedLastName = lastName.value.trim()
  const normalizedEmail = email.value.trim().toLowerCase()

  if (!normalizedFirstName || !normalizedLastName || !normalizedEmail) {
    errorMessage.value = 'Please complete all fields.'
    scheduleMessageClear()
    return
  }

  try {
    isSubmitting.value = true

    const formData = new URLSearchParams()

    formData.append(GOOGLE_FORM_FIELDS.firstName, normalizedFirstName)
    formData.append(GOOGLE_FORM_FIELDS.lastName, normalizedLastName)
    formData.append(GOOGLE_FORM_FIELDS.email, normalizedEmail)
    formData.append(GOOGLE_FORM_FIELDS.role, selectedRole.value)

    await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })

    resetForm()

    successMessage.value =
      'You have successfully joined the CastHall waitlist. We will keep you updated.'
  } catch (error) {
    console.error('Waitlist submission failed:', error)

    errorMessage.value =
      'We could not submit your details. Please check your connection and try again.'
  } finally {
    isSubmitting.value = false
    scheduleMessageClear()
  }
}

onBeforeUnmount(() => {
  if (messageTimer) {
    clearTimeout(messageTimer)
  }
})
</script>

<template>
  <main class="min-h-screen overflow-x-hidden bg-white font-Sora text-[#111827]">
    <!-- HERO -->
    <section
      class="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-[#EEF4FB] via-white to-[#E8F1FA] py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        class="absolute -left-28 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"
      ></div>

      <div
        aria-hidden="true"
        class="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-orange-100/50 blur-3xl"
      ></div>

      <div class="relative z-10 mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div
          class="inline-flex items-center rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-[11px] font-semibold tracking-[0.15em] text-blue-700 shadow-sm backdrop-blur sm:text-xs"
        >
          COMING OCTOBER 2026
        </div>

        <h1
          class="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-[#111827] sm:mt-8 sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Where
          <span class="text-casthall-blue-700">Talent</span>
          Meets
          <br class="hidden sm:block" />
          <span class="text-casthall-blue-700">Opportunity</span>
        </h1>

        <p
          class="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8"
        >
          Connect with casting professionals, discover your next role, and showcase your talent on a
          platform built for Africa's entertainment industry.
        </p>

        <!-- ROLE TOGGLE -->
        <div class="mt-8 flex justify-center sm:mt-10">
          <div
            class="grid w-full max-w-xl grid-cols-1 gap-2 rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm sm:grid-cols-2"
            role="group"
            aria-label="Select your waitlist type"
          >
            <button
              type="button"
              :aria-pressed="selectedRole === 'Talent'"
              class="rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:px-6"
              :class="
                selectedRole === 'Talent'
                  ? 'bg-casthall-blue-700 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              "
              @click="selectedRole = 'Talent'"
            >
              I am a Talent
            </button>

            <button
              type="button"
              :aria-pressed="selectedRole === 'Agent/Agency'"
              class="rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:px-6"
              :class="
                selectedRole === 'Agent/Agency'
                  ? 'bg-casthall-blue-700 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              "
              @click="selectedRole = 'Agent/Agency'"
            >
              I am a Production House / Agency
            </button>
          </div>
        </div>

        <!-- WAITLIST FORM -->
        <form
          id="waitlist"
          class="mx-auto mt-6 max-w-xl rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-xl shadow-blue-900/5 sm:mt-8 sm:p-7"
          @submit.prevent="submitWaitlist"
        >
          <Transition name="content-fade" mode="out-in">
            <div :key="selectedRole">
              <p class="text-center text-xs font-bold uppercase tracking-[0.08em] text-gray-700 sm:text-sm">
                {{ pageContent.waitlistTitle }}
              </p>

              <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label for="first-name" class="mb-1.5 block text-sm font-medium text-gray-700">
                    First name
                  </label>

                  <input
                    id="first-name"
                    v-model="firstName"
                    type="text"
                    name="firstName"
                    autocomplete="given-name"
                    required
                    placeholder="Enter your first name"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label for="last-name" class="mb-1.5 block text-sm font-medium text-gray-700">
                    Last name
                  </label>

                  <input
                    id="last-name"
                    v-model="lastName"
                    type="text"
                    name="lastName"
                    autocomplete="family-name"
                    required
                    placeholder="Enter your last name"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div class="sm:col-span-2">
                  <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700">
                    Email address
                  </label>

                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    name="email"
                    autocomplete="email"
                    inputmode="email"
                    required
                    :placeholder="
                      selectedRole === 'Talent'
                        ? 'Enter your talent email address'
                        : 'Enter your organisation email address'
                    "
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>
          </Transition>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="mt-5 flex w-full items-center justify-center rounded-lg bg-casthall-blue-700 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <span>{{ isSubmitting ? 'Joining waitlist...' : pageContent.buttonText }}</span>
            <span v-if="!isSubmitting" aria-hidden="true" class="ml-2">→</span>
          </button>

          <div class="min-h-6" aria-live="polite" aria-atomic="true">
            <p
              v-if="successMessage"
              role="status"
              class="mt-4 rounded-lg bg-green-50 px-4 py-3 text-center text-sm text-green-700"
            >
              {{ successMessage }}
            </p>

            <p
              v-else-if="errorMessage"
              role="alert"
              class="mt-4 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700"
            >
              {{ errorMessage }}
            </p>
          </div>

          <p class="mt-3 text-center text-xs leading-5 text-gray-400">
            Free to join. No spam. You will be among the first to receive CastHall launch updates.
          </p>
        </form>
      </div>
    </section>

    <!-- ROLE VALUE -->
    <section class="border-y border-gray-100 bg-white py-16 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Transition name="content-fade" mode="out-in">
          <div :key="selectedRole">
            <span
              class="inline-flex rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] sm:text-xs"
              :class="
                selectedRole === 'Talent'
                  ? 'border-[#FCD9A7] bg-[#FFF7E6] text-[#D97706]'
                  : 'border-blue-200 bg-blue-50 text-casthall-blue-700'
              "
            >
              {{ pageContent.badge }}
            </span>

            <h2
              class="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
              :class="
                selectedRole === 'Talent'
                  ? 'text-[#D97706]'
                  : 'text-casthall-blue-700'
              "
            >
              {{ pageContent.heading }}
            </h2>

            <p class="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
              {{ pageContent.description }}
            </p>

            <ul class="mx-auto mt-8 max-w-xl space-y-4 text-left">
              <li
                v-for="benefit in pageContent.benefits"
                :key="benefit"
                class="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3.5 text-sm leading-6 text-gray-700 sm:text-base"
              >
                <span
                  aria-hidden="true"
                  class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                  :class="
                    selectedRole === 'Talent'
                      ? 'border-amber-400 text-amber-600'
                      : 'border-blue-400 text-casthall-blue-700'
                  "
                >
                  ✓
                </span>

                <span>{{ benefit }}</span>
              </li>
            </ul>
          </div>
        </Transition>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="bg-[#FAFAFA] py-16 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 sm:text-sm">
            How it works
          </p>

          <h2 class="mt-3 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">
            Simple for both sides.
          </h2>

          <p class="mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
            CastHall brings talent and casting professionals into one organised professional
            ecosystem.
          </p>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:gap-7">
          <article
            v-for="card in howItWorksCards"
            :key="card.title"
            class="feature-card group flex min-h-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7 lg:p-8"
          >
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
              :class="card.iconBg"
            >
              <component :is="card.icon" class="h-6 w-6" :class="card.iconColor" />
            </div>

            <h3 class="mt-6 text-xl font-bold leading-7 text-[#111827] sm:text-2xl">
              {{ card.title }}
            </h3>

            <p class="mt-3 text-sm leading-7 text-[#4B5563] sm:text-base">
              {{ card.description }}
            </p>

            <div class="mt-auto pt-7">
              <span
                class="inline-flex rounded-md border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] sm:text-[11px]"
                :class="card.tagClass"
              >
                {{ card.tag }}
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="bg-white py-16 sm:py-20 lg:py-24">
      <div class="mx-auto max-w-4xl px-4 sm:px-6">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 sm:text-sm">
          Questions
        </p>

        <h2 class="mt-3 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl lg:text-5xl">
          Quick answers.
        </h2>

        <div class="mt-9 divide-y divide-gray-200 border-y border-gray-200">
          <details
            v-for="item in faqItems"
            :key="item.question"
            class="faq-item group py-5 sm:py-6"
          >
            <summary
              class="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-gray-900 focus:outline-none sm:text-lg"
            >
              <span>{{ item.question }}</span>

              <span
                aria-hidden="true"
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-light text-gray-600 transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>

            <p class="mt-3 max-w-3xl pr-10 text-sm leading-7 text-gray-500 sm:text-base">
              {{ item.answer }}
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-casthall-blue-700 py-12 text-white sm:py-14">
      <div
        class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 text-center sm:px-6 lg:flex-row lg:text-left"
      >
        <div>
          <h2 class="text-2xl font-bold text-white sm:text-3xl">Follow the journey.</h2>

          <p class="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
            Follow CastHall for launch updates, product news, and behind-the-scenes content.
          </p>
        </div>

        <nav aria-label="CastHall social media">
          <ul class="flex flex-wrap justify-center gap-3 lg:justify-end">
            <li v-for="socialLink in socialLinks" :key="socialLink.label">
              <a
                :href="socialLink.href"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex rounded-lg border border-white/30 px-4 py-2.5 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700 sm:px-5"
              >
                {{ socialLink.label }}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div
        class="mx-auto mt-10 max-w-7xl border-t border-white/20 px-4 pt-6 text-center text-xs text-blue-100 sm:px-6 lg:text-left"
      >
        © {{ currentYear }} CastHall Africa. All rights reserved.
      </div>
    </footer>
  </main>
</template>

<style scoped>
.content-fade-enter-active,
.content-fade-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.content-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.content-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.feature-card {
  transition:
    transform 240ms ease,
    box-shadow 240ms ease,
    border-color 240ms ease;
}

.feature-card:hover {
  transform: translateY(-6px);
  border-color: rgba(8, 102, 196, 0.28);
  box-shadow:
    0 20px 35px -20px rgba(15, 23, 42, 0.28),
    0 8px 16px -12px rgba(15, 23, 42, 0.18);
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .content-fade-enter-active,
  .content-fade-leave-active,
  .feature-card,
  .feature-card:hover,
  .feature-card * {
    transition: none !important;
    transform: none !important;
  }
}
</style>