'use client';

import React, { useState } from 'react';
import { LuCheck, LuStar, LuZap } from 'react-icons/lu';

const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: '€0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Basic profile creation',
      'Essential sections',
      'Public profile link',
      'Basic analytics'
    ],
    color: 'gray',
    icon: LuCheck,
    gradient: 'from-gray-50 to-gray-100'
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: '€7',
    period: 'per month',
    description: 'Most popular choice',
    features: [
      'Everything in Free',
      'Multiple cards',
      'Custom branding & domain',
      'Advanced analytics',
      'Priority support',
      'Extra links & integrations'
    ],
    color: 'emerald',
    icon: LuStar,
    popular: true,
    gradient: 'from-emerald-50 to-emerald-100',
    stripePriceId: 'price_pro_monthly'
  },
  business: {
    id: 'business',
    name: 'Business',
    price: '€25',
    period: 'per month',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Team accounts',
      'Advanced integrations',
      'Custom analytics',
      'Priority support',
      'Dedicated account manager'
    ],
    color: 'blue',
    icon: LuZap,
    gradient: 'from-blue-50 to-blue-100',
    stripePriceId: 'price_business_monthly'
  }
};

export default function SubscriptionSelector({ selectedPlan, onPlanChange, className = '' }) {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const handlePlanSelect = (planId) => {
    onPlanChange(planId);
  };

  const PlanCard = ({ plan }) => {
    const isSelected = selectedPlan === plan.id;
    const isHovered = hoveredPlan === plan.id;
    const Icon = plan.icon;

    return (
      <div
        className={`relative cursor-pointer transition-all duration-300 transform ${
          isSelected 
            ? 'scale-105 shadow-2xl border-2 border-[#00C896] bg-gradient-to-br from-white to-gray-50' 
            : isHovered 
              ? 'scale-102 shadow-lg border-2 border-gray-300 bg-white' 
              : 'border border-gray-200 bg-white hover:border-gray-300'
        } rounded-2xl p-4 sm:p-6 group`}
        onClick={() => handlePlanSelect(plan.id)}
        onMouseEnter={() => setHoveredPlan(plan.id)}
        onMouseLeave={() => setHoveredPlan(null)}
      >
        {/* Popular Badge - Top Right */}
        {plan.popular && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-white border-2 border-[#00C896] text-[#00C896] text-xs font-bold px-3 py-1 rounded-full shadow-md">
              Most Popular
            </div>
          </div>
        )}

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-4 left-4">
            <div className="w-6 h-6 bg-[#00C896] rounded-full flex items-center justify-center shadow-lg">
              <LuCheck className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* Plan Header */}
        <div className="text-center mb-4">
          <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${plan.gradient} mb-3 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${
              plan.color === 'emerald' ? 'text-[#00C896]' :
              plan.color === 'blue' ? 'text-blue-600' :
              'text-gray-600'
            }`} />
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          
          <div className="mb-2">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{plan.price}</span>
            <span className="text-gray-500 text-sm ml-1">/{plan.period}</span>
          </div>
          
          <p className="text-gray-600 text-xs sm:text-sm">{plan.description}</p>
        </div>

        {/* Features List */}
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <LuCheck className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>

        {/* Selection State */}
        <div className={`text-center py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
          isSelected 
            ? 'bg-[#00C896] text-white shadow-md' 
            : 'bg-gray-50 text-gray-600 group-hover:bg-gray-100'
        }`}>
          {isSelected ? '✓ Selected' : 'Select Plan'}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Grid Layout - Mobile First */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {/* Trial Info */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          All paid plans include a 14-day free trial • Cancel anytime
        </div>
      </div>
    </div>
  );
}

export { SUBSCRIPTION_PLANS };
