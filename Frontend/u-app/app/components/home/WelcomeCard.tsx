import { Card, CardContent } from "@/components/ui/card"
import { Award } from "lucide-react"



export default function WelcomeCard() {
  return (
    <Card className="bg-white/80 dark:bg-wayuu-dark-card backdrop-blur-sm mb-8 p-4 sm:p-6 rounded-xl shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4 sm:gap-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-wayuu-red font-display text-center sm:text-left">
                  Welcome to your Wayuu adventure!
                </h2>
                <p className="text-wayuu-navy dark:text-wayuu-dark-text mt-2 text-center sm:text-left">
                  Explore our chapters and lessons to learn the beautiful Wayuu dialect.
                </p>
              </div>
              <Award className="h-10 w-10 sm:h-12 sm:w-12 text-wayuu-red dark:text-wayuu-red opacity-80" />
            </div>
          </CardContent>
    </Card>
  )
}
