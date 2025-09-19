import React from 'react';
import { MapPin } from 'lucide-react';

const Footer: React.FC = () => {
	return (
		<footer className="bg-dashboard-nav text-dashboard-nav-foreground py-10 border-t">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div className="col-span-1 md:col-span-2">
						<div className="flex items-center space-x-2 mb-3">
							<div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border-2 border-white">
								<MapPin className="w-4 h-4 text-black" />
							</div>
							<div>
								<h3 className="text-lg font-bold">FRA Portal</h3>
								<p className="text-sm opacity-90">Forest Rights Administration</p>
							</div>
						</div>
						<p className="text-sm opacity-80 max-w-md">
							Empowering forest communities through digital innovation and comprehensive forest rights management solutions.
						</p>
					</div>

					<div>
						<h4 className="font-semibold mb-3">Explore</h4>
						<ul className="space-y-2 text-sm opacity-80">
							<li><a href="#faq" className="hover:underline">FAQ</a></li>
							<li><a href="#contact" className="hover:underline">Contact Us</a></li>
							<li><a href="#top" className="hover:underline">Back to Top</a></li>
						</ul>
					</div>

					<div>
						<h4 className="font-semibold mb-3">Resources</h4>
						<ul className="space-y-2 text-sm opacity-80">
							<li>Documentation</li>
							<li>Security</li>
							<li>Status</li>
						</ul>
					</div>
				</div>

				<div className="border-top border-white/20 mt-8 pt-6 text-center text-sm opacity-80">
					<p>&copy; {new Date().getFullYear()} FRA Portal. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;


