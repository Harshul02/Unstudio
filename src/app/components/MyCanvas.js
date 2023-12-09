"use client";

import { useEffect, useState } from "react";
import { fabric } from "fabric";
import { Select } from "antd";



const { Option } = Select;

const MyCanvas = () => {
  const [canvas, setCanvas] = useState(null);
  const [color, setColor] = useState('#ABCDEF');
  const [brushWidth, setBrushWidth] = useState(5);


  useEffect(() => {
    const fibreCanvas = new fabric.Canvas("canvas", {
      width: 1200,
      height: 600,
      backgroundColor: "#f0f0f0", // Background color
    });

    setCanvas(fibreCanvas);

    return () => {
      fibreCanvas.dispose();
    };
  }, []);

  const handleShapeChange = (value) => {
    // console.log("clicked");
    switch (value) {
      case "Rectangle":
        addRectangle();
        break;
      case "Circle":
        addCircle();
        break;
      case "Triangle":
        addTriangle();
        break;
      case "FreeHand":
        enableFreeDrawing();
        break;
      default:
        break;
    } 
  };

  const addRectangle = () => {
    console.log(color)
    const rect = new fabric.Rect({
      left: 400,
      top: 250,
      originX: "left",
      originY: "top",
      width: 100,
      height: 100,
      angle: 0,
      fill: color,
      transparentCorners: false,
    });
    canvas.add(rect);
    canvas.isDrawingMode = false;
  };

  const addCircle = () => {
    const circle = new fabric.Circle({
      left: 300,
      top: 300,
      radius: 80,
      fill: color,
      transparentCorners: false,
    });
    canvas.add(circle);
    canvas.isDrawingMode = false;
  };

  const addTriangle = () => {
    const triangle = new fabric.Triangle({
      width: 150,
      height: 100,
      fill: color,
      cornerColor: "blue",
    });
    canvas.add(triangle);
    canvas.isDrawingMode = false;
  };

  const enableFreeDrawing = () => {
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushWidth;
  };

  const handleObjectSelection = () => {
    canvas.isDrawingMode = false;
    canvas.selection = !canvas.selection;
  };

  const enableEraser = () => {
    // setIsEraser(true);
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = "#f0f0f0"; 
    canvas.freeDrawingBrush.width = brushWidth; 
  };

  const clearCanvas = () => {
    canvas.clear();
    canvas.backgroundColor = "#f0f0f0"; 
    canvas.renderAll();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const imgObj = new Image();
      imgObj.src = event.target.result;

      imgObj.onload = function () {
        const maxWidth = 200; // Set your desired maximum width
        const maxHeight = 200; // Set your desired maximum height
        const scaleFactor = Math.min(maxWidth / imgObj.width, maxHeight / imgObj.height);

        const width = imgObj.width * scaleFactor;
        const height = imgObj.height * scaleFactor;

        const image = new fabric.Image(imgObj, {
          scaleX: width / imgObj.width,
          scaleY: height / imgObj.height,
        });

        canvas.add(image);
      };
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const deleteSelectedObject = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  useEffect(() => {

    const handleKeyDown = (e) => {
      if (e.code === 'Delete' || e.keyCode === 46) {
        deleteSelectedObject();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas]); 

  return (
    <div className="flex flex-col items-center">
      <div className="w-full bg-blue-500 p-3">
        <div className="flex mb-2 flex-wrap">
      <div className="mr-4 rounded">
        <Select
        placeholder="Shape"
          style={{
            width: 120,
          }}
            onSelect={(value)=>{
              handleShapeChange(value);
            }}
        >
          <Option value="Rectangle">Rectangle</Option>
          <Option value="Circle">Circle</Option>
          <Option value="Triangle">Triangle</Option>
        </Select>
        </div>
        <div className="cursor-pointer bg-white rounded mr-4" onClick={handleObjectSelection}>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
<path d="M 14.78125 5 C 14.75 5.007813 14.71875 5.019531 14.6875 5.03125 C 14.644531 5.050781 14.601563 5.070313 14.5625 5.09375 C 14.550781 5.09375 14.542969 5.09375 14.53125 5.09375 C 14.511719 5.101563 14.488281 5.113281 14.46875 5.125 C 14.457031 5.136719 14.449219 5.144531 14.4375 5.15625 C 14.425781 5.167969 14.417969 5.175781 14.40625 5.1875 C 14.375 5.207031 14.34375 5.226563 14.3125 5.25 C 14.289063 5.269531 14.269531 5.289063 14.25 5.3125 C 14.238281 5.332031 14.226563 5.355469 14.21875 5.375 C 14.183594 5.414063 14.152344 5.457031 14.125 5.5 C 14.113281 5.511719 14.105469 5.519531 14.09375 5.53125 C 14.09375 5.542969 14.09375 5.550781 14.09375 5.5625 C 14.082031 5.582031 14.070313 5.605469 14.0625 5.625 C 14.050781 5.636719 14.042969 5.644531 14.03125 5.65625 C 14.03125 5.675781 14.03125 5.699219 14.03125 5.71875 C 14.019531 5.757813 14.007813 5.800781 14 5.84375 C 14 5.875 14 5.90625 14 5.9375 C 14 5.949219 14 5.957031 14 5.96875 C 14 5.980469 14 5.988281 14 6 C 13.996094 6.050781 13.996094 6.105469 14 6.15625 L 14 39 C 14.003906 39.398438 14.242188 39.757813 14.609375 39.914063 C 14.972656 40.070313 15.398438 39.992188 15.6875 39.71875 L 22.9375 32.90625 L 28.78125 46.40625 C 28.890625 46.652344 29.09375 46.847656 29.347656 46.941406 C 29.601563 47.035156 29.882813 47.023438 30.125 46.90625 L 34.5 44.90625 C 34.996094 44.679688 35.21875 44.09375 35 43.59375 L 28.90625 30.28125 L 39.09375 29.40625 C 39.496094 29.378906 39.84375 29.113281 39.976563 28.730469 C 40.105469 28.347656 39.992188 27.921875 39.6875 27.65625 L 15.84375 5.4375 C 15.796875 5.378906 15.746094 5.328125 15.6875 5.28125 C 15.648438 5.234375 15.609375 5.195313 15.5625 5.15625 C 15.550781 5.15625 15.542969 5.15625 15.53125 5.15625 C 15.511719 5.132813 15.492188 5.113281 15.46875 5.09375 C 15.457031 5.09375 15.449219 5.09375 15.4375 5.09375 C 15.386719 5.070313 15.335938 5.046875 15.28125 5.03125 C 15.269531 5.03125 15.261719 5.03125 15.25 5.03125 C 15.230469 5.019531 15.207031 5.007813 15.1875 5 C 15.175781 5 15.167969 5 15.15625 5 C 15.136719 5 15.113281 5 15.09375 5 C 15.082031 5 15.074219 5 15.0625 5 C 15.042969 5 15.019531 5 15 5 C 14.988281 5 14.980469 5 14.96875 5 C 14.9375 5 14.90625 5 14.875 5 C 14.84375 5 14.8125 5 14.78125 5 Z M 16 8.28125 L 36.6875 27.59375 L 27.3125 28.40625 C 26.992188 28.4375 26.707031 28.621094 26.546875 28.902344 C 26.382813 29.179688 26.367188 29.519531 26.5 29.8125 L 32.78125 43.5 L 30.21875 44.65625 L 24.21875 30.8125 C 24.089844 30.515625 23.828125 30.296875 23.511719 30.230469 C 23.195313 30.160156 22.863281 30.25 22.625 30.46875 L 16 36.6875 Z"></path>
</svg>
        </div>
        <div className="cursor-pointer bg-white rounded mr-4" style={{height: "30px", width: "40px"}}>
        
        <input type="color" id="favcolor" value={color} onChange={(e)=>{
          setColor(e.target.value);
        }} style={{height: "30px", width: "40px"}} className="rounded"/>
        </div>
        <div className="cursor-pointer bg-white rounded mr-4" style={{height: "30px", width: "40px"}} onClick={enableFreeDrawing} >
          <img src="https://www.svgrepo.com/show/288167/drawing-draw.svg" alt="" style={{height: "30px", width: "40px"}}/>
        </div>
        <div className="cursor-pointer rounded mr-4">
            Brush Width:
            <input
            className="bg-white rounded"
              type="number"
              value={brushWidth}
              onChange={(e) => setBrushWidth(parseInt(e.target.value, 10))}
              style={{ width: "40px", marginLeft: "5px" }}
            />
          </div>
        <div className="cursor-pointer bg-white rounded mr-4" style={{height: "30px", width: "40px"}} onClick={enableEraser} >
          <img src="https://www.svgrepo.com/show/529569/eraser.svg" alt="" style={{height: "30px", width: "40px"}}/>
        </div>
        <div className="cursor-pointer bg-white rounded mr-4" style={{ height: "30px", width: "40px" }} onClick={clearCanvas}>
          Clear
        </div>
        <div className="cursor-pointer bg-white rounded mr-4" style={{ height: "30px", width: "55px" }} onClick={deleteSelectedObject}>
            Delete
          </div>
        <div className="cursor-pointer bg-white rounded" style={{ height: "30px", width: "100px" }}>
          <input type="file" accept="image/*" onChange={handleImageUpload}  className="rounded"/>
        </div>
      </div>
      <div className="flex flex-wrap">
      <canvas id="canvas" className="w-full rounded"></canvas>
      </div>
      </div>
    </div>
  );
};

export default MyCanvas;
