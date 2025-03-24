"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { toPng } from "html-to-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownUp, Download, Image, Plus, Trash, Move, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { v4 as uuidv4 } from "uuid"

// Define a type for overlay images
type OverlayImage = {
  id: string
  src: string
  position: { x: number; y: number }
  size: number
  zIndex: number
}

// Define a type for text elements
type TextElement = {
  id: string
  content: string
  position: { x: number; y: number }
  color: string
  fontSize: number
  strokeWidth: number
  zIndex: number
}

export default function MemeGenerator() {
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [overlayImages, setOverlayImages] = useState<OverlayImage[]>([])
  const [textElements, setTextElements] = useState<TextElement[]>([])
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null)
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragType, setDragType] = useState<"overlay" | "text" | null>(null)
  const [nextZIndex, setNextZIndex] = useState(1)

  // New text element form state
  const [newTextContent, setNewTextContent] = useState("")
  const [newTextColor, setNewTextColor] = useState("#ffffff")
  const [newTextFontSize, setNewTextFontSize] = useState(36)
  const [newTextStrokeWidth, setNewTextStrokeWidth] = useState(2)

  const memeRef = useRef<HTMLDivElement>(null)

  // Get the currently selected overlay
  const selectedOverlay = overlayImages.find((img) => img.id === selectedOverlayId)

  // Get the currently selected text element
  const selectedText = textElements.find((text) => text.id === selectedTextId)

  // Handle main image drop
  const onMainDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type.match("image.*")) {
      const reader = new FileReader()
      reader.onload = () => {
        setMainImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  // Handle overlay image drop
  const onOverlayDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles;
    Array.from(file).forEach((singleFile) => {
      if (singleFile.type.match("image.*")) {
        const reader = new FileReader()
        reader.onload = () => {
        const newOverlay: OverlayImage = {
          id: uuidv4(),
          src: reader.result as string,
          position: { x: 25, y: 25 },
          size: 50,
          zIndex: nextZIndex,
        }
        setNextZIndex((prev) => prev + 1)
        setOverlayImages((prev) => [...prev, newOverlay])
        setSelectedOverlayId(newOverlay.id)
        setSelectedTextId(null)
        }
        reader.readAsDataURL(singleFile)
      }
    })
    },
    [nextZIndex],
  )

  const { getRootProps: getMainRootProps, getInputProps: getMainInputProps } = useDropzone({
    onDrop: onMainDrop,
    accept: {
      "image/*": [],
    },
  })

  const { getRootProps: getOverlayRootProps, getInputProps: getOverlayInputProps } = useDropzone({
    onDrop: onOverlayDrop,
    accept: {
      "image/*": [],
    },
  })

  // Switch main and selected overlay image
  const switchImages = () => {
    if (mainImage && selectedOverlay) {
      const temp = mainImage
      setMainImage(selectedOverlay.src)

      // Update the selected overlay with the main image
      setOverlayImages((prev) =>
        prev.map((overlay) => (overlay.id === selectedOverlay.id ? { ...overlay, src: temp } : overlay)),
      )
    }
  }

  // Add a new text element
  const addTextElement = () => {
    if (!newTextContent.trim()) return

    const newText: TextElement = {
      id: uuidv4(),
      content: newTextContent,
      position: { x: 25, y: 25 },
      color: newTextColor,
      fontSize: newTextFontSize,
      strokeWidth: newTextStrokeWidth,
      zIndex: nextZIndex,
    }

    setNextZIndex((prev) => prev + 1)
    setTextElements((prev) => [...prev, newText])
    setSelectedTextId(newText.id)
    setSelectedOverlayId(null)
    setNewTextContent("")
  }

  // Update text element content
  const updateTextContent = (content: string) => {
    if (!selectedTextId) return

    setTextElements((prev) => prev.map((text) => (text.id === selectedTextId ? { ...text, content } : text)))
  }

  // Update text element color
  const updateTextColor = (color: string) => {
    if (!selectedTextId) return

    setTextElements((prev) => prev.map((text) => (text.id === selectedTextId ? { ...text, color } : text)))
  }

  // Update text element font size
  const updateTextFontSize = (fontSize: number) => {
    if (!selectedTextId) return

    setTextElements((prev) => prev.map((text) => (text.id === selectedTextId ? { ...text, fontSize } : text)))
  }

  // Update text element stroke width
  const updateTextStrokeWidth = (strokeWidth: number) => {
    if (!selectedTextId) return

    setTextElements((prev) => prev.map((text) => (text.id === selectedTextId ? { ...text, strokeWidth } : text)))
  }

  // Remove a text element
  const removeTextElement = (id: string) => {
    setTextElements((prev) => prev.filter((text) => text.id !== id))
    if (selectedTextId === id) {
      setSelectedTextId(null)
    }
  }

  // Handle element dragging start
  const handleDragStart = (type: "overlay" | "text", id: string) => (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()

    if (type === "overlay") {
      setSelectedOverlayId(id)
      setSelectedTextId(null)
    } else {
      setSelectedTextId(id)
      setSelectedOverlayId(null)
    }

    setDragType(type)
    setIsDragging(true)

    // Bring the selected element to the front
    if (type === "overlay") {
      setOverlayImages((prev) =>
        prev.map((overlay) => (overlay.id === id ? { ...overlay, zIndex: nextZIndex } : overlay)),
      )
    } else {
      setTextElements((prev) => prev.map((text) => (text.id === id ? { ...text, zIndex: nextZIndex } : text)))
    }
    setNextZIndex((prev) => prev + 1)
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !memeRef.current || (!selectedOverlayId && !selectedTextId)) return

    const rect = memeRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    if (dragType === "overlay" && selectedOverlayId) {
      setOverlayImages((prev) =>
        prev.map((overlay) => {
          if (overlay.id === selectedOverlayId) {
            const size = overlay.size
            return {
              ...overlay,
              position: {
                x: Math.max(0, Math.min(100 - size / 2, x)),
                y: Math.max(0, Math.min(100 - size / 2, y)),
              },
            }
          }
          return overlay
        }),
      )
    } else if (dragType === "text" && selectedTextId) {
      setTextElements((prev) =>
        prev.map((text) => {
          if (text.id === selectedTextId) {
            return {
              ...text,
              position: {
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y)),
              },
            }
          }
          return text
        }),
      )
    }
  }

  // Handle touch move for dragging
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !memeRef.current || (!selectedOverlayId && !selectedTextId) || e.touches.length === 0) return

    const touch = e.touches[0]
    const rect = memeRef.current.getBoundingClientRect()
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100

    if (dragType === "overlay" && selectedOverlayId) {
      setOverlayImages((prev) =>
        prev.map((overlay) => {
          if (overlay.id === selectedOverlayId) {
            const size = overlay.size
            return {
              ...overlay,
              position: {
                x: Math.max(0, Math.min(100 - size / 2, x)),
                y: Math.max(0, Math.min(100 - size / 2, y)),
              },
            }
          }
          return overlay
        }),
      )
    } else if (dragType === "text" && selectedTextId) {
      setTextElements((prev) =>
        prev.map((text) => {
          if (text.id === selectedTextId) {
            return {
              ...text,
              position: {
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y)),
              },
            }
          }
          return text
        }),
      )
    }
  }

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false)
    setDragType(null)
  }

  // Update overlay size
  const updateOverlaySize = (size: number) => {
    if (!selectedOverlayId) return

    setOverlayImages((prev) =>
      prev.map((overlay) => (overlay.id === selectedOverlayId ? { ...overlay, size } : overlay)),
    )
  }

  // Remove an overlay
  const removeOverlay = (id: string) => {
    setOverlayImages((prev) => prev.filter((overlay) => overlay.id !== id))
    if (selectedOverlayId === id) {
      setSelectedOverlayId(null)
    }
  }

  // Bring selected element to front
  const bringToFront = () => {
    if (selectedOverlayId) {
      setOverlayImages((prev) =>
        prev.map((overlay) => (overlay.id === selectedOverlayId ? { ...overlay, zIndex: nextZIndex } : overlay)),
      )
      setNextZIndex((prev) => prev + 1)
    } else if (selectedTextId) {
      setTextElements((prev) =>
        prev.map((text) => (text.id === selectedTextId ? { ...text, zIndex: nextZIndex } : text)),
      )
      setNextZIndex((prev) => prev + 1)
    }
  }

  // Reset element position to center
  const resetPosition = () => {
    if (selectedOverlayId) {
      setOverlayImages((prev) =>
        prev.map((overlay) =>
          overlay.id === selectedOverlayId ? { ...overlay, position: { x: 25, y: 25 } } : overlay,
        ),
      )
    } else if (selectedTextId) {
      setTextElements((prev) =>
        prev.map((text) => (text.id === selectedTextId ? { ...text, position: { x: 25, y: 25 } } : text)),
      )
    }
  }

  // Download meme as image
  const downloadMeme = useCallback(() => {
    if (memeRef.current === null) return

    toPng(memeRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a")
        link.download = "my-meme.png"
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.error("Error generating image:", err)
      })
  }, [memeRef])

  // Add event listeners for mouse and touch events
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false)
      setDragType(null)
    }

    document.addEventListener("mouseup", handleGlobalMouseUp)
    document.addEventListener("touchend", handleGlobalMouseUp)

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp)
      document.removeEventListener("touchend", handleGlobalMouseUp)
    }
  }, [])

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Meme Preview */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4">Preview</h2>
        <div
          ref={memeRef}
          className="relative w-full aspect-square max-w-md border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
        >
          {!mainImage ? (
            <div className="text-center p-4 text-gray-500">
              <Image className="mx-auto h-12 w-12 text-gray-400" />
              <p>Drop your main image here or use the controls</p>
            </div>
          ) : (
            <>
              <img
                src={mainImage || "/placeholder.svg"}
                alt="Main"
                className="absolute inset-0 w-full h-full object-contain"
              />

              {/* Render all overlay images */}
              {overlayImages.map((overlay) => (
                <div
                  key={overlay.id}
                  className={cn(
                    "absolute",
                    isDragging && selectedOverlayId === overlay.id ? "cursor-grabbing" : "cursor-grab",
                    selectedOverlayId === overlay.id ? "ring-2 ring-primary ring-offset-2" : "",
                  )}
                  style={{
                    width: `${overlay.size}%`,
                    height: `${overlay.size}%`,
                    left: `${overlay.position.x}%`,
                    top: `${overlay.position.y}%`,
                    transform: "translate(-50%, -50%)",
                    touchAction: "none",
                    zIndex: overlay.zIndex,
                  }}
                  onMouseDown={handleDragStart("overlay", overlay.id)}
                  onTouchStart={handleDragStart("overlay", overlay.id)}
                >
                  <img src={overlay.src || "/placeholder.svg"} alt="Overlay" className="w-full h-full object-contain" />
                </div>
              ))}

              {/* Render all text elements */}
              {textElements.map((text) => (
                <div
                  key={text.id}
                  className={cn(
                    "absolute px-4 py-2 break-words text-center",
                    isDragging && selectedTextId === text.id ? "cursor-grabbing" : "cursor-grab",
                    selectedTextId === text.id ? "ring-2 ring-primary ring-offset-2 bg-black/10" : "",
                  )}
                  style={{
                    left: `${text.position.x}%`,
                    top: `${text.position.y}%`,
                    transform: "translate(-50%, -50%)",
                    touchAction: "none",
                    zIndex: text.zIndex,
                    fontSize: `${text.fontSize}px`,
                    color: text.color,
                    textShadow: `
                      -${text.strokeWidth}px -${text.strokeWidth}px 0 #000,
                      ${text.strokeWidth}px -${text.strokeWidth}px 0 #000,
                      -${text.strokeWidth}px ${text.strokeWidth}px 0 #000,
                      ${text.strokeWidth}px ${text.strokeWidth}px 0 #000
                    `,
                    fontFamily: "Impact, sans-serif",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    lineHeight: 1.2,
                    maxWidth: "80%",
                  }}
                  onMouseDown={handleDragStart("text", text.id)}
                  onTouchStart={handleDragStart("text", text.id)}
                >
                  {text.content}
                </div>
              ))}
            </>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={downloadMeme} disabled={!mainImage}>
            <Download className="mr-2 h-4 w-4" /> Download Meme
          </Button>

          {(selectedOverlayId || selectedTextId) && (
            <>
              <Button variant="outline" onClick={bringToFront}>
                <Move className="mr-2 h-4 w-4" /> Bring to Front
              </Button>
              <Button variant="outline" onClick={resetPosition}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset Position
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div>
        <Tabs defaultValue="images">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="images">Main Image</TabsTrigger>
            <TabsTrigger value="overlays">Overlays</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Main Image Upload */}
                <div>
                  <Label className="text-base font-medium">Main Image</Label>
                  <div
                    {...getMainRootProps()}
                    className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input {...getMainInputProps()} />
                    <div className="text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Drag & drop an image here, or click to select</p>
                    </div>
                  </div>
                </div>

                {/* Switch Images Button */}
                {selectedOverlayId && (
                  <Button
                    onClick={switchImages}
                    variant="outline"
                    className="w-full"
                    disabled={!mainImage || !selectedOverlayId}
                  >
                    <ArrowDownUp className="mr-2 h-4 w-4" /> Switch with Selected Overlay
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overlays" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Add New Overlay */}
                <div>
                  <Label className="text-base font-medium">Add New Overlay</Label>
                  <div
                    {...getOverlayRootProps()}
                    className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input {...getOverlayInputProps()} />
                    <div className="text-center">
                      <Plus className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Drag & drop an image here, or click to select</p>
                    </div>
                  </div>
                </div>

                {/* Overlay List */}
                {overlayImages.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Manage Overlays</Label>
                    <p className="text-sm text-gray-500 mb-2">Click an overlay to select it for editing</p>
                    <div className="grid grid-cols-3 gap-2">
                      {overlayImages.map((overlay) => (
                        <div
                          key={overlay.id}
                          className={cn(
                            "relative border rounded-md p-1 cursor-pointer",
                            selectedOverlayId === overlay.id ? "ring-2 ring-primary" : "",
                          )}
                          onClick={() => {
                            setSelectedOverlayId(overlay.id)
                            setSelectedTextId(null)
                          }}
                        >
                          <img
                            src={overlay.src || "/placeholder.svg"}
                            alt="Overlay thumbnail"
                            className="w-full aspect-square object-contain"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeOverlay(overlay.id)
                            }}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Overlay Controls */}
                {selectedOverlay && (
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Overlay Size</Label>
                    <Slider
                      value={[selectedOverlay.size]}
                      min={10}
                      max={100}
                      step={1}
                      onValueChange={(value) => updateOverlaySize(value[0])}
                    />
                    <p className="text-xs text-gray-500">Tip: Drag the overlay image to position it anywhere</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Add New Text */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Add New Text</Label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        value={newTextContent}
                        onChange={(e) => setNewTextContent(e.target.value)}
                        placeholder="Enter text content"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={newTextColor}
                            onChange={(e) => setNewTextColor(e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Font Size</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[newTextFontSize]}
                            min={12}
                            max={72}
                            step={1}
                            onValueChange={(value) => setNewTextFontSize(value[0])}
                          />
                          <span className="text-sm text-gray-500 w-8">{newTextFontSize}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Text Outline</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[newTextStrokeWidth]}
                          min={0}
                          max={5}
                          step={0.5}
                          onValueChange={(value) => setNewTextStrokeWidth(value[0])}
                        />
                        <span className="text-sm text-gray-500 w-8">{newTextStrokeWidth}</span>
                      </div>
                    </div>

                    <Button onClick={addTextElement} disabled={!newTextContent.trim()} className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Add Text
                    </Button>
                  </div>
                </div>

                {/* Text Elements List */}
                {textElements.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Manage Text Elements</Label>
                    <p className="text-sm text-gray-500 mb-2">Click a text element to select it for editing</p>
                    <div className="space-y-2">
                      {textElements.map((text) => (
                        <div
                          key={text.id}
                          className={cn(
                            "relative border rounded-md p-3 cursor-pointer",
                            selectedTextId === text.id ? "ring-2 ring-primary" : "",
                          )}
                          onClick={() => {
                            setSelectedTextId(text.id)
                            setSelectedOverlayId(null)
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div
                              className="truncate flex-1"
                              style={{
                                color: text.color,
                                textShadow: `
                                  -${text.strokeWidth}px -${text.strokeWidth}px 0 #000,
                                  ${text.strokeWidth}px -${text.strokeWidth}px 0 #000,
                                  -${text.strokeWidth}px ${text.strokeWidth}px 0 #000,
                                  ${text.strokeWidth}px ${text.strokeWidth}px 0 #000
                                `,
                                fontSize: `${Math.min(text.fontSize, 24)}px`,
                                fontFamily: "Impact, sans-serif",
                                fontWeight: "bold",
                              }}
                            >
                              {text.content}
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-6 w-6 ml-2"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeTextElement(text.id)
                              }}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Text Controls */}
                {selectedText && (
                  <div className="space-y-4 border-t pt-4 mt-4">
                    <Label className="text-base font-medium">Edit Selected Text</Label>

                    <div className="space-y-2">
                      <Label>Text Content</Label>
                      <Input
                        value={selectedText.content}
                        onChange={(e) => updateTextContent(e.target.value)}
                        placeholder="Enter text content"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="color"
                            value={selectedText.color}
                            onChange={(e) => updateTextColor(e.target.value)}
                            className="w-12 h-10 p-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Font Size</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[selectedText.fontSize]}
                            min={12}
                            max={72}
                            step={1}
                            onValueChange={(value) => updateTextFontSize(value[0])}
                          />
                          <span className="text-sm text-gray-500 w-8">{selectedText.fontSize}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Text Outline</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[selectedText.strokeWidth]}
                          min={0}
                          max={5}
                          step={0.5}
                          onValueChange={(value) => updateTextStrokeWidth(value[0])}
                        />
                        <span className="text-sm text-gray-500 w-8">{selectedText.strokeWidth}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Tip: Drag the text element to position it anywhere on the meme
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

