const initCharts = () => {
  document.querySelectorAll<HTMLElement>(".chart-container").forEach((container) => {
    const tooltip = container.querySelector<HTMLElement>(".chart-tooltip")
    if (!tooltip) return
    const dots = container.querySelectorAll<SVGCircleElement>(".chart-dot")
    let visible = false
    dots.forEach((dot) => {
      dot.style.cursor = "pointer"
      dot.addEventListener("mouseenter", () => {
        const date = dot.getAttribute("data-date")
        const label = dot.getAttribute("data-label")
        const value = dot.getAttribute("data-value")
        if (date && label && value) {
          tooltip.innerHTML = `<div class="tooltip-date">${date}</div><div class="tooltip-label">${label}</div><div class="tooltip-value">${value}</div>`
          tooltip.style.opacity = "1"
          visible = true
        }
      })
      dot.addEventListener("mousemove", (e: MouseEvent) => {
        if (!visible) return
        const rect = container.getBoundingClientRect()
        tooltip.style.left = `${e.clientX - rect.left + 12}px`
        tooltip.style.top = `${e.clientY - rect.top - 12}px`
      })
      dot.addEventListener("mouseleave", () => {
        tooltip.style.opacity = "0"
        visible = false
      })
    })
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCharts)
} else {
  initCharts()
}
