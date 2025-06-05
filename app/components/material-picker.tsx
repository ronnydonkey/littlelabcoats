"use client"

interface Material {
  id: string
  name: string
  icon: string
}

interface MaterialPickerProps {
  materials: Material[]
  selectedMaterials: string[]
  onToggleMaterial: (materialId: string) => void
}

export function MaterialPicker({ materials, selectedMaterials, onToggleMaterial }: MaterialPickerProps) {
  return (
    <div className="grid grid-cols-3 gap-4 md:gap-6">
      {materials.map((material) => {
        const isSelected = selectedMaterials.includes(material.id)
        return (
          <button
            key={material.id}
            onClick={() => onToggleMaterial(material.id)}
            className={`
              relative p-4 md:p-6 rounded-2xl border-4 transition-all duration-200 transform hover:scale-105
              ${
                isSelected
                  ? "border-purple-400 bg-purple-100 shadow-lg ring-4 ring-purple-200"
                  : "border-gray-200 bg-white hover:border-purple-200 hover:shadow-md"
              }
            `}
          >
            <div className="text-3xl md:text-4xl mb-2">{material.icon}</div>
            <div className="text-xs md:text-sm font-semibold text-gray-700 leading-tight">{material.name}</div>
            {isSelected && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
