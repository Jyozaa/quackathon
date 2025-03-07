import React from 'react';

const Section = () => {
  const cards = [
    {
      title: 'Subheading',
      text: 'Body text for whatever you’d like to add more to the subheading.',
      image: 'https://via.placeholder.com/400x300',
    },
    {
      title: 'Subheading',
      text: 'Body text for whatever you’d like to expand on the main point.',
      image: 'https://via.placeholder.com/400x300',
    },
    {
      title: 'Subheading',
      text: 'Body text for whatever you’d like to share too.',
      image: 'https://via.placeholder.com/400x300',
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      {/* Section heading */}
      <h2 className="text-2xl font-bold mb-8">Section heading</h2>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <img
              src={card.image}
              alt={`Card ${index + 1}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Section;
