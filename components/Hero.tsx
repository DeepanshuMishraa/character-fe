const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center relative">
      <div className="relative animate-fade-in">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white max-w-4xl mt-24 leading-tight">
          The AI for all your <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            personal & professional
          </span> needs
        </h1>
      </div>

      <p className="mt-5 text-base sm:text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed animate-fade-in-delay-2 px-4">
        Create your own AI characters and make them available for the world.
        Engage in meaningful conversations, learn new things, and have fun.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-12 text-white/40 backdrop-blur-sm bg-white/5 px-6 sm:px-12 py-6 sm:py-8 rounded-2xl border border-white/10 animate-fade-in-delay-6">
        <div className="flex flex-col items-center group cursor-default">
          <span className="text-3xl sm:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 group-hover:scale-110 transition-transform">100+</span>
          <span className="text-xs sm:text-sm mt-2 group-hover:text-white transition-colors">Character Templates</span>
        </div>
        <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-purple-500/20 via-white/20 to-blue-500/20" />
        <div className="flex flex-col items-center group cursor-default">
          <span className="text-3xl sm:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 group-hover:scale-110 transition-transform">Unlimited</span>
          <span className="text-xs sm:text-sm mt-2 group-hover:text-white transition-colors">Conversations</span>
        </div>
        <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-purple-500/20 via-white/20 to-blue-500/20" />
        <div className="flex flex-col items-center group cursor-default">
          <span className="text-3xl sm:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 group-hover:scale-110 transition-transform">Free</span>
          <span className="text-xs sm:text-sm mt-2 group-hover:text-white transition-colors">To Get Started</span>
        </div>
      </div>
    </div>
  )
}

export default Hero
