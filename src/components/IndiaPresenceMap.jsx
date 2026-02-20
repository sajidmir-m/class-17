import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useRef } from 'react'

// Component to render clickable state labels
function StateLabels({ locations, activeName, onSelect }) {
  const map = useMap()
  const containerRef = useRef(null)

  useEffect(() => {
    const mapContainer = map.getContainer()
    
    // Create container for labels if it doesn't exist
    if (!containerRef.current) {
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.top = '0'
      container.style.left = '0'
      container.style.width = '100%'
      container.style.height = '100%'
      container.style.pointerEvents = 'none'
      container.style.zIndex = '1000'
      container.className = 'state-labels-container'
      mapContainer.appendChild(container)
      containerRef.current = container
    }

    const container = containerRef.current

    const updateLabels = () => {
      if (!container) return
      
      // Clear existing labels
      container.innerHTML = ''

      const zoom = map.getZoom()
      // At lower zoom, use stricter spacing to reduce overlap.
      const minDistance = zoom <= 4 ? 72 : zoom <= 5 ? 54 : 38
      const placed = []

      locations.forEach((loc) => {
        try {
          const point = map.latLngToContainerPoint(loc.latlng)
          const isActive = loc.name === activeName

          // Skip labels that are too close to already rendered labels, except active one.
          if (!isActive) {
            const crowded = placed.some((p) => {
              const dx = p.x - point.x
              const dy = p.y - point.y
              return Math.sqrt(dx * dx + dy * dy) < minDistance
            })
            if (crowded) return
          }

          const label = document.createElement('div')
          label.textContent = loc.name
          label.style.position = 'absolute'
          label.style.left = `${point.x}px`
          label.style.top = `${point.y}px`
          label.style.transform = 'translate(-50%, -50%)'
          label.style.padding = isActive ? '8px 14px' : '6px 10px'
          label.style.backgroundColor = isActive ? 'rgba(30, 64, 175, 0.96)' : 'rgba(37, 99, 235, 0.88)'
          label.style.color = 'white'
          label.style.borderRadius = '20px'
          label.style.fontSize = isActive ? '12px' : '11px'
          label.style.fontWeight = '600'
          label.style.cursor = 'pointer'
          label.style.whiteSpace = 'nowrap'
          label.style.boxShadow = '0 2px 10px rgba(0,0,0,0.25)'
          label.style.transition = 'all 0.2s ease'
          label.style.pointerEvents = 'auto'
          label.style.userSelect = 'none'
          label.style.border = isActive ? '2px solid rgba(255,255,255,0.7)' : '1px solid rgba(255,255,255,0.35)'
          
          label.addEventListener('mouseenter', () => {
            label.style.backgroundColor = 'rgba(37, 99, 235, 1)'
            label.style.transform = 'translate(-50%, -50%) scale(1.15)'
            label.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)'
            label.style.borderColor = 'rgba(255,255,255,0.5)'
          })
          
          label.addEventListener('mouseleave', () => {
            label.style.backgroundColor = 'rgba(37, 99, 235, 0.92)'
            label.style.transform = 'translate(-50%, -50%) scale(1)'
            label.style.boxShadow = '0 2px 10px rgba(0,0,0,0.25)'
            label.style.borderColor = 'rgba(255,255,255,0.3)'
          })
          
          label.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            onSelect?.(loc.name)
          })
          
          container.appendChild(label)
          placed.push({ x: point.x, y: point.y })
        } catch (err) {
          console.warn('Error rendering label for', loc.name, err)
        }
      })
    }

    // Initial render
    setTimeout(updateLabels, 100)

    // Update on map events
    map.on('moveend', updateLabels)
    map.on('zoomend', updateLabels)
    map.on('resize', updateLabels)
    map.on('viewreset', updateLabels)

    return () => {
      map.off('moveend', updateLabels)
      map.off('zoomend', updateLabels)
      map.off('resize', updateLabels)
      map.off('viewreset', updateLabels)
      if (containerRef.current && containerRef.current.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current)
        containerRef.current = null
      }
    }
  }, [map, locations, activeName, onSelect])

  return null
}

export default function IndiaPresenceMap({ locations, activeName, onSelect }) {
  return (
    <div className="w-full h-[600px] md:h-[700px] rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
      <MapContainer
        center={[22.5, 78.9]}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <StateLabels locations={locations} activeName={activeName} onSelect={onSelect} />
      </MapContainer>
    </div>
  )
}


