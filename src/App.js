import React, { useState, useCallback } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Board from './components/Board';

function App() {
  const [deniedMove, setDeniedMove] = useState(false);

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
  const [boards, setBoards] = useState(getBoards(4));

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

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
      console.log(result);
      const { destination, source } = result;
      if (
        !destination ||
        (source.droppableId === 'board-0' &&
          destination.droppableId === 'board-2')
      ) {
        console.log('1-3이슈');
        return;
      }
      const sourceBoard = boards.find(
        (board) => board.id === source.droppableId,
      );
      const sourceItem = sourceBoard.items[source.index]?.content;

      const destinationBoard = boards.find(
        (board) => board.id === destination.droppableId,
      );
      const destinationItem =
        destinationBoard.items[destination.index]?.content;

      if (
        Number(sourceItem[sourceItem.length - 1]) % 2 === 0 &&
        destinationItem &&
        Number(destinationItem[destinationItem.length - 1]) % 2 === 0
      ) {
        console.log(
          sourceItem[sourceItem.length - 1],
          destinationItem[destinationItem.length - 1],
          '짝수 이슈',
        );
        return;
      }

      if (destination.droppableId === source.droppableId) {
        const board = boards.find((board) => board.id === source.droppableId);
        const newItems = reorder(board.items, source.index, destination.index);
        const newBoard = boards.map((board) =>
          board.id === source.droppableId
            ? { ...board, items: newItems }
            : board,
        );
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

  const onDragUpdate = (update) => {
    const { source, destination } = update;
    if (!destination) {
      return;
    }
    const startBoard = boards.find((board) => board.id === source.droppableId);
    const draggingItem = startBoard.items[source.index].content;
    const destinationBoard = boards.find(
      (board) => board.id === destination.droppableId,
    );
    const destinationItem = destinationBoard.items[destination.index]?.content;

    if (
      (Number(draggingItem[draggingItem.length - 1]) % 2 === 0 &&
        destinationItem &&
        Number(destinationItem[destinationItem.length - 1]) % 2 === 0) ||
      (source.droppableId === 'board-0' &&
        destination.droppableId === 'board-2')
    ) {
      setDeniedMove(true);
      return;
    } else {
      setDeniedMove(false);
    }
    setDeniedMove(false);
  };

  return (
    <div style={getWraperStyle}>
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        {boards.map((board, index) => (
          <Board board={board} deniedMove={deniedMove} setBoards={setBoards} />
        ))}
      </DragDropContext>
    </div>
  );
}

const getWraperStyle = {
  display: 'flex',
  gap: '18px',
};

export default App;
