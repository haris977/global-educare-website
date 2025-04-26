"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// Pricing plans from pricing page
const pricingPlans = [
  {
    name: "Monthly",
    id: "monthly",
    price: "29.99",
    description: "Perfect for short-term IELTS preparation",
    billingPeriod: "month",
  },
  {
    name: "Quarterly",
    id: "quarterly",
    price: "59.99",
    description: "Our most popular plan for comprehensive preparation",
    billingPeriod: "3 months",
  },
  {
    name: "Annual",
    id: "annual",
    price: "199.99",
    description: "Best value for serious IELTS candidates",
    billingPeriod: "year",
  }
];

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') || 'monthly';
  
  const [selectedPlan, setSelectedPlan] = useState<typeof pricingPlans[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formState, setFormState] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
    error: '',
    success: false
  });

  useEffect(() => {
    const plan = pricingPlans.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
    } else {
      setSelectedPlan(pricingPlans[0]);
    }
  }, [planId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces after every 4 digits
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add spaces after every 4 digits
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    setFormState(prev => ({ ...prev, cardNumber: formattedValue }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 4) value = value.slice(0, 4);
    
    // Format as MM/YY
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    setFormState(prev => ({ ...prev, expiryDate: value }));
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, error: '' }));
    setIsProcessing(true);
    
    try {
      // Basic validation
      if (paymentMethod === 'card') {
        if (!formState.cardNumber || !formState.cardHolder || !formState.expiryDate || !formState.cvv) {
          throw new Error('Please fill in all required fields');
        }
        
        if (formState.cardNumber.replace(/\s/g, '').length !== 16) {
          throw new Error('Card number must be 16 digits');
        }
        
        if (formState.cvv.length < 3) {
          throw new Error('CVV must be at least 3 digits');
        }
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Successful payment
      setFormState(prev => ({ ...prev, success: true }));
      
    } catch (error) {
      setFormState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Payment processing failed. Please try again.'
      }));
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  
  if (formState.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="py-12">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-green-50 border-b border-green-100">
              <div className="flex items-center justify-center">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">Payment Successful!</h2>
              <p className="mt-2 text-center text-gray-600">Thank you for subscribing to our platform.</p>
            </div>
            
            <div className="p-6 border-b border-gray-200">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Subscription Plan</h3>
                  <p className="mt-1 text-base font-medium text-gray-900">{selectedPlan.name} Plan - ${selectedPlan.price}/{selectedPlan.billingPeriod}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {paymentMethod === 'card' ? 'Credit Card' : 'PayPal'}
                    {paymentMethod === 'card' && formState.cardNumber && (
                      <span className="ml-1 text-gray-600">ending in {formState.cardNumber.slice(-4)}</span>
                    )}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="mt-1 text-base font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  We've sent a confirmation email with your receipt and subscription details.
                </p>
              </div>
              
              <div className="pt-4">
                <Link
                  href="/onboarding"
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  Continue to Onboarding
                </Link>
                
                <div className="mt-3 text-center">
                  <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Return to Home
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Complete Your Subscription</h1>
              <p className="mt-2 text-sm text-gray-600">You're just one step away from accessing our premium IELTS preparation platform.</p>
            </div>
            
            <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-7">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
                  
                  <div className="mb-6">
                    <div className="flex space-x-4">
                      <div 
                        className={`relative flex-1 p-4 border rounded-lg cursor-pointer ${
                          paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                        }`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            className="h-4 w-4 text-indigo-600"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                          />
                          <span className="ml-3 font-medium text-gray-900">Credit / Debit Card</span>
                        </div>
                        <div className="mt-2 flex space-x-2">
                          {['visa', 'mastercard', 'amex', 'discover'].map(card => (
                            <div key={card} className="w-10 h-6 bg-gray-200 rounded"></div>
                          ))}
                        </div>
                      </div>
                      
                      <div 
                        className={`relative flex-1 p-4 border rounded-lg cursor-pointer ${
                          paymentMethod === 'paypal' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                        }`}
                        onClick={() => setPaymentMethod('paypal')}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            className="h-4 w-4 text-indigo-600"
                            checked={paymentMethod === 'paypal'}
                            onChange={() => setPaymentMethod('paypal')}
                          />
                          <span className="ml-3 font-medium text-gray-900">PayPal</span>
                        </div>
                        <div className="mt-2">
                          <div className="w-16 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {paymentMethod === 'card' ? (
                    <form onSubmit={handlePaymentSubmit}>
                      {formState.error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                          <p className="text-sm text-red-700">{formState.error}</p>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                            Card Number *
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              value={formState.cardNumber}
                              onChange={handleCardNumberChange}
                              placeholder="1234 5678 9012 3456"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">
                            Cardholder Name *
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="cardHolder"
                              name="cardHolder"
                              value={formState.cardHolder}
                              onChange={handleInputChange}
                              placeholder="John Smith"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                              Expiry Date *
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                value={formState.expiryDate}
                                onChange={handleExpiryDateChange}
                                placeholder="MM/YY"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                              Security Code (CVV) *
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                value={formState.cvv}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  if (value.length > 4) return;
                                  setFormState(prev => ({ ...prev, cvv: value }));
                                }}
                                placeholder="123"
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            id="saveCard"
                            name="saveCard"
                            type="checkbox"
                            checked={formState.saveCard}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
                            Save this card for future payments
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none ${
                            isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                          }`}
                        >
                          {isProcessing ? 'Processing...' : `Pay $${selectedPlan.price}`}
                        </button>
                      </div>
                      
                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                          Your payment information is processed securely. We do not store credit card details.
                        </p>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center p-6">
                      <p className="text-gray-700 mb-4">You will be redirected to PayPal to complete your payment.</p>
                      <button
                        onClick={handlePaymentSubmit}
                        disabled={isProcessing}
                        className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ${
                          isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isProcessing ? 'Processing...' : 'Continue to PayPal'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-5">
                <div className="bg-gray-50 rounded-lg shadow-lg p-6 sticky top-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Selected Plan</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedPlan.name}</dd>
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <dt className="text-sm text-gray-600">Billing Period</dt>
                      <dd className="text-sm font-medium text-gray-900">Per {selectedPlan.billingPeriod}</dd>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <dt className="text-base font-medium text-gray-900">Subtotal</dt>
                      <dd className="text-base font-medium text-gray-900">${selectedPlan.price}</dd>
                    </div>
                    
                    <div className="flex justify-between border-t border-gray-200 pt-4 mt-4">
                      <dt className="text-lg font-bold text-gray-900">Total</dt>
                      <dd className="text-lg font-bold text-gray-900">${selectedPlan.price}</dd>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-sm">
                    <div className="flex items-start mb-4">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-2 text-gray-600">Access to all IELTS modules: Reading, Writing, Listening and Speaking</p>
                    </div>
                    
                    <div className="flex items-start mb-4">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-2 text-gray-600">Unlimited practice tests with detailed feedback</p>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-2 text-gray-600">7-day money-back guarantee</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <p className="ml-2 text-xs text-gray-600">
                        Your subscription will automatically renew at the end of your billing period. You can cancel anytime from your account settings.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link
                      href="/pricing"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      ← Change subscription plan
                    </Link>
                  </div>
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