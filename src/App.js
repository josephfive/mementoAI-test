import React, { useState, useCallback } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Board from './components/Board';

function App() {
  const getItems = (count) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
      id: `item-${k}`,
      content: `item ${k}`,
    }));
  const getBoards = (count) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
      id: `item-${k}`,
      content: `item ${k}`,
    }));
  const [items, setItems] = useState(getItems(10));
  const [boards, setBoards] = useState(getBoards(3));
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      const newItems = reorder(
        items,
        result.source.index,
        result.destination.index,
      );

      setItems(newItems);
    },
    [items],
  );

  return (
    <div style={getWraperStyle}>
      <DragDropContext onDragEnd={onDragEnd}>
        {boards.map((board, index) => (
          <Board key={board.id} boardId={board.id} items={items} />
        ))}
      </DragDropContext>
    </div>
  );
}
const GRID = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: GRID * 2,
  margin: `0 0 ${GRID}px 0`,
  background: isDragging ? 'lightgreen' : 'grey',
  ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: GRID,
  width: 250,
});
const getWraperStyle = {
  display: 'flex',
  gap: '18px',
};

export default App;
