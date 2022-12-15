import React, { useEffect, useState } from "react";
import axiosClient from "../axiosclient";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {}, []);

    const getUsers = () => {
        setLoading(true);
        axiosClient
            .get("/users")
            .then(({ data }) => {
                setUsers(data.data);
                let pagesBackend = data.meta.links;
                let newPages = pagesBackend.slice(1, -1);
                setPages(newPages);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getUsersByPage();
    }, []);

    const getUsersByPage = (page) => {
        setLoading(true);
        axiosClient
            .get(page)
            .then(({ data }) => {
                setUsers(data.data);
                console.log(data);
                let pagesBackend = data.meta.links;
                let newPages = pagesBackend.slice(1, -1);
                setPages(newPages);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const onDelete = (u) => {
        if (!window.confirm("Are you sure you want to delete?")) {
            return;
        }
        axiosClient.delete(`/users/${u.id}`).then(() => {
            setNotification("User successfully Deleted");
            getUsers();
        });
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Users</h1>
                <Link className="btn-add" to="/users/new">
                    Add New
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {users.map((u) => (
                                <tr>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.created_at}</td>
                                    <td>
                                        <Link
                                            className="btn-edit"
                                            to={"/users/" + u.id}
                                        >
                                            Edit
                                        </Link>
                                        &nbsp;
                                        <button
                                            onClick={(e) => onDelete(u)}
                                            className="btn-delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>

            {pages.map((page) => (
                <button
                    style={
                        page.active
                            ? { margin: "2px", backgroundColor: "#0002A1" }
                            : { margin: "2px" }
                    }
                    className="btn-pagination"
                    onClick={() => {
                        getUsersByPage(page.url);
                    }}
                >
                    {page.label}
                </button>
            ))}
        </div>
    );
};

export default Users;
