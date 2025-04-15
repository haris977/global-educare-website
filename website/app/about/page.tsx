import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    bio: "Former IELTS examiner with over 15 years of experience in language education. Sarah founded Global EduCare to make quality IELTS preparation accessible to everyone."
  },
  {
    name: "David Chen",
    role: "Academic Director",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    bio: "IELTS specialist with a PhD in Applied Linguistics. David oversees all content development and ensures that our materials follow the latest IELTS standards."
  },
  {
    name: "Priya Sharma",
    role: "Head of Technology",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    bio: "Tech expert with a passion for EdTech. Priya leads our development team to create an intuitive, adaptive learning platform for IELTS preparation."
  },
  {
    name: "Michael Torres",
    role: "Content Strategist",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    bio: "Content creator with expertise in IELTS curriculum development. Michael ensures that our materials are engaging, effective, and up-to-date."
  }
];

const missionPoints = [
  {
    title: "Accessible Education",
    description: "We believe that quality IELTS preparation should be accessible to everyone, regardless of location or background.",
    icon: (
      <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  {
    title: "Personalized Learning",
    description: "We understand that each learner is unique, so we provide adaptive content that adjusts to individual learning needs and goals.",
    icon: (
      <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    title: "Continuous Improvement",
    description: "We are committed to constantly improving our platform based on feedback, research, and the evolving needs of IELTS test-takers.",
    icon: (
      <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  },
  {
    title: "Data-Driven Education",
    description: "We use analytics and learning science to continuously optimize our content and provide personalized guidance for each learner.",
    icon: (
      <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero Section */}
        <div className="relative bg-indigo-800">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-indigo-700 mix-blend-multiply" />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">About Global EduCare</h1>
            <p className="mt-6 max-w-3xl text-xl text-indigo-100">
              We are dedicated to helping individuals achieve their target IELTS band scores through comprehensive, personalized preparation.
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="bg-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Story</h2>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  Global EduCare was founded in 2020 with a simple mission: to make high-quality IELTS preparation accessible to everyone. What started as a small team of passionate educators has grown into a comprehensive online platform serving thousands of learners worldwide.
                </p>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  Our founder, Sarah Johnson, a former IELTS examiner, noticed that many students struggled not due to their language abilities, but because they lacked proper guidance and structured preparation. She assembled a team of IELTS experts and technology specialists to create a platform that addresses this gap.
                </p>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  Today, Global EduCare offers comprehensive preparation for all four IELTS modules, with content structured by difficulty levels to help learners progressively improve their skills and reach their target band scores.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
                <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600">10,000+</div>
                    <div className="mt-1 text-lg font-medium text-gray-700">Students Helped</div>
                  </div>
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600">96%</div>
                    <div className="mt-1 text-lg font-medium text-gray-700">Success Rate</div>
                  </div>
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600">30+</div>
                    <div className="mt-1 text-lg font-medium text-gray-700">Expert Educators</div>
                  </div>
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600">100+</div>
                    <div className="mt-1 text-lg font-medium text-gray-700">Countries Reached</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="bg-gray-50 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Mission</h2>
              <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
                To empower individuals worldwide to achieve their IELTS goals through personalized, high-quality preparation that adapts to their unique needs.
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {missionPoints.map((point, index) => (
                  <div key={index} className="pt-6">
                    <div className="flow-root bg-white rounded-lg px-6 pb-8">
                      <div className="-mt-6">
                        <div>
                          <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                            {point.icon}
                          </span>
                        </div>
                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{point.title}</h3>
                        <p className="mt-5 text-base text-gray-500">{point.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Our Team</h2>
                <p className="text-xl text-gray-500">
                  Our diverse team combines expertise in IELTS examination, language education, and technology to deliver an exceptional learning experience.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {teamMembers.map((member) => (
                  <div key={member.name} className="bg-gray-50 rounded-lg pb-4">
                    <div className="space-y-4">
                      <div className="aspect-w-3 aspect-h-3 relative h-60 w-full">
                        <Image 
                          className="object-cover rounded-lg rounded-b-none" 
                          src={member.image} 
                          alt={member.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      </div>
                      <div className="space-y-2 px-4">
                        <div className="text-lg leading-6 font-medium space-y-1">
                          <h3 className="text-indigo-600">{member.name}</h3>
                          <p className="text-gray-600">{member.role}</p>
                        </div>
                        <div className="text-base">
                          <p className="text-gray-500">{member.bio}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to start your IELTS journey?</span>
              <span className="block text-indigo-200">Begin with our free trial today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Get started
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 