import PublicLayout from '../../components/PublicLayout'

export default function Services() {
  const services = [
    {
      title: 'School Activities & Campus Programs',
      description:
        'End-to-end school activation campaigns, interactive sessions, and engagement activities designed for students and educators.',
      icon: '🏫',
    },
    {
      title: 'Face-to-Face Product Demonstrations',
      description:
        'High-impact, on-ground demos that put your products directly in the hands of consumers for real-time feedback and experience.',
      icon: '🤝',
    },
    {
      title: 'Industrial Product Showcases',
      description:
        'Specialized presentations and demonstrations for industrial audiences, decision makers, and trade partners.',
      icon: '🏭',
    },
    {
      title: 'Experiential Event Planning',
      description:
        'Concept, design, and execution of events that create immersive brand stories and memorable experiences.',
      icon: '🎉',
    },
    {
      title: 'Retail & Channel Activations',
      description:
        'In-store promotions, dealer meets, and channel programs that drive visibility and conversions.',
      icon: '🛒',
    },
    {
      title: 'Brand & Marketing Strategy',
      description:
        'Integrated marketing campaigns combining on-ground, digital, and content to amplify your brand message.',
      icon: '📢',
    },
  ]

  return (
    <PublicLayout>
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">Our Services</h1>
            <p className="section-subtitle">
              On-ground experiences, school activities, face-to-face demos, and industrial activations tailored
              for your brand.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100 card-hover group"
              >
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

