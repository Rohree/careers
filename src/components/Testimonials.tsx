import React from 'react';

interface Testimonial {
	name: string;
	role: string;
	text: string;
	image?: string;
}

const testimonials: Testimonial[] = [
	{
		name: 'Sarah M.',
		role: 'Project Manager',
		text: 'Working at Dunamis Power has given me the opportunity to grow and lead amazing projects. The team is supportive and the culture is truly empowering.',
		image: 'https://randomuser.me/api/portraits/women/44.jpg',
	},
	{
		name: 'James K.',
		role: 'Electrical Engineer',
		text: 'I love the innovative spirit here. Every day brings new challenges and the chance to make a real impact in the energy sector.',
		image: 'https://randomuser.me/api/portraits/men/32.jpg',
	},
	{
		name: 'Aisha T.',
		role: 'HR Specialist',
		text: 'Dunamis Power values its people. I feel heard, respected, and motivated to help others thrive in their careers.',
		image: 'https://randomuser.me/api/portraits/women/68.jpg',
	},
];

const Testimonials: React.FC = () => {
	return (
		<section className="py-16 bg-slate-50">
			<div className="max-w-4xl mx-auto px-4">
				<h2 className="text-3xl font-bold text-center text-slate-900 mb-10">What Our Team Says</h2>
				<div className="grid md:grid-cols-3 gap-8">
					{testimonials.map((t, idx) => (
						<div key={idx} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
							{t.image && (
								<img src={t.image} alt={t.name} className="w-20 h-20 rounded-full object-cover mb-4" />
							)}
							<p className="text-slate-700 mb-4">“{t.text}”</p>
							<div className="font-semibold text-blue-700">{t.name}</div>
							<div className="text-sm text-slate-500">{t.role}</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
