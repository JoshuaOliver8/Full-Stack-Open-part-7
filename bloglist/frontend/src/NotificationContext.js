import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN-SUCCESS':
            return `user ${action.payload} was successfully logged on`
        case 'LOGIN-FAIL':
            return 'ERROR: wrong credentials'
        case 'LOGOUT':
            return 'user was logged out'
        case 'BLOG-CREATED':
            return `a new blog ${action.payload} added`
        case 'BLOG-DELETE-SUCCESS':
            return `deleted ${action.payload}`
        case 'BLOG-DELETE-FAIL':
            return 'ERROR: unable to delete blog'
        default:
            return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = props => {
    const [notification, notificationDispatch] = useReducer(
        notificationReducer,
        ''
    )

    return (
        <NotificationContext.Provider
            value={[notification, notificationDispatch]}
        >
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotificationValue = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
    const notificationAndDispatch = useContext(NotificationContext)
    return notificationAndDispatch[1]
}

export default NotificationContext
