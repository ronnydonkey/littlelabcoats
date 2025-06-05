import { type NextRequest, NextResponse } from "next/server"

// Use Node.js runtime instead of edge
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    console.log("API route called")

    const body = await req.json()
    const { materials } = body

    console.log("Received materials:", materials)

    if (!materials || materials.length === 0) {
      return NextResponse.json({ error: "No materials provided" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not found")
      return NextResponse.json(createFallbackProject(materials))
    }

    // Try to use OpenAI with proper server-side configuration
    try {
      // Dynamic import to ensure it runs server-side
      const { default: OpenAI } = await import("openai")

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        // Explicitly set this to false since we're on the server
        dangerouslyAllowBrowser: false,
      })

      console.log("Making OpenAI request...")

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 1000,
        messages: [
          {
            role: "system",
            content: `You are a creative STEM educator. Create a fun, safe science experiment for kids ages 5-12. 
Respond with valid JSON only, no other text:
{
  "name": "Project Name",
  "time_estimate": "30 minutes",
  "materials": ["Material 1", "Material 2"],
  "instructions": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "parent_tip": "Helpful supervision tip",
  "learning_goal": "STEM concept learned"
}`,
          },
          {
            role: "user",
            content: `Create a STEM project using these materials: ${materials.join(", ")}`,
          },
        ],
      })

      const responseText = completion.choices[0].message.content || ""
      console.log("OpenAI response received")

      // Parse the JSON response
      let parsedJson
      try {
        const cleanedResponse = responseText.trim()
        const jsonStart = cleanedResponse.indexOf("{")
        const jsonEnd = cleanedResponse.lastIndexOf("}") + 1

        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          const jsonString = cleanedResponse.slice(jsonStart, jsonEnd)
          parsedJson = JSON.parse(jsonString)
        } else {
          throw new Error("No valid JSON found")
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        parsedJson = createFallbackProject(materials)
      }

      // Validate the response has required fields
      if (!parsedJson.name || !parsedJson.instructions || !Array.isArray(parsedJson.instructions)) {
        console.log("Invalid project structure, using fallback")
        parsedJson = createFallbackProject(materials)
      }

      console.log("Returning project successfully")
      return NextResponse.json(parsedJson)
    } catch (openaiError: any) {
      console.error("OpenAI API error:", openaiError.message)
      return NextResponse.json(createFallbackProject(materials))
    }
  } catch (error: any) {
    console.error("General API error:", error.message)

    // Try to get materials from the request for fallback
    let fallbackMaterials = ["Various household items"]
    try {
      const body = await req.json()
      fallbackMaterials = body.materials || fallbackMaterials
    } catch {
      // If we can't parse the request, use default materials
    }

    return NextResponse.json(createFallbackProject(fallbackMaterials))
  }
}

function createFallbackProject(materials: string[]) {
  const projects = [
    {
      name: "Rainbow Paper Tower Challenge",
      time_estimate: "30 minutes",
      materials: materials.slice(0, 3),
      instructions: [
        "Gather your materials on a flat surface",
        "Try to build the tallest tower you can using your materials",
        "Test how stable your tower is by gently blowing on it",
        "If it falls down, try a different design approach",
        "Measure your final tower and celebrate your engineering skills!",
      ],
      parent_tip:
        "Encourage your child to experiment with different building techniques and discuss what makes structures stable.",
      learning_goal: "Basic engineering principles and problem-solving skills",
    },
    {
      name: "Creative Color Mixing Lab",
      time_estimate: "25 minutes",
      materials: materials.slice(0, 4),
      instructions: [
        "Set up your workspace with all materials",
        "Use your materials to create different patterns and designs",
        "Try combining materials in unexpected ways",
        "Observe what happens when different materials interact",
        "Document your discoveries by drawing or describing them",
      ],
      parent_tip:
        "Ask open-ended questions like 'What do you think will happen if...' to encourage scientific thinking.",
      learning_goal: "Observation skills and creative problem-solving",
    },
    {
      name: "Amazing Balance Experiment",
      time_estimate: "35 minutes",
      materials: materials.slice(0, 3),
      instructions: [
        "Choose 2-3 materials to work with",
        "Try to balance one material on top of another",
        "Experiment with different positions and arrangements",
        "See how many materials you can balance at once",
        "Discuss why some arrangements work better than others",
      ],
      parent_tip: "This is a great opportunity to talk about gravity, balance, and center of mass in simple terms.",
      learning_goal: "Understanding balance, gravity, and basic physics concepts",
    },
    {
      name: "Super Simple Catapult",
      time_estimate: "40 minutes",
      materials: materials.slice(0, 4),
      instructions: [
        "Use your materials to create a launching device",
        "Test different ways to make things fly or move",
        "Try launching lightweight objects like paper balls",
        "Measure how far your objects travel",
        "Experiment with different angles and force amounts",
      ],
      parent_tip: "Talk about force, motion, and trajectory while keeping safety as the top priority.",
      learning_goal: "Physics concepts: force, motion, and simple machines",
    },
    {
      name: "Fantastic Floating Challenge",
      time_estimate: "30 minutes",
      materials: materials.slice(0, 3),
      instructions: [
        "Fill a container with water (ask an adult for help)",
        "Test which of your materials float and which sink",
        "Try to make sinking materials float using other materials",
        "Create boats or rafts using your materials",
        "See how much weight your floating creations can hold",
      ],
      parent_tip: "This is perfect for discussing density, buoyancy, and why some things float while others sink.",
      learning_goal: "Understanding density, buoyancy, and water displacement",
    },
  ]

  // Return a random project
  const randomProject = projects[Math.floor(Math.random() * projects.length)]
  console.log("Using fallback project:", randomProject.name)
  return randomProject
}
