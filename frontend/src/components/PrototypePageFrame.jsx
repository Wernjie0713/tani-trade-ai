import { useEffect } from "react"

function PrototypePageFrame({
  bodyClass = "",
  children,
  htmlClass = "",
  styles = [],
  themeStyle = {},
  title,
}) {
  useEffect(() => {
    const previousTitle = document.title
    const previousHtmlClass = document.documentElement.className
    const previousBodyClass = document.body.className
    const previousStyleValues = {}

    for (const [property, value] of Object.entries(themeStyle)) {
      previousStyleValues[property] = document.documentElement.style.getPropertyValue(
        property
      )
      document.documentElement.style.setProperty(property, value)
    }

    document.title = title
    document.documentElement.className = htmlClass
    document.body.className = bodyClass

    return () => {
      document.title = previousTitle
      document.documentElement.className = previousHtmlClass
      document.body.className = previousBodyClass

      for (const [property, value] of Object.entries(previousStyleValues)) {
        if (value) {
          document.documentElement.style.setProperty(property, value)
        } else {
          document.documentElement.style.removeProperty(property)
        }
      }
    }
  }, [bodyClass, htmlClass, themeStyle, title])

  return (
    <>
      {styles.map((styleContent, index) => (
        <style key={`${title}-style-${index}`}>{styleContent}</style>
      ))}
      {children}
    </>
  )
}

export default PrototypePageFrame
