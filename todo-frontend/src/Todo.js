import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    // Edit
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000";

    const handleSubmit = () => {
        setError("");
        if (title.trim() !== '' && description.trim() !== '') {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description, completed: false }]);
                    setTitle("");
                    setDescription("");
                    setMessage("Task added successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                } else {
                    setError("Unable to create task");
                }
            }).catch(() => {
                setError("Unable to create task");
            });
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            });
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    const updatedTodos = todos.map((item) => {
                        if (item._id === editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    });

                    setTodos(updatedTodos);
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Task updated successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);

                    setEditId(-1);
                } else {
                    setError("Unable to update task");
                }
            }).catch(() => {
                setError("Unable to update task");
            });
        }
    };

    const handleEditCancel = () => {
        setEditId(-1);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            fetch(apiUrl + '/todos/' + id, {
                method: "DELETE"
            })
                .then(() => {
                    const updatedTodos = todos.filter((item) => item._id !== id);
                    setTodos(updatedTodos);
                });
        }
    };

    const handleToggleComplete = (id) => {
        const updatedTodos = todos.map((item) => {
            if (item._id === id) {
                return { ...item, completed: !item.completed };
            }
            return item;
        });

        fetch(apiUrl + "/todos/" + id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !todos.find(item => item._id === id).completed })
        }).then((res) => {
            if (res.ok) {
                setTodos(updatedTodos);
            } else {
                setError("Unable to update task status");
            }
        }).catch(() => {
            setError("Unable to update task status");
        });
    };

    return (
        <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", padding: "3rem" }}>
            <div className="container" style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#1f2937", borderRadius: "15px", padding: "2.5rem", color: "white", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                <div className="text-center mb-4">
                    <h1 style={{ 
                        fontFamily: 'Montserrat, sans-serif', 
                        fontSize: '3.5rem', 
                        color: '#fbbf24', 
                        margin: '0' 
                    }}>
                        Taskify
                    </h1>
                    <h2 style={{ 
                        fontFamily: 'Roboto, sans-serif', 
                        fontSize: '1.3rem', 
                        color: '#d1d5db',
                        marginTop: '0.5rem',
                        fontWeight: '300'
                    }}>
                        Your Ultimate Task Manager - One Task at a Time!
                    </h2>
                </div>
                <div>
                    <h3 className="text-center" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.5rem', color: '#fbbf24' }}>Add New Task</h3>
                    {message && <p className="text-center text-success" style={{ fontFamily: 'Roboto, sans-serif' }}>{message}</p>}
                    <div className="form-group d-flex justify-content-center gap-2 mt-4">
                        <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" style={{ borderRadius: "8px", padding: "10px", fontSize: "1rem" }} type="text" />
                        <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control" style={{ borderRadius: "8px", padding: "10px", fontSize: "1rem" }} type="text" />
                        <button className="btn btn-warning" style={{ fontSize: "1rem", padding: "10px 20px", borderRadius: "8px" }} onClick={handleSubmit}>Submit</button>
                    </div>
                    {error && <p className="text-center text-danger" style={{ fontFamily: 'Roboto, sans-serif' }}>{error}</p>}
                </div>
                <div className="mt-5">
                    <h3 className="text-center" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.5rem', color: '#fbbf24' }}>Tasks</h3>
                    <ul className="list-group mt-4">
                        {todos.map((item) =>
                            <li className="list-group-item bg-light text-dark d-flex justify-content-between align-items-center my-2" key={item._id} style={{ borderRadius: "10px", padding: "15px", boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)" }}>
                                <div className="d-flex flex-column me-2">
                                    {editId === -1 || editId !== item._id ? <>
                                        <span className={`fw-bold ${item.completed ? 'text-decoration-line-through' : ''}`} style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.2rem' }}>{item.title}</span>
                                        <span className={item.completed ? 'text-decoration-line-through' : ''} style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1rem' }}>{item.description}</span>
                                    </> : <>
                                        <div className="form-group d-flex gap-2">
                                            <input placeholder="Title" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} className="form-control" style={{ borderRadius: "8px", padding: "10px", fontSize: "1rem" }} type="text" />
                                            <input placeholder="Description" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} className="form-control" style={{ borderRadius: "8px", padding: "10px", fontSize: "1rem" }} type="text" />
                                        </div>
                                    </>}
                                </div>
                                <div className="d-flex gap-2">
                                    {editId === -1 ?
                                        <>
                                            <button className="btn btn-warning" style={{ fontSize: "1rem", padding: "10px 15px", borderRadius: "8px" }} onClick={() => handleEdit(item)}>Edit</button>
                                            <button className="btn btn-danger" style={{ fontSize: "1rem", padding: "10px 15px", borderRadius: "8px" }} onClick={() => handleDelete(item._id)}>Delete</button>
                                            <button className={`btn ${item.completed ? 'btn-secondary' : 'btn-success'}`} style={{ fontSize: "1rem", padding: "10px 15px", borderRadius: "8px" }} onClick={() => handleToggleComplete(item._id)}>
                                                {item.completed ? 'Mark Incomplete' : 'Mark Complete'}
                                            </button>
                                        </> :
                                        <>
                                            <button className="btn btn-success" style={{ fontSize: "1rem", padding: "10px 15px", borderRadius: "8px" }} onClick={handleUpdate}>Update</button>
                                            <button className="btn btn-secondary" style={{ fontSize: "1rem", padding: "10px 15px", borderRadius: "8px" }} onClick={handleEditCancel}>Cancel</button>
                                        </>
                                    }
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
