import { Button, Card } from "ui";

interface BlogPost {
	id: number;
	title: string;
	content: string;
	author: string;
	date: string;
}

export const blogPosts: BlogPost[] = [
	{
		id: 1,
		title: "The Evolution of Electric Vehicles",
		content:
			"Electric vehicles have transformed the automotive industry, offering sustainable transportation solutions with cutting-edge technology...",
		author: "John Doe",
		date: "2024-01-15",
	},
	{
		id: 2,
		title: "Maintenance Tips for Your Car",
		content:
			"Regular maintenance is crucial for keeping your car in optimal condition. Here are essential tips every car owner should know...",
		author: "Jane Smith",
		date: "2024-01-16",
	},
	{
		id: 3,
		title: "Future of Autonomous Driving",
		content:
			"Self-driving technology is rapidly advancing, promising to revolutionize how we think about transportation...",
		author: "Mike Johnson",
		date: "2024-01-17",
	},
];

const Blog = () => {
	return (
		<section className="max-w-screen-xl mx-auto px-4 pb-16">
			<h2 className="text-3xl font-bold mb-4 md:mb-8">Latest Blog Posts</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{blogPosts.map((post) => (
					<Card key={post.id}>
						<Card.Header>
							<Card.Title>{post.title}</Card.Title>
							<Card.Description className="text-sm">
								Published on {post.date} by {post.author}
							</Card.Description>
						</Card.Header>
						<Card.Content>
							<p className="text-muted-fg line-clamp-4 text-sm">
								{post.content}
							</p>
						</Card.Content>
						<Card.Footer>
							<Button size="small">Read More</Button>
						</Card.Footer>
					</Card>
				))}
			</div>
		</section>
	);
};

export { Blog };
