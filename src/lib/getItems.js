export const getItems = (boardId, count) =>
    Array.from({ length: count }, (v, k) => k).map((k) => ({
      id: `${boardId}-item-${k}`,
      content: `item ${k}`,
    }));
