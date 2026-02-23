import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, WrenchScrewdriverIcon, AcademicCapIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReact, faNodeJs } from '@fortawesome/free-brands-svg-icons';
import { faCode, faClock, faSeedling, faCube, faShapes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import jerryGif from './assets/jerry.gif';
import hhyProfile from './assets/hhy_profile.png';
import kdyProfile from './assets/kdy_profile.jpg';
import pjsProfile from './assets/pjs_profile.jpg';
import yjsProfile from './assets/yjs_profile.jpg';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
];

function ProfileCard({ imgSrc, title, name, description }) {
  return (
    <div className="group relative block bg-black rounded-lg overflow-hidden shadow-lg">
      <img
        alt=""
        src={imgSrc}
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
      />
      <div className="relative p-4 sm:p-6 lg:p-8">
        <p className="text-sm font-medium uppercase tracking-widest" style={{ color: '#fff' }}>{title}</p>
        <p className="text-xl font-bold text-white sm:text-2xl">{name}</p>
        <div className="mt-32 sm:mt-48 lg:mt-64">
          <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-sm text-white">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);
  
  const sectionRef1 = useRef(null);
  const sectionRef2 = useRef(null);
  const sectionRef3 = useRef(null);
  const startRef = useRef(null);
  const teamRef = useRef(null);
  const productValueRef = useRef(null);
  const techValueRef = useRef(null);
  const functionValueRef = useRef(null);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    const observer1 = new IntersectionObserver(
      ([entry]) => {
        setIsVisible1(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const observer2 = new IntersectionObserver(
      ([entry]) => {
        setIsVisible2(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const observer3 = new IntersectionObserver(
      ([entry]) => {
        setIsVisible3(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef1.current) observer1.observe(sectionRef1.current);
    if (sectionRef2.current) observer2.observe(sectionRef2.current);
    if (sectionRef3.current) observer3.observe(sectionRef3.current);

    return () => {
      if (sectionRef1.current) observer1.unobserve(sectionRef1.current);
      if (sectionRef2.current) observer2.unobserve(sectionRef2.current);
      if (sectionRef3.current) observer3.unobserve(sectionRef3.current);
    };
  }, []);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-transparent h-screen/2 text-white w-full relative">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">#LSPT</span>
              <span className="text-2xl font-bold">#LSPT</span>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className="text-sm font-semibold leading-6">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link to="/login" className="text-sm font-semibold leading-6">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
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
                    Log in
                  </Link>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div className="fixed top-1/4 left-0 z-50 bg-transparent text-white rounded-l-lg shadow-lg p-4">
        <ul className="space-y-4">
          <li><button onClick={() => scrollToSection(startRef)} className="text-lg">1. 할머니를 부탁해를 시작하세요</button></li>
          <li><button onClick={() => scrollToSection(teamRef)} className="text-lg">2. 팀원 소개</button></li>
          <li><button onClick={() => scrollToSection(productValueRef)} className="text-lg">3. Product Value</button></li>
          <li><button onClick={() => scrollToSection(techValueRef)} className="text-lg">4. Tech Value</button></li>
          <li><button onClick={() => scrollToSection(functionValueRef)} className="text-lg">5. 주요 기능</button></li>
          
        </ul>
      </div>

      <section ref={startRef} className="bg-transparent pt-8 pb-0 w-full animate-fadeIn">
        <div className="py-8 px-4 mx-auto max-w-screen-lg sm:py-16 lg:px-6">
          <div className="mb-4 lg:mb-8 flex flex-col lg:flex-row items-center lg:items-start">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl sm:text-4xl tracking-tight font-extrabold">
                할머니를 부탁해를 시작하세요
              </h2>
              <p className="sm:text-lg lg:text-xl text-left">
                Fitbit Sense2를 활용한 신체 정보 수집을 통해 할머니를 부탁해에서 제공하는 여러 기능을 사용하세요. 메타버스를 통해 <br className="hidden lg:inline-block" />사용자에게 동적인 경험을 제공합니다.
              </p>
              <Link 
                to="/login" 
                className="inline-block bg-white text-black font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 hover:text-white">
                Get started
              </Link>
            </div>
            <div className="flex-shrink-0 mt-8 lg:mt-0 lg:ml-8">
              <img 
                src={jerryGif} 
                alt="Jerry Animation" 
                className="w-96 h-auto object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      <span className="flex items-center">
        <span className="h-px flex-1 bg-white"></span>
        <span className="pl-6"></span>
      </span>

      <section ref={teamRef} className={`w-full py-8 animate-fadeIn`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white">
            팀원 소개
          </h2>
          <p className="text-lg text-white mb-8">
            할머니를 부탁해를 만든 팀원을 소개합니다.
          </p>
          
          <div className="grid grid-cols-2 gap-8">
            <ProfileCard
              title="팀장 / Front-end"
              name="황호연"
              description="UI/UX 설계 및 제작"
              imgSrc={hhyProfile}
            />
            <ProfileCard
              title="Back-end"
              name="고대영"
              description="Fitbit Sense2 연동 및 기능 구현"
              imgSrc={kdyProfile}
            />
            <ProfileCard
              title="Back-end"
              name="박준서"
              description="메타버스 구현"
              imgSrc={pjsProfile}
            />
            <ProfileCard
              title="Back-end"
              name="윤제승"
              description="메타버스 구현"
              imgSrc={yjsProfile}
            />
          </div>
        </div>
      </section>

      <section ref={productValueRef} className="bg-transparent animate-fadeIn">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <h2 className="text-3xl font-extrabold">Product Value</h2>
          <p className="text-lg mb-8 mt-0">할머니를 부탁해가 제공하는 가치입니다.</p>
          <div className="text-center">
            <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
              <div className="text-left">
                <div className="flex items-center mb-8">
                  <WrenchScrewdriverIcon className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300 mr-2" />
                  <h3 className="text-xl font-bold">기술성</h3>
                </div>
                <p>
                  IoT를 통한 신체정보 수집, 메타버스를 통한 실시간 소통, AI를 활용한 건강 상담 서비스 등 할머니를 부탁해에서 제공하는 다양한 기능을 제공합니다.
                </p>
              </div>

              <div className="text-left">
                <div className="flex items-center mb-8">
                  <AcademicCapIcon className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300 mr-2" />
                  <h3 className="text-xl font-bold">전문성</h3>
                </div>
                <p>
                  병원에 가지 않더라도 간단한 증상에 대한 의학적 지식과 전조 증상을 AI가 설명해줍니다. 사용자의 신체정보와 웹에 존재하는 빅데이터를 기반으로 이루어지는 상담은 사용자에게 정확한 지식을 제공합니다.
                </p>
              </div>

              <div className="text-left">
                <div className="flex items-center mb-8">
                  <MapPinIcon className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300 mr-2" />
                  <h3 className="text-xl font-bold">접근성</h3>
                </div>
                <p>
                  메타버스 안에서 물리적으로, 금전적으로 병원 이용이 힘든 사용자를 위해 다양한 의료 서비스를 제공합니다. 또한 사용자끼리 신체정보를 공유하면서 서로의 건강 정보에 대해 관심을 가지게 됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section ref={techValueRef} className="bg-transparent animate-fadeIn">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <h2 className="text-3xl font-extrabold">Tech Value</h2>
          <p className="text-lg mb-8 mt-0">할머니를 부탁해를 구성한 기술 스택입니다.</p>
          <div className="text-center">
            <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
              
              <div className="text-left">
                <div className="flex items-center mb-8">
                  <FontAwesomeIcon icon={faReact} className="text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300 mr-2" />
                  <h3 className="text-xl font-bold">React</h3>
                </div>
                <p>React를 사용하여 UI를 구성하고, 사용자 경험을 향상시킵니다.</p>
              </div>

              <div className="text-left">
                <div className="flex items-center mb-8">
                  <FontAwesomeIcon icon={faSeedling} className="text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300 mr-2" />
                  <h3 className="text-xl font-bold">Spring</h3>
                </div>
                <p>Spring을 사용하여 백엔드를 구성합니다.</p>
              </div>

              <div className="text-left">
                <div className="flex items-center mb-8">
                  <FontAwesomeIcon icon={faCube} className="text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300 mr-2" />
                  <h3 className="text-xl font-bold">Blender</h3>
                </div>
                <p>Blender를 활용해 메타버스 맵과 캐릭터를 제작합니다.</p>
              </div>
              <div className="text-left">
                <div className="flex items-center mb-8">
                  <FontAwesomeIcon icon={faShapes} className="text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300 mr-2" />
                  <h3 className="text-xl font-bold">Three.js</h3>
                </div>
                <p>Three.js를 사용하여 Blender에서 제작한 캐릭터와 맵을 기반으로 메타버스 환경을 구현합니다.</p>
              </div>

              <div className="text-left">
                <div className="flex items-center mb-8">
                  <FontAwesomeIcon icon={faClock} className="text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300 mr-2" />
                  <h3 className="text-xl font-bold">IoT</h3>
                </div>
                <p>Fitbit Sense2를 사용해서 신체정보 수집 및 동기화를 구현합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <span className="flex items-center">
        <span className="h-px flex-1 bg-white"></span>
        <span className="pl-6"></span>
      </span>
      

      <section ref={functionValueRef} className={`w-full py-8 animate-fadeIn`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold">주요 기능</h2>
          <p className="text-lg mt-0">할머니를 부탁해의 주요 기능입니다.</p>
        </div>
      </section>

    <section
      ref={sectionRef1}
      className={`text-white body-font transition-opacity duration-700 h-[600px] ${
        isVisible1 ? 'animate-fade-right' : 'opacity-0'
      }`}
    >
      <div className="container mx-auto flex px-5 h-full md:flex-row flex-col items-center">
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
          <img className="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600" />
        </div>
        <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
            메타버스를 활용한
            <br className="hidden lg:inline-block" />
            실시간 소통
          </h1>
          <p className="mb-8 leading-relaxed text-white">
            메타버스 세상에서 다른 사용자와 실시간으로 소통합니다. 또한 할머니를 부탁해에서 제공하는
            <br className="hidden lg:inline-block" />
            다양한 서비스를 메타버스 안에서 사용함으로써 사용자에게 동적인 경험을 제공합니다.
          </p>
        </div>
      </div>
    </section>

      <section
        ref={sectionRef2}
        className={`text-white body-font transition-opacity duration-700 h-[600px] ${
          isVisible2 ? 'animate-fade-left' : 'opacity-0'
        }`}
      >
        <div className="container mx-auto flex px-5 h-full md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
              IoT 기기를 활용한
              <br className="hidden lg:inline-block" />
              신체정보 수집
            </h1>
            <p className="mb-8 leading-relaxed text-white">
              IoT 기기를 활용해서
              <br className="hidden lg:inline-block" />
              다양한 서비스를 메타버스 안에서 사용함으로써 사용자에게 동적인 경험을 제공합니다.
            </p>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
            <img className="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600" />
          </div>
        </div>
      </section>

      <section
        ref={sectionRef3}
        className={`text-white body-font transition-opacity duration-700 h-[600px] ${
          isVisible3 ? 'animate-fade-right' : 'opacity-0'
        }`}
      >
        <div className="container mx-auto flex px-5 h-full md:flex-row flex-col items-center">
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
            <img className="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600" />
          </div>
          <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
              AI를 활용한
              <br className="hidden lg:inline-block" />
              실시간 건강 상담 서비스
            </h1>
            <p className="mb-8 leading-relaxed text-white">
              메타버스 세상에서 다른 사용자와 실시간으로 소통합니다. 또한 할머니를 부탁해에서 제공하는
              <br className="hidden lg:inline-block" />
              다양한 서비스를 메타버스 안에서 사용함으로써 사용자에게 동적인 경험을 제공합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
