import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPaginate from "react-paginate";
import { imageDefault } from "./DefaultValue";
import { Line } from 'react-chartjs-2';
import{
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)
function Home() {
  const [paginatedData, setPaginatedData] = useState([]);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [records, setRecords] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [pagination, setPagination] = useState({
    startIndex: 0,
    currentPage: 0,
    endIndex: 0 + 3,
    itemsPerPage: 3,
    totalPages: data.length / 3,
  });
  const [dataset, setDataset] = useState([]);
  const [numberOfUsers, setNumberOfUsers] = useState([]);
  // const chartData = {
  //   data.map((f) => f.birthDate === id)
  //   label:data.birthDate,
  //   dataset:[]
  // }

  const [chartData, setChartData] =useState({
    labels: [],
    datasets: [
        {
            label: 'test label',
            data: [
               
            ],
            backgroundColor:'aqua',
           borderColor:'black',
           pointBorderColor:'aqua',

           fill:true
        }
    ]
});
const options= {
    
      Plugin:{
        legend:true
      }
      
  }



  
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    console.log("in useEfect");
    recordPaginationHandler();
  }, [pagination]);

  const recordPaginationHandler = () => {
    console.log({ records });
    setPaginatedData(records.slice(pagination.startIndex, pagination.endIndex));
  };

  const loadData = () => {
    axios
      .get("http://localhost:3000/users")
      .then((res) => {
        setData(res.data);
        setTotalData(res.data.length);
        setRecords(res.data);
        setTotalRecords(res.data.length);
        setPagination({
          ...pagination,
          totalPages: Math.ceil(res.data.length / pagination.itemsPerPage),
        });
        const d = res.data.map((index) => index.birthDate.split("-")[0]);
        setDataset(res.data.map((index) => index.birthDate.split("-")[0]));

        handleDataSet(d);
      })
      .catch((err) => err);
  };

  const handleDataSet = (d) => {
    console.log("handleDataSet")
    for (let i = 0; i < d.length; i++) {
      let index = d[i];
      if (!chartData.labels.find((f)=>f===index)) {
        let count = d.filter((f) => f === index).length;
        chartData.labels.push(index);
        chartData.datasets[0].data.push(count);
       console.log('------------------------',{ i }); 
      }
   
       
     
      // console.log({ count });
    } 
    
  };
  const handlePageChange = (selectedPage) => {
    console.log(selectedPage.selected);
    let newPagination = { ...pagination };
    newPagination.currentPage = selectedPage.selected;
    console.log(
      "newPagination.",
      newPagination.startIndex,
      selectedPage.selected * pagination.itemsPerPage
    );

    newPagination.startIndex =
      newPagination.currentPage * pagination.itemsPerPage;
    newPagination.endIndex = newPagination.startIndex + pagination.itemsPerPage;
    if (newPagination.endIndex >= totalRecords.length) {
      newPagination.endIndex = totalRecords.length;
    }

    setPagination(newPagination);

    console.log({ newPagination });
  };

  const handleSpliceDelete = (id) => {
    const confirm = window.confirm("would you like to delete?");
    if (confirm) {
      axios
        .delete("http://localhost:3000/users/" + id)
        .then((res) => {
          if (res) {
            let removingItem = data.find((f) => f.id === id);
            console.log({ removingItem });
            let indexOfRemovingItem = data.indexOf(removingItem);

            let newData = [...data];
            newData.splice(indexOfRemovingItem, 1);
            setData(newData);
            setRecords(newData);
            setTotalData(newData.length);
            setTotalRecords(newData.length);
            setPagination({
              ...pagination,
              totalPages: Math.ceil(res.data.length / pagination.itemsPerPage),
            });
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const Filter = (event) => {
    let dataRecord;
    if (event.target.name === "searchName") {
      dataRecord = data.filter(
        (f) =>
          f.name.toLowerCase().includes(event.target.value) ||
          f.phone.includes(event.target.value)
      );
      console.log({ dataRecord });
    }

    console.log({ dataRecord });
    setRecords(dataRecord);

    setTotalRecords(dataRecord.length);
    setPagination({
      ...pagination,
      totalPages: Math.ceil(dataRecord.length / pagination.itemsPerPage),
    });
  };
  //Todo
  const Status = (event) => {
    setSelectedStatus(event.target.value);
    if (event.target.value === "inactive") {
      var arrayRecord;
      arrayRecord = data.filter((f) => f.status === "inactive");
      setRecords(arrayRecord);

      setTotalRecords(arrayRecord.length);
      setPagination({
        ...pagination,
        totalPages: Math.ceil(arrayRecord.length / pagination.itemsPerPage),
      });
    }
    if (event.target.value === "active") {
      var arrayRecord2;
      arrayRecord2 = data.filter((f) => f.status === "active");
      setRecords(arrayRecord2);
      setTotalRecords(arrayRecord2.length);
      setPagination({
        ...pagination,
        totalPages: Math.ceil(arrayRecord2.length / pagination.itemsPerPage),
      });
    }
    if (event.target.value === "allUsers") {
      setRecords(data);
      setTotalRecords(data.length);
      setPagination({
        ...pagination,
        totalPages: Math.ceil(data.length / pagination.itemsPerPage),
      });
    }
  };

  const activationHandler = (values) => {
    let temp = { ...values };
    console.log({ temp });
    if (temp.status == "active") {
      temp.status = "inactive";

      console.log({ values });
    } else {
      temp.status = "active";
    }
    values = { ...temp };
    console.log({ values });
    axios
      .put("http://localhost:3000/users/" + temp.id, temp)
      .then((res) => {
        const tempObject = data.map((obj) => {
          if (obj.id == temp.id) {
            obj.status = temp.status;
          }
          return obj;
        });
        setData(tempObject);
        setTotalData(tempObject.length);
        setRecords(data);

        setTotalRecords(tempObject.length);
        setPagination({
          ...pagination,
          totalPages: Math.ceil(tempObject.length / pagination.itemsPerPage),
        });
        console.log({ tempObject });
      })

      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
      <h1>List Of Users</h1>
      <div className="w-75 arounded bg-white border shadow p-4">
        <div className="d-flex justify-content-between">
          <input
            type="text"
            className="form-control w-25"
            onChange={Filter}
            placeholder="Search by name or phone number..."
            name="searchName"
          />
          <label>
            Pick a status:
            <select
              name="selectedStatus"
              value={selectedStatus} // ...force the select's value to match the state variable...
              onChange={Status}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
              <option value="allUsers">all Users</option>
            </select>
          </label>

          <Link to="/create" className="btn btn-success">
            Add +
          </Link>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>profile</th>
              <th>Name</th>
              <th>email</th>
              <th>Date of birth</th>
              <th>Phone</th>
              <th>status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((d, i) => (
              <tr key={i}>
                <td>{d.id}</td>
                <td>
                  <img src={`${d.image ? d.image : imageDefault}`} />
                </td>
                <td>{d.name}</td>
                <td>{d.Email}</td>
                <td>{d.birthDate}</td>
                <td>{d.phone}</td>
                <td>
                  {" "}
                  {d.status === "active" ? (
                    <button
                      className="btn btn-outline-success"
                      onClick={(e) => activationHandler(d)}
                    >
                      Active
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={(e) => activationHandler(d)}
                    >
                      inactive
                    </button>
                  )}
                </td>
                <td>
                  <Link
                    to={`/read/${d.id}`}
                    className="btn btn-sm btn-info me-2"
                  >
                    Read
                  </Link>
                  <Link
                    to={`/update/${d.id}`}
                    className="btn btn-sm btn-primary me-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => handleSpliceDelete(d.id)}
                    className="btn btn-sm btn-danger "
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
            pageCount={pagination.totalPages}
            onPageChange={handlePageChange}
            forcePage={pagination.currentPage}
          />
        </div>
        <Line data={chartData} options={options} />
      </div>
    
    </div>
  );
}

export default Home;
