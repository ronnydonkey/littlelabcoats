"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, RotateCcw, Heart, Package, AlertCircle } from "lucide-react"
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
  const [mounted, setMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load saved projects from localStorage only after mounting
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("little-lab-coats-saved")
        if (saved) {
          setSavedProjects(JSON.parse(saved))
        }
      } catch (error) {
        console.error("Error loading saved projects:", error)
      }
    }
  }, [mounted])

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
      const selectedNames = selectedMaterials
        .map((id) => materials.find((m) => m.id === id)?.name)
        .filter((name): name is string => Boolean(name))

      console.log("Sending materials:", selectedNames)

      const response = await fetch("/api/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materials: selectedNames }),
      })

      // Always try to get the JSON response, even if status isn't ok
      const data = await response.json()
      console.log("Received response:", data)

      // Check if we got a valid project
      if (data && data.name && data.instructions && Array.isArray(data.instructions)) {
        setProjects([data])
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      } else if (data.error) {
        throw new Error(data.error)
      } else {
        throw new Error("Invalid project data received")
      }
    } catch (err) {
      console.error("Error in generateProjects:", err)
      setError("Don't worry! Even real scientists have experiments that don't work the first time. Let's try again! 🔬")
    } finally {
      setLoading(false)
    }
  }

  const saveProject = (project: Project) => {
    if (typeof window !== "undefined") {
      try {
        const updated = [...savedProjects, project]
        setSavedProjects(updated)
        localStorage.setItem("little-lab-coats-saved", JSON.stringify(updated))
      } catch (error) {
        console.error("Error saving project:", error)
      }
    }
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🥽</div>
          <div className="text-xl text-purple-600">Loading Little Lab Coats...</div>
        </div>
      </div>
    )
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
              {"What's in your lab today?"}
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
          <div className="mb-6 p-4 bg-orange-100 border-2 border-orange-300 rounded-xl text-orange-700 text-center font-medium flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
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
