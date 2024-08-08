'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'

import metaverseImg from './assets/metaverse.png'
import fitbitImg from './assets/fitbit.jpg'
import ex3 from './assets/ex3.png'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
]

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(metaverseImg)
  const [fadeIn, setFadeIn] = useState(true)
  const images = [metaverseImg, fitbitImg, ex3]

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false)
      setTimeout(() => {
        setCurrentImage(prevImage => {
          const currentIndex = images.indexOf(prevImage)
          const nextIndex = (currentIndex + 1) % images.length
          return images[nextIndex]
        })
        setFadeIn(true)
      }, 1000) // Transition duration (1s)
    }, 8000) // Interval between image changes (8s)
    
    return () => clearInterval(interval)
  }, [])

  const renderContent = () => {
    switch(currentImage) {
      case metaverseImg:
        return (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              메타버스를 통한<br/>실시간 소통
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              메타버스를 통해 다른 사용자와 실시간으로 소통하세요<br/>
              메타버스에서 구현된 여러 기능을 동적으로 경험하세요
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Link
                to="/login"
                className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ background: '-webkit-linear-gradient(left, #7F7FD5, #86A8E7, #91EAE4)' }}
              >
                Get started
              </Link>
              <Link to="/features" className="text-sm font-semibold leading-6 text-black">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </>
        )
      case fitbitImg:
        return (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              IoT기기를 활용한<br/>신체정보 수집
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              fitbit Sense2를 통해 신체정보를 수집하세요<br/>
              자신의 신체정보를 다른사람과 공유하세요
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Link
                to="/login"
                className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ background: '-webkit-linear-gradient(left, #7F7FD5, #86A8E7, #91EAE4)' }}
              >
                Get started
              </Link>
              <Link to="/features" className="text-sm font-semibold leading-6 text-black">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </>
        )
      case ex3:
        return (
          <>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              AI를 통한<br/>건강 상담 서비스
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              신체정보를 기반으로 한 건강 상담 서비스를 진행하세요<br/>
              
            </p>
            <p className="mt-4 text-lg text-gray-600">
              할머니를 부탁해에서 제공하는 메타버스 서비스 사진입니다.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Link
                to="/login"
                className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ background: '-webkit-linear-gradient(left, #7F7FD5, #86A8E7, #91EAE4)' }}
              >
                Get started
              </Link>
              <Link to="/features" className="text-sm font-semibold leading-6 text-black">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">#LSPT</span>
              <span className="text-2xl font-bold text-white">#LSPT</span>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">  
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className="text-sm font-semibold leading-6 text-white">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link to="/login" className="text-sm font-semibold leading-6 text-white">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">#LSPT</span>
                <span className="text-2xl font-bold text-indigo-600">#LSPT</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    to="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div className="relative flex flex-col lg:flex-row justify-center items-center h-full w-full min-w-[1300px]">
        <div className={`w-full lg:w-1/2 bg-white min-h-[872px] flex justify-center items-center ${fadeIn ? 'animate-fadeIn' : 'animate-fadeOut'}`}>
          <div className="relative isolate px-6 pt-14 lg:px-8">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
              <div
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]">
              </div>
            </div>
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
              {renderContent()}
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            >
              <div
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              />
            </div>
          </div>
        </div>
        
        <div className={`w-full lg:w-1/2 bg-white min-h-[872px] flex flex-col items-center ${fadeIn ? 'animate-fadeIn' : 'animate-fadeOut'}`}>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl p-6">실제 사진</h2>
          <div className="p-8">
            <img src={currentImage} alt="메타버스 서비스" className="mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

