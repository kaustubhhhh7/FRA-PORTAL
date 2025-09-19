import React from 'react';

const faqs: { question: string; answer: string }[] = [
	{
		question: 'What is the FRA Portal?',
		answer:
			'The FRA Portal is a dashboard to visualize, manage, and analyze Forest Rights Act claims and forest areas with interactive maps and analytics.',
	},
	{
		question: 'Who can use this portal?',
		answer:
			'It is designed for government administrators and community stakeholders. Public users can explore limited information without logging in.',
	},
	{
		question: 'Is my data secure?',
		answer:
			'Yes. The platform uses role-based access, secure authentication, and encryption to protect sensitive information.',
	},
	{
		question: 'How often is data updated?',
		answer:
			'Datasets are refreshed as new submissions and verifications are processed. Demo content is bundled for offline trials.',
	},
];

const FAQSection: React.FC = () => {
	return (
		<section id="faq" className="py-16 bg-muted/30">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{faqs.map((item, idx) => (
						<div key={idx} className="bg-white rounded-lg border shadow-sm p-5">
							<h3 className="font-semibold text-foreground mb-2">{item.question}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default FAQSection;


