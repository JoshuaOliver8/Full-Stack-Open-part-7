import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ createBlog, user }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')
    const [newLikes, setNewLikes] = useState(0)

    const addBlog = event => {
        event.preventDefault()
        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl,
            likes: newLikes,
            user: user,
        })

        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setNewLikes(0)
    }

    return (
        <div>
            <h2>blogs</h2>
            <Form onSubmit={addBlog}>
                <Form.Group>
                    <Form.Label>title:{' '}</Form.Label>
                    <Form.Control
                        id="title"
                        value={newTitle}
                        onChange={event => setNewTitle(event.target.value)}
                        data-testid="title"
                    />
                    <Form.Label>author:{' '}</Form.Label>
                    <Form.Control
                        id="author"
                        value={newAuthor}
                        onChange={event => setNewAuthor(event.target.value)}
                        data-testid="author"
                    />
                    <Form.Label>url:{' '}</Form.Label>
                    <Form.Control
                        id="url"
                        value={newUrl}
                        onChange={event => setNewUrl(event.target.value)}
                        data-testid="url"
                    />
                    <Form.Label>likes:{' '}</Form.Label>
                    <Form.Control
                        id="likes"
                        type="number"
                        value={newLikes}
                        onChange={event => setNewLikes(event.target.value)}
                        data-testid="likes"
                    />
                    <Button variant="primary" id="submit" type="submit">
                        add
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default BlogForm
