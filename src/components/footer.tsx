import {
	IconBrandFacebook,
	IconBrandInstagram,
	IconBrandTwitter,
} from "justd-icons";
import { Logo } from "./logo";
import { Link } from "ui";

export const Footer = () => {
	return (
		<footer className="text-white pb-16">
			<div className="max-w-screen-xl mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-12">
					<div>
						<Logo className="w-30 h-auto" />
						<p className="text-muted-fg text-sm mt-3 leading-relaxed">
							We're dedicated to helping you find the perfect vehicle for your
							needs, offering a wide selection of quality cars at competitive
							prices.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-3">Quick Links</h3>
						<ul className="space-y-3">
							<li className="text-sm">
								<Link intent="secondary" href="/">
									Home
								</Link>
							</li>
							<li className="text-sm">
								<Link intent="secondary" href="/">
									Search
								</Link>
							</li>
							<li className="text-sm">
								<Link intent="secondary" href="/">
									Sell your car
								</Link>
							</li>
							<li className="text-sm">
								<Link intent="secondary" href="/">
									Blog
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-3">Contact Us</h3>
						<p className="text-muted-fg mb-2 text-sm">
							1234 Car Street, Auto City, AC 12345
						</p>
						<p className="text-muted-fg mb-2 text-sm">Phone: (123) 456-7890</p>
						<p className="text-muted-fg text-sm">
							Email: info@carmarketplace.com
						</p>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-3">Follow Us</h3>
						<div className="flex space-x-4">
							<a
								href="/"
								className="text-muted-fg hover:text-white transition duration-300"
							>
								<IconBrandFacebook className="size-6" />
							</a>
							<a
								className="text-muted-fg hover:text-white transition duration-300"
								href="/"
							>
								<IconBrandTwitter className="size-6" />
							</a>
							<a
								className="text-muted-fg hover:text-white transition duration-300"
								href="/"
							>
								<IconBrandInstagram className="size-6" />
							</a>
						</div>
					</div>
				</div>
				<div className="mt-12 pt-8 border-t border-gray-800 text-center">
					<p className="text-muted-fg">
						&copy; 2023 Car Marketplace. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};
