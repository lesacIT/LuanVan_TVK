import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  const maxVisiblePages = 5;
  const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

  const renderPaginationItems = () => {
    const items = [];
    let startPage = 1;
    let endPage = pages;

    if (pages > maxVisiblePages) {
      if (page > halfMaxVisiblePages) {
        startPage = Math.max(page - halfMaxVisiblePages, 1);
        endPage = Math.min(startPage + maxVisiblePages - 1, pages);
      } else {
        endPage = maxVisiblePages;
      }
    }

    if (page + halfMaxVisiblePages > pages) {
      startPage = Math.max(pages - maxVisiblePages + 1, 1);
    }

    if (startPage > 1) {
      items.push(
        <LinkContainer
          key={1}
          to={!isAdmin ? (keyword ? `/search/${keyword}/page/1` : '/page/1') : `/admin/productlist/1`}
        >
          <Pagination.First />
        </LinkContainer>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <LinkContainer
          key={i}
          to={!isAdmin ? (keyword ? `/search/${keyword}/page/${i}` : `/page/${i}`) : `/admin/productlist/${i}`}
        >
          <Pagination.Item active={i === page}>{i}</Pagination.Item>
        </LinkContainer>
      );
    }

    if (endPage < pages) {
      items.push(
        <LinkContainer
          key={pages}
          to={!isAdmin ? (keyword ? `/search/${keyword}/page/${pages}` : `/page/${pages}`) : `/admin/productlist/${pages}`}
        >
          <Pagination.Last />
        </LinkContainer>
      );
    }

    return items;
  };

  return (
    pages > 1 && (
      <Pagination>
        {renderPaginationItems()}
      </Pagination>
    )
  );
};

export default Paginate;
