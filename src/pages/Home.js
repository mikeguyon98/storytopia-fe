import React from 'react';
import { BookOpen, Compass, Share2 } from 'lucide-react';
import Hero from '../components/home/Hero';
import FeatureCard from '../components/home/FeatureCard';
import ExploreCard from '../components/home/ExploreCard';
import StoryGenerator from '../components/home/StoryGenerator';

const Home = () => {
  const features = [
    { Icon: BookOpen, title: 'Personalized Stories', description: 'Get unique, AI-generated stories based on your prompts or themes.' },
    { Icon: Compass, title: 'Explore', description: 'Discover and enjoy stories created by other Storytopia users.' },
    { Icon: Share2, title: 'Share & Like', description: "Share your creations and appreciate others' stories with likes." }
  ];

  const exploreStories = [
    { title: 'Amazing Adventure 1', description: 'A thrilling journey through space and time...', likes: 42 },
    { title: 'Amazing Adventure 2', description: 'An epic tale of dragons and knights...', likes: 37 },
    { title: 'Amazing Adventure 3', description: 'A heartwarming story of friendship...', likes: 53 }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Hero />
      <StoryGenerator />
      
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginBottom: '48px' }}>
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Explore Popular Stories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {exploreStories.map((story, index) => (
            <ExploreCard key={index} {...story} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;