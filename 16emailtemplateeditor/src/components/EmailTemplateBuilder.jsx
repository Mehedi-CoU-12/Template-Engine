import React, { useState, useRef, useCallback } from "react";
import {
    Type,
    Image,
    Square,
    Copy,
    Download,
    Upload,
    Trash2,
    Eye,
    Smartphone,
    Monitor,
} from "lucide-react";

const EmailTemplateBuilder = () => {
    const [elements, setElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const [dragOverlay, setDragOverlay] = useState(null);
    const [viewMode, setViewMode] = useState("desktop");
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    // Generate unique ID for elements
    const generateId = () =>
        Date.now().toString(36) + Math.random().toString(36).substr(2);

    // Add new element to canvas
    const addElement = useCallback(
        (type) => {
            const newElement = {
                id: generateId(),
                type,
                x: 50,
                y: 50 + elements.length * 60,
                width: type === "text" ? 200 : type === "button" ? 150 : 200,
                height: type === "text" ? 40 : type === "button" ? 40 : 120,
                properties: getDefaultProperties(type),
            };
            setElements((prev) => [...prev, newElement]);
            setSelectedElement(newElement.id);
        },
        [elements.length]
    );

    // Default properties for different element types
    const getDefaultProperties = (type) => {
        switch (type) {
            case "text":
                return {
                    content: "Your text here",
                    fontSize: 16,
                    color: "#000000",
                    fontWeight: "normal",
                    textAlign: "left",
                    fontStyle: "normal",
                };
            case "image":
                return {
                    src: "https://via.placeholder.com/200x120",
                    alt: "Image",
                    objectFit: "cover",
                };
            case "button":
                return {
                    text: "Click me",
                    backgroundColor: "#007bff",
                    color: "#ffffff",
                    borderRadius: 4,
                    padding: "10px 20px",
                    href: "#",
                    fontSize: 14,
                };
            default:
                return {};
        }
    };

    // Handle drag start
    const handleDragStart = (e, elementId) => {
        const element = elements.find((el) => el.id === elementId);
        const rect = e.target.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        setDragOverlay({ elementId, offsetX, offsetY });
    };

    // Handle drag over canvas
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Handle drop on canvas
    const handleDrop = (e) => {
        e.preventDefault();
        if (!dragOverlay) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const newX = e.clientX - canvasRect.left - dragOverlay.offsetX;
        const newY = e.clientY - canvasRect.top - dragOverlay.offsetY;

        setElements((prev) =>
            prev.map((el) =>
                el.id === dragOverlay.elementId
                    ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) }
                    : el
            )
        );

        setDragOverlay(null);
    };

    // Update element properties
    const updateElement = (elementId, updates) => {
        setElements((prev) =>
            prev.map((el) => (el.id === elementId ? { ...el, ...updates } : el))
        );
    };

    // Update element property
    const updateElementProperty = (elementId, property, value) => {
        setElements((prev) =>
            prev.map((el) =>
                el.id === elementId
                    ? {
                          ...el,
                          properties: { ...el.properties, [property]: value },
                      }
                    : el
            )
        );
    };

    // Delete element
    const deleteElement = (elementId) => {
        setElements((prev) => prev.filter((el) => el.id !== elementId));
        if (selectedElement === elementId) {
            setSelectedElement(null);
        }
    };

    // Generate JSON
    const generateJSON = () => {
        return JSON.stringify(
            {
                template: {
                    name: "Email Template",
                    created: new Date().toISOString(),
                    elements: elements.map((el) => ({
                        id: el.id,
                        type: el.type,
                        position: { x: el.x, y: el.y },
                        dimensions: { width: el.width, height: el.height },
                        properties: el.properties,
                    })),
                },
            },
            null,
            2
        );
    };

    // Copy JSON to clipboard
    const copyJSON = async () => {
        try {
            await navigator.clipboard.writeText(generateJSON());
            alert("JSON copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy JSON:", err);
        }
    };

    // Load JSON template
    const loadJSON = (jsonString) => {
        try {
            const data = JSON.parse(jsonString);
            if (data.template && data.template.elements) {
                const loadedElements = data.template.elements.map((el) => ({
                    id: el.id,
                    type: el.type,
                    x: el.position.x,
                    y: el.position.y,
                    width: el.dimensions.width,
                    height: el.dimensions.height,
                    properties: el.properties,
                }));
                setElements(loadedElements);
                setSelectedElement(null);
            }
        } catch (err) {
            alert("Invalid JSON format",err);
        }
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (e) => {
                loadJSON(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    // Render element on canvas
    const renderElement = (element) => {
        const isSelected = selectedElement === element.id;
        const style = {
            position: "absolute",
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            border: isSelected ? "2px solid #007bff" : "1px solid transparent",
            cursor: "move",
            zIndex: isSelected ? 10 : 1,
        };

        switch (element.type) {
            case "text":
                return (
                    <div
                        key={element.id}
                        style={style}
                        draggable
                        onDragStart={(e) => handleDragStart(e, element.id)}
                        onClick={() => setSelectedElement(element.id)}
                        className="hover:border-blue-300"
                    >
                        <div
                            contentEditable
                            suppressContentEditableWarning
                            style={{
                                fontSize: element.properties.fontSize,
                                color: element.properties.color,
                                fontWeight: element.properties.fontWeight,
                                textAlign: element.properties.textAlign,
                                fontStyle: element.properties.fontStyle,
                                outline: "none",
                                width: "100%",
                                height: "100%",
                                padding: "4px",
                            }}
                            onBlur={(e) =>
                                updateElementProperty(
                                    element.id,
                                    "content",
                                    e.target.textContent
                                )
                            }
                        >
                            {element.properties.content}
                        </div>
                    </div>
                );

            case "image":
                return (
                    <div
                        key={element.id}
                        style={style}
                        draggable
                        onDragStart={(e) => handleDragStart(e, element.id)}
                        onClick={() => setSelectedElement(element.id)}
                        className="hover:border-blue-300"
                    >
                        <img
                            src={element.properties.src}
                            alt={element.properties.alt}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: element.properties.objectFit,
                            }}
                        />
                    </div>
                );

            case "button":
                return (
                    <div
                        key={element.id}
                        style={style}
                        draggable
                        onDragStart={(e) => handleDragStart(e, element.id)}
                        onClick={() => setSelectedElement(element.id)}
                        className="hover:border-blue-300"
                    >
                        <button
                            style={{
                                backgroundColor:
                                    element.properties.backgroundColor,
                                color: element.properties.color,
                                borderRadius: element.properties.borderRadius,
                                padding: element.properties.padding,
                                border: "none",
                                fontSize: element.properties.fontSize,
                                width: "100%",
                                height: "100%",
                                cursor: "pointer",
                            }}
                        >
                            {element.properties.text}
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    // Render property panel
    const renderPropertyPanel = () => {
        if (!selectedElement) return null;

        const element = elements.find((el) => el.id === selectedElement);
        if (!element) return null;

        return (
            <div className="bg-white p-4 border rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold capitalize">
                        {element.type} Properties
                    </h3>
                    <button
                        onClick={() => deleteElement(element.id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {element.type === "text" && (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Font Size
                            </label>
                            <input
                                type="number"
                                value={element.properties.fontSize}
                                onChange={(e) =>
                                    updateElementProperty(
                                        element.id,
                                        "fontSize",
                                        parseInt(e.target.value)
                                    )
                                }
                                className="w-full px-3 py-1 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Color
                            </label>
                            <input
                                type="color"
                                value={element.properties.color}
                                onChange={(e) =>
                                    updateElementProperty(
                                        element.id,
                                        "color",
                                        e.target.value
                                    )
                                }
                                className="w-full h-8 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Alignment
                            </label>
                            <select
                                value={element.properties.textAlign}
                                onChange={(e) =>
                                    updateElementProperty(
                                        element.id,
                                        "textAlign",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-1 border rounded"
                            >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={
                                        element.properties.fontWeight === "bold"
                                    }
                                    onChange={(e) =>
                                        updateElementProperty(
                                            element.id,
                                            "fontWeight",
                                            e.target.checked ? "bold" : "normal"
                                        )
                                    }
                                    className="mr-1"
                                />
                                Bold
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={
                                        element.properties.fontStyle ===
                                        "italic"
                                    }
                                    onChange={(e) =>
                                        updateElementProperty(
                                            element.id,
                                            "fontStyle",
                                            e.target.checked
                                                ? "italic"
                                                : "normal"
                                        )
                                    }
                                    className="mr-1"
                                />
                                Italic
                            </label>
                        </div>
                    </div>
                )}

                {element.type === "image" && (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Image URL
                            </label>
                            <input
                                type="url"
                                value={element.properties.src}
                                onChange={(e) =>
                                    updateElementProperty(
                                        element.id,
                                        "src",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-1 border rounded"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Alt Text
                            </label>
                            <input
                                type="text"
                                value={element.properties.alt}
                                onChange={(e) =>
                                    updateElementProperty(
                                        element.id,
                                        "alt",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-1 border rounded"
                            />
                        </div>
                    </div>
                )}

                {element.type === "button" && (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Button Text
                            </label>
                            <input
                                type="text"
                                value={element.properties.text}
                                onChange={(e) =>
                                    updateElementProperty(
                                        element.id,
                                        "text",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-1 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Background Color
                            </label>
                            <input
                                type="color"
                                value={element.properties.backgroundColor}
                                onChange={(e) =>
                                    updateElementProperty(
                                        element.id,
                                        "backgroundColor",
                                        e.target.value
                                    )
                                }
                                className="w-full h-8 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Text Color
                            </label>
                            <input
                                type="color"
                                value={element.properties.color}
                                onChange={(e) =>
                                    updateElementProperty(
                                        element.id,
                                        "color",
                                        e.target.value
                                    )
                                }
                                className="w-full h-8 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Link URL
                            </label>
                            <input
                                type="url"
                                value={element.properties.href}
                                onChange={(e) =>
                                    updateElementProperty(
                                        element.id,
                                        "href",
                                        e.target.value
                                    )
                                }
                                className="w-full px-3 py-1 border rounded"
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Toolbox */}
            <div className="bg-white border-b shadow-sm p-4">

                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold text-gray-800">
                            Email Template Builder
                        </h1>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => addElement("text")}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                <Type size={18} className="mr-2" />
                                Text
                            </button>
                            <button
                                onClick={() => addElement("image")}
                                className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            >
                                <Image size={18} className="mr-2" />
                                Image
                            </button>
                            <button
                                onClick={() => addElement("button")}
                                className="flex items-center px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                            >
                                <Square size={18} className="mr-2" />
                                Button
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex border rounded">
                            <button
                                onClick={() => setViewMode("desktop")}
                                className={`p-2 ${
                                    viewMode === "desktop"
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <Monitor size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode("mobile")}
                                className={`p-2 ${
                                    viewMode === "mobile"
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <Smartphone size={18} />
                            </button>
                        </div>

                        <button
                            onClick={copyJSON}
                            className="flex items-center px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                            <Copy size={16} className="mr-1" />
                            Copy JSON
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                            <Upload size={16} className="mr-1" />
                            Load
                        </button>
                    </div>
                </div>

            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-4">

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    
                    {/* Canvas */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h2 className="text-lg font-semibold mb-4">
                                Live Preview
                            </h2>
                            <div
                                ref={canvasRef}
                                className={`relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden ${
                                    viewMode === "mobile"
                                        ? "w-80 mx-auto"
                                        : "w-full"
                                }`}
                                style={{
                                    height: "600px",
                                    minHeight: "600px",
                                }}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => setSelectedElement(null)}
                            >
                                {elements.length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                        <div className="text-center">
                                            <Eye
                                                size={48}
                                                className="mx-auto mb-2 opacity-50"
                                            />
                                            <p>
                                                Click the buttons above to add
                                                elements
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {elements.map(renderElement)}
                            </div>
                        </div>
                    </div>

                    {/* Properties Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h2 className="text-lg font-semibold mb-4">
                                Properties
                            </h2>
                            {selectedElement ? (
                                renderPropertyPanel()
                            ) : (
                                <p className="text-gray-500 text-center">
                                    Select an element to edit its properties
                                </p>
                            )}
                        </div>
                    </div>

                    {/* JSON Output */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <h2 className="text-lg font-semibold mb-4">
                                JSON Output
                            </h2>
                            <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-96 text-gray-700">
                                {generateJSON()}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailTemplateBuilder;
