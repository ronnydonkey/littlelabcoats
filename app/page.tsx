"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, RotateCcw, Heart, Package } from "lucide-react"
import { MaterialPicker } from "./components/material-picker"
import { ProjectCard } from "./components/project-card"
import { Confetti } from "./components/confetti"

interface Project {
  name: string
  time_estimate: string
  materials: string[]
  instructions: string[]
  parent_tip: string
  learning_goal: string
}

const materials = [
  { id: "scissors", name: "Scissors", icon: "✂️" },
  { id: "balloon", name: "Balloon", icon: "🎈" },
  { id: "glue", name: "Glue", icon: "🧴" },
  { id: "tape", name: "Tape", icon: "📏" },
  { id: "toilet-paper-roll", name: "Toilet Paper Roll", icon: "🧻" },
  { id: "yarn", name: "Yarn", icon: "🧶" },
  { id: "markers", name: "Markers", icon: "🖍️" },
  { id: "clothespin", name: "Clothespin", icon: "📎" },
  { id: "plastic-bottle", name: "Plastic Bottle", icon: "🍼" },
]

export default function LittleLabCoats() {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [savedProjects, setSavedProjects] = useState<Project[]>([])

  // Load saved projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("little-lab-coats-saved")
    if (saved) {
      setSavedProjects(JSON.parse(saved))
    }
  }, [])

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId) ? prev.filter((id) => id !== materialId) : [...prev, materialId],
    )
  }

  const generateProjects = async () => {
    if (selectedMaterials.length === 0) {
      setError("Please select at least one material to start your lab experiment! 🧪")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const selectedNames = selectedMaterials.map((id) => materials.find((m) => m.id === id)?.name).filter(Boolean)

      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materials: selectedNames }),
      })

      if (!response.ok) throw new Error("Failed to generate projects")

      const data = await response.json()
      setProjects(Array.isArray(data) ? data : [data])
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } catch (err) {
      setError("Oops! Our idea brain needs a moment. Try again! 🤖")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const saveProject = (project: Project) => {
    const updated = [...savedProjects, project]
    setSavedProjects(updated)
    localStorage.setItem("little-lab-coats-saved", JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {showConfetti && <Confetti />}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-purple-800 mb-2">🥽 Little Lab Coats</h1>
          <p className="text-lg md:text-xl text-purple-600 font-medium">Turn your home into a STEM playground!</p>
        </div>

        {/* Material Picker */}
        <Card className="mb-8 border-4 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
              <Package className="w-6 h-6" />
              What's in your lab today?
            </h2>
            <MaterialPicker
              materials={materials}
              selectedMaterials={selectedMaterials}
              onToggleMaterial={toggleMaterial}
            />
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-xl text-red-700 text-center font-medium">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <div className="text-center mb-8">
          <Button
            onClick={generateProjects}
            disabled={loading || selectedMaterials.length === 0}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Brewing Ideas...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-6 w-6" />
                Start Idea Brain! 🧠
              </>
            )}
          </Button>
        </div>

        {/* Projects Display */}
        {projects.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-purple-800 text-center mb-6">🎉 Your STEM Adventures!</h2>
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} onSave={() => saveProject(project)} />
            ))}

            <div className="text-center">
              <Button
                onClick={generateProjects}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Try Another Experiment!
              </Button>
            </div>
          </div>
        )}

        {/* Saved Projects */}
        {savedProjects.length > 0 && (
          <Card className="mt-12 border-4 border-green-200 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6" />
                Your Saved Lab Experiments ({savedProjects.length})
              </h2>
              <div className="grid gap-4">
                {savedProjects.slice(-3).map((project, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <h3 className="font-bold text-green-800">{project.name}</h3>
                    <p className="text-sm text-green-600">{project.learning_goal}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
