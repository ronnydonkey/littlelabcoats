import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const ProjectSchema = z.object({
  name: z.string().describe("Creative, engaging project name"),
  time_estimate: z.string().describe("Time needed (e.g., '30 minutes', '1-2 hours')"),
  materials: z.array(z.string()).describe("Materials needed from the provided list"),
  instructions: z.array(z.string()).describe("4-8 clear, step-by-step instructions"),
  parent_tip: z.string().describe("Helpful supervision tip for parents"),
  learning_goal: z.string().describe("STEM concept being learned (e.g., 'principles of motion', 'chemical reactions')"),
})

export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { materials } = await req.json()

    if (!materials || materials.length === 0) {
      return Response.json({ error: "No materials provided" }, { status: 400 })
    }

    const result = await generateObject({
      model: openai("gpt-4o"),
      temperature: 0.8,
      schema: ProjectSchema,
      prompt: `You are a creative STEM educator creating fun, hands-on science experiments for kids ages 5-12. 
Create ONE engaging project using some or all of these materials: ${materials.join(", ")}.

Requirements:
- Make it educational and fun, focusing on a clear STEM concept
- Use only the provided materials (plus common household items like water if needed)
- Include 4-8 clear, easy-to-follow steps
- Ensure it's safe for kids with adult supervision
- Time should be 15 minutes to 2 hours
- Focus on discovery and learning through play
- Include a specific learning goal (physics, chemistry, engineering, etc.)
- Make the parent tip practical and encouraging

Available materials: ${materials.join(", ")}

Make it feel like a real science experiment that kids would be excited to try!`,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Error generating project:", error)
    return Response.json({ error: "Failed to generate project" }, { status: 500 })
  }
}
