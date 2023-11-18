// BudgetBookTable.jsx

import React, { useState } from "react";

const BudgetBookTable = () => {
  const [tableRows, setTableRows] = useState([
    {
      id: 1,
      comment: "This is a comment",
      category: "Category 1",
      amount: 100.0,
      timestamp: "18/11/2023, 19:01:40",
      isEditing: false,
    },
    // Add more rows as needed
  ]);
    
  const [categories, setCategories] = useState(["Category 1", "Category 2", "Category 3"]); // Add your existing categories here

  const toggleEdit = (id) => {
    setTableRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, isEditing: !row.isEditing } : row
      )
    );
  };

  const handleInputChange = (id, field, value) => {
    setTableRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const saveChanges = (id) => {
    // Perform any additional logic or validation before saving
    toggleEdit(id);
  };

  const addRow = () => {
    const newRow = {
      id: tableRows.length + 1,
      comment: "",
      category: categories[0], // Set the default category to the first one
      amount: 0.0,
      timestamp: "18/11/2023, 19:01:40",
      isEditing: true,
    };

    setTableRows((prevRows) => [newRow, ...prevRows]);
  };

  const handleCategoryChange = (id, value) => {
    if (value === "__new__") {
      const newCategory = window.prompt("Add new category", "");
      if (newCategory !== null && newCategory.trim() !== "") {
        setCategories([...categories, newCategory])
      }
    } else {
      handleInputChange(id, "category", value);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        onClick={addRow}
      >
        Add Row
      </button>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Label</th>
            <th className="py-2 px-4">Category</th>
            <th className="py-2 px-4">Amount</th>
            <th className="py-2 px-4">Timestamp</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row) => (
            <tr key={row.id}>
              <td className="py-2 px-4">
                {row.isEditing ? (
                  <input
                    type="text"
                    value={row.comment}
                    onChange={(e) =>
                      handleInputChange(row.id, "comment", e.target.value)
                    }
                  />
                ) : (
                  row.comment
                )}
              </td>
              <td className="py-2 px-4">
                {row.isEditing ? (
                  <select
                    value={row.category}
                    onChange={(e) => handleCategoryChange(row.id, e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="__new__">Add New Category</option>
                  </select>
                ) : (
                  row.category
                )}
              </td>
              <td className="py-2 px-4">
                {row.isEditing ? (
                  <input
                    type="number"
                    value={row.amount}
                    onChange={(e) =>
                      handleInputChange(row.id, "amount", parseFloat(e.target.value))
                    }
                  />
                ) : (
                  `€${row.amount.toFixed(2)}`
                )}
              </td>
              <td className="py-2 px-4">{row.timestamp}</td>
              <td className="py-2 px-4">
                {row.isEditing ? (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => saveChanges(row.id)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => toggleEdit(row.id)}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetBookTable;
