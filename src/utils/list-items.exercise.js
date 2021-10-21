import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'
import {setQueryDataForBook} from 'utils/books'

const listItemQueryConfig = user => ({
  queryKey: 'list-items',
  queryFn: () =>
    client(`list-items`, {token: user.token}).then(data => data.listItems),
  config: {
    onSuccess: listItems =>
      listItems.forEach(item => setQueryDataForBook(item.book)),
  },
})

const useListItem = (user, bookId) => {
  const result = useQuery(listItemQueryConfig(user))

  let listItem = null
  if (result.status === 'success') {
    result.data.forEach(item => {
      if (item.bookId === bookId) {
        listItem = item
      }
    })
  }
  return {listItem}
}

const useListItems = user => {
  const {data: listItems} = useQuery(listItemQueryConfig(user))
  return {listItems}
}

const mutateOptions = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
  onError: (error, data, context) => {
    if (context && context.listItems) {
      queryCache.setQueryData('list-items', context.listItems)
    }
  },
}

const useUpdateListItem = (user, options) => {
  return useMutation(
    data =>
      client(`list-items/${data.id}`, {method: 'PUT', data, token: user.token}),
    {
      onMutate: data => {
        const listItems = queryCache.getQueryData('list-items')
        queryCache.setQueryData('list-items', oldItems => {
          return oldItems.map(oldItem => {
            return oldItem.id === data.id ? data : oldItem
          })
        })
        return {listItems}
      },
      mutateOptions,
      ...options,
    },
  )
}

const useRemoveListItem = (user, options) => {
  return useMutation(
    listItemId =>
      client(`list-items/${listItemId}`, {method: 'DELETE', token: user.token}),
    {
      onMutate: listItemId => {
        const listItems = queryCache.getQueryData('list-items')
        queryCache.setQueryData('list-items', oldItems =>
          oldItems.filter(oldItem => oldItem.id !== listItemId),
        )
        return {listItems}
      },
      mutateOptions,
      ...options,
    },
  )
}

const useCreateListItem = (user, options) => {
  return useMutation(
    bookId =>
      client('list-items', {
        data: {bookId},
        token: user.token,
      }),
    {
      mutateOptions,
      ...options,
    },
  )
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
