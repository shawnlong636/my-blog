import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

// Fetch all users
app.get('/users', (req, res) => {
  void (async () => {
    const users = await prisma.user.findMany()
    res.json(users)
  })()
})

// Fetch all published posts
app.get('/feed', (req, res) => {
  void (async () => {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { author: true }
    })
    res.json(posts)
  })()
})

// Fetches a specific post by its id
app.get('/post/:id', (req, res) => {
  void (async () => {
    const { id } = req.params
    const post = await prisma.post.findUnique({
      where: { id: Number(id) }
    })
    res.json(post)
  })()
})

// Creates a new user
app.post('/user', (req, res) => {
  void (async () => {
    const result = await prisma.user.create({
      data: { ...req.body }
    })
    res.json(result)
  })()
})

// Creates a new post (as a draft)
app.post('/post', (req, res) => {
  void (async () => {
    const { title, content, authorEmail } = req.body
    const result = await prisma.post.create({
      data: {
        title,
        content,
        published: false,
        author: { connect: { email: authorEmail } }
      }
    })
    res.json(result)
  })()
})

// Sets the published field of a post to true
app.put('/post/publish/:id', (req, res) => {
  void (async () => {
    const { id } = req.params
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { published: true }
    })
    res.json(post)
  })()
})

// Deletes a post by its ID
app.delete('/post/:id', (req, res) => {
  void (async () => {
    const { id } = req.params
    const post = await prisma.post.delete({
      where: { id: Number(id) }
    })
    res.json(post)
  })()
})

app.listen(3000, () => {
  console.log('REST API server ready at: http://localhost:3000')
})
