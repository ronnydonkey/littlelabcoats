"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Clock, Package, List, Heart, Lightbulb } from "lucide-react"

interface Project {
  name: string
  time_estimate: string
  materials: string[]
  instructions: string[]
  parent_tip: string
  learning_goal: string
}

interface ProjectCardProps {
  project: Project
  onSave: () => void
}

export function ProjectCard({ project, onSave }: ProjectCardProps) {
  return (
    <Card className="border-4 border-yellow-200 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl md:text-3xl font-bold text-orange-800 leading-tight">{project.name}</h3>
          <Button
            onClick={onSave}
            variant="outline"
            size="sm"
            className="border-2 border-pink-300 text-pink-600 hover:bg-pink-100"
          >
            <Heart className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-700">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Time: {project.time_estimate}</span>
            </div>

            <div>
              <div className="flex items-center gap-2 text-orange-700 mb-2">
                <Package className="w-5 h-5" />
                <span className="font-semibold">Materials:</span>
              </div>
              <ul className="list-disc list-inside text-sm space-y-1 text-orange-600 ml-4">
                {project.materials.map((material, index) => (
                  <li key={index}>{material}</li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <Brain className="w-5 h-5" />
                <span className="font-semibold">Learning Goal:</span>
              </div>
              <p className="text-sm text-purple-600 bg-purple-100 p-3 rounded-lg border-2 border-purple-200">
                {project.learning_goal}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <List className="w-5 h-5" />
                <span className="font-semibold">Steps:</span>
              </div>
              <ol className="list-decimal list-inside text-sm space-y-2 text-blue-600">
                {project.instructions.map((step, index) => (
                  <li key={index} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <Lightbulb className="w-5 h-5" />
                <span className="font-semibold">Parent Tip:</span>
              </div>
              <p className="text-sm text-green-600 bg-green-100 p-3 rounded-lg border-2 border-green-200">
                {project.parent_tip}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
