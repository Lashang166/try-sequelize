const express = require('express');
const { Op } = require('sequelize');
const { sequelize, User, Post } = require('./models')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.post('/users', async(req, res) => {
    const { name, email, role } = req.body;
    try {
        const user = await User.create({ name, email, role });

        return res.json(user)
    }catch(err) {
        console.log(err);
        return res.status(500).json(err);
    }

})

app.get('/', async(req, res) => {
    const users = await User.findAll();
    return res.json(users)
})


app.get('/user/:uuid', async(req, res) => {
    const uuid = req.params.uuid;
    try {   
        const users = await User.findOne({
            where: { uuid }, 
            include: ['posts']
        })
        
        return res.json(users);


    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Something went wrong "})
    }
})

app.post('/post', async(req, res) => {
    const { uuid, content } = req.body;

    try {
        const user = await User.findOne({where: {uuid}});

        const post = await Post.create({
            body: content,
            userId: user.id
        })

        return res.status(200).json(post)

        
    } catch (err) {
        console.log(err);
        res.status(500).json({err: "somthing went wrong"})
    }
})

app.get('/post', async(req, res) => {

    try {
        const posts = await Post.findAll({ include: "user" });

        return res.status(200).json(posts)
        
    } catch (err) {
        console.log(err);
        res.status(500).json({err: "somthing went wrong"})
    }
})

app.delete('/post/:uuid', async(req, res) => {
    const uuid = req.params.uuid;

    try {
        const post = await Post.findOne({ where: { uuid }});
        await post.destroy();

        return res.json({message: "post deleted !"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "error ocur"})
    }

})


app.put('/users/:uuid', async(req, res) => {
    const { name } = req.body;
    const uuid = req.params.uuid;

    try {
        const user = await User.update({ name }, {
            where: {uuid}
        })
        
        return res.status(200).json(user)


    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "error ocur"})
    }
})

app.listen({port: 4000}, async() => {
    console.log("port listen to 4000");
    await sequelize.authenticate();
    console.log('Database Connected!');
})


// async function main() {
//     await sequelize.sync({
//         alter:true
//     });
// }

// main();