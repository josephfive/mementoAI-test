import { useState, useTransition } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

function Board({ board, deniedMove, setBoards }) {
  const [isAdd, setIsAdd] = useState(false);
  const [itemText, setItemText] = useState('');
  const toggleAdd = () => {
    setIsAdd(true);
  };
  const onChange = (e) => {
    setItemText(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: `${board.id}-${new Date()}`,
      content: itemText,
    };
    console.log(newItem, board.id);
    setBoards((prev) => {
      return prev.map((prevBoard) =>
        prevBoard.id === board.id
          ? { ...prevBoard, items: [...prevBoard.items, newItem] }
          : prevBoard,
      );
    });
    // setBoards((prev) => {
    //   return {
    //     ...prev,
    //     [board.id]: [...prev[board.id], newItem],
    //   };
    // });
    setItemText('');
  };
  return (
    <Droppable key={board.id} droppableId={board.id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={getListStyle(snapshot.isDraggingOver)}
        >
          {board.items.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style,
                    deniedMove,
                  )}
                >
                  {item.content}
                </div>
              )}
            </Draggable>
          ))}
          {isAdd ? (
            <form onSubmit={onSubmit}>
              <input onChange={onChange} type="text" value={itemText} />
            </form>
          ) : (
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                style={{ width: '30px', cursor: 'pointer' }}
                onClick={toggleAdd}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
const GRID = 8;
const getItemStyle = (isDragging, draggableStyle, deniedMove) => ({
  userSelect: 'none',
  padding: GRID * 2,
  width: 210,
  margin: `0 0 ${GRID}px 0`,
  background: isDragging ? (deniedMove ? 'red' : 'lightgreen') : 'grey',
  ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: GRID,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 250,
});

export default Board;
