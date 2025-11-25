'use client'

import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SPACING } from '@/lib/utils'

const pricingPlans = [
	{
		name: 'Starter',
		price: 15,
		originalPrice: 20,
		description: 'Perfect for a tryout',
		features: [
			'20 AI generated images',
			'2 style options',
			'2 background choices',
			'HD resolution',
		],
		popular: false,
		buttonText: 'Try Now',
	},
	{
		name: 'Pro',
		price: 29,
		originalPrice: 40,
		description: 'Most popular choice',
		features: [
			'40 AI generated images',
			'8 style options',
			'All background choices',
			'2K resolution',
			'Premium accessories',
			'Priority support',
		],
		popular: true,
		buttonText: 'Go Pro',
	},
	{
		name: 'Max',
		price: 49,
		originalPrice: 80,
		description: 'Best value package',
		features: [
			'100 AI generated images',
			'All style options (15+)',
			'All backgrounds (25+)',
			'4K resolution',
			'All premium accessories',
			'Custom style requests',
			'Commercial usage rights',
			'Priority support',
		],
		popular: false,
		buttonText: 'Go Max',
	},
]

export default function PricingSection() {
	return (
		<section
			id="pricing"
			className="bg-white"
			style={{
				paddingTop: SPACING.SECTION_GAP * 8,
				paddingBottom: SPACING.SECTION_GAP * 8,
			}}
		>
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="text-center mb-12">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						Loved Your Free Portrait?
					</h2>
					<p className="text-lg text-gray-800 max-w-2xl mx-auto">
						<strong>Get more amazing portraits at unbeatable prices.</strong>
						<br />
						Choose a plan and create professional portraits for every occasion.
                        <br />
                        100% satisfaction guarantee - refund if you're not happy!
					</p>
				</div>				{/* Pricing Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
					{pricingPlans.map((plan, index) => (
						<div
							key={index}
							className={`relative rounded-sm border-2 p-8 flex flex-col ${
								plan.popular
									? 'border-blue-500 bg-blue-50 shadow-xl scale-105'
									: 'border-gray-200 bg-white shadow-lg'
							}`}
						>
							{plan.popular && (
								<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
									<span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
										Most Popular
									</span>
								</div>
							)}

							<div className="text-center mb-8">
								<h3 className="text-2xl font-bold text-gray-900 mb-2">
									{plan.name}
								</h3>
								<div className="mb-4">
									<span className="text-2xl text-gray-400 line-through mr-2">
										${plan.originalPrice}
									</span>
									<span className="text-4xl font-bold text-gray-900">
										${plan.price}
									</span>
								</div>
								<p className="text-gray-800">{plan.description}</p>
							</div>

							<ul className="space-y-4 mb-8 flex-grow">
								{plan.features.map((feature, featureIndex) => (
									<li
										key={featureIndex}
										className="flex items-start gap-3"
									>
										<Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
										<span className="text-gray-800">{feature}</span>
									</li>
								))}
							</ul>

							<Link
								href="/onboarding"
								className="mt-auto"
							>
								<Button
									variant={plan.popular ? 'gradient' : 'outline'}
									size="lg"
									className="w-full"
								>
									{plan.buttonText}
								</Button>
							</Link>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}