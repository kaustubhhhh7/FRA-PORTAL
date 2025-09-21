import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, Search, Plus, Minus } from 'lucide-react';

const faqs: { 
question: string; 
answer: string; 
category: string;
popular?: boolean;
}[] = [
{
question: 'What is the FRA Portal?',
answer: 'The FRA Portal is a comprehensive digital platform designed to visualize, manage, and analyze Forest Rights Act claims and forest areas. It provides interactive maps, real-time analytics, and streamlined workflows for government administrators and community stakeholders to efficiently process and monitor forest rights applications.',
category: 'General',
popular: true
},
{
question: 'Who can use this portal?',
answer: 'The portal is designed for multiple user types: Government administrators have full access to manage and process applications, community stakeholders can submit and track their claims, and public users can explore limited information without logging in. Each user type has role-based permissions ensuring data security and appropriate access levels.',
category: 'Access',
popular: true
},
{
question: 'Is my data secure?',
answer: 'Absolutely. The platform implements enterprise-grade security measures including role-based access control, secure authentication protocols, end-to-end encryption for sensitive data, regular security audits, and compliance with data protection regulations. Your information is protected with the highest security standards.',
category: 'Security',
popular: true
},
{
question: 'How often is data updated?',
answer: 'Data is updated in real-time as new submissions and verifications are processed. The system automatically refreshes datasets, syncs with government databases, and provides live updates on application statuses. Demo content is bundled for offline trials and testing purposes.',
category: 'Data',
popular: false
},
{
question: 'How do I submit a forest rights claim?',
answer: 'To submit a forest rights claim, log into your account, navigate to the "Submit Claim" section, fill out the required information including location details, supporting documents, and community information. The system will guide you through each step and provide validation to ensure completeness.',
category: 'Process',
popular: false
},
{
question: 'What documents are required for submission?',
answer: 'Required documents include proof of residence, community membership verification, land records, traditional forest use evidence, and any relevant government-issued identification. The system provides a comprehensive checklist and accepts various file formats for easy upload.',
category: 'Process',
popular: false
},
{
question: 'How can I track my application status?',
answer: 'You can track your application status through the dashboard by logging into your account. The system provides real-time updates on processing stages, notifications for required actions, and detailed timelines. You can also receive email updates for important status changes.',
category: 'Process',
popular: true
},
{
question: 'What if I encounter technical issues?',
answer: 'If you encounter any technical issues, you can contact our support team through the help desk, email support, or phone assistance. We also provide comprehensive documentation, video tutorials, and a troubleshooting guide to help resolve common issues quickly.',
category: 'Support',
popular: false
}
];

const FAQSection: React.FC = () => {
const [openItems, setOpenItems] = useState<number[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [selectedCategory, setSelectedCategory] = useState('All');
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
setIsVisible(true);
}, []);

const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

const filteredFAQs = faqs.filter(faq => {
const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
 faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
return matchesSearch && matchesCategory;
});

const toggleItem = (index: number) => {
setOpenItems(prev => 
prev.includes(index) 
? prev.filter(item => item !== index)
: [...prev, index]
);
};

const popularFAQs = faqs.filter(faq => faq.popular);

