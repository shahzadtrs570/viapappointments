/* eslint-disable */
'use client';

import { useState } from 'react';

interface PricingSectionProps {
  car: any;
}

export default function PricingSection({ car }: PricingSectionProps) {
  const [downPayment, setDownPayment] = useState(0);
  const [creditScore, setCreditScore] = useState('good');
  const [loanTerm, setLoanTerm] = useState(60);
  const [showHistory, setShowHistory] = useState(false);

  const marketPrice = car.msrp;
  const currentPrice = car.salePrice;
  const savings = marketPrice - currentPrice;
  const savingsPercent = Math.round((savings / marketPrice) * 100);

  const estimatePayment = () => {
    const principal = currentPrice - downPayment;
    const rate = creditScore === 'excellent' ? 0.04 : 
                 creditScore === 'good' ? 0.07 : 
                 creditScore === 'fair' ? 0.12 : 0.18;
    const monthlyRate = rate / 12;
    const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTerm));
    return Math.round(payment);
  };

  const getDealRating = () => {
    if (savingsPercent >= 15) return { text: 'Great Deal', color: 'text-green-600', bg: 'bg-green-100' };
    if (savingsPercent >= 10) return { text: 'Good Deal', color: 'text-green-600', bg: 'bg-green-100' };
    if (savingsPercent >= 5) return { text: 'Fair Deal', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: 'High Priced', color: 'text-orange-600', bg: 'bg-orange-100' };
  };

  const dealRating = getDealRating();

  return (
    <div className="space-y-8">
      {/* Ready to Buy Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to buy? Here's how it works.</h2>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Build your deal | 
                <button className="text-blue-600 hover:text-blue-700 ml-2">Start now</button>
              </h3>
              <p className="text-gray-600">Find financing options, value your trade-in, and choose service and protection plans.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Choose pick up time</h3>
              <p className="text-gray-600">Schedule a time to get your new car at the dealership.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Finalize your sale</h3>
              <p className="text-gray-600">Head to the dealership to finish up your sale.</p>
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          History
          <sup className="text-sm text-gray-500">1</sup>
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-gray-900">Clean title</div>
              <div className="text-sm text-gray-600">No issues reported.</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-gray-900">0 accidents reported</div>
              <div className="text-sm text-gray-600">No accidents or damage reported.</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-gray-900">2 previous owners</div>
              <div className="text-sm text-gray-600">Vehicle has 2 previous owners.</div>
            </div>
          </div>
        </div>
        
        <button className="text-blue-600 hover:text-blue-700 font-medium mt-4">
          Save 20% on the full AutoCheck vehicle history report
          <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>

      {/* Pricing Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing</h2>
        
        <div className="mb-6">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ${currentPrice.toLocaleString()}
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${dealRating.bg} ${dealRating.color} mb-4`}>
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {dealRating.text}
          </div>
        </div>

        {/* Price Comparison Chart */}
        <div className="mb-6">
          <div className="relative h-4 bg-gray-200 rounded-full mb-4">
            <div 
              className="absolute left-0 top-0 h-full bg-gray-400 rounded-full" 
              style={{ width: '40%' }}
            ></div>
            <div 
              className="absolute top-0 h-full w-2 bg-black rounded-full" 
              style={{ left: '30%' }}
            ></div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="text-sm font-medium text-gray-900">${marketPrice.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Avg. market price (IMV)</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            This car is ${savings.toLocaleString()} below market price. We compared this car with similar {car.year} {car.make} {car.model} 
            based on price, mileage, features, condition, dealer reputation, and other factors.
          </p>
        </div>

        {/* Pricing Insights */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900">Selling slowly</div>
              <div className="text-sm text-gray-600">On the market longer than average. There may be flexibility on price.</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900">Price decreased</div>
              <div className="text-sm text-gray-600">Price went down by $2,815.</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900">65 days at this dealership</div>
              <div className="text-sm text-gray-600">65 days on CarGurus • 16 saves</div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          Show price history
          <svg className={`w-4 h-4 ml-1 transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Estimate Financing */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Estimate financing</h2>
        
        <div className="text-center mb-6">
          <div className="text-sm text-gray-600 mb-2">Your estimated payment* is</div>
          <div className="text-4xl font-bold text-gray-900 mb-1">
            ${estimatePayment()}
            <span className="text-lg text-gray-600">/mo est</span>
            <button className="ml-2 text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <div className="text-sm text-gray-600">9.84% Dealer APR</div>
        </div>

        <div className="space-y-6">
          {/* Down Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Down payment (0%)</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="$0"
            />
          </div>

          {/* Credit Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Credit score</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'rebuilding', label: 'Rebuilding', range: '<640' },
                { id: 'fair', label: 'Fair', range: '641-699' },
                { id: 'good', label: 'Good', range: '700-749' },
                { id: 'excellent', label: 'Excellent', range: '750-850' }
              ].map((score) => (
                <button
                  key={score.id}
                  onClick={() => setCreditScore(score.id)}
                  className={`p-3 text-center border rounded-md transition-colors ${
                    creditScore === score.id 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium text-sm">{score.label}</div>
                  <div className="text-xs">{score.range}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loan term</label>
            <div className="grid grid-cols-3 gap-2">
              {[48, 60, 72].map((term) => (
                <button
                  key={term}
                  onClick={() => setLoanTerm(term)}
                  className={`p-3 text-center border rounded-md transition-colors ${
                    loanTerm === term 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {term} months
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Sound good? Start your purchase to complete paperwork online before heading to the dealership.
          </p>
          <div className="flex space-x-4">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              Start purchase
            </button>
            <button className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors">
              View financing options
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          *Estimated payments are for informational purposes only, and do not represent a financing offer or guarantee of credit from the seller.
        </p>
      </div>
    </div>
  );
} 