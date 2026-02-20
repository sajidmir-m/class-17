import PublicLayout from '../../components/PublicLayout'

export default function About() {
  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="section-title">About Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Crafting extraordinary experiences that transform ideas into unforgettable moments
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">
                Welcome to <span className="font-semibold text-blue-600">Class 17 Events</span>, where we believe that <span className="font-semibold text-purple-600">ideas speak louder than words</span>.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                We are a premier event management and marketing company dedicated to creating
                unforgettable experiences that leave a lasting impact. Our team of creative professionals
                works tirelessly to bring your vision to life, combining innovation with meticulous attention to detail.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                With years of experience in the industry, we have successfully organized hundreds of
                events ranging from corporate conferences to grand celebrations. Our commitment to
                excellence and passion for perfection sets us apart in every project we undertake.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Events Organized</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">10+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600 mb-2">100%</div>
                <div className="text-gray-600">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

