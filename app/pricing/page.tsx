import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const pricingPlans = [
  {
    name: "Monthly",
    id: "monthly",
    price: "29.99",
    description: "Perfect for short-term IELTS preparation",
    features: [
      "Full access to all IELTS modules",
      "Unlimited practice tests",
      "Detailed progress tracking",
      "Writing & Speaking feedback",
      "Mobile-friendly platform",
      "Cancel anytime"
    ],
    mostPopular: false,
    billingPeriod: "month",
    refundPolicy: "7-day money-back guarantee",
    buttonText: "Subscribe Monthly"
  },
  {
    name: "Quarterly",
    id: "quarterly",
    price: "59.99",
    description: "Our most popular plan for comprehensive preparation",
    features: [
      "Everything in the Monthly plan",
      "Personalized study plan",
      "Priority writing feedback",
      "One-on-one speaking consultation",
      "10% discount on extension",
      "Downloadable study materials"
    ],
    mostPopular: true,
    billingPeriod: "3 months",
    refundPolicy: "7-day money-back guarantee",
    buttonText: "Subscribe Quarterly"
  },
  {
    name: "Annual",
    id: "annual",
    price: "199.99",
    description: "Best value for serious IELTS candidates",
    features: [
      "Everything in the Quarterly plan",
      "Advanced analytics and insights",
      "Unlimited writing assessments",
      "Four one-on-one speaking consultations",
      "Exam day preparation guide",
      "Certificate of completion"
    ],
    mostPopular: false,
    billingPeriod: "year",
    refundPolicy: "7-day money-back guarantee",
    buttonText: "Subscribe Annually"
  }
];

const faqItems = [
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a 3-day free trial that gives you limited access to all four IELTS modules. You can experience our platform with one reading passage, five listening questions, one Writing Task 1 prompt, and sample Speaking questions before committing to a subscription."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time. If you cancel within the first 7 days of your paid subscription, you are eligible for a full refund under our money-back guarantee policy."
  },
  {
    question: "How do I request a refund?",
    answer: "You can request a refund within 7 days of your initial subscription payment through your account settings or by contacting our support team. Refunds are typically processed within 2-3 business days."
  },
  {
    question: "Can I switch between subscription plans?",
    answer: "Yes, you can upgrade or downgrade your subscription plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate will apply at the start of your next billing cycle."
  },
  {
    question: "Do you offer group or institutional pricing?",
    answer: "Yes, we offer special pricing for educational institutions and language training centers. Please contact our sales team for custom quotes based on your organization's specific needs."
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        {/* Header */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                Find the Perfect Plan for Your IELTS Journey
              </h1>
              <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                Start with a 3-day free trial. No credit card required.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="bg-gray-50 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`flex flex-col rounded-lg shadow-lg overflow-hidden bg-white ${
                    plan.mostPopular ? 'ring-2 ring-indigo-600' : ''
                  }`}
                >
                  <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
                    {plan.mostPopular && (
                      <div className="absolute inset-x-0 transform translate-y-px">
                        <div className="flex justify-center transform -translate-y-1/2">
                          <span className="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold tracking-wider uppercase text-white">
                            Most Popular
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900 leading-6">{plan.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                    </div>
                    <div className="mt-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-extrabold tracking-tight text-gray-900">${plan.price}</span>
                        <span className="ml-1 text-xl font-medium text-gray-500">/{plan.billingPeriod}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{plan.refundPolicy}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10 sm:pt-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="ml-3 text-base text-gray-700">{feature}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-md shadow">
                      <Link 
                        href={`/register?plan=${plan.id}`}
                        className={`w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md ${
                          plan.mostPopular
                            ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                            : 'text-indigo-600 bg-white hover:bg-gray-50 border-indigo-600'
                        }`}
                      >
                        {plan.buttonText}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Free Trial Info */}
        <div className="bg-indigo-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Start with a free trial</span>
              <span className="block text-indigo-200">No credit card required to try.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Start free trial
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
              <dl className="space-y-6 divide-y divide-gray-200">
                {faqItems.map((faq, index) => (
                  <div key={index} className="pt-6">
                    <dt className="text-lg">
                      <span className="font-medium text-gray-900">{faq.question}</span>
                    </dt>
                    <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Customer Support */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Still have questions?
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-gray-500">
                  Our dedicated support team is here to help you choose the right plan for your IELTS preparation journey.
                </p>
                <div className="mt-8 sm:flex">
                  <div className="rounded-md shadow">
                    <Link
                      href="/contact"
                      className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Contact Support
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="mailto:support@globaleducare.com"
                      className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      Email Us
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
                <div className="col-span-1 flex justify-center py-8 px-8 bg-white">
                  <span className="text-center text-lg font-medium text-gray-900">24/7 Support</span>
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-white">
                  <span className="text-center text-lg font-medium text-gray-900">Live Chat</span>
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-white">
                  <span className="text-center text-lg font-medium text-gray-900">Email Support</span>
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-white">
                  <span className="text-center text-lg font-medium text-gray-900">Phone Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 