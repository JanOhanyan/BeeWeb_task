import * as React from "react";
import { useTable } from "react-table";
import "./workspace.css";
import FormComponent from "../../components/Form/Form";

const WorkspacePage = () => {

    if(!localStorage.getItem("accessToken")) {
        window.location.href = "/login";
    }
    
    const [data, setData] = React.useState([]);
    const [isFormVisible, setFormVisible] = React.useState(false);

    const deleteRow = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/workspace/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
                credentials: 'include',
            });
            console.log(response)
            if (response.ok) {
                setData(prevData => prevData.filter(item => item._id !== id));
                alert("Workspace deleted successfully");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred while deleting the workspace');
            }
        } catch (error) {
            console.error("Error deleting workspace:", error);
            alert(`Error: ${error.message}`);
        }
    };

    const columns = React.useMemo(
        () => [
            {
                Header: "ID",
                accessor: "_id",
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Slug",
                accessor: "slug",
            },
            {
                Header: "Actions",
                Cell: ({ row }) => (
                    <button
                        onClick={() => deleteRow(row.original._id)}
                        className="delete-button"
                    >
                        Delete
                    </button>
                ),
                id: "actions",
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
    });

    React.useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:3001/workspace", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    credentials: 'include'
                });
                const data = await response.json();
                console.log("Fetched data:", data);
                if (Array.isArray(data)) {
                    setData(data);
                } else {
                    console.error("Data is not an array:", data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="workspace">
            <div className="workspace-container">
                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()} key={column.id}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} key={row.id}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()} key={cell.column.id} style={{ color: 'black', backgroundColor: 'white' }}>
                                            {cell.render('Cell')}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <button className="open-form-button" onClick={() => setFormVisible(true)}>
                    Add Workspace
                </button>
                {isFormVisible && <FormComponent onClose={() => setFormVisible(false)} />}
            </div>
        </div>
    );
};

export default WorkspacePage;
