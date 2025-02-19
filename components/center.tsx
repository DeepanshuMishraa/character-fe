import { Users, Sparkles, MessageCircle, Brain, Heart, Star, Crown, Flame } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

const popularCategories = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Romance & Dating",
    description: "Find your perfect match",
    bgColor: "from-pink-500/20 to-red-500/20"
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Intellectual Chat",
    description: "Deep conversations",
    bgColor: "from-purple-500/20 to-indigo-500/20"
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "Celebrity Talk",
    description: "Chat with stars",
    bgColor: "from-yellow-500/20 to-orange-500/20"
  },
  {
    icon: <Crown className="w-8 h-8" />,
    title: "Historical Figures",
    description: "Learn from the past",
    bgColor: "from-emerald-500/20 to-teal-500/20"
  },
  {
    icon: <Flame className="w-8 h-8" />,
    title: "Fantasy & Fiction",
    description: "Explore new worlds",
    bgColor: "from-red-500/20 to-orange-500/20"
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Therapy & Support",
    description: "Find comfort",
    bgColor: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Supernatural",
    description: "Mystical encounters",
    bgColor: "from-violet-500/20 to-purple-500/20"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Roleplay",
    description: "Be someone else",
    bgColor: "from-green-500/20 to-emerald-500/20"
  },
]

const Center = () => {
  const router = useRouter();

  const { data: charactersData, isLoading } = useQuery({
    queryKey: ['characters'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/character/characters`);
      const data = await response.json();
      return data.characters;
    }
  });

  const handleCharacterClick = (characterId: string) => {
    router.push(`/dashboard/chat/${characterId}`);
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-white/90 px-2">Featured Characters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2 mb-12">
        {isLoading ? (
          <div>Loading characters...</div>
        ) : (
          charactersData?.slice(0, 8).map((character: any) => (
            <div
              key={character.id}
              onClick={() => handleCharacterClick(character.id)}
              className="group relative overflow-hidden rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-100 group-hover:opacity-90 transition-opacity`} />
              <div className="relative p-6">
                <h3 className="text-lg font-medium text-white mb-2 group-hover:text-white/90 transition-colors">
                  {character.name}
                </h3>
                <p className="text-sm text-white/60 mb-4">
                  {character.description}
                </p>
                <div className="flex items-center gap-2 text-white/40">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">AI Character</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-white/90 px-2">Explore Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
        {popularCategories.map((category, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.bgColor} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className="relative p-6 flex items-start gap-4">
              <div className="p-2 rounded-full bg-white/10 text-white/80 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-medium text-white group-hover:text-white/90 transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-white/60">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Center
