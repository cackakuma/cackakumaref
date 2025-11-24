
const Program = ({
  leadImage, 
  programName, 
  programDesc, 
  supportImage, 
  supportAuthor, 
  impacts, 
  beneGridLeft,
  beneGridRight,
  programIcon,
  programColor = "blue",
  statistics = [],
  benefits = [],
  testimonials = []
}) => {
  const colorVariants = {
    blue: {
      primary: "blue-800",
      secondary: "blue-600", 
      light: "blue-50",
      accent: "blue-100"
    },
    green: {
      primary: "green-800",
      secondary: "green-600",
      light: "green-50", 
      accent: "green-100"
    },
    purple: {
      primary: "purple-800",
      secondary: "purple-600",
      light: "purple-50",
      accent: "purple-100"
    },
    red: {
      primary: "red-800", 
      secondary: "red-600",
      light: "red-50",
      accent: "red-100"
    },
    orange: {
      primary: "orange-800",
      secondary: "orange-600", 
      light: "orange-50",
      accent: "orange-100"
    }
  };

  const colors = colorVariants[programColor] || colorVariants.blue;

  return(
    <main className="pt-20 px-4 pb-16 max-w-6xl mx-auto">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative">
            <img 
              className="w-full h-64 md:h-80 object-cover" 
              src={leadImage} 
              alt={programName}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-3 mb-3">
                {programIcon && (
                  <div className={`w-12 h-12 bg-${colors.secondary} rounded-full flex items-center justify-center text-white text-xl`}>
                    {programIcon}
                  </div>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {programName}
                </h1>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <p className="text-gray-700 text-base leading-relaxed">
              {programDesc}
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        {statistics.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Program Impact
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl md:text-3xl font-bold text-${colors.primary} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits Section */}
        {benefits.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Program Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-6 h-6 bg-${colors.secondary} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community Impact Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Community Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {impacts.map((impact, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className={`w-8 h-8 bg-${colors.secondary} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {impact.impact}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {impact.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Image Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img 
                className="w-full h-64 md:h-80 object-cover" 
                src={supportImage} 
                alt="Program Support"
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Photo by: <span className="italic font-medium">{supportAuthor}</span>
            </p>
          </div>
        </div>

        {/* Beneficiaries Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Our Portfolio
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Left Grid */}
            <div className="space-y-4">
              {beneGridLeft.map((img, index) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img 
                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300" 
                    src={img.url} 
                    alt={`Participant ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* Right Grid */}
            <div className="space-y-4">
              {beneGridRight.map((img, index) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <img 
                      className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300" 
                      src={img.url} 
                      alt={`Participant ${index + 1}`}
                    />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              What Our Participants Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 font-bold text-sm">
                        {testimonial.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {testimonial.name || 'Anonymous'}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed italic">
                        "{testimonial.quote}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Program;