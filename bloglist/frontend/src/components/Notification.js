import { useNotificationValue } from '../NotificationContext'
import { useState, useEffect } from 'react'

const Notification = () => {
    const [showMessage, setShowMessage] = useState(false)

    const currentMessage = useNotificationValue()

    useEffect(() => {
        if (currentMessage !== '') {
            setShowMessage(true)
            setTimeout(() => {
                setShowMessage(false)
            }, 5000)
        }
    }, [currentMessage])

    if (!showMessage) {
        return null
    } else if (currentMessage.startsWith('ERROR')) {
        return (
            <div className='error'>
                {currentMessage}
            </div>
        )
    } else {
        return (
            <div className='success'>
                {currentMessage}
            </div>
        )
    }
}

export default Notification

/*
const Notification = ({ message, success }) => {
    if (message === null) {
        return null
    }

    if (success) {
        return <div className="success">{message}</div>
    } else {
        return <div className="error">{message}</div>
    }
}

export default Notification
*/