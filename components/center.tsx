import { Globe2, MessagesSquare, Lightbulb, BookOpen, Map, PenLine, Gamepad2, HelpCircle, Users } from "lucide-react"

const characterCards = [
  {
    icon: <Globe2 className="w-8 h-8" />,
    title: "Practice a new language",
    description: "with HyperGlot",
    bgColor: "from-green-500/20 to-blue-500/20"
  },
  {
    icon: <MessagesSquare className="w-8 h-8" />,
    title: "Practice interviewing",
    description: "with Interviewer",
    bgColor: "from-purple-500/20 to-pink-500/20"
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Brainstorm ideas",
    description: "with Brainstormer",
    bgColor: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Get book recommendations",
    description: "with Librarian Linda",
    bgColor: "from-teal-500/20 to-emerald-500/20"
  },
  {
    icon: <Map className="w-8 h-8" />,
    title: "Plan a trip",
    description: "with Trip Planner",
    bgColor: "from-blue-500/20 to-indigo-500/20"
  },
  {
    icon: <PenLine className="w-8 h-8" />,
    title: "Write a story",
    description: "with Creative Helper",
    bgColor: "from-amber-500/20 to-orange-500/20"
  },
  {
    icon: <Gamepad2 className="w-8 h-8" />,
    title: "Play a game",
    description: "with Space Adventure Game",
    bgColor: "from-red-500/20 to-rose-500/20"
  },
  {
    icon: <HelpCircle className="w-8 h-8" />,
    title: "Help me make a decision",
    description: "with DecisionHelper",
    bgColor: "from-yellow-500/20 to-orange-500/20"
  },
]

const featuredCards = [
  {
    title: "Character Assistant",
    description: "Your AI work/study buddy",
    users: "189.0m",
    bgGradient: "from-purple-500/10 to-blue-500/10",
    image: "/assistant.png"
  },
  {
    title: "Man From 2025",
    description: "Curious about your 2025? I'll check for you.",
    users: "2.0m",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    image: "/2025.png"
  },
  {
    title: "AwkwardFamilyDinner",
    description: "The chaos is real, and so is the tension.",
    users: "9.2m",
    bgGradient: "from-orange-500/10 to-red-500/10",
    image: "/dinner.png"
  },
  {
    title: "Detective Haywire",
    description: "Investigate your imagination",
    users: "2.7m",
    bgGradient: "from-emerald-500/10 to-teal-500/10",
    image: "/detective.png"
  }
]

const Center = () => {
  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-white/90 px-2">Try these</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
        {characterCards.map((card, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))`
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-10 group-hover:opacity-20 transition-opacity`} />

            <div className="relative p-6 flex items-start gap-4">
              <div className="p-2 rounded-full bg-white/10 text-white/80 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-medium text-white group-hover:text-white/90 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-white/60">
                  {card.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-12 mb-6 text-white/90 px-2">Featured</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
        {featuredCards.map((card, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br cursor-pointer"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-100 group-hover:opacity-90 transition-opacity`} />
            <div className="relative p-6">
              <h3 className="text-lg font-medium text-white mb-2 group-hover:text-white/90 transition-colors">{card.title}</h3>
              <p className="text-sm text-white/60 mb-4">{card.description}</p>
              <div className="flex items-center gap-2 text-white/40">
                <Users className="w-4 h-4" />
                <span className="text-sm">{card.users} users</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Center
