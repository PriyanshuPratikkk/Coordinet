import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import Button from '@/components/Button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-background to-background/50 py-16 md:py-24">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                  Streamline Your Club &amp; Festival Management
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Coordinet makes it easy to organize, manage, and participate in college clubs and festivals.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link href="/auth/signup">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <Link href="/auth/signin">
                    <Button variant="outline" size="lg">Sign In</Button>
                  </Link>
                </div>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-auto">
                <div className="relative w-full h-[320px] md:h-[400px] rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg"
                    alt="College festival"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold">Everything You Need</h2>
              <p className="text-muted-foreground mt-2">
                Powerful features designed for both club leaders and students
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Club Management</CardTitle>
                  <CardDescription>Create and manage your clubs with ease</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Streamline club administration, track memberships, and coordinate club activities all in one place.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Festival Planning</CardTitle>
                  <CardDescription>Organize events from start to finish</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Create festivals, manage sub-events, assign tasks, and track expenses with our comprehensive tools.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Participation</CardTitle>
                  <CardDescription>Join and track your involvement</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Browse upcoming festivals, register for events, and keep track of your participation across campus.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-card rounded-xl shadow-lg p-8 md:p-10">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
                <p className="text-muted-foreground">
                  Join Coordinet today and transform how you manage your college clubs and events.
                </p>
                <div className="pt-4">
                  <Link href="/auth/signup">
                    <Button size="lg">Create Your Account</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M16.5 8.25A4.5 4.5 0 0 0 12 3.75a4.5 4.5 0 0 0 0 9h9a4.5 4.5 0 0 0 0-9 4.5 4.5 0 0 0-4.5 4.5Z" />
                <path d="M12.75 8.25a4.5 4.5 0 0 0-9 0 4.5 4.5 0 0 0 0 9h9a4.5 4.5 0 0 0 0-9Z" />
                <path d="M13.5 14.25a4.5 4.5 0 0 0-9 0 4.5 4.5 0 0 0 4.5 4.5 4.5 4.5 0 0 0 4.5-4.5Z" />
              </svg>
              <span className="font-bold">Coordinet</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Coordinet. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}