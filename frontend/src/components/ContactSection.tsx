import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactSection: React.FC = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// In this demo, we just simulate a submit.
			setSubmitted(true);
			setName('');
			setEmail('');
			setMessage('');
		} catch {}
	};

	return (
		<section id="contact" className="py-16">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Contact Us</h2>
				<p className="text-muted-foreground mb-8 max-w-2xl">
					Have questions or feedback? Send us a message and we’ll get back to you.
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<form onSubmit={onSubmit} className="bg-white border rounded-lg p-6 shadow-sm">
						<div className="grid grid-cols-1 gap-4">
							<div>
								<label className="block text-sm font-medium mb-1">Name</label>
								<Input value={name} onChange={(e) => setName(e.target.value)} required />
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Email</label>
								<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Message</label>
								<Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required />
							</div>
							<div>
								<Button type="submit" className="bg-black text-white hover:bg-gray-800">Send Message</Button>
								{submitted && <span className="ml-3 text-green-600 text-sm">Thanks! We received your message.</span>}
							</div>
						</div>
					</form>
					<div className="bg-white border rounded-lg p-6 shadow-sm">
						<h3 className="font-semibold text-foreground mb-2">Support</h3>
						<p className="text-sm text-muted-foreground mb-4">Email: support@fraportal.example</p>
						<h3 className="font-semibold text-foreground mb-2">Address</h3>
						<p className="text-sm text-muted-foreground">Vidyalankar School of Information Technology</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ContactSection;


