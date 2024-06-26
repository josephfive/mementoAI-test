
export const reorderDifBoard = (
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