return (
<section id="faq" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
{/* Background Elements */}
<div className="absolute inset-0 opacity-5">
<div className="absolute top-20 left-10 w-32 h-32 bg-black rounded-full animate-pulse"></div>
<div className="absolute top-40 right-20 w-24 h-24 bg-gray-600 rounded-full animate-pulse delay-1000"></div>
<div className="absolute bottom-20 left-1/3 w-16 h-16 bg-black rounded-full animate-pulse delay-2000"></div>
</div>

<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
{/* Header Section */}
<div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
<div className="flex items-center justify-center mb-6">
<HelpCircle className="w-12 h-12 text-black mr-4" />
<h2 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
Frequently Asked Questions
</h2>
</div>
<p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
Find answers to common questions about the FRA Portal. Can't find what you're looking for? 
Contact our support team for personalized assistance.
</p>
<div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
</div>

{/* Search and Filter Section */}
<div className={`max-w-4xl mx-auto mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
<div className="relative mb-6">
<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
<input
type="text"
placeholder="Search questions or answers..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-4 focus:ring-gray-200 focus:outline-none transition-all duration-300 text-lg"
/>
</div>

{/* Category Filter */}
<div className="flex flex-wrap gap-3 justify-center">
{categories.map((category) => (
<button
key={category}
onClick={() => setSelectedCategory(category)}
className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
selectedCategory === category
? 'bg-black text-white shadow-lg scale-105'
: 'bg-white text-gray-600 hover:bg-gray-100 hover:text-black border-2 border-gray-200'
}`}
>
{category}
</button>
))}
</div>
</div>

{/* Popular FAQs Section */}
{selectedCategory === 'All' && (
<div className={`mb-12 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
<h3 className="text-2xl font-bold text-foreground mb-8 text-center">Popular Questions</h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{popularFAQs.map((faq, index) => (
<div
key={`popular-${index}`}
className="bg-white rounded-xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
onClick={() => scrollToSection('faq-accordion')}
>
<div className="p-6">
<div className="flex items-start justify-between">
<div className="flex-1">
<h4 className="font-semibold text-foreground mb-3 group-hover:text-black transition-colors">
{faq.question}
</h4>
<p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
{faq.answer}
</p>
</div>
<div className="ml-4 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
<Plus className="w-4 h-4" />
</div>
</div>
</div>
</div>
))}
</div>
</div>
)}

{/* FAQ Accordion */}
<div id="faq-accordion" className={`max-w-4xl mx-auto transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
<h3 className="text-2xl font-bold text-foreground mb-8 text-center">
{selectedCategory === 'All' ? 'All Questions' : `${selectedCategory} Questions`}
</h3>
<div className="space-y-4">
{filteredFAQs.map((faq, index) => {
const isOpen = openItems.includes(index);
return (
<div
key={index}
className="bg-white rounded-xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
>
<button
onClick={() => toggleItem(index)}
className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 group"
>
<div className="flex items-start space-x-4 flex-1">
<div className="w-8 h-8 bg-gradient-to-br from-black to-gray-800 text-white rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
<HelpCircle className="w-4 h-4" />
</div>
<div className="flex-1">
<h4 className="font-semibold text-foreground text-lg group-hover:text-black transition-colors">
{faq.question}
</h4>
<div className="flex items-center space-x-2 mt-2">
<span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
{faq.category}
</span>
{faq.popular && (
<span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
Popular
</span>
)}
</div>
</div>
</div>
<div className="ml-4 flex-shrink-0">
{isOpen ? (
<Minus className="w-6 h-6 text-gray-600 group-hover:text-black transition-colors" />
) : (
<Plus className="w-6 h-6 text-gray-600 group-hover:text-black transition-colors" />
)}
</div>
</button>

{isOpen && (
<div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
<div className="ml-12 border-l-2 border-gray-200 pl-6">
<p className="text-muted-foreground leading-relaxed">
{faq.answer}
</p>
</div>
</div>
)}
</div>
);
})}
</div>

{/* No Results Message */}
{filteredFAQs.length === 0 && (
<div className="text-center py-12">
<HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
<h3 className="text-xl font-semibold text-gray-600 mb-2">No questions found</h3>
<p className="text-gray-500">Try adjusting your search terms or category filter.</p>
</div>
)}
</div>

{/* Contact Support CTA */}
<div className={`text-center mt-16 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
<div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl p-8 max-w-2xl mx-auto">
<h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
<p className="text-gray-200 mb-6">
Our support team is here to help you with any questions or concerns you may have.
</p>
<button
onClick={() => scrollToSection('contact')}
className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
>
Contact Support
</button>
</div>
</div>
</div>
</section>
);
};

export default FAQSection;
