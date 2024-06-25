import React, { useState, useCallback } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Board from './components/Board';

function App() {
  const getItems = (boardId, count) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
      id: `${boardId}-item-${k}`,
      content: `item ${k}`,
    }));

  const getBoards = (count) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
      id: `board-${k}`,
      items: getItems(`board-${k}`, 10),
    }));
  const [boards, setBoards] = useState(getBoards(3));

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    // console.log(removed)
    return result;
  };

  // console.log(boards)
  const reorderDifBoard = (
    boards,
    startBoardId,
    endBoardId,
    startIndex,
    endIndex,
  ) => {
    const result = Array.from(boards);
    const startBoard = result.find((board) => board.id === startBoardId);
    const endBoard = result.find((board) => board.id === endBoardId);
    const [removed] = startBoard.items.splice(startIndex, 1);
    endBoard.items.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = useCallback(
    (result) => {
      const { destination, source } = result;
      if (!result.destination) {
        return;
      }
      // console.log(result);
      if (destination.droppabledId === source.droppabled00d) {
        const board = boards.find((board) => board.id === source.droppableId);
        const newItems = reorder(board.items, source.index, destination.index);
        const newBoard = boards.filter((board) =>
          board.id === source.droppableId ? (board.items = newItems) : board,
        );
        // console.log(newBoard);
        setBoards(newBoard);
      }
      if (destination.droppableId !== source.droppableId) {
        const newBoards = reorderDifBoard(
          boards,
          source.droppableId,
          destination.droppableId,
          source.index,
          destination.index,
        );

        setBoards(newBoards);
      }
    },
    [boards],
  );

  return (
    <div style={getWraperStyle}>
      <DragDropContext onDragEnd={onDragEnd}>
        {boards.map((board, index) => (
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
                        )}
                      >
                        {`${item.content}`}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
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
