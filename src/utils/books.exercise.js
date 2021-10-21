import {useQuery, queryCache} from 'react-query'
import {client} from 'utils/api-client'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const useBook = (bookId, user) => {
  const result = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {token: user.token}).then(data => data.book),
  })
  const {data} = result
  return data ?? loadingBook
}

const queryConfig = (query, user) => {
  return {
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then(data => data.books),
    config: {
      onSuccess: books => books.forEach(book => setQueryDataForBook(book)),
    },
  }
}

const setQueryDataForBook = book => {
  console.log('setQueryDataForBook')
  queryCache.setQueryData(['book', {bookId: book.id}], book)
}

const useBookSearch = (query, user) => {
  console.log('useBookSearch')
  return useQuery(queryConfig(query, user))
}

const refetchBookSearchQuery = user => {
  queryCache.removeQueries('bookSearch')
  return queryCache.prefetchQuery(queryConfig('', user))
}

export {useBook, useBookSearch, refetchBookSearchQuery, setQueryDataForBook}
