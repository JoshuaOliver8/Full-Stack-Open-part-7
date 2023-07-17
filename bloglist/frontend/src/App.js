import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import usersService from './services/users'
import { useNotificationDispatch } from './NotificationContext'
import {
    Routes, Route, Link, useParams
} from 'react-router-dom'
import { Table, Form, Button } from 'react-bootstrap'

const User = ({ users }) => {
    const id = useParams().id
    const user = users.find(u => u.id === id)

    if (!user) {
        return null
    }

    return (
        <div>
            <h2>{user.name}</h2>
            <h3>added blogs</h3>
            <ul>
                {user.blogs.map(b =>
                    <li key={b.id}>
                        {b.title}
                    </li>
                )}
            </ul>
        </div>
    )
}

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [users, setUsers] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState('')
    const blogFormRef = useRef()

    const dispatch = useNotificationDispatch()

    useEffect(() => {
        blogService
            .getAll()
            .then(blogs => setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    useEffect(() => {
        usersService
            .getAll()
            .then(users => setUsers(users))
    }, [])

    const handleLogin = async event => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username,
                password,
            })

            blogService.setToken(user.token)

            window.localStorage.setItem(
                'loggedBlogappUser',
                JSON.stringify(user)
            )

            setUser(user)
            setUsername('')
            setPassword('')
            dispatch({ type: 'LOGIN-SUCCESS', payload: user.name })
        } catch (exception) {
            dispatch({ type: 'LOGIN-FAIL' })
        }
    }

    const handleLogout = event => {
        event.preventDefault()

        window.localStorage.removeItem('loggedBlogappUser')
        blogService.setToken('')
        setUser('')
        setUsername('')
        setPassword('')
        dispatch({ type: 'LOGOUT' })
    }

    const addBlog = blogObject => {
        blogFormRef.current.toggleVisibility()

        blogService.create(blogObject).then(returnedBlog => {
            setBlogs(
                blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes)
            )
            dispatch({
                type: 'BLOG-CREATED',
                payload: `${returnedBlog.title} ${returnedBlog.author}`
            })
        })
    }

    const addLike = (id, blogObject) => {
        blogService.update(id, blogObject).then(returnedBlog => {
            setBlogs(
                blogs
                    .map(b => (b.id !== id ? b : returnedBlog))
                    .sort((a, b) => b.likes - a.likes)
            )
        })
    }

    const deleteBlog = blogObject => {
        try {
            if (
                window.confirm(
                    `Remove ${blogObject.title} ${blogObject.author}`
                )
            ) {
                blogService.deleteObject(blogObject.id).then(() => {
                    setBlogs(blogs.filter(b => b !== blogObject))
                    dispatch({
                        type: 'BLOG-DELETE-SUCCESS',
                        payload: `${blogObject.title} ${blogObject.author}`
                    })
                })
            }
        } catch (error) {
            dispatch({ type: 'BLOG-DELETE-FAIL' })
        }
    }

    const loginForm = () => (
        <Form onSubmit={handleLogin}>
            <Form.Group>
                <Form.Label>username:</Form.Label>
                <Form.Control
                    id="username"
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                />
                <Form.Label>password:</Form.Label>
                <Form.Control
                    id="password"
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
                <br></br>
                <Button variant="primary" id="login-button" type="submit">
                    login
                </Button>
            </Form.Group>
        </Form>
    )

    if (!user) {
        return (
            <div className='container'>
                <h2>Log in to application</h2>
                <Notification />
                {loginForm()}
            </div>
        )
    }

    return (
        <div className='container'>
            <div className='navBar'>
                <Link className='nav' to="/">Blogs</Link>
                <Link className='nav' to="/users">Users</Link>
                <p className='nav'>
                    {user.name} logged in{' '}
                    <button id="logOut" onClick={handleLogout}>
                        log out
                    </button>
                </p>
            </div>

            <div>
                <h1>blogs app</h1>
                <Notification />
            </div>

            <Routes>
                <Route path="/" element={
                    <div>
                        <h2>create a blog</h2>

                        <Togglable buttonLabel="new blog" ref={blogFormRef}>
                            <BlogForm createBlog={addBlog} user={user} />
                        </Togglable>

                        <h2>blogs</h2>

                        {blogs.map(blog => (
                            <Blog
                                key={blog.id}
                                blog={blog}
                                incrementLikes={addLike}
                                removeBlog={deleteBlog}
                                showRemoveButton={
                                    user && user.username === blog.user.username
                                }
                            />
                        ))}
                    </div>
                } />
                <Route path="/users" element={
                    <div>
                        <h2>users</h2>

                        <Table striped>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>blogs created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <Link to={`/users/${u.id}`}>
                                                {u.name}
                                            </Link>
                                        </td>
                                        <td>{u.blogs.length}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                } />
                <Route path="/users/:id" element={ <User users={users} /> } />
            </Routes>
        </div>
    )
}

export default App
