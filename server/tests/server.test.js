const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

// first we need to set up the environment to have no todos in it, or the length check below will fail
// GET needs test data though, so let's set some up
const todos = [
    { 
        _id: new ObjectID(),
        text: 'First test todo'
    },
    { 
        _id: new ObjectID(),
        text: 'Second test todo',
        completed: true,
        completedAt: 11111111
    }
];

beforeEach((done) => {
    Todo.remove({}).then(() => { // removes all items from collection
        return Todo.insertMany(todos) // insert the test data
            .then(() => { done(); });  
    });
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        // see supertest docs for this stuff
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err); // return is just here to stop function execution
                }

                Todo.find({text:'Test todo text'}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a todo if sent invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2); // 2 because of the test data added
                    done();
                }).catch((e) => { done(e); });
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return a 404 for an invalid ID', (done) => {
        request(app)
            .get('/todos/asdasdasd')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                } 
            // query database using findById and toNotExist
            
            Todo.findById(hexId).then((todo) => {
                expect(todo).toNotExist();
                done();
            }).catch((e) => done(e));
        });

    });

    it('should return a 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return a 404 for an invalid ID', (done) => {
        request(app)
            .delete('/todos/asdasdasd')
            .expect(404)
            .end(done);
    });

});

describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({text: 'new todo text #1', completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe("new todo text #1");
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA("number");
            }).end(done);
    });

    it('should clear completedAt when the todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var updatedTodo = {
            text: "new todo text #2",
            completed: false
        };
        request(app)
        .patch(`/todos/${hexId}`)
        .send(updatedTodo)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe("new todo text #2");
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        }).end(done);

    });
});