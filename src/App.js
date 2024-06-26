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
      const { destination, source } = result;
      const sourceBoard = boards.find(
        (board) => board.id === source.droppableId,
      );
      const sourceItem = sourceBoard.items[source?.index]?.content;
      const prevItem = sourceBoard.items[destination?.index]?.content;
      const nextItem = sourceBoard.items[destination?.index + 1]?.content;
      if (
        !destination ||
        (source.droppableId === 'board-0' &&
          destination.droppableId === 'board-2')
      ) {
        alert('첫 번째 칼럼에서 세 번째 칼럼으로는 아이템 이동이 불가능합니다');
        console.log('1-3이슈');
        return;
      }
      const destinationBoard = boards.find(
        (board) => board.id === destination.droppableId,
      );
      const destinationItem =
        destinationBoard.items[destination.index]?.content;
      console.log(prevItem, sourceItem, nextItem);
      console.log(
        prevItem[prevItem.length - 1] % 2,
        sourceItem[sourceItem.length - 1] % 2,
        nextItem[nextItem.length - 1] % 2,
      );
      // console.log(result);
      // console.log(sourceItem, destinationItem);
      if (
        (sourceItem[sourceItem.length - 1] % 2 === 0 &&
          ((prevItem[prevItem.length - 1] % 2 === 0) ||
        nextItem[nextItem.length - 1] % 2 === 0))
        // Number(sourceItem[sourceItem.length - 1]) % 2 === 0 &&
        // Number(destinationItem[destinationItem.length - 1]) % 2 === 0
      ) {
        alert('짝수 아이템은 다른 짝수 아이템 앞으로 이동할 수 없습니다');
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
    // console.log(update);
    const { source, destination } = update;
    const sourceBoard = boards.find((board) => board.id === source.droppableId);
    const sourceItem = sourceBoard.items[source?.index]?.content;
    const prevItem = sourceBoard.items[destination?.index]?.content;
    const nextItem = sourceBoard.items[destination?.index + 1]?.content;
    if (!destination) {
      return;
    }
    if (
      (sourceItem[sourceItem.length - 1] % 2 === 0 &&
        ((prevItem[prevItem.length - 1] % 2 === 0) ||
      nextItem[nextItem.length - 1] % 2 === 0))
    ) {
      // console.log(deniedMove);
      setDeniedMove(true);
    } else if (
      source.droppableId === 'board-0' &&
      destination.droppableId === 'board-2'
    ) {
      setDeniedMove(true);

      // console.log(deniedMove);
    } else {
      setDeniedMove(false);
    }
  };

  return (
    <div style={getWraperStyle}>
      <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
        {boards.map((board, index) => (
          <Board
            key={board.id}
            board={board}
            deniedMove={deniedMove}
            setBoards={setBoards}
          />
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
