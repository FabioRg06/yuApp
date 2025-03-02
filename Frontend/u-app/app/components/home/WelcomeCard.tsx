import { Card, CardContent } from "@/components/ui/card"

export default function WelcomeCard() {
  return (
    <Card className="bg-white/80 dark:bg-wayuu-dark-card backdrop-blur-sm mb-8 p-6 rounded-xl shadow-lg">
      <CardContent>
        <h2 className="text-2xl font-semibold mb-4 text-wayuu-red font-display">
          Welcome to your Wayuu adventure!
        </h2>
        <p className="text-wayuu-navy dark:text-wayuu-dark-text">
          Explore our chapters and lessons to learn the beautiful Wayuu dialect.
        </p>
      </CardContent>
    </Card>
  )
}
