/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
export const isLastPage = pageLinks => Object.keys(pageLinks).length === 2 && pageLinks.first && pageLinks.prev;

export const getPageCount = pageLinks => {
  if (!pageLinks) {
    return 1;
  }
  if (isLastPage(pageLinks)) {
    return parseInt(pageLinks.prev.page || 1, 10) + 1;
  }
  if (pageLinks.last) {
    return parseInt(pageLinks.last.page, 10);
  }
  return 0;
};
