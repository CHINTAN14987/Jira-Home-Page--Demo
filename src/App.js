import logo from "./logo.svg";
import "./App.css";
import { useRef, useState } from "react";

function App() {
  const data = ["To-do status", "In-progress status", "Done-status"];
  const [locationData, setLocationData] = useState({
    progress: [],
    "to-do": [],
    done: [],
  });
  const [card, setCard] = useState({
    id: Math.floor(Math.random() * 1000),
    title: "",
  });
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [cardIndex, setCardIndex] = useState(-1);
  const [cardActive, setCardActive] = useState(false);
  const [dragLocation, setDragLocation] = useState("");

  const editCardLabel = (e) => {
    setCard({ ...card, title: e.target.value });
  };
  const createStatusHandler = (name) => {
    setCardActive(false);
    switch (name) {
      case "To-do status": {
        return setLocationData({
          ...locationData,
          "to-do": locationData?.["to-do"]?.concat({
            ...card,
            bgColor: "#D3D3D3",
            status: "to-do",
          }),
        });
      }
      case "In-progress status": {
        return setLocationData({
          ...locationData,
          progress: locationData["progress"]?.concat({
            ...card,
            bgColor: "lightblue",
            status: "progress",
          }),
        });
      }
      case "Done-status": {
        return setLocationData({
          ...locationData,
          done: locationData["done"]?.concat({
            ...card,
            bgColor: "lightgreen",
            status: "done",
          }),
        });
      }
      default:
        return locationData;
    }
  };

  const editLabel = (value) => {
    setCardIndex(value);
    setCardActive(true);
  };
  const dragStartHandler = (position, dragStartLocation) => {
    dragItem.current = position;
    setDragLocation(dragStartLocation);
  };
  const dragOverHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDropHandler = (dropLocation) => {
    const newState = [...locationData?.[dragLocation]];
    const draggedItem = locationData[dragLocation][dragItem.current];
    newState.splice(dragItem.current, 1);
    console.log(newState);
    setLocationData({
      ...locationData,
      [dragLocation]: [...newState],
      [dropLocation]: locationData?.[dropLocation].concat(draggedItem),
    });
  };
  const dragEnter = (position) => {
    dragOverItem.current = position;
  };

  return (
    <div className="App">
      <div className="card-generate-wrapper">
        {data?.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                editLabel(index);
              }}
              onBlur={() => {
                createStatusHandler(item);
                setCard("");
              }}
            >
              <div
                className={`status-button-wrapper status-button-wrapper-${index}`}
              >
                <span>+</span>
                <span>{item}</span>
              </div>
              {index === cardIndex && cardActive && (
                <input
                  value={card.title}
                  onChange={editCardLabel}
                  placeholder="enter title"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="wrapper">
        <div
          onDrop={() => {
            onDropHandler("to-do");
          }}
          onDragOver={dragOverHandler}
        >
          <h3>To do</h3>
          <div className="drop-container">
            {locationData?.["to-do"]?.map((card, index) => {
              return (
                <div
                  key={card?.id}
                  draggable
                  onDragStart={() => {
                    dragStartHandler(index, "to-do");
                  }}
                  onDragOver={() => dragEnter(index)}
                  className="card"
                  style={{ background: card?.bgColor }}
                >
                  <h3>{card?.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
        <div
          onDragOver={dragOverHandler}
          onDrop={() => {
            onDropHandler("progress");
          }}
        >
          <h3>Progess</h3>
          <div className="drop-container">
            {locationData?.progress?.map((card, index) => {
              return (
                <div
                  key={card?.id}
                  className="card"
                  style={{ background: card?.bgColor }}
                  draggable
                  onDragStart={() => {
                    dragStartHandler(index, "progress");
                  }}
                  onDragOver={() => dragEnter(index)}
                >
                  <h3>{card?.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={{ width: "20rem", height: "20rem" }}
          onDragOver={dragOverHandler}
          onDrop={() => {
            onDropHandler("done");
          }}
        >
          <h3>Done</h3>
          <div className="drop-container">
            {locationData?.done?.map((card, index) => {
              return (
                <div
                  key={card?.id}
                  className="card"
                  style={{ background: card?.bgColor }}
                  draggable
                  onDragStart={() => {
                    dragStartHandler(index, "done");
                  }}
                  onDragOver={() => dragEnter(index)}
                >
                  <h3>{card?.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
